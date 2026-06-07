import { Injectable, Logger } from '@nestjs/common';
import { Prisma, Payment, TransactionStatus, TransactionType } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';
import { WalletService } from '../wallet/wallet.service';
import { formatPaise } from '../../common/constants';

type Tx = Prisma.TransactionClient;

@Injectable()
export class ReferralsService {
  private readonly logger = new Logger(ReferralsService.name);

  constructor(
    private prisma: PrismaService,
    private walletService: WalletService,
  ) {}

  /**
   * Process 2-level referral commissions for a SUCCESSFUL course purchase.
   * MUST run inside the same `$transaction` as the payment settlement.
   *
   * Rules (from design spec section 10):
   *  - Only course purchases trigger commissions (not partner purchases).
   *  - Earner must have an active partner tier, else no commission.
   *  - Commission amount comes from the matrix (tier x package x level).
   *  - Circular / self referrals are skipped.
   */
  async processCommissions(tx: Tx, payment: Payment): Promise<void> {
    if (!payment.coursePackageId) {
      return; // partner purchases never trigger commissions
    }

    const buyer = await tx.user.findUnique({
      where: { id: payment.userId },
      select: { id: true, referredById: true },
    });
    if (!buyer?.referredById) return; // no referrer => nothing to do

    // Level 1 = direct referrer; Level 2 = referrer's referrer
    const l1 = await tx.user.findUnique({
      where: { id: buyer.referredById },
      select: { id: true, referredById: true },
    });
    if (!l1) return;

    await this.creditLevel(tx, {
      earnerId: l1.id,
      buyerId: buyer.id,
      level: 1,
      coursePackageId: payment.coursePackageId,
      paymentId: payment.id,
    });

    if (l1.referredById && l1.referredById !== buyer.id) {
      await this.creditLevel(tx, {
        earnerId: l1.referredById,
        buyerId: buyer.id,
        level: 2,
        coursePackageId: payment.coursePackageId,
        paymentId: payment.id,
      });
    }
  }

  private async creditLevel(
    tx: Tx,
    p: {
      earnerId: string;
      buyerId: string;
      level: number;
      coursePackageId: string;
      paymentId: string;
    },
  ): Promise<void> {
    if (p.earnerId === p.buyerId) return; // self-referral guard

    const earner = await tx.user.findUnique({
      where: { id: p.earnerId },
      select: { id: true, partnerTier: { select: { tierId: true } } },
    });
    if (!earner?.partnerTier) {
      this.logger.debug(`Earner ${p.earnerId} has no partner tier — skipping L${p.level}`);
      return;
    }

    const rate = await tx.commissionRate.findUnique({
      where: {
        partnerTierId_coursePackageId_level: {
          partnerTierId: earner.partnerTier.tierId,
          coursePackageId: p.coursePackageId,
          level: p.level,
        },
      },
    });
    if (!rate || rate.amount <= 0) return;

    const commission = await tx.commission.create({
      data: {
        earnerId: p.earnerId,
        triggeredByUserId: p.buyerId,
        triggeredByPaymentId: p.paymentId,
        level: p.level,
        amount: rate.amount,
        status: TransactionStatus.SETTLED,
        settledAt: new Date(),
      },
    });

    await this.walletService.credit(tx, {
      userId: p.earnerId,
      amount: rate.amount,
      type: TransactionType.REFERRAL_COMMISSION,
      bucket: 'available',
      status: TransactionStatus.SETTLED,
      ref: {
        commissionId: commission.id,
        paymentId: p.paymentId,
        note: `L${p.level} referral commission`,
      },
    });

    this.logger.log(
      `Credited L${p.level} commission ${formatPaise(rate.amount)} to ${p.earnerId}`,
    );
  }

  /** Public: resolve a referral code to the sponsor's name (for register prefill). */
  async lookupSponsor(code: string) {
    if (!code) return { found: false as const };
    const u = await this.prisma.user.findUnique({
      where: { referralCode: code.trim() },
      select: { fullName: true, isActive: true, isBanned: true },
    });
    if (!u || !u.isActive || u.isBanned) return { found: false as const };
    return { found: true as const, fullName: u.fullName };
  }

  // ── User-facing queries ────────────────────────────────────────

  async getMyLinks(userId: string, frontendUrl: string) {
    const user = await this.prisma.user.findUniqueOrThrow({
      where: { id: userId },
      select: { referralCode: true },
    });
    return {
      referralCode: user.referralCode,
      referralLink: `${frontendUrl}/register?ref=${user.referralCode}`,
    };
  }

  async getMyTeam(userId: string) {
    const directs = await this.prisma.user.findMany({
      where: { referredById: userId },
      select: {
        id: true,
        adsId: true,
        fullName: true,
        createdAt: true,
        partnerTier: { select: { tier: { select: { name: true } } } },
        referrals: {
          select: {
            id: true,
            adsId: true,
            fullName: true,
            createdAt: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    const l1 = directs.map((d) => ({
      id: d.id,
      adsId: d.adsId,
      fullName: d.fullName,
      tier: d.partnerTier?.tier.name ?? null,
      joinedAt: d.createdAt,
    }));
    const l2 = directs.flatMap((d) =>
      d.referrals.map((r) => ({
        id: r.id,
        adsId: r.adsId,
        fullName: r.fullName,
        joinedAt: r.createdAt,
      })),
    );

    return { level1Count: l1.length, level2Count: l2.length, level1: l1, level2: l2 };
  }

  async getLeaderboard(limit = 10) {
    const top = await this.prisma.commission.groupBy({
      by: ['earnerId'],
      _sum: { amount: true },
      orderBy: { _sum: { amount: 'desc' } },
      take: limit,
    });

    const users = await this.prisma.user.findMany({
      where: { id: { in: top.map((t) => t.earnerId) } },
      select: { id: true, adsId: true, fullName: true },
    });
    const byId = new Map(users.map((u) => [u.id, u]));

    return top.map((t, i) => ({
      rank: i + 1,
      adsId: byId.get(t.earnerId)?.adsId ?? '—',
      fullName: byId.get(t.earnerId)?.fullName ?? 'User',
      totalEarned: t._sum.amount ?? 0,
      totalEarnedFormatted: formatPaise(t._sum.amount ?? 0),
    }));
  }
}
