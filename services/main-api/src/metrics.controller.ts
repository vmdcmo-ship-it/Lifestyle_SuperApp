import { Controller, Get, Res } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiExcludeEndpoint } from '@nestjs/swagger';
import { Public } from './modules/auth/decorators/public.decorator';
import { Response } from 'express';
import { register, collectDefaultMetrics, Counter, Histogram, Gauge } from 'prom-client';

collectDefaultMetrics({ prefix: 'lifestyle_' });

export const httpRequestsTotal = new Counter({
  name: 'lifestyle_http_requests_total',
  help: 'Total HTTP requests',
  labelNames: ['method', 'route', 'status_code'],
});

export const httpRequestDuration = new Histogram({
  name: 'lifestyle_http_request_duration_seconds',
  help: 'HTTP request duration in seconds',
  labelNames: ['method', 'route', 'status_code'],
  buckets: [0.01, 0.05, 0.1, 0.3, 0.5, 1, 2, 5, 10],
});

export const activeConnections = new Gauge({
  name: 'lifestyle_active_connections',
  help: 'Number of active connections',
});

export const dbQueryDuration = new Histogram({
  name: 'lifestyle_db_query_duration_seconds',
  help: 'Database query duration in seconds',
  labelNames: ['operation'],
  buckets: [0.001, 0.005, 0.01, 0.05, 0.1, 0.5, 1],
});

@ApiTags('Metrics')
@Controller('metrics')
@Public()
export class MetricsController {
  @Get()
  @ApiExcludeEndpoint()
  async getMetrics(@Res() res: Response) {
    res.set('Content-Type', register.contentType);
    res.send(await register.metrics());
  }
}
