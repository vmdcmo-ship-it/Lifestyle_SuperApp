import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersSatellite } from '../../entities/users-satellite.entity';
import { AuthSyncJtiStore } from './auth-sync-jti.store';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { AuthSyncAssertionGuard } from './guards/auth-sync-assertion.guard';

@Module({
  imports: [TypeOrmModule.forFeature([UsersSatellite])],
  controllers: [AuthController],
  providers: [AuthService, AuthSyncJtiStore, AuthSyncAssertionGuard],
})
export class AuthModule {}
