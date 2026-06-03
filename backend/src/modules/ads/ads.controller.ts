import {
  Body,
  Controller,
  Get,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import type { Request } from 'express';
import { AdsService } from './ads.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { CurrentUser } from '../../common/decorators/current-user.decorator';

@Controller('ads')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('USER')
export class AdsController {
  constructor(private adsService: AdsService) {}

  @Get('eligibility')
  async eligibility(@CurrentUser() user: { id: string }) {
    const data = await this.adsService.checkEligibility(user.id);
    return { success: true, data };
  }

  @Post('start-session')
  async start(@CurrentUser() user: { id: string }, @Req() req: Request) {
    const ip = req.ip ?? req.socket?.remoteAddress ?? undefined;
    const ua = req.headers['user-agent'];
    const data = await this.adsService.startSession(user.id, ip, ua);
    return { success: true, data };
  }

  @Post('complete-session')
  async complete(
    @CurrentUser() user: { id: string },
    @Body('sessionId') sessionId: string,
  ) {
    const data = await this.adsService.completeSession(user.id, sessionId);
    return { success: true, data };
  }
}
