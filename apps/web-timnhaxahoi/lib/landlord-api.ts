import { clearLandlordAuth, getLandlordToken, setLandlordAuth, type LandlordUser } from './landlord-auth';

const apiBase = () => process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3020/api/v1';

function authHeaders(): HeadersInit {
  const t = getLandlordToken();
  const h: Record<string, string> = { 'Content-Type': 'application/json' };
  if (t) {
    h.Authorization = `Bearer ${t}`;
  }
  return h;
}

async function parseErr(res: Response): Promise<string> {
  const data = (await res.json().catch(() => ({}))) as { message?: string | string[] };
  const m = data.message;
  if (Array.isArray(m)) return m.join(', ');
  if (typeof m === 'string') return m;
  return `Lỗi ${res.status}`;
}

export type AuthResponse = {
  accessToken: string;
  tokenType: 'Bearer';
  user: LandlordUser;
};

function errFromBody(data: { message?: string | string[] }): string {
  const m = data.message;
  if (Array.isArray(m)) return m.join(', ');
  if (typeof m === 'string') return m;
  return 'Đăng ký / đăng nhập thất bại';
}

export async function landlordRegister(body: {
  email: string;
  phone: string;
  password: string;
  fullName?: string;
}): Promise<AuthResponse> {
  const res = await fetch(`${apiBase()}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  const data = (await res.json().catch(() => ({}))) as AuthResponse & { message?: string | string[] };
  if (!res.ok) {
    throw new Error(errFromBody(data));
  }
  setLandlordAuth(data.accessToken, data.user);
  return data;
}

export async function landlordLogin(body: { identifier: string; password: string }): Promise<AuthResponse> {
  const res = await fetch(`${apiBase()}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  const data = (await res.json().catch(() => ({}))) as AuthResponse & { message?: string | string[] };
  if (!res.ok) {
    throw new Error(errFromBody(data));
  }
  setLandlordAuth(data.accessToken, data.user);
  return data;
}

export function landlordLogout(): void {
  clearLandlordAuth();
}

export type LandlordListing = {
  id: string;
  ownerUserId: string;
  title: string;
  description: string | null;
  province: string | null;
  district: string | null;
  addressLine: string | null;
  lat: number | null;
  lng: number | null;
  priceMonthly: number;
  areaM2: number | null;
  contactPhone: string;
  slug: string;
  expiresAt: string;
  visiblePublic: boolean;
  createdAt: string;
  updatedAt: string;
};

export type LandlordListResponse = {
  items: LandlordListing[];
  total: number;
  page: number;
  limit: number;
};

export async function fetchMyListings(params?: { page?: number; limit?: number }): Promise<LandlordListResponse> {
  const u = new URLSearchParams();
  if (params?.page) u.set('page', String(params.page));
  if (params?.limit) u.set('limit', String(params.limit));
  const qs = u.toString();
  const res = await fetch(`${apiBase()}/rental/listings/mine${qs ? `?${qs}` : ''}`, {
    headers: authHeaders(),
    cache: 'no-store',
  });
  if (res.status === 401) {
    clearLandlordAuth();
    throw new Error('UNAUTHORIZED');
  }
  if (!res.ok) {
    throw new Error(await parseErr(res));
  }
  return res.json() as Promise<LandlordListResponse>;
}

export async function fetchMyListing(id: string): Promise<LandlordListing> {
  const res = await fetch(`${apiBase()}/rental/listings/mine/${id}`, {
    headers: authHeaders(),
    cache: 'no-store',
  });
  if (res.status === 401) {
    clearLandlordAuth();
    throw new Error('UNAUTHORIZED');
  }
  if (!res.ok) {
    throw new Error(await parseErr(res));
  }
  return res.json() as Promise<LandlordListing>;
}

export type CreateListingBody = {
  title: string;
  description?: string;
  province?: string;
  district?: string;
  addressLine?: string;
  lat?: number;
  lng?: number;
  priceMonthly: number;
  areaM2?: number;
  contactPhone: string;
  expiresAt: string;
};

export async function createListing(body: CreateListingBody): Promise<LandlordListing> {
  const res = await fetch(`${apiBase()}/rental/listings`, {
    method: 'POST',
    headers: authHeaders(),
    body: JSON.stringify(body),
  });
  if (res.status === 401) {
    clearLandlordAuth();
    throw new Error('UNAUTHORIZED');
  }
  if (!res.ok) {
    throw new Error(await parseErr(res));
  }
  return res.json() as Promise<LandlordListing>;
}

export type UpdateListingBody = Partial<CreateListingBody> & { visiblePublic?: boolean };

export async function updateListing(id: string, body: UpdateListingBody): Promise<LandlordListing> {
  const res = await fetch(`${apiBase()}/rental/listings/${id}`, {
    method: 'PATCH',
    headers: authHeaders(),
    body: JSON.stringify(body),
  });
  if (res.status === 401) {
    clearLandlordAuth();
    throw new Error('UNAUTHORIZED');
  }
  if (!res.ok) {
    throw new Error(await parseErr(res));
  }
  return res.json() as Promise<LandlordListing>;
}

export async function softDeleteListing(id: string): Promise<void> {
  const res = await fetch(`${apiBase()}/rental/listings/${id}`, {
    method: 'DELETE',
    headers: authHeaders(),
  });
  if (res.status === 401) {
    clearLandlordAuth();
    throw new Error('UNAUTHORIZED');
  }
  if (!res.ok) {
    throw new Error(await parseErr(res));
  }
}
