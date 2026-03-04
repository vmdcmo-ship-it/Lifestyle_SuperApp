import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AnCuController } from './an-cu.controller';
import { AnCuService } from './an-cu.service';
import { AnCuLeadNotifier } from './an-cu-lead.notifier';

@Module({
  imports: [ConfigModule],
  controllers: [AnCuController],
  providers: [AnCuService, AnCuLeadNotifier],
  exports: [AnCuService],
})
export class AnCuLacNghiepModule {}
