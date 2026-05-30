import { Injectable } from '@nestjs/common';
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
  constructor(private prisma: PrismaService) {}

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
