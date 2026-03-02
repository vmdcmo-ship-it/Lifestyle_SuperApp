import { Module } from '@nestjs/common';
import { DriversController } from './drivers.controller';
import { DriversService } from './drivers.service';
import { OcrService } from './ocr.service';

@Module({
  controllers: [DriversController],
  providers: [DriversService, OcrService],
  exports: [DriversService],
})
export class DriversModule {}
