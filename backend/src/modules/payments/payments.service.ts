import {
  BadRequestException,
  Injectable,
  Logger,
  ServiceUnavailableException,
} from '@nestjs/common';
import { createHmac, timingSafeEqual } from 'crypto';
import Razorpay from 'razorpay';
import { PaymentStatus } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';
import { ReferralsService } from '../referrals/referrals.service';
import { CreateOrderDto } from './dto/create-order.dto';

@Injectable()
export class PaymentsService {
  private readonly logger = new Logger(PaymentsService.name);
  private razorpayClient: Razorpay | null = null;

  constructor(
    private prisma: PrismaService,
    private referralsService: ReferralsService,
  ) {}

  private getRazorpay(): Razorpay {
    if (this.razorpayClient) return this.razorpayClient;
    const key_id = process.env.RAZORPAY_KEY_ID;
    const key_secret = process.env.RAZORPAY_KEY_SECRET;
    if (!key_id || !key_secret) {
      throw new ServiceUnavailableException(
        'Payment gateway not configured (missing Razorpay keys)',
      );
    }
    this.razorpayClient = new Razorpay({ key_id, key_secret });
    return this.razorpayClient;
  }

  async createOrder(userId: string, dto: CreateOrderDto) {
    if (!dto.packageSlug && !dto.partnerTierSlug) {
      throw new BadRequestException(
        'Provide either packageSlug or partnerTierSlug',
      );
    }
    if (dto.packageSlug && dto.partnerTierSlug) {
      throw new BadRequestException(
        'Provide only one of packageSlug or partnerTierSlug',
      );
    }

    // Idempotency — return the existing order if this key was already used.
    const existing = await this.prisma.payment.findUnique({
      where: { idempotencyKey: dto.idempotencyKey },
    });
    if (existing) {
      return {
        orderId: existing.razorpayOrderId,
        amount: existing.amount,
        currency: existing.currency,
        key: process.env.RAZORPAY_KEY_ID,
        reused: true,
      };
    }

    // Resolve product + price from the DB (never trust a price from the client).
    let amount: number;
    let coursePackageId: string | null = null;
    let partnerTierId: string | null = null;

    if (dto.packageSlug) {
      const pkg = await this.prisma.coursePackage.findUnique({
        where: { slug: dto.packageSlug },
      });
      if (!pkg || !pkg.isActive) {
        throw new BadRequestException('Invalid course package');
      }
      amount = pkg.price;
      coursePackageId = pkg.id;
    } else {
      const tier = await this.prisma.partnerTier.findUnique({
        where: { slug: dto.partnerTierSlug! },
      });
      if (!tier || !tier.isActive) {
        throw new BadRequestException('Invalid partner tier');
      }
      amount = tier.price;
      partnerTierId = tier.id;
    }

    const order = await this.getRazorpay().orders.create({
      amount, // paise
      currency: 'INR',
      receipt: dto.idempotencyKey.slice(0, 40),
      notes: { userId, coursePackageId, partnerTierId },
    });

    await this.prisma.payment.create({
      data: {
        userId,
        coursePackageId,
        partnerTierId,
        razorpayOrderId: order.id,
        amount,
        currency: 'INR',
        status: PaymentStatus.CREATED,
        idempotencyKey: dto.idempotencyKey,
      },
    });

    return {
      orderId: order.id,
      amount,
      currency: 'INR',
      key: process.env.RAZORPAY_KEY_ID,
      reused: false,
    };
  }

  async getPaymentStatus(userId: string, orderId: string) {
    const payment = await this.prisma.payment.findUnique({
      where: { razorpayOrderId: orderId },
      select: {
        userId: true,
        status: true,
        amount: true,
        coursePackageId: true,
        partnerTierId: true,
        paidAt: true,
      },
    });
    if (!payment || payment.userId !== userId) {
      throw new BadRequestException('Order not found');
    }
    return {
      status: payment.status,
      amount: payment.amount,
      paidAt: payment.paidAt,
    };
  }

  /** Verify the Razorpay webhook HMAC signature against the raw request body. */
  private verifySignature(rawBody: Buffer, signature: string): boolean {
    const secret = process.env.RAZORPAY_WEBHOOK_SECRET;
    if (!secret) {
      throw new ServiceUnavailableException('Webhook secret not configured');
    }
    const expected = createHmac('sha256', secret).update(rawBody).digest('hex');
    try {
      const a = Buffer.from(expected, 'utf8');
      const b = Buffer.from(signature ?? '', 'utf8');
      return a.length === b.length && timingSafeEqual(a, b);
    } catch {
      return false;
    }
  }

  async handleWebhook(rawBody: Buffer, signature: string): Promise<void> {
    if (!this.verifySignature(rawBody, signature)) {
      throw new BadRequestException('Invalid webhook signature');
    }

    const event = JSON.parse(rawBody.toString('utf8'));
    const type: string = event?.event;
    const entity = event?.payload?.payment?.entity;
    if (!entity) return;

    const orderId: string = entity.order_id;
    const razorpayPaymentId: string = entity.id;

    if (type === 'payment.captured') {
      await this.handlePaymentCaptured(orderId, razorpayPaymentId);
    } else if (type === 'payment.failed') {
      await this.handlePaymentFailed(orderId, razorpayPaymentId, entity.error_description);
    }
  }

  private async handlePaymentCaptured(
    orderId: string,
    razorpayPaymentId: string,
  ): Promise<void> {
    await this.prisma.$transaction(async (tx) => {
      const payment = await tx.payment.findUnique({
        where: { razorpayOrderId: orderId },
      });
      if (!payment) {
        this.logger.warn(`Webhook for unknown order ${orderId}`);
        return;
      }
      if (payment.status === PaymentStatus.SUCCESS) {
        return; // idempotent — already processed
      }

      await tx.payment.update({
        where: { id: payment.id },
        data: {
          status: PaymentStatus.SUCCESS,
          razorpayPaymentId,
          paidAt: new Date(),
        },
      });

      if (payment.coursePackageId) {
        await tx.coursePurchase.create({
          data: {
            userId: payment.userId,
            packageId: payment.coursePackageId,
            paymentId: payment.id,
          },
        });
        await tx.user.update({
          where: { id: payment.userId },
          data: { isActive: true },
        });
        // Fire 2-level referral commissions inside the same transaction.
        await this.referralsService.processCommissions(tx, payment);
      } else if (payment.partnerTierId) {
        await tx.userPartnerTier.create({
          data: {
            userId: payment.userId,
            tierId: payment.partnerTierId,
            paymentId: payment.id,
          },
        });
      }
    });
    this.logger.log(`Payment captured + processed for order ${orderId}`);
  }

  private async handlePaymentFailed(
    orderId: string,
    razorpayPaymentId: string,
    reason?: string,
  ): Promise<void> {
    await this.prisma.payment.updateMany({
      where: { razorpayOrderId: orderId, status: { not: PaymentStatus.SUCCESS } },
      data: {
        status: PaymentStatus.FAILED,
        razorpayPaymentId,
        failureReason: reason ?? 'Payment failed',
      },
    });
  }
}
