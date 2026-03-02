'use client';

import { API_CONFIG, API_ENDPOINTS } from '../config/api';
import { ADMIN_STORAGE_KEYS } from '../storage-keys';

const BASE = `${API_CONFIG.baseURL}${API_CONFIG.apiPrefix}`;

function getHeaders(skipContentType = false): Record<string, string> {
  const headers: Record<string, string> = {};
  if (!skipContentType) headers['Content-Type'] = 'application/json';
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem(ADMIN_STORAGE_KEYS.ACCESS_TOKEN);
    if (token) headers['Authorization'] = `Bearer ${token}`;
  }
  return headers;
}

function tryRefresh(): boolean {
  if (typeof window === 'undefined') return false;
  const refreshToken = localStorage.getItem(ADMIN_STORAGE_KEYS.REFRESH_TOKEN);
  if (!refreshToken) return false;
  return true;
}

async function doRefresh(): Promise<boolean> {
  const refreshToken = localStorage.getItem(ADMIN_STORAGE_KEYS.REFRESH_TOKEN);
  if (!refreshToken) return false;
  const refreshRes = await fetch(`${BASE}${API_ENDPOINTS.AUTH.REFRESH}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ refreshToken }),
  });
  if (!refreshRes.ok) return false;
  const data = (await refreshRes.json()) as {
    accessToken?: string;
    refreshToken?: string;
    tokens?: { accessToken?: string; refreshToken?: string };
  };
  const accessToken = data.accessToken ?? data.tokens?.accessToken;
  const newRefresh = data.refreshToken ?? data.tokens?.refreshToken;
  if (accessToken) {
    localStorage.setItem(ADMIN_STORAGE_KEYS.ACCESS_TOKEN, accessToken);
    if (newRefresh) {
      localStorage.setItem(ADMIN_STORAGE_KEYS.REFRESH_TOKEN, newRefresh);
    }
    setAuthCookie(accessToken, 900);
    setRoleCookie();
    return true;
  }
  return false;
}

async function handleResponse<T>(res: Response, canRetry: boolean): Promise<T> {
  if (res.status === 401 && typeof window !== 'undefined') {
    if (canRetry && tryRefresh()) {
      const refreshed = await doRefresh();
      if (refreshed) return 'retry' as unknown as T;
    }
    clearAdminTokens();
    window.location.href = '/login';
    throw new Error('Session expired');
  }

  if (!res.ok) {
    const err = await res.json().catch(() => ({ message: res.statusText }));
    const msg = (err as { message?: string }).message || `HTTP ${res.status}`;
    throw new Error(msg);
  }

  if (res.status === 204) return {} as T;
  return res.json();
}

async function request<T>(path: string, init: RequestInit, canRetry = true): Promise<T> {
  const url = path.startsWith('http') ? path : `${BASE}${path}`;
  const isFormData = init.body instanceof FormData;
  const res = await fetch(url, {
    ...init,
    headers: { ...getHeaders(isFormData), ...init.headers } as HeadersInit,
  });
  const result = await handleResponse<T>(res, canRetry);
  if (result === 'retry') {
    return request<T>(path, init, false);
  }
  return result;
}

export const api = {
  async get<T>(path: string, params?: Record<string, unknown>): Promise<T> {
    const u = new URL(`${BASE}${path}`);
    if (params) {
      Object.entries(params).forEach(([k, v]) => {
        if (v !== undefined && v !== null) u.searchParams.set(k, String(v));
      });
    }
    return request<T>(u.toString(), { method: 'GET' });
  },

  async post<T>(path: string, body?: unknown): Promise<T> {
    return request<T>(`${BASE}${path}`, {
      method: 'POST',
      body: body ? JSON.stringify(body) : undefined,
    });
  },

  async put<T>(path: string, body?: unknown): Promise<T> {
    return request<T>(`${BASE}${path}`, {
      method: 'PUT',
      body: body ? JSON.stringify(body) : undefined,
    });
  },

  async patch<T>(path: string, body?: unknown): Promise<T> {
    return request<T>(`${BASE}${path}`, {
      method: 'PATCH',
      body: body ? JSON.stringify(body) : undefined,
    });
  },

  async upload<T = { url: string }>(path: string, file: File): Promise<T> {
    const fd = new FormData();
    fd.append('file', file);
    return request<T>(path, { method: 'POST', body: fd });
  },

  async del<T>(path: string): Promise<T> {
    return request<T>(`${BASE}${path}`, { method: 'DELETE' });
  },
};

function setAuthCookie(value: string, maxAge: number): void {
  if (typeof document === 'undefined') return;
  document.cookie = `${ADMIN_STORAGE_KEYS.AUTH_COOKIE}=${encodeURIComponent(value)}; path=/; max-age=${maxAge}; SameSite=Lax`;
}

function clearAuthCookie(): void {
  if (typeof document === 'undefined') return;
  document.cookie = `${ADMIN_STORAGE_KEYS.AUTH_COOKIE}=; path=/; max-age=0`;
}

export function setRoleCookie(): void {
  if (typeof document === 'undefined') return;
  document.cookie = `${ADMIN_STORAGE_KEYS.ROLE_COOKIE}=ADMIN; path=/; max-age=900; SameSite=Lax`;
}

function clearRoleCookie(): void {
  if (typeof document === 'undefined') return;
  document.cookie = `${ADMIN_STORAGE_KEYS.ROLE_COOKIE}=; path=/; max-age=0`;
}

export function saveAdminTokens(accessToken: string, refreshToken: string): void {
  if (typeof window !== 'undefined') {
    localStorage.setItem(ADMIN_STORAGE_KEYS.ACCESS_TOKEN, accessToken);
    localStorage.setItem(ADMIN_STORAGE_KEYS.REFRESH_TOKEN, refreshToken);
    setAuthCookie(accessToken, 900);
    setRoleCookie();
  }
}

export function clearAdminTokens(): void {
  if (typeof window !== 'undefined') {
    localStorage.removeItem(ADMIN_STORAGE_KEYS.ACCESS_TOKEN);
    localStorage.removeItem(ADMIN_STORAGE_KEYS.REFRESH_TOKEN);
    localStorage.removeItem(ADMIN_STORAGE_KEYS.USER);
    clearAuthCookie();
    clearRoleCookie();
  }
}

export function getAdminToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem(ADMIN_STORAGE_KEYS.ACCESS_TOKEN);
}
