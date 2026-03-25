import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { ThrottlerModule } from '@nestjs/throttler';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './modules/auth/auth.module';
import { EligibilityModule } from './modules/eligibility/eligibility.module';
import { HealthModule } from './modules/health/health.module';
import { LeadsModule } from './modules/leads/leads.module';
import { ProjectsModule } from './modules/projects/projects.module';
import { RentalModule } from './modules/rental/rental.module';
import { SeedModule } from './modules/seed/seed.module';
import { UserModule } from './modules/user/user.module';

function typeOrmSynchronize(): boolean {
  if (process.env.NODE_ENV === 'production') {
    return false;
  }
  if (process.env.TYPEORM_SYNC === 'false') {
    return false;
  }
  return true;
}

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, envFilePath: ['.env.local', '.env'] }),
    JwtModule.registerAsync({
      global: true,
      imports: [ConfigModule],
      useFactory: (config: ConfigService) => ({
        secret:
          config.get<string>('DASHBOARD_JWT_SECRET') ??
          'dev-only-change-DASHBOARD_JWT_SECRET',
        signOptions: {
          expiresIn: config.get<string>('DASHBOARD_JWT_EXPIRES_IN', '7d'),
        },
      }),
      inject: [ConfigService],
    }),
    ThrottlerModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => {
        const sec = (key: string, fallback: number) =>
          Math.max(1, parseInt(config.get<string>(key, String(fallback)), 10) || fallback);
        const ttlMs = (key: string, fallbackSec: number) =>
          Math.max(1000, sec(key, fallbackSec) * 1000);
        return {
          throttlers: [
            {
              name: 'eligibility-check',
              ttl: ttlMs('THROTTLE_ELIGIBILITY_TTL_SEC', 60),
              limit: sec('THROTTLE_ELIGIBILITY_LIMIT', 12),
            },
            {
              name: 'auth-sync',
              ttl: ttlMs('THROTTLE_AUTH_SYNC_TTL_SEC', 60),
              limit: sec('THROTTLE_AUTH_SYNC_LIMIT', 30),
            },
            {
              name: 'leads-convert',
              ttl: ttlMs('THROTTLE_LEADS_CONVERT_TTL_SEC', 60),
              limit: sec('THROTTLE_LEADS_CONVERT_LIMIT', 20),
            },
          ],
        };
      },
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DATABASE_HOST ?? 'localhost',
      port: parseInt(process.env.DATABASE_PORT ?? '5432', 10),
      username: process.env.DATABASE_USER ?? 'postgres',
      password: process.env.DATABASE_PASSWORD ?? 'postgres',
      database: process.env.DATABASE_NAME ?? 'timnhaxahoi',
      autoLoadEntities: true,
      synchronize: typeOrmSynchronize(),
      logging: process.env.NODE_ENV === 'development',
    }),
    HealthModule,
    ProjectsModule,
    RentalModule,
    EligibilityModule,
    AuthModule,
    UserModule,
    LeadsModule,
    SeedModule,
  ],
})
export class AppModule {}
