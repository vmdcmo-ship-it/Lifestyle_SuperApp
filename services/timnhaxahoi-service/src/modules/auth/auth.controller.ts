import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Throttle, ThrottlerGuard } from '@nestjs/throttler';
import { AuthService } from './auth.service';
import { AuthSyncDto } from './dto/auth-sync.dto';
import {
  AuthSyncAssertionGuard,
  type RequestWithAuthSyncAssertion,
} from './guards/auth-sync-assertion.guard';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly auth: AuthService) {}

  @Post('sync')
  @UseGuards(AuthSyncAssertionGuard, ThrottlerGuard)
  @Throttle({ 'auth-sync': {} })
  @ApiBearerAuth('auth-sync-assertion')
  @ApiOperation({
    summary: 'Đồng bộ / đăng ký user satellite (web hoặc Super App)',
    description:
      'Tuỳ chọn `Authorization: Bearer <assertion JWT họ C>`. Khi `AUTH_SYNC_REQUIRE_JWT=true` (production Super App), bắt buộc assertion; body phải khớp email/phone trong token. Xem docs/timnhaxahoi/JWT_CONTRACT.md.',
  })
  sync(
    @Body() dto: AuthSyncDto,
    @Req() req: RequestWithAuthSyncAssertion,
  ) {
    return this.auth.sync(dto, req.authSyncAssertion);
  }
}
