import {
  Injectable,
  UnauthorizedException,
  ConflictException,
  BadRequestException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcryptjs';
import * as speakeasy from 'speakeasy';
import * as QRCode from 'qrcode';
import { randomBytes } from 'crypto';
import { PrismaService } from '../../prisma/prisma.service';
import { RegisterDto, LoginDto } from './dto';
import { ZaloOAuthService } from './services/zalo-oauth.service';

// ─── Types ───────────────────────────────────────────────────────────────────

interface TokenPayload {
  sub: string; // user ID
  email: string;
  role: string;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
}

export interface AuthResponse {
  user: {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    displayName: string;
    role: string;
    avatar_url: string | null;
    ekycLevel: string;
  };
  tokens: AuthTokens;
}

// ─── Service ─────────────────────────────────────────────────────────────────

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwt: JwtService,
    private readonly config: ConfigService,
    private readonly zaloOAuth: ZaloOAuthService,
  ) {}

  // ─── REGISTER ────────────────────────────────────────────────────────────

  async register(dto: RegisterDto): Promise<AuthResponse> {
    // 1. Check email exists
    const existingUser = await this.prisma.user.findFirst({
      where: { email: dto.email, deletedAt: null },
    });

    if (existingUser) {
      throw new ConflictException('Email đã được sử dụng');
    }

    // 2. Check phone exists (if provided)
    if (dto.phoneNumber) {
      const existingPhone = await this.prisma.user.findFirst({
        where: { phoneNumber: dto.phoneNumber, deletedAt: null },
      });
      if (existingPhone) {
        throw new ConflictException('Số điện thoại đã được sử dụng');
      }
    }

    // 3. Hash password
    const salt = await bcrypt.genSalt(12);
    const passwordHash = await bcrypt.hash(dto.password, salt);

    // 4. Determine role
    const role = dto.role || 'CUSTOMER';

    // 5. Create user (DB trigger auto-generates referral_code and wallet)
    const user = await this.prisma.user.create({
      data: {
        email: dto.email,
        passwordHash,
        firstName: dto.firstName,
        lastName: dto.lastName,
        displayName: `${dto.firstName} ${dto.lastName}`,
        phoneNumber: dto.phoneNumber,
        role: role as any,
      },
    });

    // 6. If registering as DRIVER, create driver record
    if (role === 'DRIVER') {
      const driverCount = await this.prisma.driver.count();
      const driverNumber = `LS-DRV-${String(driverCount + 1).padStart(5, '0')}`;

      await this.prisma.driver.create({
        data: {
          userId: user.id,
          driverNumber,
        },
      });
    }

    // 7. Generate tokens
    const tokens = await this.generateTokens({
      sub: user.id,
      email: user.email,
      role: user.role,
    });

    // 8. Save refresh token
    await this.saveRefreshToken(user.id, tokens.refreshToken);

    return {
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        displayName: user.displayName,
        role: user.role,
        avatar_url: user.avatar_url,
        ekycLevel: user.ekycLevel,
      },
      tokens,
    };
  }

  // ─── LOGIN ───────────────────────────────────────────────────────────────

  async login(dto: LoginDto): Promise<AuthResponse> {
    // 1. Find user by email
    const user = await this.prisma.user.findFirst({
      where: { email: dto.email, deletedAt: null },
    });

    if (!user) {
      throw new UnauthorizedException('Email hoặc mật khẩu không đúng');
    }

    // 2. Verify password
    const isPasswordValid = await bcrypt.compare(
      dto.password,
      user.passwordHash,
    );

    if (!isPasswordValid) {
      throw new UnauthorizedException('Email hoặc mật khẩu không đúng');
    }

    // 3. Check if user is active
    if (!user.isActive) {
      throw new UnauthorizedException(
        'Tài khoản đã bị khóa. Vui lòng liên hệ hỗ trợ.',
      );
    }

    // 3b. If MFA enabled, return temp token for OTP step
    const mfaEnabled = (user as { mfa_enabled?: boolean }).mfa_enabled;
    if (mfaEnabled) {
      const mfaToken = this.jwt.sign(
        { sub: user.id, purpose: 'mfa_pending' },
        { secret: this.config.get('JWT_SECRET'), expiresIn: '5m' },
      );
      return {
        requiresMfa: true,
        mfaToken,
        user: {
          id: user.id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          displayName: user.displayName,
          role: user.role,
          avatar_url: user.avatar_url,
          ekycLevel: user.ekycLevel,
        },
      } as AuthResponse & { requiresMfa: boolean; mfaToken: string };
    }

    // 4. Generate tokens
    const tokens = await this.generateTokens({
      sub: user.id,
      email: user.email,
      role: user.role,
    });

    // 5. Save refresh token
    await this.saveRefreshToken(user.id, tokens.refreshToken);

    // 6. Update last login & login count
    await this.prisma.user.update({
      where: { id: user.id },
      data: {
        lastLoginAt: new Date(),
        login_count: { increment: 1 },
      },
    });

    return {
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        displayName: user.displayName,
        role: user.role,
        avatar_url: user.avatar_url,
        ekycLevel: user.ekycLevel,
      },
      tokens,
    };
  }

  // ─── REFRESH TOKEN ───────────────────────────────────────────────────────

  async refreshToken(refreshTokenValue: string): Promise<AuthTokens> {
    try {
      // 1. Verify the refresh token JWT
      const payload = this.jwt.verify(refreshTokenValue, {
        secret: this.config.get('JWT_SECRET'),
      });

      // 2. Find stored token
      const storedToken = await this.prisma.authToken.findFirst({
        where: {
          userId: payload.sub,
          refresh_token: refreshTokenValue,
          isRevoked: false,
          expiresAt: { gt: new Date() },
        },
      });

      if (!storedToken) {
        throw new UnauthorizedException('Refresh token không hợp lệ');
      }

      // 3. Get user
      const user = await this.prisma.user.findUnique({
        where: { id: payload.sub },
      });

      if (!user || !user.isActive) {
        throw new UnauthorizedException('Tài khoản không tồn tại hoặc đã bị khóa');
      }

      // 4. Revoke old token
      await this.prisma.authToken.update({
        where: { id: storedToken.id },
        data: { isRevoked: true, revoked_at: new Date() },
      });

      // 5. Generate new tokens
      const tokens = await this.generateTokens({
        sub: user.id,
        email: user.email,
        role: user.role,
      });

      // 6. Save new refresh token
      await this.saveRefreshToken(user.id, tokens.refreshToken);

      return tokens;
    } catch (error) {
      if (error instanceof UnauthorizedException) throw error;
      throw new UnauthorizedException('Refresh token hết hạn hoặc không hợp lệ');
    }
  }

  // ─── LOGOUT ──────────────────────────────────────────────────────────────

  async logout(userId: string): Promise<{ message: string }> {
    await this.prisma.authToken.updateMany({
      where: { userId, isRevoked: false },
      data: { isRevoked: true, revoked_at: new Date() },
    });

    return { message: 'Đăng xuất thành công' };
  }

  // ─── GET PROFILE ─────────────────────────────────────────────────────────

  async getProfile(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: {
        driver: true,
        addresses: true,
        wallets: true,
      },
    });

    if (!user) {
      throw new BadRequestException('Người dùng không tồn tại');
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { passwordHash, mfa_secret, ...safeUser } = user;
    return {
      ...safeUser,
      mfaEnabled: (user as { mfa_enabled?: boolean }).mfa_enabled ?? false,
    };
  }

  // ─── CHANGE PASSWORD ──────────────────────────────────────────────────────

  async changePassword(
    userId: string,
    currentPassword: string,
    newPassword: string,
  ): Promise<{ message: string }> {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new BadRequestException('Người dùng không tồn tại');
    }

    const isValid = await bcrypt.compare(currentPassword, user.passwordHash);
    if (!isValid) {
      throw new UnauthorizedException('Mật khẩu hiện tại không đúng');
    }

    const salt = await bcrypt.genSalt(12);
    const passwordHash = await bcrypt.hash(newPassword, salt);

    await this.prisma.user.update({
      where: { id: userId },
      data: { passwordHash },
    });

    return { message: 'Đổi mật khẩu thành công' };
  }

  // ─── MFA SETUP ────────────────────────────────────────────────────────────

  async mfaSetup(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new BadRequestException('Người dùng không tồn tại');
    }

    const existing = (user as { mfa_enabled?: boolean }).mfa_enabled;
    if (existing) {
      throw new BadRequestException('MFA đã được bật. Tắt trước khi thiết lập lại.');
    }

    const secret = speakeasy.generateSecret({
      name: `Lifestyle Admin (${user.email})`,
      length: 20,
    });

    await this.prisma.user.update({
      where: { id: userId },
      data: {
        mfa_secret: secret.base32,
        mfa_enabled: false, // Chưa bật cho đến khi verify
      } as { mfa_secret?: string; mfa_enabled?: boolean },
    });

    const qrDataUrl = await QRCode.toDataURL(secret.otpauth_url!);

    return {
      secret: secret.base32,
      qrCode: qrDataUrl,
      message: 'Quét QR bằng ứng dụng Authenticator, sau đó nhập mã để xác nhận.',
    };
  }

  // ─── MFA VERIFY (enable) ───────────────────────────────────────────────────

  async mfaVerify(userId: string, code: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new BadRequestException('Người dùng không tồn tại');
    }

    const mfaSecret = (user as { mfa_secret?: string | null }).mfa_secret;
    if (!mfaSecret) {
      throw new BadRequestException('Chưa thiết lập MFA. Gọi /auth/mfa/setup trước.');
    }

    const valid = speakeasy.totp.verify({
      secret: mfaSecret,
      encoding: 'base32',
      token: code,
      window: 1,
    });

    if (!valid) {
      throw new UnauthorizedException('Mã OTP không đúng hoặc đã hết hạn');
    }

    await this.prisma.user.update({
      where: { id: userId },
      data: { mfa_enabled: true } as { mfa_enabled?: boolean },
    });

    return { message: 'MFA đã được bật thành công' };
  }

  // ─── MFA DISABLE ─────────────────────────────────────────────────────────

  async mfaDisable(userId: string, password: string, code: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new BadRequestException('Người dùng không tồn tại');
    }

    const isValidPassword = await bcrypt.compare(password, user.passwordHash);
    if (!isValidPassword) {
      throw new UnauthorizedException('Mật khẩu không đúng');
    }

    const mfaSecret = (user as { mfa_secret?: string | null }).mfa_secret;
    if (!mfaSecret) {
      throw new BadRequestException('MFA chưa được thiết lập');
    }

    const valid = speakeasy.totp.verify({
      secret: mfaSecret,
      encoding: 'base32',
      token: code,
      window: 1,
    });

    if (!valid) {
      throw new UnauthorizedException('Mã OTP không đúng hoặc đã hết hạn');
    }

    await this.prisma.user.update({
      where: { id: userId },
      data: {
        mfa_enabled: false,
        mfa_secret: null,
      } as { mfa_enabled?: boolean; mfa_secret?: string | null },
    });

    return { message: 'MFA đã được tắt' };
  }

  // ─── MFA COMPLETE LOGIN ──────────────────────────────────────────────────

  async mfaCompleteLogin(mfaToken: string, code: string): Promise<AuthResponse> {
    try {
      const payload = this.jwt.verify(mfaToken, {
        secret: this.config.get('JWT_SECRET'),
      });

      if (payload.purpose !== 'mfa_pending') {
        throw new UnauthorizedException('MFA token không hợp lệ');
      }

      const userId = payload.sub as string;
      const user = await this.prisma.user.findUnique({
        where: { id: userId },
      });

      if (!user || !user.isActive) {
        throw new UnauthorizedException('Tài khoản không tồn tại hoặc đã bị khóa');
      }

      const mfaSecret = (user as { mfa_secret?: string | null }).mfa_secret;
      if (!mfaSecret) {
        throw new UnauthorizedException('MFA chưa được thiết lập');
      }

      const valid = speakeasy.totp.verify({
        secret: mfaSecret,
        encoding: 'base32',
        token: code,
        window: 1,
      });

      if (!valid) {
        throw new UnauthorizedException('Mã OTP không đúng hoặc đã hết hạn');
      }

      const tokens = await this.generateTokens({
        sub: user.id,
        email: user.email,
        role: user.role,
      });

      await this.saveRefreshToken(user.id, tokens.refreshToken);

      await this.prisma.user.update({
        where: { id: user.id },
        data: {
          lastLoginAt: new Date(),
          login_count: { increment: 1 },
        },
      });

      return {
        user: {
          id: user.id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          displayName: user.displayName,
          role: user.role,
          avatar_url: user.avatar_url,
          ekycLevel: user.ekycLevel,
        },
        tokens,
      };
    } catch (err) {
      if (
        err instanceof UnauthorizedException ||
        err instanceof BadRequestException
      ) {
        throw err;
      }
      throw new UnauthorizedException('MFA token hết hạn hoặc không hợp lệ');
    }
  }

  // ─── GOOGLE LOGIN ───────────────────────────────────────────────────────

  async handleGoogleLogin(googleUser: {
    googleId: string;
    email: string;
    firstName: string;
    lastName: string;
    avatar: string | null;
  }): Promise<AuthResponse> {
    if (!googleUser.email) {
      throw new BadRequestException('Google account does not have an email');
    }

    let user = await this.prisma.user.findFirst({
      where: { email: googleUser.email, deletedAt: null },
    });

    if (!user) {
      const randomPass = require('crypto').randomBytes(32).toString('hex');
      const passwordHash = await bcrypt.hash(randomPass, 12);

      user = await this.prisma.user.create({
        data: {
          email: googleUser.email,
          passwordHash,
          firstName: googleUser.firstName,
          lastName: googleUser.lastName,
          displayName: `${googleUser.firstName} ${googleUser.lastName}`,
          avatar_url: googleUser.avatar,
          role: 'CUSTOMER' as any,
          isEmailVerified: true,
        },
      });
    } else if (googleUser.avatar && !user.avatar_url) {
      await this.prisma.user.update({
        where: { id: user.id },
        data: { avatar_url: googleUser.avatar },
      });
    }

    const tokens = await this.generateTokens({
      sub: user.id,
      email: user.email,
      role: user.role,
    });

    await this.saveRefreshToken(user.id, tokens.refreshToken);

    await this.prisma.user.update({
      where: { id: user.id },
      data: { lastLoginAt: new Date(), login_count: { increment: 1 } },
    });

    return {
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        displayName: user.displayName,
        role: user.role,
        avatar_url: user.avatar_url,
        ekycLevel: user.ekycLevel,
      },
      tokens,
    };
  }

  // ─── ZALO LOGIN ─────────────────────────────────────────────────────────

  async handleZaloLogin(
    code: string,
    codeVerifier?: string,
  ): Promise<AuthResponse> {
    const tokenResponse = await this.zaloOAuth.exchangeCodeForToken(
      code,
      codeVerifier,
    );
    const zaloUser = await this.zaloOAuth.getUserInfo(tokenResponse.access_token);

    const zaloId = String(zaloUser.id);
    const displayName = zaloUser.name?.trim() || 'Zalo User';
    const [firstName, ...lastParts] = displayName.split(/\s+/);
    const lastName = lastParts.join(' ') || firstName;
    const avatarUrl = zaloUser.picture?.data?.url ?? null;

    // 1. Tìm user đã link Zalo (social_connections)
    let user = await this.prisma.user.findFirst({
      where: {
        social_connections: {
          some: {
            provider: 'zalo',
            provider_id: zaloId,
          },
        },
        deletedAt: null,
      },
    });

    if (!user) {
      // 2. User mới: tạo với email synthetic (Zalo không cung cấp email)
      const syntheticEmail = `zalo_${zaloId}@lifestyle.placeholder`;
      const passwordHash = await bcrypt.hash(
        randomBytes(32).toString('hex'),
        12,
      );

      user = await this.prisma.user.create({
        data: {
          email: syntheticEmail,
          passwordHash,
          firstName,
          lastName,
          displayName,
          avatar_url: avatarUrl,
          role: 'CUSTOMER' as any,
        },
      });

      await this.prisma.social_connections.create({
        data: {
          user_id: user.id,
          provider: 'zalo',
          provider_id: zaloId,
          name: displayName,
          avatar_url: avatarUrl,
          access_token: tokenResponse.access_token,
          refresh_token: tokenResponse.refresh_token,
          expires_at: new Date(Date.now() + tokenResponse.expires_in * 1000),
        },
      });
    } else {
      // 3. User đã tồn tại: cập nhật avatar nếu thiếu, upsert social_connection
      if (avatarUrl && !user.avatar_url) {
        await this.prisma.user.update({
          where: { id: user.id },
          data: { avatar_url: avatarUrl },
        });
      }

      await this.prisma.social_connections.upsert({
        where: {
          user_id_provider: { user_id: user.id, provider: 'zalo' },
        },
        create: {
          user_id: user.id,
          provider: 'zalo',
          provider_id: zaloId,
          name: displayName,
          avatar_url: avatarUrl,
          access_token: tokenResponse.access_token,
          refresh_token: tokenResponse.refresh_token,
          expires_at: new Date(Date.now() + tokenResponse.expires_in * 1000),
        },
        update: {
          provider_id: zaloId,
          name: displayName,
          avatar_url: avatarUrl,
          access_token: tokenResponse.access_token,
          refresh_token: tokenResponse.refresh_token,
          expires_at: new Date(Date.now() + tokenResponse.expires_in * 1000),
        },
      });
    }

    if (!user.isActive) {
      throw new UnauthorizedException('Tài khoản đã bị khóa');
    }

    const tokens = await this.generateTokens({
      sub: user.id,
      email: user.email,
      role: user.role,
    });

    await this.saveRefreshToken(user.id, tokens.refreshToken);

    await this.prisma.user.update({
      where: { id: user.id },
      data: { lastLoginAt: new Date(), login_count: { increment: 1 } },
    });

    return {
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        displayName: user.displayName,
        role: user.role,
        avatar_url: user.avatar_url,
        ekycLevel: user.ekycLevel,
      },
      tokens,
    };
  }

  // ─── PRIVATE HELPERS ─────────────────────────────────────────────────────

  private async generateTokens(payload: TokenPayload): Promise<AuthTokens> {
    const [accessToken, refreshToken] = await Promise.all([
      this.jwt.signAsync(payload, {
        secret: this.config.get('JWT_SECRET'),
        expiresIn: this.config.get('JWT_ACCESS_EXPIRATION', '15m'),
      }),
      this.jwt.signAsync(payload, {
        secret: this.config.get('JWT_SECRET'),
        expiresIn: this.config.get('JWT_REFRESH_EXPIRATION', '7d'),
      }),
    ]);

    return {
      accessToken,
      refreshToken,
      expiresIn: 900, // 15 minutes in seconds
    };
  }

  private async saveRefreshToken(
    userId: string,
    refreshToken: string,
  ): Promise<void> {
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7); // 7 days

    await this.prisma.authToken.create({
      data: {
        userId,
        refresh_token: refreshToken,
        expiresAt,
      },
    });
  }
}
