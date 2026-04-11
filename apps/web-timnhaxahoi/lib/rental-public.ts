import { fetchWithTimeout } from '@/lib/fetch-with-timeout';

const apiBase = () => process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3020/api/v1';

export type PublicRentalListing = {
  id: string;
  slug: string;
  title: string;
  description: string | null;
  province: string | null;
  district: string | null;
  addressLine: string | null;
  lat: number | null;
  lng: number | null;
  priceMonthly: number;
  areaM2: number | null;
  expiresAt: string;
  createdAt: string;
  contactPhone: string | null;
  listingStatus: 'active' | 'expired_grace';
};

export type RentalListResponse = {
  items: PublicRentalListing[];
  total: number;
  page: number;
  limit: number;
};

export async function fetchRentalList(params?: {
  page?: number;
  limit?: number;
  province?: string;
  district?: string;
}): Promise<RentalListResponse> {
  const u = new URLSearchParams();
  if (params?.page) u.set('page', String(params.page));
  if (params?.limit) u.set('limit', String(params.limit));
  if (params?.province) u.set('province', params.province);
  if (params?.district) u.set('district', params.district);
  const qs = u.toString();
  const res = await fetchWithTimeout(`${apiBase()}/rental/listings${qs ? `?${qs}` : ''}`, {
    next: { revalidate: 60 },
  });
  if (!res.ok) {
    throw new Error('Không tải được danh sách tin cho thuê');
  }
  return res.json() as Promise<RentalListResponse>;
}

export async function fetchRentalBySlug(slug: string): Promise<PublicRentalListing> {
  const res = await fetchWithTimeout(`${apiBase()}/rental/listings/slug/${encodeURIComponent(slug)}`, {
    next: { revalidate: 60 },
  });
  if (res.status === 404) {
    throw new Error('NOT_FOUND');
  }
  if (!res.ok) {
    throw new Error('Không tải được tin');
  }
  return res.json() as Promise<PublicRentalListing>;
}

export function formatVnd(n: number): string {
  return new Intl.NumberFormat('vi-VN').format(n) + ' đ/tháng';
}

const META_DESC_MAX = 155;

/** Đoạn mô tả rút gọn cho meta / khi chia sẻ link tin cho thuê. */
export function metaDescriptionForListing(item: PublicRentalListing): string {
  const price = formatVnd(item.priceMonthly);
  const loc = [item.district, item.province].filter(Boolean).join(', ');
  const raw = item.description?.replace(/\s+/g, ' ').trim();
  if (raw) {
    const excerpt = raw.length > META_DESC_MAX ? `${raw.slice(0, META_DESC_MAX - 1)}…` : raw;
    return loc ? `${excerpt} · ${price} · ${loc}` : `${excerpt} · ${price}`;
  }
  return loc ? `${loc} · ${price} · Tin cho thuê trên timnhaxahoi.com` : `${price} · Tin cho thuê timnhaxahoi.com`;
}

/** Lấy toàn bộ slug tin công khai (phân trang API tối đa 50/trang) — dùng sitemap. */
export async function fetchAllPublicRentalSlugs(): Promise<string[]> {
  const slugs: string[] = [];
  let page = 1;
  const limit = 50;
  const maxPages = 500;
  while (page <= maxPages) {
    const res = await fetchRentalList({ page, limit });
    if (res.items.length === 0) {
      break;
    }
    for (const it of res.items) {
      if (it.slug) {
        slugs.push(it.slug);
      }
    }
    if (res.items.length < limit || page * limit >= res.total) {
      break;
    }
    page += 1;
  }
  return slugs;
}
