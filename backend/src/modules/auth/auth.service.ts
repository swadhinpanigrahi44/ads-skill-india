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

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

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

    const tokens = await this.generateTokens(user.id, user.role);
    await this.saveRefreshToken(user.id, tokens.refreshToken);

    return {
      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken,
      user: {
        id: user.id,
        adsId: user.adsId,
        fullName: user.fullName,
        email: user.email,
        mobile: user.mobile,
        state: user.state,
        role: user.role,
        kycStatus: user.kycStatus,
        referralCode: user.referralCode,
      },
    };
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
