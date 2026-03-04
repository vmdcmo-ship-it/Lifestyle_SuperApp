import { Module, MiddlewareConsumer, NestModule } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { BookingModule } from './modules/booking/booking.module';
import { SpotlightModule } from './modules/spotlight/spotlight.module';
import { AddressesModule } from './modules/addresses/addresses.module';
import { WalletModule } from './modules/wallet/wallet.module';
import { DriversModule } from './modules/drivers/drivers.module';
import { MerchantsModule } from './modules/merchants/merchants.module';
import { OrdersModule } from './modules/orders/orders.module';
import { NotificationsModule } from './modules/notifications/notifications.module';
import { LoyaltyModule } from './modules/loyalty/loyalty.module';
import { LuckyWheelModule } from './modules/lucky-wheel/lucky-wheel.module';
import { RunToEarnModule } from './modules/run-to-earn/run-to-earn.module';
import { MissionsModule } from './modules/missions/missions.module';
import { InsuranceModule } from './modules/insurance/insurance.module';
import { WealthModule } from './modules/wealth/wealth.module';
import { AnCuLacNghiepModule } from './modules/an-cu-lac-nghiep/an-cu.module';
import { SearchModule } from './modules/search/search.module';
import { ContentModule } from './modules/content/content.module';
import { TrainingModule } from './modules/training/training.module';
import { NewsModule } from './modules/news/news.module';
import { PricingModule } from './modules/pricing/pricing.module';
import { DashboardModule } from './modules/dashboard/dashboard.module';
import { MarketingModule } from './modules/marketing/marketing.module';
import { AuditModule } from './modules/audit/audit.module';
import { RegionsModule } from './modules/regions/regions.module';
import { FranchiseModule } from './modules/franchise/franchise.module';
import { GatewayModule } from './modules/gateway/gateway.module';
import { HealthController } from './health.controller';
import { MetricsController } from './metrics.controller';
import { MetricsMiddleware } from './metrics.middleware';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    PrismaModule,
    AuthModule,
    UsersModule,
    BookingModule,
    DriversModule,
    MerchantsModule,
    OrdersModule,
    WalletModule,
    InsuranceModule,
    WealthModule,
    AnCuLacNghiepModule,
    LoyaltyModule,
    LuckyWheelModule,
    RunToEarnModule,
    MissionsModule,
    SpotlightModule,
    AddressesModule,
    NotificationsModule,
    SearchModule,
    ContentModule,
    TrainingModule,
    NewsModule,
    PricingModule,
    DashboardModule,
    MarketingModule,
    AuditModule,
    RegionsModule,
    FranchiseModule,
    GatewayModule,
  ],
  controllers: [HealthController, MetricsController],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(MetricsMiddleware).forRoutes('*');
  }
}
