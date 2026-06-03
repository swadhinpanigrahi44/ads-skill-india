import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import {
  KycStatus,
  TransactionStatus,
  TransactionType,
  WithdrawalStatus,
} from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';
import { WalletService } from '../wallet/wallet.service';
import { MIN_WITHDRAWAL_PAISE, formatPaise } from '../../common/constants';
import { RequestWithdrawalDto } from './dto/request-withdrawal.dto';

@Injectable()
export class WithdrawalsService {
  constructor(
    private prisma: PrismaService,
    private walletService: WalletService,
  ) {}

  getConfig() {
    return {
      minAmount: MIN_WITHDRAWAL_PAISE,
      minAmountFormatted: formatPaise(MIN_WITHDRAWAL_PAISE),
    };
  }

  async getMyRequests(userId: string) {
    const items = await this.prisma.withdrawal.findMany({
      where: { userId },
      orderBy: { requestedAt: 'desc' },
    });
    return items.map((w) => ({ ...w, amountFormatted: formatPaise(w.amount) }));
  }

  async request(userId: string, dto: RequestWithdrawalDto) {
    const user = await this.prisma.user.findUniqueOrThrow({
      where: { id: userId },
      select: { kycStatus: true },
    });
    if (user.kycStatus !== KycStatus.APPROVED) {
      throw new ForbiddenException('Complete KYC before withdrawing');
    }

    if (dto.method === 'UPI' && !dto.upiId) {
      throw new BadRequestException('upiId is required for UPI withdrawals');
    }
    if (dto.method === 'BANK' && (!dto.accountNumber || !dto.ifscCode)) {
      throw new BadRequestException('Bank account number and IFSC are required');
    }

    const pending = await this.prisma.withdrawal.findFirst({
      where: {
        userId,
        status: { in: [WithdrawalStatus.REQUESTED, WithdrawalStatus.APPROVED] },
      },
    });
    if (pending) {
      throw new ConflictException('You already have a pending withdrawal');
    }

    const withdrawal = await this.prisma.$transaction(async (tx) => {
      const created = await tx.withdrawal.create({
        data: {
          userId,
          amount: dto.amount,
          method: dto.method,
          upiId: dto.upiId,
          accountHolderName: dto.accountHolderName,
          accountNumber: dto.accountNumber,
          ifscCode: dto.ifscCode,
          bankName: dto.bankName,
          status: WithdrawalStatus.REQUESTED,
        },
      });
      // Debit immediately so the same balance can't be requested twice.
      await this.walletService.debit(tx, {
        userId,
        amount: dto.amount,
        type: TransactionType.WITHDRAWAL_DEBIT,
        bucket: 'available',
        status: TransactionStatus.PENDING,
        ref: { withdrawalId: created.id, note: 'Withdrawal requested' },
      });
      return created;
    });

    return { ...withdrawal, amountFormatted: formatPaise(withdrawal.amount) };
  }

  // ── Admin actions ──────────────────────────────────────────────

  async approve(adminId: string, withdrawalId: string, transactionRef: string) {
    const w = await this.prisma.withdrawal.findUnique({
      where: { id: withdrawalId },
    });
    if (!w) throw new NotFoundException('Withdrawal not found');
    if (w.status !== WithdrawalStatus.REQUESTED) {
      throw new BadRequestException('Withdrawal is not in REQUESTED state');
    }

    await this.prisma.$transaction(async (tx) => {
      await tx.withdrawal.update({
        where: { id: withdrawalId },
        data: {
          status: WithdrawalStatus.PAID,
          reviewedById: adminId,
          reviewedAt: new Date(),
          transactionRef,
        },
      });
      // Settle the pending debit ledger entries for this withdrawal.
      await tx.ledgerEntry.updateMany({
        where: { withdrawalId, status: TransactionStatus.PENDING },
        data: { status: TransactionStatus.SETTLED },
      });
      await tx.auditLog.create({
        data: {
          actorId: adminId,
          action: 'WITHDRAWAL_APPROVE',
          targetType: 'Withdrawal',
          targetId: withdrawalId,
          metadata: { transactionRef },
        },
      });
    });
    return { status: WithdrawalStatus.PAID };
  }

  async reject(adminId: string, withdrawalId: string, reason: string) {
    const w = await this.prisma.withdrawal.findUnique({
      where: { id: withdrawalId },
    });
    if (!w) throw new NotFoundException('Withdrawal not found');
    if (w.status !== WithdrawalStatus.REQUESTED) {
      throw new BadRequestException('Withdrawal is not in REQUESTED state');
    }

    await this.prisma.$transaction(async (tx) => {
      await tx.withdrawal.update({
        where: { id: withdrawalId },
        data: {
          status: WithdrawalStatus.REJECTED,
          reviewedById: adminId,
          reviewedAt: new Date(),
          rejectionNote: reason,
        },
      });
      // Reverse the debit — credit the money back to the user.
      await this.walletService.credit(tx, {
        userId: w.userId,
        amount: w.amount,
        type: TransactionType.WITHDRAWAL_DEBIT,
        bucket: 'available',
        status: TransactionStatus.REVERSED,
        ref: { withdrawalId, note: 'Withdrawal rejected — refunded' },
      });
      await tx.auditLog.create({
        data: {
          actorId: adminId,
          action: 'WITHDRAWAL_REJECT',
          targetType: 'Withdrawal',
          targetId: withdrawalId,
          metadata: { reason },
        },
      });
    });
    return { status: WithdrawalStatus.REJECTED };
  }
}
