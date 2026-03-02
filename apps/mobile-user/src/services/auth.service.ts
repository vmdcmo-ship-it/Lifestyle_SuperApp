import { api, tokenStorage } from './api';

export const authService = {
  login: (email: string, password: string) =>
    api.post('/auth/login', { email, password }),

  register: (data: { email: string; password: string; firstName: string; lastName: string; phoneNumber?: string }) =>
    api.post('/auth/register', data),

  logout: async () => {
    try { await api.post('/auth/logout'); } catch { /* ignore */ }
    await tokenStorage.clearTokens();
  },

  getProfile: () => api.get('/auth/profile'),
};
