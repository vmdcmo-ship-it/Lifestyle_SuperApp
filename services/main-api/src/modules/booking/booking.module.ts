import { Module } from '@nestjs/common';
import { BookingController } from './booking.controller';
import { BookingService } from './booking.service';
import { GatewayModule } from '../gateway/gateway.module';
import { PricingModule } from '../pricing/pricing.module';

@Module({
  imports: [GatewayModule, PricingModule],
  controllers: [BookingController],
  providers: [BookingService],
  exports: [BookingService],
})
export class BookingModule {}
