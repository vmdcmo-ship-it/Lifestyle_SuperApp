import AsyncStorage from '@react-native-async-storage/async-storage';

import { API_BASE } from '../config/api';

const TOKEN_KEY = '@lifestyle_access_token';
const REFRESH_KEY = '@lifestyle_refresh_token';

async function getHeaders(): Promise<Record<string, string>> {
  const headers: Record<string, string> = { 'Content-Type': 'application/json' };
  const token = await AsyncStorage.getItem(TOKEN_KEY);
  if (token) headers['Authorization'] = `Bearer ${token}`;
  return headers;
}

async function handleResponse<T>(res: Response): Promise<T> {
  if (res.status === 401) {
    const refreshToken = await AsyncStorage.getItem(REFRESH_KEY);
    if (refreshToken) {
      try {
        const refreshRes = await fetch(`${API_BASE}/auth/refresh`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ refreshToken }),
        });
        if (refreshRes.ok) {
          const data = await refreshRes.json();
          await AsyncStorage.setItem(TOKEN_KEY, data.accessToken);
          if (data.refreshToken) await AsyncStorage.setItem(REFRESH_KEY, data.refreshToken);
        }
      } catch {
        await AsyncStorage.multiRemove([TOKEN_KEY, REFRESH_KEY]);
      }
    }
    throw new Error('SESSION_EXPIRED');
  }

  if (!res.ok) {
    const err = await res.json().catch(() => ({ message: res.statusText }));
    throw new Error(err.message || `HTTP ${res.status}`);
  }

  if (res.status === 204) return {} as T;
  return res.json();
}

export const api = {
  async get<T = any>(path: string, params?: Record<string, any>): Promise<T> {
    const url = new URL(`${API_BASE}${path}`);
    if (params) {
      Object.entries(params).forEach(([k, v]) => {
        if (v !== undefined && v !== null) url.searchParams.set(k, String(v));
      });
    }
    const res = await fetch(url.toString(), { headers: await getHeaders() });
    return handleResponse<T>(res);
  },

  async post<T = any>(path: string, body?: any): Promise<T> {
    const res = await fetch(`${API_BASE}${path}`, {
      method: 'POST',
      headers: await getHeaders(),
      body: body ? JSON.stringify(body) : undefined,
    });
    return handleResponse<T>(res);
  },

  async put<T = any>(path: string, body?: any): Promise<T> {
    const res = await fetch(`${API_BASE}${path}`, {
      method: 'PUT',
      headers: await getHeaders(),
      body: body ? JSON.stringify(body) : undefined,
    });
    return handleResponse<T>(res);
  },

  async patch<T = any>(path: string, body?: any): Promise<T> {
    const res = await fetch(`${API_BASE}${path}`, {
      method: 'PATCH',
      headers: await getHeaders(),
      body: body ? JSON.stringify(body) : undefined,
    });
    return handleResponse<T>(res);
  },

  async del<T = any>(path: string): Promise<T> {
    const res = await fetch(`${API_BASE}${path}`, {
      method: 'DELETE',
      headers: await getHeaders(),
    });
    return handleResponse<T>(res);
  },
};

export const tokenStorage = {
  async saveTokens(accessToken: string, refreshToken: string) {
    await AsyncStorage.multiSet([
      [TOKEN_KEY, accessToken],
      [REFRESH_KEY, refreshToken],
    ]);
  },
  async clearTokens() {
    await AsyncStorage.multiRemove([TOKEN_KEY, REFRESH_KEY]);
  },
  async getAccessToken() {
    return AsyncStorage.getItem(TOKEN_KEY);
  },
};
