import {
  Controller,
  Post,
  Get,
  Patch,
  Body,
  HttpCode,
  HttpStatus,
  UseGuards,
  Req,
  Res,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiExcludeEndpoint,
} from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { ConfigService } from '@nestjs/config';
import { Response } from 'express';
import { AuthService } from './auth.service';
import { RegisterDto, LoginDto, RefreshTokenDto, ZaloLoginDto } from './dto';
import { MfaVerifyDto, MfaDisableDto, MfaCompleteLoginDto, ChangePasswordDto } from './dto';
import { Public } from './decorators/public.decorator';
import { CurrentUser, CurrentUserData } from './decorators/current-user.decorator';
import { JwtAuthGuard } from './guards/jwt-auth.guard';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly config: ConfigService,
  ) {}

  // ─── POST /auth/register ─────────────────────────────────────────────

  @Public()
  @Post('register')
  @ApiOperation({
    summary: 'Đăng ký tài khoản mới',
    description:
      'Tạo tài khoản với vai trò CUSTOMER, DRIVER hoặc RESTAURANT_OWNER',
  })
  @ApiResponse({ status: 201, description: 'Đăng ký thành công' })
  @ApiResponse({ status: 409, description: 'Email đã tồn tại' })
  @ApiResponse({ status: 400, description: 'Dữ liệu không hợp lệ' })
  async register(@Body() dto: RegisterDto) {
    return this.authService.register(dto);
  }

  // ─── POST /auth/login ────────────────────────────────────────────────

  @Public()
  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Đăng nhập',
    description: 'Đăng nhập bằng email và mật khẩu, nhận JWT tokens',
  })
  @ApiResponse({ status: 200, description: 'Đăng nhập thành công hoặc requiresMfa' })
  @ApiResponse({ status: 401, description: 'Sai email hoặc mật khẩu' })
  async login(@Body() dto: LoginDto) {
    return this.authService.login(dto);
  }

  // ─── POST /auth/mfa/complete-login ───────────────────────────────────────

  @Public()
  @Post('mfa/complete-login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Hoàn tất đăng nhập với MFA',
    description: 'Khi login trả về requiresMfa, gửi mfaToken + code OTP để nhận tokens',
  })
  @ApiResponse({ status: 200, description: 'Đăng nhập thành công' })
  @ApiResponse({ status: 401, description: 'Mã OTP không đúng hoặc token hết hạn' })
  async mfaCompleteLogin(@Body() dto: MfaCompleteLoginDto) {
    return this.authService.mfaCompleteLogin(dto.mfaToken, dto.code);
  }

  // ─── POST /auth/refresh ──────────────────────────────────────────────

  @Public()
  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Refresh access token',
    description: 'Dùng refresh token để lấy access token mới',
  })
  @ApiResponse({ status: 200, description: 'Token mới' })
  @ApiResponse({ status: 401, description: 'Refresh token hết hạn' })
  async refresh(@Body() dto: RefreshTokenDto) {
    return this.authService.refreshToken(dto.refreshToken);
  }

  // ─── POST /auth/logout ───────────────────────────────────────────────

  @UseGuards(JwtAuthGuard)
  @Post('logout')
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth('access-token')
  @ApiOperation({
    summary: 'Đăng xuất',
    description: 'Thu hồi tất cả refresh tokens của user',
  })
  @ApiResponse({ status: 200, description: 'Đăng xuất thành công' })
  async logout(@CurrentUser() user: CurrentUserData) {
    return this.authService.logout(user.id);
  }

  // ─── GET /auth/profile ───────────────────────────────────────────────

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  @ApiBearerAuth('access-token')
  @ApiOperation({
    summary: 'Lấy thông tin cá nhân',
    description: 'Trả về profile đầy đủ của user đang đăng nhập',
  })
  @ApiResponse({ status: 200, description: 'Thông tin user' })
  async getProfile(@CurrentUser() user: CurrentUserData) {
    return this.authService.getProfile(user.id);
  }

  // ─── PATCH /auth/change-password ──────────────────────────────────────────

  @UseGuards(JwtAuthGuard)
  @Patch('change-password')
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth('access-token')
  @ApiOperation({
    summary: 'Đổi mật khẩu',
    description: 'Yêu cầu mật khẩu hiện tại để xác thực, mật khẩu mới tối thiểu 8 ký tự',
  })
  @ApiResponse({ status: 200, description: 'Đổi mật khẩu thành công' })
  @ApiResponse({ status: 401, description: 'Mật khẩu hiện tại không đúng' })
  async changePassword(
    @CurrentUser() user: CurrentUserData,
    @Body() dto: ChangePasswordDto,
  ) {
    return this.authService.changePassword(
      user.id,
      dto.currentPassword,
      dto.newPassword,
    );
  }

  // ─── MFA: Setup ───────────────────────────────────────────────────────────

  @UseGuards(JwtAuthGuard)
  @Post('mfa/setup')
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'Thiết lập MFA – tạo secret và QR code' })
  async mfaSetup(@CurrentUser() user: CurrentUserData) {
    return this.authService.mfaSetup(user.id);
  }

  // ─── MFA: Verify (enable) ──────────────────────────────────────────────────

  @UseGuards(JwtAuthGuard)
  @Post('mfa/verify')
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'Xác nhận MFA – nhập mã OTP để bật' })
  async mfaVerify(@CurrentUser() user: CurrentUserData, @Body() dto: MfaVerifyDto) {
    return this.authService.mfaVerify(user.id, dto.code);
  }

  // ─── MFA: Disable ────────────────────────────────────────────────────────

  @UseGuards(JwtAuthGuard)
  @Post('mfa/disable')
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'Tắt MFA – yêu cầu mật khẩu + mã OTP' })
  async mfaDisable(@CurrentUser() user: CurrentUserData, @Body() dto: MfaDisableDto) {
    return this.authService.mfaDisable(user.id, dto.password, dto.code);
  }

  // ─── POST /auth/zalo ───────────────────────────────────────────────

  @Public()
  @Post('zalo')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Đăng nhập bằng Zalo',
    description:
      'Dùng cho Zalo Mini App: gửi authorization code (và codeVerifier nếu dùng PKCE) từ User.getOauthV1Code()',
  })
  @ApiResponse({ status: 200, description: 'Đăng nhập thành công, trả về user + tokens' })
  @ApiResponse({ status: 400, description: 'Code không hợp lệ hoặc Zalo OAuth chưa cấu hình' })
  @ApiResponse({ status: 401, description: 'Tài khoản bị khóa' })
  async zaloLogin(@Body() dto: ZaloLoginDto) {
    return this.authService.handleZaloLogin(dto.code, dto.codeVerifier);
  }

  // ─── GET /auth/google ──────────────────────────────────────────────

  @Public()
  @Get('google')
  @UseGuards(AuthGuard('google'))
  @ApiOperation({
    summary: 'Đăng nhập bằng Google',
    description: 'Redirect đến Google OAuth consent screen',
  })
  async googleAuth() {
    // Guard redirects to Google
  }

  // ─── GET /auth/google/callback ─────────────────────────────────────

  @Public()
  @Get('google/callback')
  @UseGuards(AuthGuard('google'))
  @ApiExcludeEndpoint()
  async googleAuthCallback(@Req() req: any, @Res() res: Response) {
    const frontendUrl = this.config.get('FRONTEND_URL', 'https://vmd.asia');
    try {
      const result = await this.authService.handleGoogleLogin(req.user);
      const params = new URLSearchParams({
        accessToken: result.tokens.accessToken,
        refreshToken: result.tokens.refreshToken,
      });
      return res.redirect(`${frontendUrl}/auth/callback?${params.toString()}`);
    } catch (error: any) {
      const params = new URLSearchParams({ error: error.message || 'Google login failed' });
      return res.redirect(`${frontendUrl}/login?${params.toString()}`);
    }
  }
}
