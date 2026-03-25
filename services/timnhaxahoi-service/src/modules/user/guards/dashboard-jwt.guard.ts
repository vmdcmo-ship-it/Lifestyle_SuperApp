import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import type { Request } from 'express';

export interface DashboardJwtPayload {
  sub: string;
  qid: string;
}

@Injectable()
export class DashboardJwtAuthGuard implements CanActivate {
  constructor(private readonly jwt: JwtService) {}

  canActivate(context: ExecutionContext): boolean {
    const req = context.switchToHttp().getRequest<Request & { dashboard?: DashboardJwtPayload }>();
    const auth = req.headers.authorization;
    if (!auth?.startsWith('Bearer ')) {
      throw new UnauthorizedException('Thiếu Bearer token.');
    }
    const token = auth.slice(7);
    try {
      const payload = this.jwt.verify<DashboardJwtPayload>(token);
      if (!payload.sub || !payload.qid) {
        throw new UnauthorizedException('Token không hợp lệ.');
      }
      req.dashboard = payload;
      return true;
    } catch {
      throw new UnauthorizedException('Token hết hạn hoặc không hợp lệ.');
    }
  }
}
