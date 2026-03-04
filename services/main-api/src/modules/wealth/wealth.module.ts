import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { WealthController } from './wealth.controller';
import { WealthService } from './wealth.service';
import { WealthLeadNotifier } from './wealth-lead.notifier';

@Module({
  imports: [ConfigModule],
  controllers: [WealthController],
  providers: [WealthService, WealthLeadNotifier],
  exports: [WealthService],
})
export class WealthModule {}
