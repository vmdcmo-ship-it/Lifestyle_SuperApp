import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersSatellite } from '../../entities/users-satellite.entity';
import { LarkModule } from '../lark/lark.module';
import { ProjectsModule } from '../projects/projects.module';
import { EligibilityController } from './eligibility.controller';
import { EligibilityService } from './eligibility.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([UsersSatellite]),
    ProjectsModule,
    LarkModule,
  ],
  controllers: [EligibilityController],
  providers: [EligibilityService],
})
export class EligibilityModule {}
