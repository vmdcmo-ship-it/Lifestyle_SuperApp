import { api, saveAdminTokens, clearAdminTokens } from './api/api';
import { API_ENDPOINTS } from './config/api';
import { ADMIN_STORAGE_KEYS } from './storage-keys';
import { canAccessWebAdmin } from './rbac';

export interface AdminUser {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  displayName: string;
  role: string;
}

export interface AuthResponse {
  user: AdminUser;
  tokens: {
    accessToken: string;
    refreshToken: string;
    expiresIn?: number;
  };
}

export const authService = {
  async login(
    email: string,
    password: string,
  ): Promise<AuthResponse | { requiresMfa: true; mfaToken: string; user: AdminUser }> {
    const data = await api.post<
      AuthResponse | { requiresMfa: true; mfaToken: string; user: AdminUser }
    >(API_ENDPOINTS.AUTH.LOGIN, { email, password });

    const withTokens = data as AuthResponse;
    if (
      canAccessWebAdmin(withTokens.user?.role) &&
      withTokens.tokens?.accessToken &&
      withTokens.tokens?.refreshToken
    ) {
      saveAdminTokens(withTokens.tokens.accessToken, withTokens.tokens.refreshToken);
      if (typeof window !== 'undefined') {
        localStorage.setItem(ADMIN_STORAGE_KEYS.USER, JSON.stringify(withTokens.user));
      }
    }
    return data;
  },

  async mfaCompleteLogin(mfaToken: string, code: string): Promise<AuthResponse> {
    const data = await api.post<AuthResponse>(API_ENDPOINTS.AUTH.MFA_COMPLETE_LOGIN, {
      mfaToken,
      code,
    });
    if (
      canAccessWebAdmin(data.user?.role) &&
      data.tokens?.accessToken &&
      data.tokens?.refreshToken
    ) {
      saveAdminTokens(data.tokens.accessToken, data.tokens.refreshToken);
      if (typeof window !== 'undefined') {
        localStorage.setItem(ADMIN_STORAGE_KEYS.USER, JSON.stringify(data.user));
      }
    }
    return data;
  },

  async mfaSetup(): Promise<{ secret: string; qrCode: string; message: string }> {
    return api.post(API_ENDPOINTS.AUTH.MFA_SETUP);
  },

  async mfaVerify(code: string): Promise<{ message: string }> {
    return api.post(API_ENDPOINTS.AUTH.MFA_VERIFY, { code });
  },

  async mfaDisable(password: string, code: string): Promise<{ message: string }> {
    return api.post(API_ENDPOINTS.AUTH.MFA_DISABLE, { password, code });
  },

  async changePassword(currentPassword: string, newPassword: string): Promise<{ message: string }> {
    return api.patch(API_ENDPOINTS.AUTH.CHANGE_PASSWORD, {
      currentPassword,
      newPassword,
    });
  },

  async logout(): Promise<void> {
    try {
      await api.post(API_ENDPOINTS.AUTH.LOGOUT);
    } finally {
      clearAdminTokens();
    }
  },

  async getProfile(): Promise<(AdminUser & { mfaEnabled?: boolean }) | null> {
    try {
      const profile = await api.get<AdminUser & { mfaEnabled?: boolean }>(
        API_ENDPOINTS.AUTH.PROFILE,
      );
      if (profile && typeof window !== 'undefined') {
        localStorage.setItem(ADMIN_STORAGE_KEYS.USER, JSON.stringify(profile));
      }
      return profile;
    } catch {
      return null;
    }
  },

  getStoredUser(): AdminUser | null {
    if (typeof window === 'undefined') return null;
    const raw = localStorage.getItem(ADMIN_STORAGE_KEYS.USER);
    if (!raw) return null;
    try {
      return JSON.parse(raw) as AdminUser;
    } catch {
      return null;
    }
  },
};
