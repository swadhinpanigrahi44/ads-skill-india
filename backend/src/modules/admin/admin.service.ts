import { Injectable, NotFoundException } from '@nestjs/common';
import {
  KycStatus,
  PaymentStatus,
  Prisma,
  WithdrawalStatus,
} from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';
import { KycService } from '../kyc/kyc.service';
import {
  DEFAULT_PAGE_SIZE,
  MAX_PAGE_SIZE,
  formatPaise,
} from '../../common/constants';

@Injectable()
export class AdminService {
  constructor(
    private prisma: PrismaService,
    private kycService: KycService,
  ) {}

  private paginate(page?: number, pageSize?: number) {
    const take = Math.min(Math.max(pageSize ?? DEFAULT_PAGE_SIZE, 1), MAX_PAGE_SIZE);
    const safePage = Math.max(page ?? 1, 1);
    return { take, skip: (safePage - 1) * take, page: safePage };
  }

  async getDashboard() {
    const [
      totalUsers,
      activeUsers,
      pendingKyc,
      pendingWithdrawals,
      paymentsAgg,
      withdrawalsPaidAgg,
    ] = await this.prisma.$transaction([
      this.prisma.user.count(),
      this.prisma.user.count({ where: { isActive: true, isBanned: false } }),
      this.prisma.user.count({ where: { kycStatus: KycStatus.PENDING } }),
      this.prisma.withdrawal.count({
        where: { status: WithdrawalStatus.REQUESTED },
      }),
      this.prisma.payment.aggregate({
        where: { status: PaymentStatus.SUCCESS },
        _sum: { amount: true },
        _count: true,
      }),
      this.prisma.withdrawal.aggregate({
        where: { status: WithdrawalStatus.PAID },
        _sum: { amount: true },
      }),
    ]);

    const revenue = paymentsAgg._sum.amount ?? 0;
    const paidOut = withdrawalsPaidAgg._sum.amount ?? 0;
    return {
      totalUsers,
      activeUsers,
      pendingKyc,
      pendingWithdrawals,
      successfulPayments: paymentsAgg._count,
      totalRevenue: revenue,
      totalRevenueFormatted: formatPaise(revenue),
      totalPaidOut: paidOut,
      totalPaidOutFormatted: formatPaise(paidOut),
    };
  }

  async getUsers(search?: string, page?: number, pageSize?: number) {
    const { take, skip, page: p } = this.paginate(page, pageSize);
    const where: Prisma.UserWhereInput = search
      ? {
          OR: [
            { email: { contains: search, mode: 'insensitive' } },
            { adsId: { contains: search, mode: 'insensitive' } },
            { mobile: { contains: search } },
            { fullName: { contains: search, mode: 'insensitive' } },
          ],
        }
      : {};

    const [items, total] = await this.prisma.$transaction([
      this.prisma.user.findMany({
        where,
        skip,
        take,
        orderBy: { createdAt: 'desc' },
        select: {
          id: true,
          adsId: true,
          fullName: true,
          email: true,
          mobile: true,
          state: true,
          role: true,
          isActive: true,
          isBanned: true,
          kycStatus: true,
          createdAt: true,
          wallet: { select: { availableBalance: true } },
        },
      }),
      this.prisma.user.count({ where }),
    ]);

    return { items, meta: { page: p, pageSize: take, total } };
  }

  async getUser(id: string) {
    const user = await this.prisma.user.findUnique({
      where: { id },
      include: {
        wallet: true,
        partnerTier: { include: { tier: true } },
        coursePurchases: { include: { package: true } },
        withdrawals: { orderBy: { requestedAt: 'desc' } },
      },
    });
    if (!user) throw new NotFoundException('User not found');
    const { passwordHash, refreshTokenHash, twoFASecret, ...safe } = user;
    return safe;
  }

  async banUser(adminId: string, userId: string, reason?: string) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) throw new NotFoundException('User not found');
    await this.prisma.$transaction([
      this.prisma.user.update({
        where: { id: userId },
        data: { isBanned: true },
      }),
      this.prisma.auditLog.create({
        data: {
          actorId: adminId,
          action: 'USER_BAN',
          targetType: 'User',
          targetId: userId,
          metadata: reason ? { reason } : undefined,
        },
      }),
    ]);
    return { isBanned: true };
  }

  async unbanUser(adminId: string, userId: string) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) throw new NotFoundException('User not found');
    await this.prisma.$transaction([
      this.prisma.user.update({
        where: { id: userId },
        data: { isBanned: false },
      }),
      this.prisma.auditLog.create({
        data: {
          actorId: adminId,
          action: 'USER_UNBAN',
          targetType: 'User',
          targetId: userId,
        },
      }),
    ]);
    return { isBanned: false };
  }

  // ── KYC review ──────────────────────────────────────────────────

  async getPendingKyc() {
    const users = await this.prisma.user.findMany({
      where: { kycStatus: KycStatus.PENDING },
      select: {
        id: true,
        adsId: true,
        fullName: true,
        email: true,
        kycSubmittedAt: true,
      },
      orderBy: { kycSubmittedAt: 'asc' },
    });
    return users;
  }

  async getKycDocuments(userId: string) {
    const docs = await this.prisma.kycDocument.findMany({ where: { userId } });
    // Generate short-lived signed URLs for each document.
    const withUrls = await Promise.all(
      docs.map(async (d) => ({
        documentType: d.documentType,
        uploadedAt: d.uploadedAt,
        viewUrl: await this.kycService
          .getSignedViewUrl(d.filePublicId)
          .catch(() => d.fileUrl),
      })),
    );
    return withUrls;
  }

  // ── Read-only lists ─────────────────────────────────────────────

  async getPendingWithdrawals() {
    const items = await this.prisma.withdrawal.findMany({
      where: { status: WithdrawalStatus.REQUESTED },
      orderBy: { requestedAt: 'asc' },
      include: { user: { select: { adsId: true, fullName: true, email: true } } },
    });
    return items.map((w) => ({ ...w, amountFormatted: formatPaise(w.amount) }));
  }

  async getTransactions(page?: number, pageSize?: number) {
    const { take, skip, page: p } = this.paginate(page, pageSize);
    const [items, total] = await this.prisma.$transaction([
      this.prisma.ledgerEntry.findMany({
        skip,
        take,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.ledgerEntry.count(),
    ]);
    return {
      items: items.map((e) => ({ ...e, amountFormatted: formatPaise(e.amount) })),
      meta: { page: p, pageSize: take, total },
    };
  }

  async getPayments(page?: number, pageSize?: number) {
    const { take, skip, page: p } = this.paginate(page, pageSize);
    const [items, total] = await this.prisma.$transaction([
      this.prisma.payment.findMany({
        skip,
        take,
        orderBy: { createdAt: 'desc' },
        include: { user: { select: { adsId: true, email: true } } },
      }),
      this.prisma.payment.count(),
    ]);
    return {
      items: items.map((e) => ({ ...e, amountFormatted: formatPaise(e.amount) })),
      meta: { page: p, pageSize: take, total },
    };
  }

  async getAuditLogs(page?: number, pageSize?: number) {
    const { take, skip, page: p } = this.paginate(page, pageSize);
    const [items, total] = await this.prisma.$transaction([
      this.prisma.auditLog.findMany({
        skip,
        take,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.auditLog.count(),
    ]);
    return { items, meta: { page: p, pageSize: take, total } };
  }
}
