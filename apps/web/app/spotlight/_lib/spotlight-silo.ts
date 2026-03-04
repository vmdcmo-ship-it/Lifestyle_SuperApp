/** Shared config và helpers cho Spotlight silo pages (an-uong, diem-den, phong-cach) */

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';
const API_PREFIX = '/api/v1';

export const SILO_CONFIG: Record<
  string,
  { categorySlug: string; title: string; description: string }
> = {
  'an-uong': {
    categorySlug: 'food',
    title: 'Ẩm thực - Video review món ăn, quán ngon',
    description:
      'Khám phá video review ẩm thực, món ăn ngon, quán cafe và nhà hàng từ cộng đồng Spotlight',
  },
  'diem-den': {
    categorySlug: 'travel',
    title: 'Điểm đến - Video du lịch & khám phá',
    description:
      'Khám phá video du lịch, điểm đến hot, nghỉ dưỡng từ cộng đồng Spotlight',
  },
  'phong-cach': {
    categorySlug: 'lifestyle',
    title: 'Phong cách sống - Video lifestyle & trải nghiệm',
    description:
      'Khám phá video phong cách sống, trải nghiệm và xu hướng từ cộng đồng Spotlight',
  },
};

export async function fetchSiloFeed(params: {
  page?: number;
  limit?: number;
  category?: string;
  regionId?: string;
  sort?: string;
  tag?: string;
}) {
  const searchParams = new URLSearchParams();
  if (params.page) searchParams.set('page', String(params.page));
  if (params.limit) searchParams.set('limit', String(params.limit));
  if (params.category) searchParams.set('category', params.category);
  if (params.regionId) searchParams.set('regionId', params.regionId);
  if (params.sort) searchParams.set('sort', params.sort || 'latest');
  if (params.tag) searchParams.set('tag', params.tag);
  searchParams.set('format', 'VIDEO_REEL');

  const url = `${API_BASE.replace(/\/$/, '')}${API_PREFIX}/spotlight/feed?${searchParams}`;
  const res = await fetch(url, { next: { revalidate: 30 } });
  if (!res.ok) {
    return { data: [], pagination: { page: 1, limit: 20, total: 0, totalPages: 0 } };
  }
  return res.json();
}

export async function fetchSiloCategories() {
  const url = `${API_BASE.replace(/\/$/, '')}${API_PREFIX}/spotlight/categories`;
  const res = await fetch(url, { next: { revalidate: 300 } });
  if (!res.ok) return { data: [] };
  return res.json();
}

export async function fetchSiloLocations() {
  const url = `${API_BASE.replace(/\/$/, '')}${API_PREFIX}/spotlight/locations?level=PROVINCE`;
  const res = await fetch(url, { next: { revalidate: 300 } });
  if (!res.ok) return { data: [] };
  return res.json();
}
