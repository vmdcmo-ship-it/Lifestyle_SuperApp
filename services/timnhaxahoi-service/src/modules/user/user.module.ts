import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { QuizAnalytic } from '../../entities/quiz-analytic.entity';
import { UsersSatellite } from '../../entities/users-satellite.entity';
import { ProjectsModule } from '../projects/projects.module';
import { DashboardJwtAuthGuard } from './guards/dashboard-jwt.guard';
import { UserController } from './user.controller';
import { UserService } from './user.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([UsersSatellite, QuizAnalytic]),
    ProjectsModule,
  ],
  controllers: [UserController],
  providers: [UserService, DashboardJwtAuthGuard],
})
export class UserModule {}
