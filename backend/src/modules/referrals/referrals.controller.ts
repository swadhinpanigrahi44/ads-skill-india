import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { ReferralsService } from './referrals.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';

@Controller()
export class ReferralsController {
  constructor(private referralsService: ReferralsService) {}

  @Get('referrals/my-links')
  @UseGuards(JwtAuthGuard)
  async myLinks(@CurrentUser() user: { id: string }) {
    const frontendUrl = process.env.FRONTEND_URL ?? 'http://localhost:3000';
    const data = await this.referralsService.getMyLinks(user.id, frontendUrl);
    return { success: true, data };
  }

  @Get('referrals/my-team')
  @UseGuards(JwtAuthGuard)
  async myTeam(@CurrentUser() user: { id: string }) {
    const data = await this.referralsService.getMyTeam(user.id);
    return { success: true, data };
  }

  // Public leaderboard
  @Get('leaderboard')
  async leaderboard(@Query('limit') limit?: string) {
    const data = await this.referralsService.getLeaderboard(
      limit ? parseInt(limit, 10) : 10,
    );
    return { success: true, data };
  }

  // Public: resolve a referral code to the sponsor's name (register prefill)
  @Get('referrals/lookup')
  async lookup(@Query('code') code?: string) {
    const data = await this.referralsService.lookupSponsor(code ?? '');
    return { success: true, data };
  }
}
