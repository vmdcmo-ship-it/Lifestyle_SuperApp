/**
 * R8 — JWT chủ trọ (MVP: sessionStorage; tránh lộ token qua link chia sẻ tab).
 * Đổi sang httpOnly cookie + route handler nếu cần harden sau.
 */

const TOKEN_KEY = 'timnhaxahoi_landlord_token';
const USER_KEY = 'timnhaxahoi_landlord_user';

export const LANDLORD_AUTH_EVENT = 'timnhaxahoi-landlord-auth';

export type LandlordUser = {
  id: string;
  email: string;
  phoneNumber: string;
  fullName: string | null;
};

function storage(): Storage | null {
  if (typeof window === 'undefined') return null;
  return window.sessionStorage;
}

export function getLandlordToken(): string | null {
  return storage()?.getItem(TOKEN_KEY) ?? null;
}

export function getLandlordUser(): LandlordUser | null {
  const raw = storage()?.getItem(USER_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as LandlordUser;
  } catch {
    return null;
  }
}

export function setLandlordAuth(token: string, user: LandlordUser): void {
  storage()?.setItem(TOKEN_KEY, token);
  storage()?.setItem(USER_KEY, JSON.stringify(user));
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new Event(LANDLORD_AUTH_EVENT));
  }
}

export function clearLandlordAuth(): void {
  storage()?.removeItem(TOKEN_KEY);
  storage()?.removeItem(USER_KEY);
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new Event(LANDLORD_AUTH_EVENT));
  }
}

export function isLandlordLoggedIn(): boolean {
  return Boolean(getLandlordToken());
}
