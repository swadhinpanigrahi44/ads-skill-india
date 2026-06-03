import { Controller, Get } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { formatPaise } from '../../common/constants';

@Controller()
export class CatalogController {
  constructor(private prisma: PrismaService) {}

  @Get('packages')
  async packages() {
    const items = await this.prisma.coursePackage.findMany({
      where: { isActive: true },
      orderBy: { sortOrder: 'asc' },
    });
    return {
      success: true,
      data: items.map((p) => ({ ...p, priceFormatted: formatPaise(p.price) })),
    };
  }

  @Get('partner-tiers')
  async partnerTiers() {
    const items = await this.prisma.partnerTier.findMany({
      where: { isActive: true },
      orderBy: { sortOrder: 'asc' },
    });
    return {
      success: true,
      data: items.map((t) => ({ ...t, priceFormatted: formatPaise(t.price) })),
    };
  }
}
