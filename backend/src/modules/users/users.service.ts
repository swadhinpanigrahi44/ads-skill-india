import { Injectable, ServiceUnavailableException } from '@nestjs/common';
import { v2 as cloudinary } from 'cloudinary';
import { PrismaService } from '../../prisma/prisma.service';
import { UpdateUserDto } from './dto/update-user.dto';

const USER_SELECT = {
  id: true,
  adsId: true,
  fullName: true,
  email: true,
  mobile: true,
  state: true,
  role: true,
  kycStatus: true,
  referralCode: true,
  referredById: true,
  isActive: true,
  twoFAEnabled: true,
  avatarUrl: true,
  createdAt: true,
  wallet: {
    select: { availableBalance: true, pendingBalance: true },
  },
  partnerTier: {
    select: { tier: { select: { name: true, slug: true } } },
  },
} as const;

@Injectable()
export class UsersService {
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

  /** Signed params for the frontend to upload an avatar directly to Cloudinary. */
  getAvatarUploadParams(userId: string) {
    if (!this.cloudinaryConfigured) {
      throw new ServiceUnavailableException('Image storage is not configured');
    }
    const timestamp = Math.round(Date.now() / 1000);
    const folder = `avatars/${userId}`;
    const signature = cloudinary.utils.api_sign_request(
      { timestamp, folder },
      process.env.CLOUDINARY_API_SECRET!,
    );
    return {
      cloudName: process.env.CLOUDINARY_CLOUD_NAME,
      apiKey: process.env.CLOUDINARY_API_KEY,
      timestamp,
      folder,
      signature,
    };
  }

  /** Save the uploaded avatar URL on the user. */
  async setAvatar(userId: string, url: string) {
    const updated = await this.prisma.user.update({
      where: { id: userId },
      data: { avatarUrl: url },
      select: USER_SELECT,
    });
    return updated;
  }

  async getMe(userId: string) {
    const user = await this.prisma.user.findUniqueOrThrow({
      where: { id: userId },
      select: USER_SELECT,
    });

    return {
      ...user,
      wallet: {
        availableBalance: user.wallet?.availableBalance ?? 0,
        pendingBalance: user.wallet?.pendingBalance ?? 0,
        availableFormatted: ((user.wallet?.availableBalance ?? 0) / 100).toFixed(2),
        pendingFormatted: ((user.wallet?.pendingBalance ?? 0) / 100).toFixed(2),
      },
    };
  }

  async updateMe(userId: string, dto: UpdateUserDto) {
    const updated = await this.prisma.user.update({
      where: { id: userId },
      data: {
        ...(dto.fullName && { fullName: dto.fullName }),
        ...(dto.state && { state: dto.state }),
      },
      select: USER_SELECT,
    });
    return updated;
  }
}
