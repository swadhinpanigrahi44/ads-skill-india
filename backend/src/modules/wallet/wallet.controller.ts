import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { WalletService } from './wallet.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { PrismaService } from '../../prisma/prisma.service';
import { formatPaise } from '../../common/constants';

@Controller('users/me')
@UseGuards(JwtAuthGuard)
export class WalletController {
  constructor(
    private walletService: WalletService,
    private prisma: PrismaService,
  ) {}

  @Get('wallet')
  async getWallet(@CurrentUser() user: { id: string }) {
    const data = await this.walletService.getBalance(user.id);
    return { success: true, data };
  }

  @Get('transactions')
  async getTransactions(
    @CurrentUser() user: { id: string },
    @Query('page') page?: string,
    @Query('pageSize') pageSize?: string,
  ) {
    const result = await this.walletService.getTransactions(
      user.id,
      page ? parseInt(page, 10) : 1,
      pageSize ? parseInt(pageSize, 10) : undefined,
    );
    return { success: true, data: result.items, meta: result.meta };
  }

  @Get('commissions')
  async getCommissions(@CurrentUser() user: { id: string }) {
    const items = await this.prisma.commission.findMany({
      where: { earnerId: user.id },
      orderBy: { createdAt: 'desc' },
    });
    return {
      success: true,
      data: items.map((c) => ({ ...c, amountFormatted: formatPaise(c.amount) })),
    };
  }

  @Get('purchases')
  async getPurchases(@CurrentUser() user: { id: string }) {
    const items = await this.prisma.coursePurchase.findMany({
      where: { userId: user.id },
      orderBy: { purchasedAt: 'desc' },
      include: { package: { select: { name: true, slug: true, price: true } } },
    });
    return { success: true, data: items };
  }
}
