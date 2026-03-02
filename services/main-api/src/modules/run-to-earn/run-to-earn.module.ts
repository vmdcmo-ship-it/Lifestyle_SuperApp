import { Module } from '@nestjs/common';
import { RunToEarnController } from './run-to-earn.controller';
import { RunToEarnService } from './run-to-earn.service';

@Module({
  controllers: [RunToEarnController],
  providers: [RunToEarnService],
  exports: [RunToEarnService],
})
export class RunToEarnModule {}
