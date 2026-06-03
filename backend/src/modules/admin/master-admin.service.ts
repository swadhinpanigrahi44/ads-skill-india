import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { Role, TransactionType } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';
import { WalletService } from '../wallet/wallet.service';
import { formatPaise } from '../../common/constants';

@Injectable()
export class MasterAdminService {
  constructor(
    private prisma: PrismaService,
    private walletService: WalletService,
  ) {}

  async getCommissionMatrix() {
    const rates = await this.prisma.commissionRate.findMany({
      include: {
        partnerTier: { select: { name: true, slug: true } },
        coursePackage: { select: { name: true, slug: true } },
      },
      orderBy: [{ partnerTierId: 'asc' }, { coursePackageId: 'asc' }, { level: 'asc' }],
    });
    return rates.map((r) => ({
      id: r.id,
      partnerTier: r.partnerTier.name,
      coursePackage: r.coursePackage.name,
      level: r.level,
      amount: r.amount,
      amountFormatted: formatPaise(r.amount),
    }));
  }

  async updateCommissionRate(adminId: string, rateId: string, amount: number) {
    if (!Number.isInteger(amount) || amount < 0) {
      throw new BadRequestException('amount must be a non-negative integer (paise)');
    }
    const rate = await this.prisma.commissionRate.findUnique({
      where: { id: rateId },
    });
    if (!rate) throw new NotFoundException('Commission rate not found');

    await this.prisma.$transaction([
      this.prisma.commissionRate.update({
        where: { id: rateId },
        data: { amount },
      }),
      this.prisma.auditLog.create({
        data: {
          actorId: adminId,
          action: 'COMMISSION_RATE_UPDATE',
          targetType: 'CommissionRate',
          targetId: rateId,
          metadata: { from: rate.amount, to: amount },
        },
      }),
    ]);
    return { id: rateId, amount };
  }

  async createSubAdmin(
    adminId: string,
    data: { fullName: string; email: string; mobile: string; state: string; password: string },
  ) {
    const exists = await this.prisma.user.findFirst({
      where: { OR: [{ email: data.email }, { mobile: data.mobile }] },
    });
    if (exists) {
      throw new BadRequestException('Email or mobile already in use');
    }
    const passwordHash = await bcrypt.hash(data.password, 12);
    // Sub-admins get an ADS id too, for consistency.
    const count = await this.prisma.user.count();
    const adsId = `ADS${15001 + count}`;

    const user = await this.prisma.$transaction(async (tx) => {
      const created = await tx.user.create({
        data: {
          adsId,
          fullName: data.fullName,
          email: data.email,
          mobile: data.mobile,
          state: data.state,
          passwordHash,
          role: Role.SUB_ADMIN,
          referralCode: adsId,
        },
      });
      await tx.auditLog.create({
        data: {
          actorId: adminId,
          action: 'SUB_ADMIN_CREATE',
          targetType: 'User',
          targetId: created.id,
        },
      });
      return created;
    });
    return { id: user.id, adsId: user.adsId, email: user.email };
  }

  async deleteSubAdmin(adminId: string, userId: string) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user || user.role !== Role.SUB_ADMIN) {
      throw new NotFoundException('Sub-admin not found');
    }
    await this.prisma.$transaction([
      // Demote rather than hard-delete (preserves audit/foreign keys).
      this.prisma.user.update({
        where: { id: userId },
        data: { role: Role.USER, isActive: false },
      }),
      this.prisma.auditLog.create({
        data: {
          actorId: adminId,
          action: 'SUB_ADMIN_REMOVE',
          targetType: 'User',
          targetId: userId,
        },
      }),
    ]);
    return { removed: true };
  }

  async manualCredit(adminId: string, userId: string, amount: number, note?: string) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) throw new NotFoundException('User not found');
    await this.prisma.$transaction(async (tx) => {
      await this.walletService.credit(tx, {
        userId,
        amount,
        type: TransactionType.ADMIN_CREDIT,
        bucket: 'available',
        ref: { note: note ?? 'Manual admin credit' },
      });
      await tx.auditLog.create({
        data: {
          actorId: adminId,
          action: 'MANUAL_CREDIT',
          targetType: 'User',
          targetId: userId,
          metadata: { amount, note },
        },
      });
    });
    return { credited: amount, creditedFormatted: formatPaise(amount) };
  }

  async manualDebit(adminId: string, userId: string, amount: number, note?: string) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) throw new NotFoundException('User not found');
    await this.prisma.$transaction(async (tx) => {
      await this.walletService.debit(tx, {
        userId,
        amount,
        type: TransactionType.ADMIN_DEBIT,
        bucket: 'available',
        ref: { note: note ?? 'Manual admin debit' },
      });
      await tx.auditLog.create({
        data: {
          actorId: adminId,
          action: 'MANUAL_DEBIT',
          targetType: 'User',
          targetId: userId,
          metadata: { amount, note },
        },
      });
    });
    return { debited: amount, debitedFormatted: formatPaise(amount) };
  }

  async reconciliation() {
    const wallets = await this.prisma.wallet.findMany();
    const results = await Promise.all(
      wallets.map((w) => this.walletService.verifyBalance(w.userId)),
    );
    const mismatches = results.filter((r) => !r.inSync);
    return { totalWallets: wallets.length, mismatches };
  }
}
