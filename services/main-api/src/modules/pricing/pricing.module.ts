import { Module } from '@nestjs/common';
import { PricingController } from './pricing.controller';
import { PricingService } from './pricing.service';
import { PricingTablesService } from './pricing-tables.service';

@Module({
  controllers: [PricingController],
  providers: [PricingService, PricingTablesService],
  exports: [PricingService, PricingTablesService],
})
export class PricingModule {}
