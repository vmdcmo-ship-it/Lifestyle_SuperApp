import type { Metadata } from 'next';
import Link from 'next/link';
import { SpotlightFeedClient } from './spotlight-feed-client';
import { SpotlightFeedTabs } from './spotlight-feed-tabs';
import { FindnearSection } from './findnear/findnear-section';
import { BreadcrumbJsonLd } from '@/lib/seo/json-ld';

const API_BASE =
  process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';
const API_PREFIX = '/api/v1';

async function fetchFeed(params: {
  page?: number;
  limit?: number;
  category?: string;
  regionId?: string;
  sort?: string;
  tag?: string;
  merchantId?: string;
}) {
  const searchParams = new URLSearchParams();
  if (params.page) searchParams.set('page', String(params.page));
  if (params.limit) searchParams.set('limit', String(params.limit));
  if (params.category) searchParams.set('category', params.category);
  if (params.regionId) searchParams.set('regionId', params.regionId);
  if (params.sort) searchParams.set('sort', params.sort || 'latest');
  if (params.tag) searchParams.set('tag', params.tag);
  if (params.merchantId) searchParams.set('merchantId', params.merchantId);
  searchParams.set('format', 'VIDEO_REEL');

  const url = `${API_BASE.replace(/\/$/, '')}${API_PREFIX}/spotlight/feed?${searchParams}`;
  const res = await fetch(url, { next: { revalidate: 30 } });
  const fallback = { data: [], pagination: { page: 1, limit: 20, total: 0, totalPages: 0 } };
  if (!res.ok) return fallback;
  try {
    const json = await res.json();
    const data = json.data ?? json.items ?? [];
    const pagination = json.pagination ?? {
      page: json.meta?.page ?? 1,
      limit: json.meta?.limit ?? 20,
      total: json.meta?.total ?? json.total ?? 0,
      totalPages: (json.meta?.totalPages ?? json.totalPages ?? Math.ceil((json.meta?.total ?? json.total ?? 0) / 20)) || 0,
    };
    return { data, pagination };
  } catch {
    return fallback;
  }
}

async function fetchCategories() {
  const url = `${API_BASE.replace(/\/$/, '')}${API_PREFIX}/spotlight/categories`;
  const res = await fetch(url, { next: { revalidate: 300 } });
  if (!res.ok) return { data: [] };
  try {
    const json = await res.json();
    return { data: json.data ?? json ?? [] };
  } catch {
    return { data: [] };
  }
}

async function fetchLocations() {
  const url = `${API_BASE.replace(/\/$/, '')}${API_PREFIX}/spotlight/locations?level=PROVINCE`;
  const res = await fetch(url, { next: { revalidate: 300 } });
  if (!res.ok) return { data: [] };
  try {
    const json = await res.json();
    return { data: json.data ?? json ?? [] };
  } catch {
    return { data: [] };
  }
}

export const metadata: Metadata = {
  title: 'Spotlight - Video du lịch & phong cách sống',
  description:
    'Khám phá video review du lịch, ẩm thực, nghỉ dưỡng và phong cách sống từ cộng đồng Lifestyle',
};

interface PageProps {
  searchParams: Promise<{
    page?: string;
    category?: string;
    regionId?: string;
    sort?: 'latest' | 'popular' | 'trending';
    tab?: 'for_you' | 'all' | 'following';
    tag?: string;
    merchantId?: string;
  }>;
}

