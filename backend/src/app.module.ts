import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { WalletModule } from './modules/wallet/wallet.module';
import { CatalogModule } from './modules/catalog/catalog.module';
import { ReferralsModule } from './modules/referrals/referrals.module';
import { PaymentsModule } from './modules/payments/payments.module';
import { AdsModule } from './modules/ads/ads.module';
import { KycModule } from './modules/kyc/kyc.module';
import { WithdrawalsModule } from './modules/withdrawals/withdrawals.module';
import { AdminModule } from './modules/admin/admin.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    ThrottlerModule.forRoot([
      {
        name: 'short',
        ttl: 60000,   // 1 minute window
        limit: 20,    // max 20 requests per minute per IP (general)
      },
    ]),
    PrismaModule,
    AuthModule,
    UsersModule,
    WalletModule,
    CatalogModule,
    ReferralsModule,
    PaymentsModule,
    AdsModule,
    KycModule,
    WithdrawalsModule,
    AdminModule,
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule {}
