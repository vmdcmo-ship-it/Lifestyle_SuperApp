/**
 * API client cho Lifestyle Super App backend.
 * Base URL có thể override qua env khi deploy.
 */
const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:3000";
const API_PREFIX = "/api/v1";

export const apiConfig = {
  baseUrl: `${API_BASE}${API_PREFIX}`,
  timeout: 30000,
  headers: {
    "Content-Type": "application/json",
  },
};

export const endpoints = {
  auth: {
    zaloLogin: "/auth/zalo",
    refresh: "/auth/refresh",
    logout: "/auth/logout",
    profile: "/auth/profile",
  },
  wallet: {
    info: "/wallet",
    transactions: "/wallet/transactions",
  },
  loyalty: {
    xu: "/loyalty/xu",
  },
  orders: {
    my: "/orders/my",
    create: "/orders",
  },
  merchants: {
    list: "/merchants",
  },
} as const;

async function getAuthHeaders(): Promise<Record<string, string>> {
  const token = typeof window !== "undefined" ? localStorage.getItem("accessToken") : null;
  const headers: Record<string, string> = { ...apiConfig.headers };
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }
  return headers;
}

export async function apiFetch<T>(
  path: string,
  options: RequestInit = {}
): Promise<T> {
  const url = `${apiConfig.baseUrl}${path}`;
  const headers = { ...(await getAuthHeaders()), ...(options.headers as Record<string, string>) };

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), apiConfig.timeout);

  const res = await fetch(url, {
    ...options,
    headers: { ...apiConfig.headers, ...headers },
    signal: controller.signal,
  });

  clearTimeout(timeoutId);

  if (!res.ok) {
    const errBody = await res.json().catch(() => ({}));
    throw new Error((errBody as { message?: string }).message || `HTTP ${res.status}`);
  }

  return res.json() as Promise<T>;
}
