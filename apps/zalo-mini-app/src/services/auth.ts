import { apiFetch, endpoints } from "./api";

export interface AuthUser {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  displayName: string;
  role: string;
  avatar_url: string | null;
  ekycLevel: string;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
}

export interface ZaloLoginResponse {
  user: AuthUser;
  tokens: AuthTokens;
}

export async function zaloLogin(
  code: string,
  codeVerifier?: string
): Promise<ZaloLoginResponse> {
  const body: { code: string; codeVerifier?: string } = { code };
  if (codeVerifier) body.codeVerifier = codeVerifier;

  const res = await apiFetch<ZaloLoginResponse>(endpoints.auth.zaloLogin, {
    method: "POST",
    body: JSON.stringify(body),
  });

  if (res.tokens) {
    localStorage.setItem("accessToken", res.tokens.accessToken);
    localStorage.setItem("refreshToken", res.tokens.refreshToken);
  }

  return res;
}

export async function logout(): Promise<void> {
  try {
    await apiFetch(endpoints.auth.logout, { method: "POST" });
  } finally {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
  }
}

export function isLoggedIn(): boolean {
  return !!localStorage.getItem("accessToken");
}
