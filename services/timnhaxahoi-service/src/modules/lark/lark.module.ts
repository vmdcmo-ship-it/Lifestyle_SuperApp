import { Module } from '@nestjs/common';
import { LarkBaseService } from './lark-base.service';

@Module({
  providers: [LarkBaseService],
  exports: [LarkBaseService],
})
export class LarkModule {}
