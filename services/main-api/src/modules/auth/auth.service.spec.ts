import { Test, TestingModule } from '@nestjs/testing';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { PrismaService } from '../../prisma/prisma.service';
import { ZaloOAuthService } from './services/zalo-oauth.service';

describe('AuthService', () => {
  let service: AuthService;
  let prisma: PrismaService;
  let zaloOAuth: ZaloOAuthService;
  let jwtService: JwtService;

  const mockUser = {
    id: 'user-uuid-1',
    email: 'zalo_123@lifestyle.placeholder',
    firstName: 'Nguyễn',
    lastName: 'Văn A',
    displayName: 'Nguyễn Văn A',
    role: 'CUSTOMER',
    avatar_url: null,
    xuBalance: BigInt(0),
    isActive: true,
    passwordHash: 'hashed',
    isEmailVerified: false,
    isPhoneVerified: false,
    dateOfBirth: null,
    gender: null,
    ekycLevel: 'LEVEL_0',
    phoneNumber: null,
    lastLoginAt: null,
    login_count: 0,
    preferences: null,
    referralCode: null,
    referred_by: null,
    metadata: null,
    mfa_enabled: false,
    mfa_secret: null,
    createdAt: new Date(),
    updatedAt: new Date(),
    deletedAt: null,
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: PrismaService,
          useValue: {
            user: { findFirst: jest.fn(), findUnique: jest.fn(), create: jest.fn(), update: jest.fn() },
            social_connections: { create: jest.fn(), upsert: jest.fn() },
            authToken: { create: jest.fn() },
          },
        },
        {
          provide: JwtService,
          useValue: {
            signAsync: jest.fn().mockResolvedValue('jwt-token'),
          },
        },
        {
          provide: ConfigService,
          useValue: { get: jest.fn((k: string) => (k === 'JWT_SECRET' ? 'secret' : '15m')) },
        },
        {
          provide: ZaloOAuthService,
          useValue: {
            exchangeCodeForToken: jest.fn().mockResolvedValue({
              access_token: 'zalo-at',
              refresh_token: 'zalo-rt',
              expires_in: 3600,
            }),
            getUserInfo: jest.fn().mockResolvedValue({
              id: 'zalo-123',
              name: 'Nguyễn Văn A',
              picture: { data: { url: 'https://avatar.url' } },
            }),
          },
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    prisma = module.get<PrismaService>(PrismaService);
    zaloOAuth = module.get<ZaloOAuthService>(ZaloOAuthService);
    jwtService = module.get<JwtService>(JwtService);

    jest.clearAllMocks();
  });

  describe('handleZaloLogin', () => {
    it('returns tokens for existing user linked to Zalo', async () => {
      (prisma.user.findFirst as jest.Mock).mockResolvedValue(mockUser);

      const result = await service.handleZaloLogin('valid-code');

      expect(result).toHaveProperty('user');
      expect(result).toHaveProperty('tokens');
      expect(result.user.id).toBe('user-uuid-1');
      expect(result.user.displayName).toBe('Nguyễn Văn A');
      expect(result.tokens).toHaveProperty('accessToken', 'jwt-token');
      expect(zaloOAuth.exchangeCodeForToken).toHaveBeenCalledWith('valid-code', undefined);
      expect(zaloOAuth.getUserInfo).toHaveBeenCalledWith('zalo-at');
    });

    it('creates new user and social_connection when user not found', async () => {
      (prisma.user.findFirst as jest.Mock).mockResolvedValue(null);
      (prisma.user.create as jest.Mock).mockResolvedValue(mockUser);

      const result = await service.handleZaloLogin('valid-code');

      expect(prisma.user.create).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({
            email: 'zalo_zalo-123@lifestyle.placeholder',
            firstName: 'Nguyễn',
            lastName: 'Văn A',
            displayName: 'Nguyễn Văn A',
            role: 'CUSTOMER',
          }),
        }),
      );
      expect(prisma.social_connections.create).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({
            provider: 'zalo',
            provider_id: 'zalo-123',
          }),
        }),
      );
      expect(result.user.id).toBe('user-uuid-1');
      expect(result.tokens.accessToken).toBe('jwt-token');
    });

    it('throws UnauthorizedException when user is inactive', async () => {
      (prisma.user.findFirst as jest.Mock).mockResolvedValue({
        ...mockUser,
        isActive: false,
      });

      await expect(service.handleZaloLogin('code')).rejects.toThrow(UnauthorizedException);
      await expect(service.handleZaloLogin('code')).rejects.toThrow('Tài khoản đã bị khóa');
    });

    it('passes codeVerifier to ZaloOAuth when provided', async () => {
      (prisma.user.findFirst as jest.Mock).mockResolvedValue(mockUser);

      await service.handleZaloLogin('code', 'pkce-verifier');

      expect(zaloOAuth.exchangeCodeForToken).toHaveBeenCalledWith('code', 'pkce-verifier');
    });
  });
});
