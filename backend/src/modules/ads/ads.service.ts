import {
  BadRequestException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { AdSessionStatus, TransactionType } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';
import { WalletService } from '../wallet/wallet.service';
import {
  AD_EARNING_PAISE,
  AD_FREE_LIFETIME_SESSIONS,
  AD_MIN_WATCH_SECONDS,
  AD_SUSPICIOUS_DAILY_IP_LIMIT,
  formatPaise,
} from '../../common/constants';

@Injectable()
export class AdsService {
  private readonly logger = new Logger(AdsService.name);

  constructor(
    private prisma: PrismaService,
    private walletService: WalletService,
  ) {}

  private async hasPartnerTier(userId: string): Promise<boolean> {
    const tier = await this.prisma.userPartnerTier.findUnique({
      where: { userId },
    });
    return !!tier;
  }

  async checkEligibility(userId: string) {
    const completed = await this.prisma.adSession.count({
      where: { userId, status: AdSessionStatus.COMPLETED },
    });
    const hasTier = await this.hasPartnerTier(userId);
    const freeLeft = Math.max(AD_FREE_LIFETIME_SESSIONS - completed, 0);
    const eligible = hasTier || freeLeft > 0;
    return {
      eligible,
      completedSessions: completed,
      freeSessionsLeft: freeLeft,
      hasPartnerTier: hasTier,
      earningPerAd: AD_EARNING_PAISE,
      earningPerAdFormatted: formatPaise(AD_EARNING_PAISE),
      minWatchSeconds: AD_MIN_WATCH_SECONDS,
    };
  }

  async startSession(userId: string, ip?: string, userAgent?: string) {
    const { eligible } = await this.checkEligibility(userId);
    if (!eligible) {
      throw new BadRequestException(
        'No ad sessions left. Upgrade to a partner tier to continue.',
      );
    }

    // Anti-abuse: flag if same IP started many sessions today.
    if (ip) {
      const since = new Date();
      since.setHours(0, 0, 0, 0);
      const todayFromIp = await this.prisma.adSession.count({
        where: { ipAddress: ip, startedAt: { gte: since } },
      });
      if (todayFromIp >= AD_SUSPICIOUS_DAILY_IP_LIMIT) {
        await this.prisma.auditLog.create({
          data: {
            actorId: userId,
            action: 'AD_SESSION_SUSPICIOUS_IP',
            targetType: 'AdSession',
            ipAddress: ip,
            metadata: { todayFromIp },
          },
        });
      }
    }

    const session = await this.prisma.adSession.create({
      data: {
        userId,
        status: AdSessionStatus.STARTED,
        ipAddress: ip,
        userAgent,
      },
    });
    return { sessionId: session.id, startedAt: session.startedAt };
  }

  async completeSession(userId: string, sessionId: string) {
    const session = await this.prisma.adSession.findUnique({
      where: { id: sessionId },
    });
    if (!session || session.userId !== userId) {
      throw new NotFoundException('Ad session not found');
    }
    if (session.status !== AdSessionStatus.STARTED) {
      throw new BadRequestException('Ad session already finalized');
    }

    // Server-side elapsed-time check — never trust a client-reported duration.
    const elapsedSeconds = Math.floor(
      (Date.now() - session.startedAt.getTime()) / 1000,
    );
    if (elapsedSeconds < AD_MIN_WATCH_SECONDS) {
      throw new BadRequestException(
        `Minimum watch time is ${AD_MIN_WATCH_SECONDS}s`,
      );
    }

    await this.prisma.$transaction(async (tx) => {
      await tx.adSession.update({
        where: { id: sessionId },
        data: {
          status: AdSessionStatus.COMPLETED,
          completedAt: new Date(),
          durationSeconds: elapsedSeconds,
          earningAmount: AD_EARNING_PAISE,
        },
      });
      await this.walletService.credit(tx, {
        userId,
        amount: AD_EARNING_PAISE,
        type: TransactionType.AD_EARNING,
        bucket: 'available',
        ref: { adSessionId: sessionId, note: 'Ad watch reward' },
      });
    });

    return {
      earned: AD_EARNING_PAISE,
      earnedFormatted: formatPaise(AD_EARNING_PAISE),
      durationSeconds: elapsedSeconds,
    };
  }
}
