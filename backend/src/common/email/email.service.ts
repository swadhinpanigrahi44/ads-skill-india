import {
  Injectable,
  Logger,
  ServiceUnavailableException,
} from '@nestjs/common';
import { Resend } from 'resend';

@Injectable()
export class EmailService {
  private readonly logger = new Logger(EmailService.name);
  private resend: Resend | null = null;

  private client(): Resend {
    if (this.resend) return this.resend;
    const key = process.env.RESEND_API_KEY;
    if (!key) {
      throw new ServiceUnavailableException('Email service is not configured');
    }
    this.resend = new Resend(key);
    return this.resend;
  }

  private from(): string {
    return process.env.RESEND_FROM_EMAIL ?? 'noreply@adsskillindia.in';
  }

  /** Send a one-time password for 2FA (enable or login). */
  async sendOtp(to: string, code: string, purpose: 'login' | 'enable'): Promise<void> {
    const title =
      purpose === 'login' ? 'Your login verification code' : 'Confirm two-factor authentication';
    const html = `
      <div style="font-family:Arial,sans-serif;max-width:480px;margin:auto">
        <h2 style="color:#0a7cff">ADS Skill India</h2>
        <p>${title}</p>
        <p style="font-size:32px;font-weight:bold;letter-spacing:6px;color:#0a121f">${code}</p>
        <p style="color:#666">This code expires in 10 minutes. If you didn't request it, ignore this email.</p>
      </div>`;

    // In non-production, also log the code so it can be tested without a real inbox.
    if (process.env.NODE_ENV !== 'production') {
      this.logger.log(`[DEV] 2FA OTP for ${to} (${purpose}): ${code}`);
    }

    await this.client().emails.send({
      from: this.from(),
      to,
      subject: `${title} — ADS Skill India`,
      html,
    });
  }
}
