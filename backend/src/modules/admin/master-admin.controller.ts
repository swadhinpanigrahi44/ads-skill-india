import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { MasterAdminService } from './master-admin.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { RegisterDto } from '../auth/dto/register.dto';

@Controller('master-admin')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('MASTER_ADMIN')
export class MasterAdminController {
  constructor(private masterAdminService: MasterAdminService) {}

  @Get('commission-matrix')
  async getMatrix() {
    return { success: true, data: await this.masterAdminService.getCommissionMatrix() };
  }

  @Put('commission-matrix')
  async updateMatrix(
    @CurrentUser() admin: { id: string },
    @Body('rateId') rateId: string,
    @Body('amount') amount: number,
  ) {
    return {
      success: true,
      data: await this.masterAdminService.updateCommissionRate(admin.id, rateId, amount),
    };
  }

  @Post('sub-admins')
  async createSubAdmin(
    @CurrentUser() admin: { id: string },
    @Body() dto: RegisterDto,
  ) {
    return {
      success: true,
      data: await this.masterAdminService.createSubAdmin(admin.id, {
        fullName: dto.fullName,
        email: dto.email,
        mobile: dto.mobile,
        state: dto.state,
        password: dto.password,
      }),
    };
  }

  @Delete('sub-admins/:id')
  async deleteSubAdmin(
    @CurrentUser() admin: { id: string },
    @Param('id') id: string,
  ) {
    return { success: true, data: await this.masterAdminService.deleteSubAdmin(admin.id, id) };
  }

  @Post('users/:id/credit')
  async credit(
    @CurrentUser() admin: { id: string },
    @Param('id') id: string,
    @Body('amount') amount: number,
    @Body('note') note?: string,
  ) {
    return {
      success: true,
      data: await this.masterAdminService.manualCredit(admin.id, id, amount, note),
    };
  }

  @Post('users/:id/debit')
  async debit(
    @CurrentUser() admin: { id: string },
    @Param('id') id: string,
    @Body('amount') amount: number,
    @Body('note') note?: string,
  ) {
    return {
      success: true,
      data: await this.masterAdminService.manualDebit(admin.id, id, amount, note),
    };
  }

  @Get('reconciliation')
  async reconciliation() {
    return { success: true, data: await this.masterAdminService.reconciliation() };
  }
}