export default async function SpotlightPage({
  searchParams,
}: PageProps): Promise<JSX.Element> {
  const params = await searchParams;
  const tab = params.tab === 'following' ? 'following' : params.tab === 'for_you' ? 'for_you' : 'all';
  const fetchSort = tab === 'for_you' ? 'trending' : (params.sort || 'latest');
  const emptyFeed = { data: [] as any[], pagination: { page: 1, limit: 20, total: 0, totalPages: 0 } };

  let feed = emptyFeed;
  let categories: { id: string; slug: string; name: string }[] = [];
  let locations: { id: string; code: string; name: string }[] = [];

  try {
    const [feedRes, categoriesRes, locationsRes] = await Promise.all([
      tab === 'all' || tab === 'for_you'
        ? fetchFeed({
            page: 1,
            limit: 20,
            category: params.category,
            regionId: params.regionId,
            sort: fetchSort,
            tag: params.tag,
            merchantId: params.merchantId,
          })
        : Promise.resolve(emptyFeed),
      fetchCategories(),
      fetchLocations(),
    ]);
    feed = feedRes ?? emptyFeed;
    categories = (categoriesRes?.data ?? categoriesRes ?? []) as typeof categories;
    locations = (locationsRes?.data ?? locationsRes ?? []) as typeof locations;
  } catch {
    // API không chạy hoặc lỗi mạng - hiển thị trang với feed trống
  }

  const breadcrumbs = [
    { name: 'Trang chủ', url: '/' },
    { name: 'Spotlight', url: '/spotlight' },
  ];

  return (
    <div className="min-h-screen bg-background">
      <BreadcrumbJsonLd items={breadcrumbs} />
      {/* B1: Hero block */}
      <section className="relative overflow-hidden bg-gradient-to-br from-purple-700 via-purple-600 to-pink-600">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cg fill=\'%23ffffff\' fill-opacity=\'0.08\'%3E%3Cpath d=\'M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-40" />
        <div className="container relative mx-auto px-4 py-12 md:py-16">
          <div className="mx-auto max-w-3xl text-center">
            <h1 className="font-heading text-3xl font-bold text-white drop-shadow-md md:text-4xl lg:text-5xl">
              Spotlight
            </h1>
            <p className="mt-3 text-lg text-white/90 md:text-xl">
              Khám phá video du lịch, ẩm thực và phong cách sống từ cộng đồng
            </p>
            <div className="mt-6 flex flex-wrap items-center justify-center gap-4">
              <Link
                href="/spotlight/create"
                className="inline-flex items-center rounded-lg bg-white px-6 py-3 font-semibold text-purple-700 shadow-lg transition-all hover:bg-white/95 hover:shadow-xl active:scale-95"
              >
                <span className="mr-2">+</span>
                Đăng video
              </Link>
              <Link
                href="/spotlight/an-uong"
                className="inline-flex items-center rounded-lg border-2 border-white/60 px-6 py-3 font-medium text-white transition-colors hover:bg-white/20"
              >
                Khám phá Ẩm thực
              </Link>
              <Link
                href="/spotlight/diem-den"
                className="inline-flex items-center rounded-lg border-2 border-white/60 px-6 py-3 font-medium text-white transition-colors hover:bg-white/20"
              >
                Khám phá Điểm đến
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Findnear - Tìm dịch vụ gần bạn (web: ghép với Spotlight) */}
      <div className="container mx-auto px-4 py-4">
        <FindnearSection />
      </div>

      <div className="border-b bg-card">
        <div className="container mx-auto px-4 py-6">
          <nav
            className="mb-2 text-sm text-muted-foreground"
            aria-label="Breadcrumb"
          >
            <Link href="/" className="hover:text-foreground">
              Trang chủ
            </Link>
            <span className="mx-2">/</span>
            <span className="text-foreground">Spotlight</span>
          </nav>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="font-heading text-xl font-bold md:text-2xl">
                Feed video
              </h2>
              <p className="mt-1 text-sm text-muted-foreground">
                Dành cho bạn · Tất cả · Đang theo dõi
              </p>
              <nav className="mt-3 flex flex-wrap gap-2" aria-label="Danh mục Spotlight">
                <Link
                  href="/spotlight/an-uong"
                  className="rounded-full bg-muted px-3 py-1 text-xs font-medium transition-colors hover:bg-muted/80 hover:text-foreground"
                >
                  Ẩm thực
                </Link>
                <Link
                  href="/spotlight/diem-den"
                  className="rounded-full bg-muted px-3 py-1 text-xs font-medium transition-colors hover:bg-muted/80 hover:text-foreground"
                >
                  Điểm đến
                </Link>
                <Link
                  href="/spotlight/phong-cach"
                  className="rounded-full bg-muted px-3 py-1 text-xs font-medium transition-colors hover:bg-muted/80 hover:text-foreground"
                >
                  Phong cách sống
                </Link>
              </nav>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <Link
                href="/dang-ky-doi-tac?group=LOCAL_SERVICE"
                className="inline-flex items-center justify-center rounded-lg border-2 border-purple-500/60 px-4 py-2.5 text-sm font-medium text-purple-300 transition-colors hover:bg-purple-500/10"
              >
                Chủ dịch vụ đăng ký
              </Link>
              <Link
                href="/spotlight/create"
                className="inline-flex items-center justify-center rounded-lg bg-gradient-to-r from-purple-600 to-pink-600 px-4 py-2.5 text-sm font-semibold text-white transition-all hover:shadow-lg hover:scale-105 active:scale-95"
              >
                <span className="mr-2">+</span>
                Đăng video
              </Link>
            </div>
          </div>

          {(tab === 'all' || tab === 'for_you') && (
            <div className="sticky top-16 z-20 -mx-4 -mb-6 mt-6 border-b border-border bg-card px-4 py-4 backdrop-blur-sm supports-[backdrop-filter]:bg-card/95">
              <SpotlightFeedClient
                categories={categories}
                locations={locations}
                currentFilters={{
                  page: 1,
                  category: params.category,
                  regionId: params.regionId,
                  sort: tab === 'for_you' ? 'trending' : (params.sort || 'latest'),
                  tag: params.tag,
                  merchantId: params.merchantId,
                }}
              />
            </div>
          )}
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <SpotlightFeedTabs
          tab={tab}
          initialData={feed.data ?? []}
          initialPagination={feed.pagination ?? { page: 1, limit: 20, total: 0, totalPages: 0 }}
          filters={{
            category: params.category,
            regionId: params.regionId,
            sort: tab === 'for_you' ? 'trending' : (params.sort || 'latest'),
            tag: params.tag,
            merchantId: params.merchantId,
          }}
          categories={categories}
          locations={locations}
        />
      </div>
    </div>
  );
}

