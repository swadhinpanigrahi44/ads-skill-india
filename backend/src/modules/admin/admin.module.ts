import { Module } from '@nestjs/common';
import { AdminService } from './admin.service';
import { MasterAdminService } from './master-admin.service';
import { AdminController } from './admin.controller';
import { MasterAdminController } from './master-admin.controller';
import { AuthModule } from '../auth/auth.module';
import { WalletModule } from '../wallet/wallet.module';
import { KycModule } from '../kyc/kyc.module';
import { WithdrawalsModule } from '../withdrawals/withdrawals.module';

@Module({
  imports: [AuthModule, WalletModule, KycModule, WithdrawalsModule],
  providers: [AdminService, MasterAdminService],
  controllers: [AdminController, MasterAdminController],
})
export class AdminModule {}
