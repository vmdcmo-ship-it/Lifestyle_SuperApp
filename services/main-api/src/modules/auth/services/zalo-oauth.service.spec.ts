import { Test, TestingModule } from '@nestjs/testing';
import { ConfigService } from '@nestjs/config';
import { BadRequestException } from '@nestjs/common';
import { ZaloOAuthService } from './zalo-oauth.service';

describe('ZaloOAuthService', () => {
  let service: ZaloOAuthService;
  let configGet: jest.SpyInstance;

  const mockFetch = jest.fn();

  beforeEach(async () => {
    mockFetch.mockReset();
    global.fetch = mockFetch as unknown as typeof fetch;

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ZaloOAuthService,
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn((key: string) => {
              if (key === 'ZALO_APP_ID') return 'test-app-id';
              if (key === 'ZALO_APP_SECRET') return 'test-app-secret';
              return undefined;
            }),
          },
        },
      ],
    }).compile();

    service = module.get<ZaloOAuthService>(ZaloOAuthService);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('exchangeCodeForToken', () => {
    it('throws BadRequestException when ZALO_APP_ID is not configured', async () => {
      const module = await Test.createTestingModule({
        providers: [
          ZaloOAuthService,
          {
            provide: ConfigService,
            useValue: { get: jest.fn().mockReturnValue(undefined) },
          },
        ],
      }).compile();
      const svc = module.get<ZaloOAuthService>(ZaloOAuthService);

      await expect(svc.exchangeCodeForToken('code')).rejects.toThrow(
        'Zalo OAuth chưa được cấu hình (ZALO_APP_ID, ZALO_APP_SECRET)',
      );
    });

    it('throws BadRequestException when Zalo returns error', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        json: () => Promise.resolve({ error: 1, message: 'Invalid code' }),
      });

      await expect(service.exchangeCodeForToken('bad-code')).rejects.toThrow(BadRequestException);
      await expect(service.exchangeCodeForToken('bad-code')).rejects.toThrow('Invalid code');
    });

    it('returns token when Zalo responds successfully', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () =>
          Promise.resolve({
            access_token: 'at-123',
            refresh_token: 'rt-456',
            expires_in: 3600,
          }),
      });

      const result = await service.exchangeCodeForToken('valid-code');

      expect(result).toEqual({
        access_token: 'at-123',
        refresh_token: 'rt-456',
        expires_in: 3600,
      });
      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining('oauth.zaloapp.com'),
        expect.objectContaining({
          method: 'POST',
          body: expect.stringContaining('code=valid-code'),
        }),
      );
    });

    it('includes code_verifier when provided (PKCE)', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () =>
          Promise.resolve({
            access_token: 'at-123',
            refresh_token: 'rt-456',
            expires_in: 3600,
          }),
      });

      await service.exchangeCodeForToken('code', 'verifier-xyz');

      expect(mockFetch).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({
          body: expect.stringContaining('code_verifier=verifier-xyz'),
        }),
      );
    });
  });

  describe('getUserInfo', () => {
    it('throws BadRequestException when Zalo returns error', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        json: () => Promise.resolve({ error: 401, message: 'Invalid token' }),
      });

      await expect(service.getUserInfo('bad-token')).rejects.toThrow(BadRequestException);
    });

    it('returns user info when Zalo responds successfully', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () =>
          Promise.resolve({
            id: 'zalo-123',
            name: 'Nguyễn Văn A',
            picture: { data: { url: 'https://photo.url' } },
          }),
      });

      const result = await service.getUserInfo('valid-token');

      expect(result).toEqual({
        id: 'zalo-123',
        name: 'Nguyễn Văn A',
        picture: { data: { url: 'https://photo.url' } },
      });
    });

    it('uses default name when name is empty', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ id: 'zalo-456', name: null }),
      });

      const result = await service.getUserInfo('token');

      expect(result.name).toBe('Zalo User');
    });
  });
});
