import { Injectable, BadRequestException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

const ZALO_TOKEN_URL = 'https://oauth.zaloapp.com/v4/access_token';
const ZALO_USER_INFO_URL = 'https://graph.zalo.me/v2.0/me';

export interface ZaloTokenResponse {
  access_token: string;
  refresh_token: string;
  expires_in: number;
}

export interface ZaloUserInfo {
  id: string;
  name: string;
  picture?: { data?: { url?: string } };
  birthday?: string;
  gender?: string;
}

@Injectable()
export class ZaloOAuthService {
  constructor(private readonly config: ConfigService) {}

  /**
   * Đổi authorization code lấy access token từ Zalo.
   * Hỗ trợ PKCE: truyền codeVerifier nếu Mini App dùng PKCE.
   */
  async exchangeCodeForToken(
    code: string,
    codeVerifier?: string,
  ): Promise<ZaloTokenResponse> {
    const appId = this.config.get<string>('ZALO_APP_ID');
    const appSecret = this.config.get<string>('ZALO_APP_SECRET');

    if (!appId || !appSecret) {
      throw new BadRequestException(
        'Zalo OAuth chưa được cấu hình (ZALO_APP_ID, ZALO_APP_SECRET)',
      );
    }

    const body = new URLSearchParams({
      app_id: appId,
      app_secret: appSecret,
      code,
    });

    if (codeVerifier) {
      body.set('code_verifier', codeVerifier);
    }

    const response = await fetch(ZALO_TOKEN_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: body.toString(),
    });

    const data = (await response.json()) as {
      access_token?: string;
      refresh_token?: string;
      expires_in?: number;
      error?: number;
      message?: string;
    };

    if (!response.ok || data.error !== undefined) {
      throw new BadRequestException(
        data.message || 'Không thể lấy access token từ Zalo',
      );
    }

    if (!data.access_token) {
      throw new BadRequestException('Zalo không trả về access token');
    }

    return {
      access_token: data.access_token,
      refresh_token: data.refresh_token ?? '',
      expires_in: data.expires_in ?? 3600,
    };
  }

  /**
   * Lấy thông tin user từ Zalo Graph API.
   */
  async getUserInfo(accessToken: string): Promise<ZaloUserInfo> {
    const url = new URL(ZALO_USER_INFO_URL);
    url.searchParams.set('access_token', accessToken);
    url.searchParams.set('fields', 'id,name,picture');

    const response = await fetch(url.toString());
    const data = (await response.json()) as ZaloUserInfo & {
      error?: number;
      message?: string;
    };

    if (!response.ok || data.error !== undefined) {
      throw new BadRequestException(
        (data as { message?: string }).message || 'Không thể lấy thông tin từ Zalo',
      );
    }

    if (!data.id) {
      throw new BadRequestException('Zalo không trả về thông tin user');
    }

    return {
      id: String(data.id),
      name: data.name ?? 'Zalo User',
      picture: data.picture,
      birthday: data.birthday,
      gender: data.gender,
    };
  }
}