// ─── Video grid ────────────────────────────────────────────────────────

interface VideoItem {
  id: string;
  title: string;
  description?: string | null;
  video_url?: string | null;
  videoUrl?: string | null;
  video_source?: string | null;
  videoSource?: string | null;
  thumbnailUrl?: string | null;
  thumbnail_url?: string | null;
  cover_image_url?: string;
  views: number | bigint;
  likes: number | bigint;
  comments_count?: number;
  createdAt: string;
  creator?: {
    user?: {
      firstName?: string;
      lastName?: string;
      avatar_url?: string | null;
    };
  };
  redcomment_regions?: { region: { name: string } }[];
  spotlight_category?: { slug: string; name: string } | null;
}

function SpotlightPagination({
  currentPage,
  totalPages,
  baseParams,
}: {
  currentPage: number;
  totalPages: number;
  baseParams: { category?: string; regionId?: string; sort?: string };
}): JSX.Element {
  const buildPageUrl = (page: number) => {
    const p = new URLSearchParams();
    if (baseParams.category) p.set('category', baseParams.category);
    if (baseParams.regionId) p.set('regionId', baseParams.regionId);
    if (baseParams.sort && baseParams.sort !== 'latest') p.set('sort', baseParams.sort);
    p.set('page', String(page));
    return `/spotlight?${p.toString()}`;
  };

  return (
    <nav className="mt-10 flex items-center justify-center gap-2">
      {currentPage > 1 ? (
        <Link
          href={buildPageUrl(currentPage - 1)}
          className="rounded-lg border px-4 py-2 text-sm font-medium hover:bg-muted"
        >
          ← Trước
        </Link>
      ) : null}
      <span className="rounded-lg bg-muted px-4 py-2 text-sm">
        Trang {currentPage} / {totalPages}
      </span>
      {currentPage < totalPages ? (
        <Link
          href={buildPageUrl(currentPage + 1)}
          className="rounded-lg border px-4 py-2 text-sm font-medium hover:bg-muted"
        >
          Sau →
        </Link>
      ) : null}
    </nav>
  );
}

