import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { Prisma, TransactionStatus, TransactionType } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';
import {
  DEFAULT_PAGE_SIZE,
  MAX_PAGE_SIZE,
  formatPaise,
} from '../../common/constants';

/** A Prisma transaction client (the `tx` passed inside `$transaction`). */
type Tx = Prisma.TransactionClient;

type Bucket = 'available' | 'pending';

interface LedgerRef {
  paymentId?: string;
  commissionId?: string;
  withdrawalId?: string;
  adSessionId?: string;
  note?: string;
}

interface MovementParams {
  userId: string;
  amount: number; // paise, must be > 0
  type: TransactionType;
  bucket?: Bucket; // default 'available'
  status?: TransactionStatus; // default SETTLED
  ref?: LedgerRef;
}

@Injectable()
export class WalletService {
  private readonly logger = new Logger(WalletService.name);

  constructor(private prisma: PrismaService) {}

  private assertPositive(amount: number) {
    if (!Number.isInteger(amount) || amount <= 0) {
      throw new BadRequestException('Amount must be a positive integer (paise)');
    }
  }

  private balanceColumn(bucket: Bucket): 'availableBalance' | 'pendingBalance' {
    return bucket === 'pending' ? 'pendingBalance' : 'availableBalance';
  }

  /**
   * Credit a user's wallet and write an append-only ledger entry.
   * MUST be called inside a `prisma.$transaction()` (pass the `tx` client).
   */
  async credit(tx: Tx, params: MovementParams): Promise<void> {
    this.assertPositive(params.amount);
    const bucket = params.bucket ?? 'available';
    const column = this.balanceColumn(bucket);

    const wallet = await tx.wallet.upsert({
      where: { userId: params.userId },
      create: { userId: params.userId, [column]: params.amount },
      update: { [column]: { increment: params.amount } },
    });

    await tx.ledgerEntry.create({
      data: {
        userId: params.userId,
        walletId: wallet.id,
        type: params.type,
        status: params.status ?? TransactionStatus.SETTLED,
        amount: params.amount,
        direction: 'CREDIT',
        paymentId: params.ref?.paymentId,
        commissionId: params.ref?.commissionId,
        withdrawalId: params.ref?.withdrawalId,
        adSessionId: params.ref?.adSessionId,
        note: params.ref?.note,
      },
    });
  }

  /**
   * Debit a user's wallet (with a hard guard against going negative) and write
   * an append-only ledger entry. MUST be called inside a `prisma.$transaction()`.
   */
  async debit(tx: Tx, params: MovementParams): Promise<void> {
    this.assertPositive(params.amount);
    const bucket = params.bucket ?? 'available';
    const column = this.balanceColumn(bucket);

    const wallet = await tx.wallet.findUnique({
      where: { userId: params.userId },
    });
    const current = wallet ? wallet[column] : 0;
    if (current < params.amount) {
      throw new BadRequestException('Insufficient wallet balance');
    }

    await tx.wallet.update({
      where: { userId: params.userId },
      data: { [column]: { decrement: params.amount } },
    });

    await tx.ledgerEntry.create({
      data: {
        userId: params.userId,
        walletId: wallet!.id,
        type: params.type,
        status: params.status ?? TransactionStatus.SETTLED,
        amount: params.amount,
        direction: 'DEBIT',
        paymentId: params.ref?.paymentId,
        commissionId: params.ref?.commissionId,
        withdrawalId: params.ref?.withdrawalId,
        adSessionId: params.ref?.adSessionId,
        note: params.ref?.note,
      },
    });
  }

  /** Read the cached balance for a user (paise + formatted rupees). */
  async getBalance(userId: string) {
    const wallet = await this.prisma.wallet.findUnique({ where: { userId } });
    const available = wallet?.availableBalance ?? 0;
    const pending = wallet?.pendingBalance ?? 0;
    return {
      availableBalance: available,
      pendingBalance: pending,
      availableFormatted: formatPaise(available),
      pendingFormatted: formatPaise(pending),
    };
  }

  /** Paginated ledger history for a user, newest first. */
  async getTransactions(userId: string, page = 1, pageSize = DEFAULT_PAGE_SIZE) {
    const take = Math.min(Math.max(pageSize, 1), MAX_PAGE_SIZE);
    const safePage = Math.max(page, 1);
    const skip = (safePage - 1) * take;

    const [items, total] = await this.prisma.$transaction([
      this.prisma.ledgerEntry.findMany({
        where: { userId },
        orderBy: { createdAt: 'desc' },
        skip,
        take,
      }),
      this.prisma.ledgerEntry.count({ where: { userId } }),
    ]);

    return {
      items: items.map((e) => ({
        ...e,
        amountFormatted: formatPaise(e.amount),
      })),
      meta: { page: safePage, pageSize: take, total },
    };
  }

  /**
   * Reconciliation: compare the cached wallet balance against the sum of all
   * SETTLED ledger entries. Used by the admin reconciliation endpoint.
   */
  async verifyBalance(userId: string) {
    const wallet = await this.prisma.wallet.findUnique({ where: { userId } });
    const entries = await this.prisma.ledgerEntry.findMany({
      where: { userId, status: TransactionStatus.SETTLED },
    });
    const computed = entries.reduce(
      (sum, e) => sum + (e.direction === 'CREDIT' ? e.amount : -e.amount),
      0,
    );
    const cached = wallet?.availableBalance ?? 0;
    return {
      userId,
      cachedAvailable: cached,
      computedFromLedger: computed,
      inSync: cached === computed,
    };
  }
}
