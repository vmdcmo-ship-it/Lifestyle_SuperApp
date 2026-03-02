import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { httpRequestsTotal, httpRequestDuration, activeConnections } from './metrics.controller';

@Injectable()
export class MetricsMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    if (req.path === '/api/v1/metrics') return next();

    activeConnections.inc();
    const end = httpRequestDuration.startTimer();

    res.on('finish', () => {
      const route = req.route?.path || req.path;
      const labels = {
        method: req.method,
        route,
        status_code: String(res.statusCode),
      };
      httpRequestsTotal.inc(labels);
      end(labels);
      activeConnections.dec();
    });

    next();
  }
}
