import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { WithdrawalsService } from './withdrawals.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { RequestWithdrawalDto } from './dto/request-withdrawal.dto';

@Controller('withdrawals')
@UseGuards(JwtAuthGuard)
export class WithdrawalsController {
  constructor(private withdrawalsService: WithdrawalsService) {}

  @Get('config')
  config() {
    return { success: true, data: this.withdrawalsService.getConfig() };
  }

  @Get('my-requests')
  async myRequests(@CurrentUser() user: { id: string }) {
    const data = await this.withdrawalsService.getMyRequests(user.id);
    return { success: true, data };
  }

  @Post('request')
  @UseGuards(RolesGuard)
  @Roles('USER')
  async request(
    @CurrentUser() user: { id: string },
    @Body() dto: RequestWithdrawalDto,
  ) {
    const data = await this.withdrawalsService.request(user.id, dto);
    return { success: true, data };
  }
}
