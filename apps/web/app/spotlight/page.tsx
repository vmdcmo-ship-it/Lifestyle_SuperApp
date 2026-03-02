import type { Metadata } from 'next';
import Link from 'next/link';
import { SpotlightFeedClient } from './spotlight-feed-client';
import { SpotlightFeedTabs } from './spotlight-feed-tabs';

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
  if (!res.ok) return { data: [], pagination: { page: 1, limit: 20, total: 0, totalPages: 0 } };
  return res.json();
}

async function fetchCategories() {
  const url = `${API_BASE.replace(/\/$/, '')}${API_PREFIX}/spotlight/categories`;
  const res = await fetch(url, { next: { revalidate: 300 } });
  if (!res.ok) return { data: [] };
  return res.json();
}

async function fetchLocations() {
  const url = `${API_BASE.replace(/\/$/, '')}${API_PREFIX}/spotlight/locations?level=PROVINCE`;
  const res = await fetch(url, { next: { revalidate: 300 } });
  if (!res.ok) return { data: [] };
  return res.json();
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
  }>;
}

export default async function SpotlightPage({
  searchParams,
}: PageProps): Promise<JSX.Element> {
  const params = await searchParams;
  const tab = params.tab === 'following' ? 'following' : params.tab === 'for_you' ? 'for_you' : 'all';
  const fetchSort = tab === 'for_you' ? 'trending' : (params.sort || 'latest');
  const [feed, categoriesRes, locationsRes] = await Promise.all([
    tab === 'all' || tab === 'for_you'
      ? fetchFeed({
          page: 1,
          limit: 20,
          category: params.category,
          regionId: params.regionId,
          sort: fetchSort,
          tag: params.tag,
        })
      : Promise.resolve({ data: [], pagination: { page: 1, limit: 20, total: 0, totalPages: 0 } }),
    fetchCategories(),
    fetchLocations(),
  ]);

  const categories = categoriesRes?.data || [];
  const locations = locationsRes?.data || [];

  return (
    <div className="min-h-screen bg-background">
      <div className="border-b bg-card">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="font-heading text-2xl font-bold md:text-3xl">
                Spotlight
              </h1>
              <p className="mt-1 text-sm text-muted-foreground">
                Video du lịch, ẩm thực & phong cách sống
              </p>
            </div>
            <Link
              href="/spotlight/create"
              className="inline-flex items-center justify-center rounded-lg bg-gradient-to-r from-purple-600 to-pink-600 px-4 py-2.5 text-sm font-semibold text-white transition-all hover:shadow-lg hover:scale-105 active:scale-95"
            >
              <span className="mr-2">+</span>
              Đăng video
            </Link>
          </div>

          {(tab === 'all' || tab === 'for_you') && (
            <SpotlightFeedClient
              categories={categories}
              locations={locations}
              currentFilters={{
                page: 1,
                category: params.category,
                regionId: params.regionId,
                sort: tab === 'for_you' ? 'trending' : (params.sort || 'latest'),
                tag: params.tag,
              }}
            />
          )}
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <SpotlightFeedTabs
          tab={tab}
          initialData={feed.data}
          initialPagination={feed.pagination}
          filters={{
            category: params.category,
            regionId: params.regionId,
            sort: tab === 'for_you' ? 'trending' : (params.sort || 'latest'),
            tag: params.tag,
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
      <div className="py-20 text-center text-muted-foreground">
        <p className="text-lg">Chưa có video nào. Hãy là người đầu tiên đăng!</p>
        <Link
          href="/spotlight/create"
          className="mt-4 inline-block text-primary underline"
        >
          Đăng video ngay
        </Link>
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