function SpotlightVideoGrid({ videos }: { videos: VideoItem[] }): JSX.Element {
  if (!videos || videos.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border bg-muted/30 px-6 py-16 text-center">
        <span className="mb-4 text-6xl" aria-hidden>🎬</span>
        <h3 className="text-xl font-semibold text-foreground">Chưa có video nào</h3>
        <p className="mt-2 max-w-md text-muted-foreground">
          Hãy là người đầu tiên chia sẻ video du lịch, ẩm thực hay phong cách sống với cộng đồng!
        </p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <Link
            href="/spotlight/create"
            className="inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-purple-600 to-pink-600 px-5 py-2.5 font-semibold text-white shadow-lg transition-all hover:scale-105 hover:shadow-xl active:scale-95"
          >
            <span>+</span>
            Đăng video ngay
          </Link>
          <span className="text-muted-foreground">hoặc</span>
          <div className="flex flex-wrap justify-center gap-2">
            <Link href="/spotlight/an-uong" className="rounded-full bg-muted px-4 py-2 text-sm font-medium transition-colors hover:bg-muted/80 hover:text-foreground">🍜 Ẩm thực</Link>
            <Link href="/spotlight/diem-den" className="rounded-full bg-muted px-4 py-2 text-sm font-medium transition-colors hover:bg-muted/80 hover:text-foreground">✈️ Điểm đến</Link>
            <Link href="/spotlight/phong-cach" className="rounded-full bg-muted px-4 py-2 text-sm font-medium transition-colors hover:bg-muted/80 hover:text-foreground">🌿 Phong cách sống</Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {videos.map((v) => (
        <Link
          key={v.id}
          href={`/spotlight/${v.id}`}
          className="group overflow-hidden rounded-xl border bg-card transition-all hover:shadow-lg"
        >
          <div className="relative aspect-video overflow-hidden bg-muted">
            <img
              src={
                v.thumbnailUrl ||
                v.thumbnail_url ||
                v.cover_image_url ||
                'https://placehold.co/640x360/1a1a2e/eee?text=Video'
              }
              alt={v.title}
              className="h-full w-full object-cover transition-transform group-hover:scale-105"
            />
            {(v.videoSource || v.video_source) && (
              <span className="absolute right-2 top-2 rounded bg-black/60 px-2 py-0.5 text-xs text-white">
                {(v.videoSource || v.video_source) === 'YOUTUBE' ? 'YouTube' : 'Facebook'}
              </span>
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
          </div>
          <div className="p-4">
            <h2 className="line-clamp-2 font-semibold group-hover:text-primary">
              {v.title}
            </h2>
            <div className="mt-2 flex items-center gap-2 text-sm text-muted-foreground">
              <span>
                {v.creator?.user
                  ? `${v.creator.user.firstName || ''} ${v.creator.user.lastName || ''}`.trim() ||
                    'Creator'
                  : 'Lifestyle'}
              </span>
              <span>•</span>
              <span>{(Number(v.views) || 0).toLocaleString('vi-VN')} lượt xem</span>
              <span>•</span>
              <span>{(Number(v.likes) || 0).toLocaleString('vi-VN')} thích</span>
            </div>
            {v.redcomment_regions?.length ? (
              <p className="mt-1 text-xs text-muted-foreground">
                {v.redcomment_regions.map((rr) => rr.region.name).join(', ')}
              </p>
            ) : null}
          </div>
        </Link>
      ))}
    </div>
  );
}
