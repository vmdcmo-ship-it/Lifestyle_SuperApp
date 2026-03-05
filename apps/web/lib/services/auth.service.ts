import { api, saveTokens, clearTokens } from '../api/api';
import { API_ENDPOINTS } from '../config/api';

export interface LoginResponse {
  accessToken: string;
  refreshToken: string;
  user: { id: string; email: string; firstName: string; lastName: string; role: string };
}

/** Normalize main-api response: { user, tokens } -> { accessToken, refreshToken, user } */
function normalizeAuthResponse(data: {
  user?: unknown;
  tokens?: { accessToken: string; refreshToken: string };
  accessToken?: string;
  refreshToken?: string;
}): LoginResponse {
  const tokens = data.tokens || data;
  const accessToken = tokens.accessToken ?? data.accessToken;
  const refreshToken = tokens.refreshToken ?? data.refreshToken;
  if (!accessToken || !refreshToken) {
    throw new Error('Invalid auth response: missing tokens');
  }
  return {
    accessToken,
    refreshToken,
    user: data.user as LoginResponse['user'],
  };
}

export const authService = {
  async login(email: string, password: string): Promise<LoginResponse> {
    const data = await api.post<Parameters<typeof normalizeAuthResponse>[0]>(API_ENDPOINTS.AUTH.LOGIN, {
      email,
      password,
    });
    const normalized = normalizeAuthResponse(data);
    saveTokens(normalized.accessToken, normalized.refreshToken);
    return normalized;
  },

  async register(payload: {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    phoneNumber?: string;
    role?: 'CUSTOMER' | 'DRIVER' | 'RESTAURANT_OWNER';
  }): Promise<LoginResponse> {
    const data = await api.post<Parameters<typeof normalizeAuthResponse>[0]>(API_ENDPOINTS.AUTH.REGISTER, payload);
    const normalized = normalizeAuthResponse(data);
    saveTokens(normalized.accessToken, normalized.refreshToken);
    return normalized;
  },

  async logout(): Promise<void> {
    try {
      await api.post(API_ENDPOINTS.AUTH.LOGOUT);
    } finally {
      clearTokens();
    }
  },

  async getProfile(signal?: AbortSignal): Promise<any> {
    return api.get(API_ENDPOINTS.AUTH.PROFILE, undefined, signal);
  },

  async refresh(refreshToken: string): Promise<LoginResponse> {
    const data = await api.post<LoginResponse>(API_ENDPOINTS.AUTH.REFRESH, { refreshToken });
    saveTokens(data.accessToken, data.refreshToken);
    return data;
  },
};
