import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import type { Request } from 'express';
import { AUTH_SYNC_AUDIENCE_DEFAULT, AUTH_SYNC_PURPOSE } from '../auth-sync.constants';
import type { AuthSyncJwtPayload } from '../auth-sync-jwt.types';
import { AuthSyncJtiStore } from '../auth-sync-jti.store';

export type RequestWithAuthSyncAssertion = Request & {
  authSyncAssertion?: AuthSyncJwtPayload;
};

@Injectable()
export class AuthSyncAssertionGuard implements CanActivate {
  constructor(
    private readonly config: ConfigService,
    private readonly jwt: JwtService,
    private readonly jtiStore: AuthSyncJtiStore,
  ) {}

  canActivate(context: ExecutionContext): boolean {
    const requireJwt = this.config.get<string>('AUTH_SYNC_REQUIRE_JWT') === 'true';
    const req = context.switchToHttp().getRequest<RequestWithAuthSyncAssertion>();
    const auth = req.headers.authorization;
    const token = auth?.startsWith('Bearer ') ? auth.slice(7).trim() : '';

    if (!token) {
      if (requireJwt) {
        throw new UnauthorizedException('Thiếu Bearer assertion JWT (họ C).');
      }
      req.authSyncAssertion = undefined;
      return true;
    }

    const secret = this.config.get<string>('AUTH_SYNC_JWT_SECRET')?.trim();
    if (!secret) {
      throw new UnauthorizedException('Chưa cấu hình AUTH_SYNC_JWT_SECRET — không thể xác thực assertion.');
    }

    const audience =
      this.config.get<string>('AUTH_SYNC_JWT_AUDIENCE')?.trim() || AUTH_SYNC_AUDIENCE_DEFAULT;
    const issuersRaw = this.config.get<string>('AUTH_SYNC_JWT_ISSUER', 'lifestyle-main-api');
    const issuerList = issuersRaw
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);

    let payload: AuthSyncJwtPayload;
    try {
      payload = this.jwt.verify<AuthSyncJwtPayload>(token, {
        secret,
        algorithms: ['HS256'],
        issuer: issuerList.length === 1 ? issuerList[0] : issuerList,
        audience,
      });
    } catch {
      throw new UnauthorizedException('Assertion JWT không hợp lệ hoặc đã hết hạn.');
    }

    if (payload.purpose !== AUTH_SYNC_PURPOSE) {
      throw new UnauthorizedException('Sai purpose assertion.');
    }
    if (!payload.sub || !payload.email?.trim() || !payload.phone?.trim()) {
      throw new UnauthorizedException('Assertion thiếu sub / email / phone.');
    }

    const jtiCheck = this.config.get<string>('AUTH_SYNC_JTI_CHECK') !== 'false';
    if (jtiCheck && payload.jti && payload.exp != null) {
      if (!this.jtiStore.consumeIfValid(payload.jti, payload.exp)) {
        throw new UnauthorizedException('Assertion đã sử dụng (jti).');
      }
    }

    req.authSyncAssertion = payload;
    return true;
  }
}
