import {
  BadRequestException,
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import * as crypto from 'crypto';
import { PrismaService } from '../../prisma/prisma.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { ChangePasswordDto, ForgotPasswordDto, ResetPasswordDto } from './dto/reset-password.dto';
import { EmailService } from '../../common/email/email.service';
import { User } from '@prisma/client';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
    private emailService: EmailService,
  ) {}

  /** Public-safe user fields returned to the client. */
  private toPublicUser(user: User) {
    return {
      id: user.id,
      adsId: user.adsId,
      fullName: user.fullName,
      email: user.email,
      mobile: user.mobile,
      state: user.state,
      role: user.role,
      kycStatus: user.kycStatus,
      referralCode: user.referralCode,
      avatarUrl: user.avatarUrl,
      twoFAEnabled: user.twoFAEnabled,
    };
  }

  /** Issue tokens + persist refresh hash, return the standard auth response. */
  private async buildAuthResponse(user: User) {
    const tokens = await this.generateTokens(user.id, user.role);
    await this.saveRefreshToken(user.id, tokens.refreshToken);
    return {
      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken,
      user: this.toPublicUser(user),
    };
  }

  // ── 2FA (email OTP) helpers ─────────────────────────────────────
  private generateOtp(): string {
    return crypto.randomInt(0, 1_000_000).toString().padStart(6, '0');
  }

  private async issueOtp(userId: string): Promise<string> {
    const otp = this.generateOtp();
    const twoFAOtpHash = await bcrypt.hash(otp, 10);
    const twoFAOtpExpiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 min
    await this.prisma.user.update({
      where: { id: userId },
      data: { twoFAOtpHash, twoFAOtpExpiresAt },
    });
    return otp;
  }

  private async consumeOtp(user: User, otp: string): Promise<boolean> {
    if (!user.twoFAOtpHash || !user.twoFAOtpExpiresAt) return false;
    if (user.twoFAOtpExpiresAt < new Date()) return false;
    const ok = await bcrypt.compare(otp, user.twoFAOtpHash);
    if (!ok) return false;
    await this.prisma.user.update({
      where: { id: user.id },
      data: { twoFAOtpHash: null, twoFAOtpExpiresAt: null },
    });
    return true;
  }

  /** Send an OTP to the logged-in user's email (used to enable 2FA). */
  async request2FAOtp(userId: string) {
    const user = await this.prisma.user.findUniqueOrThrow({ where: { id: userId } });
    const otp = await this.issueOtp(user.id);
    await this.emailService.sendOtp(user.email, otp, 'enable');
    return { message: 'OTP sent to your email' };
  }

  async enable2FA(userId: string, otp: string) {
    const user = await this.prisma.user.findUniqueOrThrow({ where: { id: userId } });
    const ok = await this.consumeOtp(user, otp);
    if (!ok) throw new BadRequestException('Invalid or expired OTP');
    await this.prisma.user.update({
      where: { id: userId },
      data: { twoFAEnabled: true },
    });
    return { twoFAEnabled: true };
  }

  async disable2FA(userId: string) {
    await this.prisma.user.update({
      where: { id: userId },
      data: { twoFAEnabled: false, twoFAOtpHash: null, twoFAOtpExpiresAt: null },
    });
    return { twoFAEnabled: false };
  }

  /** Step 2 of login when 2FA is enabled: verify the emailed OTP, issue tokens. */
  async verifyLoginOtp(email: string, otp: string) {
    const user = await this.prisma.user.findUnique({ where: { email } });
    if (!user || user.isBanned || !user.isActive) {
      throw new UnauthorizedException('Invalid request');
    }
    const ok = await this.consumeOtp(user, otp);
    if (!ok) throw new UnauthorizedException('Invalid or expired OTP');
    return this.buildAuthResponse(user);
  }

  async register(dto: RegisterDto) {
    const emailExists = await this.prisma.user.findUnique({ where: { email: dto.email } });
    if (emailExists) throw new ConflictException('Email already registered');

    const mobileExists = await this.prisma.user.findUnique({ where: { mobile: dto.mobile } });
    if (mobileExists) throw new ConflictException('Mobile number already registered');

    let referrerId: string | null = null;
    if (dto.referralCode) {
      const referrer = await this.prisma.user.findUnique({
        where: { referralCode: dto.referralCode },
      });
      if (!referrer) throw new BadRequestException('Invalid referral code');
      if (!referrer.isActive) throw new BadRequestException('Referrer account is inactive');
      referrerId = referrer.id;
    }

    const passwordHash = await bcrypt.hash(dto.password, 12);

    const user = await this.prisma.$transaction(async (tx) => {
      // Retry loop to handle concurrent ADS ID collisions
      let newUser: Awaited<ReturnType<typeof tx.user.create>>;
      let attempts = 0;
      while (true) {
        attempts++;
        const lastUser = await tx.user.findFirst({
          orderBy: { createdAt: 'desc' },
          select: { adsId: true },
        });
        const nextNum = lastUser ? parseInt(lastUser.adsId.replace('ADS', ''), 10) + 1 + (attempts - 1) : 15001 + (attempts - 1);
        const adsId = `ADS${nextNum}`;

        try {
          newUser = await tx.user.create({
            data: {
              adsId,
              fullName: dto.fullName,
              email: dto.email,
              mobile: dto.mobile,
              state: dto.state,
              passwordHash,
              referralCode: adsId,
              referredById: referrerId,
            },
          });
          break;
        } catch (e: unknown) {
          const isAdsIdConflict =
            typeof e === 'object' && e !== null &&
            'code' in e && (e as { code: string }).code === 'P2002' &&
            'meta' in e &&
            Array.isArray((e as { meta: { target?: string[] } }).meta?.target) &&
            (e as { meta: { target: string[] } }).meta.target.includes('adsId');

          if (isAdsIdConflict && attempts < 5) continue;
          throw e; // re-throw email/mobile conflicts or too many retries
        }
      }

      await tx.wallet.create({ data: { userId: newUser!.id } });
      return newUser!;
    });

    return {
      id: user.id,
      adsId: user.adsId,
      fullName: user.fullName,
      email: user.email,
      mobile: user.mobile,
      state: user.state,
      role: user.role,
      referralCode: user.referralCode,
      createdAt: user.createdAt,
    };
  }

  async login(dto: LoginDto) {
    const user = await this.prisma.user.findUnique({ where: { email: dto.email } });
    if (!user) throw new UnauthorizedException('Invalid email or password');
    if (user.isBanned || !user.isActive) throw new UnauthorizedException('Invalid email or password');

    const passwordMatch = await bcrypt.compare(dto.password, user.passwordHash);
    if (!passwordMatch) throw new UnauthorizedException('Invalid email or password');

    // If 2FA is enabled, don't issue tokens yet — email an OTP and ask for it.
    if (user.twoFAEnabled) {
      const otp = await this.issueOtp(user.id);
      await this.emailService.sendOtp(user.email, otp, 'login');
      return { twoFARequired: true as const, email: user.email };
    }

    return this.buildAuthResponse(user);
  }

  async refresh(userId: string) {
    const user = await this.prisma.user.findUniqueOrThrow({
      where: { id: userId },
      select: { id: true, role: true, isActive: true, isBanned: true },
    });
    if (!user.isActive || user.isBanned) {
      throw new UnauthorizedException('Account is not accessible');
    }
    const tokens = await this.generateTokens(user.id, user.role);
    await this.saveRefreshToken(user.id, tokens.refreshToken);
    return tokens;
  }

  async logout(userId: string) {
    await this.prisma.user.update({
      where: { id: userId },
      data: { refreshTokenHash: null },
    });
  }

  async forgotPassword(dto: ForgotPasswordDto) {
    const user = await this.prisma.user.findUnique({ where: { email: dto.email } });
    if (!user) return { message: 'If that email exists, a reset link has been sent' };

    const rawSecret = crypto.randomBytes(32).toString('hex');
    const tokenHash = await bcrypt.hash(rawSecret, 10);
    const expiresAt = new Date(Date.now() + 60 * 60 * 1000);

    const resetRecord = await this.prisma.passwordReset.create({
      data: { userId: user.id, tokenHash, expiresAt },
    });

    // Token format: "{recordId}.{rawSecret}" — recordId allows O(1) lookup
    const rawToken = `${resetRecord.id}.${rawSecret}`;

    if (process.env.NODE_ENV !== 'production') {
      console.log(`[DEV] Password reset token for ${user.email}: ${rawToken}`);
    }

    return { message: 'If that email exists, a reset link has been sent' };
  }

  async resetPassword(dto: ResetPasswordDto) {
    // Token format: "{recordId}.{rawSecret}"
    const dotIndex = dto.token.indexOf('.');
    if (dotIndex === -1) throw new BadRequestException('Invalid or expired reset token');

    const recordId = dto.token.substring(0, dotIndex);
    const rawSecret = dto.token.substring(dotIndex + 1);

    const reset = await this.prisma.passwordReset.findUnique({
      where: { id: recordId },
    });

    if (!reset || reset.used || reset.expiresAt < new Date()) {
      throw new BadRequestException('Invalid or expired reset token');
    }

    const isValid = await bcrypt.compare(rawSecret, reset.tokenHash);
    if (!isValid) throw new BadRequestException('Invalid or expired reset token');

    const newPasswordHash = await bcrypt.hash(dto.newPassword, 12);

    await this.prisma.$transaction(async (tx) => {
      await tx.user.update({
        where: { id: reset.userId },
        data: { passwordHash: newPasswordHash, refreshTokenHash: null },
      });
      await tx.passwordReset.update({
        where: { id: reset.id },
        data: { used: true },
      });
    });

    return { message: 'Password reset successfully. Please log in.' };
  }

  async changePassword(userId: string, dto: ChangePasswordDto) {
    const user = await this.prisma.user.findUniqueOrThrow({ where: { id: userId } });

    const match = await bcrypt.compare(dto.currentPassword, user.passwordHash);
    if (!match) throw new BadRequestException('Current password is incorrect');

    const newHash = await bcrypt.hash(dto.newPassword, 12);
    await this.prisma.user.update({
      where: { id: userId },
      data: { passwordHash: newHash, refreshTokenHash: null },
    });

    return { message: 'Password changed successfully. Please log in again.' };
  }

  private async generateTokens(userId: string, role: string) {
    const payload = { sub: userId, role };
    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(payload, {
        secret: process.env.JWT_ACCESS_SECRET,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        expiresIn: (process.env.JWT_ACCESS_EXPIRY ?? '15m') as any,
      }),
      Promise.resolve(crypto.randomBytes(40).toString('hex')),
    ]);
    return { accessToken, refreshToken };
  }

  private async saveRefreshToken(userId: string, rawToken: string) {
    const hash = await bcrypt.hash(rawToken, 10);
    await this.prisma.user.update({
      where: { id: userId },
      data: { refreshTokenHash: hash },
    });
  }
}
