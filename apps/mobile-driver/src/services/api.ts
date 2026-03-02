import AsyncStorage from '@react-native-async-storage/async-storage';

// API: https://api.vmd.asia. Để test upload với backend local: đổi BASE_URL thành
// 'http://<IP_MÁY_BẠN>:3000/api/v1' (cùng WiFi với điện thoại)
const PRODUCTION_API = 'https://api.vmd.asia/api/v1';
/** Base URL cho mọi API (auth, drivers, upload). Export cho upload.service. */
export const BASE_URL = PRODUCTION_API;

/** WebSocket base (host không có /api/v1) cho Socket.IO namespace /ws */
export const WS_BASE = PRODUCTION_API.replace(/\/api\/v1\/?$/, '') || 'https://api.vmd.asia';

/** Chuẩn hóa URL avatar: /uploads/avatars/xxx → /api/v1/drivers/files/avatars/xxx (qua API) */
export function normalizeAvatarUrl(url: string | undefined): string | undefined {
  if (!url) return undefined;
  const m = url.match(/\/uploads\/avatars\/([a-zA-Z0-9\-_.]+)$/);
  if (m) return `${PRODUCTION_API}/drivers/files/avatars/${m[1]}`;
  return url;
}

export const tokenStorage = {
  getAccess: () => AsyncStorage.getItem('driver_accessToken'),
  getRefresh: () => AsyncStorage.getItem('driver_refreshToken'),
  save: async (access: string, refresh: string) => {
    await AsyncStorage.multiSet([
      ['driver_accessToken', access],
      ['driver_refreshToken', refresh],
    ]);
  },
  clear: async () => {
    await AsyncStorage.multiRemove(['driver_accessToken', 'driver_refreshToken']);
  },
};

async function getHeaders(json = true): Promise<Record<string, string>> {
  const headers: Record<string, string> = {};
  if (json) headers['Content-Type'] = 'application/json';
  const token = await tokenStorage.getAccess();
  if (token) headers['Authorization'] = `Bearer ${token}`;
  return headers;
}

/** Gọi refresh token, lưu token mới. Trả về true nếu thành công. Export cho upload.service retry 401. */
export async function tryRefreshToken(): Promise<boolean> {
  const refreshToken = await tokenStorage.getRefresh();
  if (!refreshToken) return false;
  const refreshRes = await fetch(`${BASE_URL}/auth/refresh`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ refreshToken }),
  });
  if (!refreshRes.ok) return false;
  const data = await refreshRes.json();
  await tokenStorage.save(data.accessToken, data.refreshToken ?? refreshToken);
  return true;
}

/** Parse response, throw SESSION_EXPIRED khi 401 (không retry). */
async function parseResponse<T>(
  res: Response,
  options?: { skipClearTokenOn401?: boolean },
): Promise<T> {
  if (res.status === 401) {
    if (options?.skipClearTokenOn401) {
      const err = await res.json().catch(() => ({ message: 'Unauthorized' }));
      throw new Error(err.message || 'Unauthorized');
    }
    throw new Error('SESSION_EXPIRED');
  }
  if (!res.ok) {
    const text = await res.text();
    let msg = res.statusText;
    try {
      const j = JSON.parse(text);
      const m = j.message ?? j.error ?? msg;
      msg = Array.isArray(m) ? m.join(', ') : String(m);
    } catch {
      if (text && text.length < 300) msg = text;
    }
    throw new Error(msg || `HTTP ${res.status}`);
  }
  if (res.status === 204) return {} as T;
  return res.json();
}

function buildUploadFormData(uri: string, fieldName: string, fileName: string): FormData {
  const fileUri = uri.startsWith('/') ? `file://${uri}` : uri;
  const formData = new FormData();
  formData.append(fieldName, {
    uri: fileUri,
    type: 'image/jpeg',
    name: fileName,
  } as any);
  return formData;
}

export const api = {
  async get<T>(path: string, params?: Record<string, any>, options?: { skipClearTokenOn401?: boolean }): Promise<T> {
    const url = new URL(`${BASE_URL}${path}`);
    if (params) {
      Object.entries(params).forEach(([k, v]) => {
        if (v !== undefined && v !== null) url.searchParams.set(k, String(v));
      });
    }
    let res = await fetch(url.toString(), { headers: await getHeaders() });
    if (res.status === 401 && !options?.skipClearTokenOn401 && (await tryRefreshToken())) {
      res = await fetch(url.toString(), { headers: await getHeaders() });
    }
    return parseResponse<T>(res, options);
  },
  async post<T>(path: string, body?: any, options?: { skipClearTokenOn401?: boolean }): Promise<T> {
    let res = await fetch(`${BASE_URL}${path}`, {
      method: 'POST',
      headers: await getHeaders(),
      body: body ? JSON.stringify(body) : undefined,
    });
    if (res.status === 401 && !options?.skipClearTokenOn401 && (await tryRefreshToken())) {
      res = await fetch(`${BASE_URL}${path}`, {
        method: 'POST',
        headers: await getHeaders(),
        body: body ? JSON.stringify(body) : undefined,
      });
    }
    return parseResponse<T>(res, options);
  },
  async put<T>(path: string, body?: any, options?: { skipClearTokenOn401?: boolean }): Promise<T> {
    let res = await fetch(`${BASE_URL}${path}`, {
      method: 'PUT',
      headers: await getHeaders(),
      body: body ? JSON.stringify(body) : undefined,
    });
    if (res.status === 401 && !options?.skipClearTokenOn401 && (await tryRefreshToken())) {
      res = await fetch(`${BASE_URL}${path}`, {
        method: 'PUT',
        headers: await getHeaders(),
        body: body ? JSON.stringify(body) : undefined,
      });
    }
    return parseResponse<T>(res, options);
  },
  async patch<T>(path: string, body?: any, options?: { skipClearTokenOn401?: boolean }): Promise<T> {
    let res = await fetch(`${BASE_URL}${path}`, {
      method: 'PATCH',
      headers: await getHeaders(),
      body: body ? JSON.stringify(body) : undefined,
    });
    if (res.status === 401 && !options?.skipClearTokenOn401 && (await tryRefreshToken())) {
      res = await fetch(`${BASE_URL}${path}`, {
        method: 'PATCH',
        headers: await getHeaders(),
        body: body ? JSON.stringify(body) : undefined,
      });
    }
    return parseResponse<T>(res, options);
  },
  async del<T>(path: string, options?: { skipClearTokenOn401?: boolean }): Promise<T> {
    let res = await fetch(`${BASE_URL}${path}`, { method: 'DELETE', headers: await getHeaders() });
    if (res.status === 401 && !options?.skipClearTokenOn401 && (await tryRefreshToken())) {
      res = await fetch(`${BASE_URL}${path}`, { method: 'DELETE', headers: await getHeaders() });
    }
    return parseResponse<T>(res, options);
  },
  async uploadFile<T>(
    path: string,
    uri: string,
    fieldName = 'file',
    fileName = 'image.jpg',
    options?: { skipClearTokenOn401?: boolean },
  ): Promise<T> {
    const doUpload = async () => {
      const token = await tokenStorage.getAccess();
      const headers: Record<string, string> = {};
      if (token) headers['Authorization'] = `Bearer ${token}`;
      const formData = buildUploadFormData(uri, fieldName, fileName);
      return fetch(`${BASE_URL}${path}`, {
        method: 'POST',
        headers,
        body: formData,
      });
    };
    let res = await doUpload();
    if (res.status === 401 && !options?.skipClearTokenOn401 && (await tryRefreshToken())) {
      res = await doUpload();
    }
    return parseResponse<T>(res, options);
  },
};
