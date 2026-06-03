import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { AdminService } from './admin.service';
import { KycService } from '../kyc/kyc.service';
import { WithdrawalsService } from '../withdrawals/withdrawals.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { CurrentUser } from '../../common/decorators/current-user.decorator';

@Controller('admin')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('SUB_ADMIN', 'MASTER_ADMIN')
export class AdminController {
  constructor(
    private adminService: AdminService,
    private kycService: KycService,
    private withdrawalsService: WithdrawalsService,
  ) {}

  @Get('dashboard')
  async dashboard() {
    return { success: true, data: await this.adminService.getDashboard() };
  }

  @Get('users')
  async users(
    @Query('search') search?: string,
    @Query('page') page?: string,
    @Query('pageSize') pageSize?: string,
  ) {
    const result = await this.adminService.getUsers(
      search,
      page ? parseInt(page, 10) : undefined,
      pageSize ? parseInt(pageSize, 10) : undefined,
    );
    return { success: true, data: result.items, meta: result.meta };
  }

  @Get('users/:id')
  async user(@Param('id') id: string) {
    return { success: true, data: await this.adminService.getUser(id) };
  }

  @Post('users/:id/ban')
  async ban(
    @CurrentUser() admin: { id: string },
    @Param('id') id: string,
    @Body('reason') reason?: string,
  ) {
    return { success: true, data: await this.adminService.banUser(admin.id, id, reason) };
  }

  @Post('users/:id/unban')
  async unban(@CurrentUser() admin: { id: string }, @Param('id') id: string) {
    return { success: true, data: await this.adminService.unbanUser(admin.id, id) };
  }

  @Get('kyc/pending')
  async kycPending() {
    return { success: true, data: await this.adminService.getPendingKyc() };
  }

  @Get('kyc/:userId')
  async kycDocs(@Param('userId') userId: string) {
    return { success: true, data: await this.adminService.getKycDocuments(userId) };
  }

  @Post('kyc/:userId/approve')
  async kycApprove(
    @CurrentUser() admin: { id: string },
    @Param('userId') userId: string,
  ) {
    return { success: true, data: await this.kycService.approve(admin.id, userId) };
  }

  @Post('kyc/:userId/reject')
  async kycReject(
    @CurrentUser() admin: { id: string },
    @Param('userId') userId: string,
    @Body('reason') reason: string,
  ) {
    return {
      success: true,
      data: await this.kycService.reject(admin.id, userId, reason ?? 'Rejected'),
    };
  }

  @Get('withdrawals/pending')
  async withdrawalsPending() {
    return { success: true, data: await this.adminService.getPendingWithdrawals() };
  }

  @Post('withdrawals/:id/approve')
  async withdrawalApprove(
    @CurrentUser() admin: { id: string },
    @Param('id') id: string,
    @Body('transactionRef') transactionRef: string,
  ) {
    return {
      success: true,
      data: await this.withdrawalsService.approve(admin.id, id, transactionRef ?? ''),
    };
  }

  @Post('withdrawals/:id/reject')
  async withdrawalReject(
    @CurrentUser() admin: { id: string },
    @Param('id') id: string,
    @Body('reason') reason: string,
  ) {
    return {
      success: true,
      data: await this.withdrawalsService.reject(admin.id, id, reason ?? 'Rejected'),
    };
  }

  @Get('transactions')
  async transactions(
    @Query('page') page?: string,
    @Query('pageSize') pageSize?: string,
  ) {
    const r = await this.adminService.getTransactions(
      page ? parseInt(page, 10) : undefined,
      pageSize ? parseInt(pageSize, 10) : undefined,
    );
    return { success: true, data: r.items, meta: r.meta };
  }

  @Get('payments')
  async payments(
    @Query('page') page?: string,
    @Query('pageSize') pageSize?: string,
  ) {
    const r = await this.adminService.getPayments(
      page ? parseInt(page, 10) : undefined,
      pageSize ? parseInt(pageSize, 10) : undefined,
    );
    return { success: true, data: r.items, meta: r.meta };
  }

  @Get('audit-logs')
  async auditLogs(
    @Query('page') page?: string,
    @Query('pageSize') pageSize?: string,
  ) {
    const r = await this.adminService.getAuditLogs(
      page ? parseInt(page, 10) : undefined,
      pageSize ? parseInt(pageSize, 10) : undefined,
    );
    return { success: true, data: r.items, meta: r.meta };
  }
}
