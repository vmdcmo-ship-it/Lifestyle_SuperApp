import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { PrismaService } from './prisma/prisma.service';
import { Public } from './modules/auth/decorators/public.decorator';

@ApiTags('Health')
@Controller('health')
@Public()
export class HealthController {
  constructor(private readonly prisma: PrismaService) {}

  @Get()
  @ApiOperation({ summary: 'Health check' })
  async check() {
    let dbStatus = 'disconnected';
    try {
      await this.prisma.$queryRaw`SELECT 1`;
      dbStatus = 'connected';
    } catch {
      dbStatus = 'error';
    }

    return {
      status: 'ok',
      timestamp: new Date().toISOString(),
      service: 'lifestyle-main-api',
      version: '1.0.0-mvp',
      database: dbStatus,
    };
  }
}
