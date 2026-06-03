import {
  BadRequestException,
  Injectable,
  Logger,
  NotFoundException,
  ServiceUnavailableException,
} from '@nestjs/common';
import { v2 as cloudinary } from 'cloudinary';
import { AdSessionStatus, KycStatus } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';
import { KYC_REQUIRED_DOCS } from '../../common/constants';
import { SubmitKycDto } from './dto/submit-kyc.dto';

@Injectable()
export class KycService {
  private readonly logger = new Logger(KycService.name);
  private cloudinaryConfigured = false;

  constructor(private prisma: PrismaService) {
    const cloud_name = process.env.CLOUDINARY_CLOUD_NAME;
    const api_key = process.env.CLOUDINARY_API_KEY;
    const api_secret = process.env.CLOUDINARY_API_SECRET;
    if (cloud_name && api_key && api_secret) {
      cloudinary.config({ cloud_name, api_key, api_secret, secure: true });
      this.cloudinaryConfigured = true;
    }
  }

  /** Gate: user must have >= 2 completed ad sessions OR an active partner tier. */
  private async isGateOpen(userId: string): Promise<boolean> {
    const completed = await this.prisma.adSession.count({
      where: { userId, status: AdSessionStatus.COMPLETED },
    });
    if (completed >= 2) return true;
    const tier = await this.prisma.userPartnerTier.findUnique({
      where: { userId },
    });
    return !!tier;
  }

  async getStatus(userId: string) {
    const user = await this.prisma.user.findUniqueOrThrow({
      where: { id: userId },
      select: {
        kycStatus: true,
        kycSubmittedAt: true,
        kycApprovedAt: true,
        kycRejectedAt: true,
        kycRejectionNote: true,
      },
    });
    const documents = await this.prisma.kycDocument.findMany({
      where: { userId },
      select: { documentType: true, uploadedAt: true },
    });
    const gateOpen = await this.isGateOpen(userId);
    return { ...user, gateOpen, requiredDocuments: KYC_REQUIRED_DOCS, documents };
  }

  /** Returns signed params the frontend uses to upload directly to Cloudinary. */
  async getUploadParams(userId: string, documentType: string) {
    if (!this.cloudinaryConfigured) {
      throw new ServiceUnavailableException('File storage not configured');
    }
    if (!KYC_REQUIRED_DOCS.includes(documentType as never)) {
      throw new BadRequestException('Invalid document type');
    }
    if (!(await this.isGateOpen(userId))) {
      throw new BadRequestException(
        'Complete at least 2 ad sessions or buy a partner tier to start KYC',
      );
    }

    const timestamp = Math.round(Date.now() / 1000);
    const folder = `kyc/${userId}`;
    const signature = cloudinary.utils.api_sign_request(
      { timestamp, folder, type: 'authenticated' },
      process.env.CLOUDINARY_API_SECRET!,
    );

    return {
      cloudName: process.env.CLOUDINARY_CLOUD_NAME,
      apiKey: process.env.CLOUDINARY_API_KEY,
      timestamp,
      folder,
      signature,
      type: 'authenticated',
    };
  }

  async submit(userId: string, dto: SubmitKycDto) {
    if (!(await this.isGateOpen(userId))) {
      throw new BadRequestException('KYC is not unlocked yet');
    }
    const provided = new Set(dto.documents.map((d) => d.documentType));
    const missing = KYC_REQUIRED_DOCS.filter((d) => !provided.has(d));
    if (missing.length > 0) {
      throw new BadRequestException(`Missing documents: ${missing.join(', ')}`);
    }

    await this.prisma.$transaction(async (tx) => {
      // Replace any prior uploads for a clean resubmission.
      await tx.kycDocument.deleteMany({ where: { userId } });
      await tx.kycDocument.createMany({
        data: dto.documents.map((d) => ({
          userId,
          documentType: d.documentType,
          fileUrl: d.fileUrl,
          filePublicId: d.filePublicId,
        })),
      });
      await tx.user.update({
        where: { id: userId },
        data: {
          kycStatus: KycStatus.PENDING,
          kycSubmittedAt: new Date(),
          kycRejectionNote: null,
          kycRejectedAt: null,
        },
      });
    });

    return { kycStatus: KycStatus.PENDING };
  }

  /** Admin: time-limited signed view URL for a stored KYC document. */
  async getSignedViewUrl(publicId: string): Promise<string> {
    if (!this.cloudinaryConfigured) {
      throw new ServiceUnavailableException('File storage not configured');
    }
    return cloudinary.url(publicId, {
      type: 'authenticated',
      sign_url: true,
      secure: true,
      expires_at: Math.round(Date.now() / 1000) + 600, // 10 min
    });
  }

  // ── Admin actions (called from AdminController) ─────────────────

  async approve(adminId: string, userId: string) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) throw new NotFoundException('User not found');
    if (user.kycStatus !== KycStatus.PENDING) {
      throw new BadRequestException('KYC is not pending review');
    }
    await this.prisma.$transaction(async (tx) => {
      await tx.user.update({
        where: { id: userId },
        data: { kycStatus: KycStatus.APPROVED, kycApprovedAt: new Date() },
      });
      await tx.auditLog.create({
        data: {
          actorId: adminId,
          action: 'KYC_APPROVE',
          targetType: 'User',
          targetId: userId,
        },
      });
    });
    return { kycStatus: KycStatus.APPROVED };
  }

  async reject(adminId: string, userId: string, reason: string) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) throw new NotFoundException('User not found');
    if (user.kycStatus !== KycStatus.PENDING) {
      throw new BadRequestException('KYC is not pending review');
    }
    await this.prisma.$transaction(async (tx) => {
      await tx.user.update({
        where: { id: userId },
        data: {
          kycStatus: KycStatus.REJECTED,
          kycRejectedAt: new Date(),
          kycRejectionNote: reason,
        },
      });
      await tx.auditLog.create({
        data: {
          actorId: adminId,
          action: 'KYC_REJECT',
          targetType: 'User',
          targetId: userId,
          metadata: { reason },
        },
      });
    });
    return { kycStatus: KycStatus.REJECTED };
  }
}
