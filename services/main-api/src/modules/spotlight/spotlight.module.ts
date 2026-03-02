import { Module } from '@nestjs/common';
import { SpotlightController } from './spotlight.controller';
import { SpotlightService } from './spotlight.service';
import { NotificationsModule } from '../notifications/notifications.module';

@Module({
  imports: [NotificationsModule],
  controllers: [SpotlightController],
  providers: [SpotlightService],
  exports: [SpotlightService],
})
export class SpotlightModule {}
