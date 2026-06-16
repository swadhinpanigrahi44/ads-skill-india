import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import type { Request, Response } from 'express';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { ChangePasswordDto, ForgotPasswordDto, ResetPasswordDto } from './dto/reset-password.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { RefreshGuard } from './guards/refresh.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';

const IS_PROD = process.env.NODE_ENV === 'production';

// In production the frontend (Vercel) and backend (Render) are different sites,
// so cookies must be SameSite=None; Secure to be sent cross-site. Locally we use
// 'lax' so cookies work over http://localhost.
const REFRESH_COOKIE_OPTIONS = {
  httpOnly: true,
  secure: IS_PROD,
  sameSite: (IS_PROD ? 'none' : 'lax') as 'none' | 'lax',
  maxAge: 7 * 24 * 60 * 60 * 1000,
  path: '/',
};

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('register')
  async register(@Body() dto: RegisterDto) {
    const user = await this.authService.register(dto);
    return { success: true, data: { user } };
  }

  private setAuthCookies(
    res: Response,
    refreshToken: string,
    userId: string,
  ) {
    res.cookie('refresh_token', refreshToken, REFRESH_COOKIE_OPTIONS);
    res.cookie('refresh_uid', userId, { ...REFRESH_COOKIE_OPTIONS, httpOnly: false });
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(
    @Body() dto: LoginDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const result = await this.authService.login(dto);

    // 2FA enabled: no tokens yet — frontend must collect the emailed OTP.
    if ('twoFARequired' in result) {
      return { success: true, data: { twoFARequired: true, email: result.email } };
    }

    this.setAuthCookies(res, result.refreshToken, result.user.id);
    return {
      success: true,
      data: { accessToken: result.accessToken, user: result.user },
    };
  }

  @Post('2fa/verify-login')
  @HttpCode(HttpStatus.OK)
  async verifyLogin(
    @Body() body: { email: string; otp: string },
    @Res({ passthrough: true }) res: Response,
  ) {
    const result = await this.authService.verifyLoginOtp(body.email, body.otp);
    this.setAuthCookies(res, result.refreshToken, result.user.id);
    return {
      success: true,
      data: { accessToken: result.accessToken, user: result.user },
    };
  }

  @Post('2fa/request')
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtAuthGuard)
  async request2FA(@CurrentUser() user: { id: string }) {
    const data = await this.authService.request2FAOtp(user.id);
    return { success: true, data };
  }

  @Post('2fa/enable')
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtAuthGuard)
  async enable2FA(
    @CurrentUser() user: { id: string },
    @Body('otp') otp: string,
  ) {
    const data = await this.authService.enable2FA(user.id, otp ?? '');
    return { success: true, data };
  }

  @Post('2fa/disable')
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtAuthGuard)
  async disable2FA(@CurrentUser() user: { id: string }) {
    const data = await this.authService.disable2FA(user.id);
    return { success: true, data };
  }

  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  @UseGuards(RefreshGuard)
  async refresh(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ) {
    const user = req.user as { id: string };
    const tokens = await this.authService.refresh(user.id);

    res.cookie('refresh_token', tokens.refreshToken, REFRESH_COOKIE_OPTIONS);
    res.cookie('refresh_uid', user.id, { ...REFRESH_COOKIE_OPTIONS, httpOnly: false });

    return { success: true, data: { accessToken: tokens.accessToken } };
  }

  @Post('logout')
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtAuthGuard)
  async logout(
    @CurrentUser() user: { id: string },
    @Res({ passthrough: true }) res: Response,
  ) {
    await this.authService.logout(user.id);
    res.clearCookie('refresh_token', {
      path: '/',
      httpOnly: true,
      secure: IS_PROD,
      sameSite: REFRESH_COOKIE_OPTIONS.sameSite,
    });
    res.clearCookie('refresh_uid', {
      path: '/',
      httpOnly: false,
      secure: IS_PROD,
      sameSite: REFRESH_COOKIE_OPTIONS.sameSite,
    });
    return { success: true, data: { message: 'Logged out successfully' } };
  }

  @Post('forgot-password')
  @HttpCode(HttpStatus.OK)
  async forgotPassword(@Body() dto: ForgotPasswordDto) {
    const result = await this.authService.forgotPassword(dto);
    return { success: true, data: result };
  }

  @Post('reset-password')
  @HttpCode(HttpStatus.OK)
  async resetPassword(@Body() dto: ResetPasswordDto) {
    const result = await this.authService.resetPassword(dto);
    return { success: true, data: result };
  }

  @Post('change-password')
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtAuthGuard)
  async changePassword(
    @CurrentUser() user: { id: string },
    @Body() dto: ChangePasswordDto,
  ) {
    const result = await this.authService.changePassword(user.id, dto);
    return { success: true, data: result };
  }
}
