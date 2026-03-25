import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { QuizAnalytic } from '../../entities/quiz-analytic.entity';
import { UsersSatellite } from '../../entities/users-satellite.entity';
import { LarkModule } from '../lark/lark.module';
import { DashboardJwtAuthGuard } from '../user/guards/dashboard-jwt.guard';
import { LeadsController } from './leads.controller';
import { LeadsService } from './leads.service';

@Module({
  imports: [TypeOrmModule.forFeature([UsersSatellite, QuizAnalytic]), LarkModule],
  controllers: [LeadsController],
  providers: [LeadsService, DashboardJwtAuthGuard],
})
export class LeadsModule {}
