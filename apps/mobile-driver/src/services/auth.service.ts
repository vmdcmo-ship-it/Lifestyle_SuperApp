import { api, tokenStorage } from './api';

/** Backend trả về { user, tokens: { accessToken, refreshToken } }. Hỗ trợ cả format phẳng. */
function extractTokens(data: any): { accessToken?: string; refreshToken?: string } {
  const t = data?.tokens;
  return {
    accessToken: t?.accessToken ?? data?.accessToken,
    refreshToken: t?.refreshToken ?? data?.refreshToken,
  };
}

export const authService = {
  login: async (email: string, password: string) => {
    const data = await api.post<any>('/auth/login', { email, password });
    const { accessToken, refreshToken } = extractTokens(data);
    if (accessToken && refreshToken) {
      await tokenStorage.save(accessToken, refreshToken);
    }
    return data;
  },

  register: async (payload: {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    phoneNumber?: string;
    role?: string;
  }) => {
    const data = await api.post<any>('/auth/register', { ...payload, role: 'DRIVER' });
    const { accessToken, refreshToken } = extractTokens(data);
    if (accessToken && refreshToken) {
      await tokenStorage.save(accessToken, refreshToken);
    }
    return data;
  },

  getProfile: () => api.get<any>('/auth/profile'),

  logout: async () => {
    try {
      await api.post('/auth/logout');
    } catch {}
    await tokenStorage.clear();
  },

  refreshToken: async () => {
    const refreshToken = await tokenStorage.getRefresh();
    if (!refreshToken) throw new Error('No refresh token');
    const data = await api.post<any>('/auth/refresh', { refreshToken });
    const { accessToken, refreshToken: newRefresh } = extractTokens(data);
    if (accessToken) {
      await tokenStorage.save(accessToken, newRefresh ?? refreshToken);
    }
    return data;
  },
};
