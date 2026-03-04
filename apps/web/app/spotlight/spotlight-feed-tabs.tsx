'use client';

import React from 'react';
import Link from 'next/link';
import { useAuth } from '@/lib/contexts/auth-context';
import { api } from '@/lib/api/api';
import { API_ENDPOINTS } from '@/lib/config/api';
import { SpotlightFeedInfinite, type ViewMode } from './spotlight-feed-infinite';

const VIEW_KEY = 'spotlight-view-mode';

const API_BASE =
  process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';
const API_PREFIX = '/api/v1';

interface VideoItem {
  id: string;
  title: string;
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
  creator?: {
    id?: string;
    user?: { firstName?: string; lastName?: string };
  };
  redcomment_regions?: { region: { name: string } }[];
}

interface SpotlightFeedTabsProps {
  tab: 'for_you' | 'all' | 'following';
  initialData: VideoItem[];
  initialPagination: { page: number; limit: number; total: number; totalPages: number };
  filters: { category?: string; regionId?: string; sort?: string; tag?: string; merchantId?: string };
  categories: { id: string; slug: string; name: string }[];
  locations: { id: string; code: string; name: string }[];
  /** Base path cho silo pages (vd: /spotlight/an-uong) */
  basePath?: string;
}

function buildFeedUrl(
  overrides: Record<string, string | number | undefined>,
  basePath?: string,
): string {
  const p = new URLSearchParams();
  const merged = { ...overrides };
  const useBase = basePath && merged.tab !== 'following';
  const base = useBase ? basePath : '/spotlight';
  if (merged.category && !useBase) p.set('category', merged.category as string);
  if (merged.regionId) p.set('regionId', merged.regionId as string);
  if (merged.sort && merged.sort !== 'latest') p.set('sort', merged.sort as string);
  if (merged.tag) p.set('tag', merged.tag as string);
  if (merged.merchantId) p.set('merchantId', merged.merchantId as string);
  if (merged.tab === 'for_you') p.set('tab', 'for_you');
  if (merged.tab === 'following') p.set('tab', 'following');
  const page = merged.page ?? 1;
  if (page > 1) p.set('page', String(page));
  return `${base}${p.toString() ? `?${p}` : ''}`;
}

async function fetchFeedPage(
  page: number,
  filters: { category?: string; regionId?: string; sort?: string; tag?: string; merchantId?: string },
): Promise<{ data: VideoItem[]; pagination: { page: number; totalPages: number } }> {
  const p = new URLSearchParams();
  p.set('page', String(page));
  p.set('limit', '20');
  p.set('format', 'VIDEO_REEL');
  if (filters.category) p.set('category', filters.category);
  if (filters.regionId) p.set('regionId', filters.regionId);
  if (filters.sort && filters.sort !== 'latest') p.set('sort', filters.sort);
  if (filters.tag) p.set('tag', filters.tag);
  if (filters.merchantId) p.set('merchantId', filters.merchantId);
  const res = await fetch(
    `${API_BASE.replace(/\/$/, '')}${API_PREFIX}/spotlight/feed?${p}`,
  );
  if (!res.ok) return { data: [], pagination: { page: 1, totalPages: 0 } };
  return res.json();
}

async function fetchFollowingPage(page: number): Promise<{
  data: VideoItem[];
  pagination: { page: number; totalPages: number };
}> {
  const res = await api.get<{ data: VideoItem[]; pagination: { page: number; totalPages: number } }>(
    API_ENDPOINTS.SPOTLIGHT.FEED_FOLLOWING,
    { page, limit: 20 },
  );
  return res as { data: VideoItem[]; pagination: { page: number; totalPages: number } };
}

export function SpotlightFeedTabs({
  tab: initialTab,
  initialData,
  initialPagination,
  filters,
  categories,
  locations,
  basePath,
}: SpotlightFeedTabsProps): JSX.Element {
  const { isAuthenticated, isLoading } = useAuth();
  const [tab, setTab] = React.useState<'for_you' | 'all' | 'following'>(initialTab);
  const [viewMode, setViewMode] = React.useState<ViewMode>(() => {
    if (typeof window === 'undefined') return 'grid';
    return (localStorage.getItem(VIEW_KEY) as ViewMode) || 'grid';
  });

  const persistViewMode = (mode: ViewMode) => {
    setViewMode(mode);
    if (typeof window !== 'undefined') localStorage.setItem(VIEW_KEY, mode);
  };

  const [followingData, setFollowingData] = React.useState<{
    data: VideoItem[];
    pagination: { page: number; limit: number; total: number; totalPages: number };
  } | null>(null);
  const [followingLoading, setFollowingLoading] = React.useState(false);
  const [followingError, setFollowingError] = React.useState<string | null>(null);

  // Sync tab with URL
  React.useEffect(() => {
    setTab(initialTab);
  }, [initialTab]);

  // Fetch following feed when tab is following and logged in
  React.useEffect(() => {
    if (tab !== 'following' || !isAuthenticated) return;
    setFollowingLoading(true);
    setFollowingError(null);
    fetchFollowingPage(1)
      .then((res) => {
        setFollowingData({
          data: res.data,
          pagination: {
            page: res.pagination.page,
            limit: 20,
            total: res.data.length,
            totalPages: res.pagination.totalPages ?? 1,
          },
        });
      })
      .catch(() => setFollowingError('Không thể tải feed đang theo dõi'))
      .finally(() => setFollowingLoading(false));
  }, [tab, isAuthenticated]);

  const showForYou = tab === 'for_you';
  const showFollowing = tab === 'following';
  const showAll = tab === 'all';

  const allFeedFilters = {
    category: filters.category,
    regionId: filters.regionId,
    sort: filters.sort || 'latest',
    tag: filters.tag,
    merchantId: filters.merchantId,
  };

  const forYouFilters = {
    ...allFeedFilters,
    sort: 'trending' as const,
  };

  return (
    <>
      {/* Tabs + View toggle */}
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4 border-b pb-4">
        <div className="flex gap-2">
        <Link
          href={buildFeedUrl({ tab: 'for_you', category: filters.category, regionId: filters.regionId, sort: 'trending', tag: filters.tag, merchantId: filters.merchantId, page: 1 }, basePath)}
          className={`border-b-2 px-4 py-2 text-sm font-medium transition-colors ${
            showForYou
              ? 'border-purple-600 text-purple-600'
              : 'border-transparent text-muted-foreground hover:text-foreground'
          }`}
        >
          Dành cho bạn
        </Link>
        <Link
          href={buildFeedUrl({ tab: undefined, category: filters.category, regionId: filters.regionId, sort: filters.sort, tag: filters.tag, merchantId: filters.merchantId, page: 1 }, basePath)}
          className={`border-b-2 px-4 py-2 text-sm font-medium transition-colors ${
            showAll
              ? 'border-purple-600 text-purple-600'
              : 'border-transparent text-muted-foreground hover:text-foreground'
          }`}
        >
          Tất cả
        </Link>
        <Link
          href={buildFeedUrl({ tab: 'following', page: 1 }, basePath)}
          className={`border-b-2 px-4 py-2 text-sm font-medium transition-colors ${
            showFollowing
              ? 'border-purple-600 text-purple-600'
              : 'border-transparent text-muted-foreground hover:text-foreground'
          }`}
        >
          Đang theo dõi
        </Link>
        </div>
        {/* C3: Grid / List view toggle */}
        <div className="flex items-center gap-1 rounded-lg border p-1">
          <button
            type="button"
            onClick={() => persistViewMode('grid')}
            className={`rounded-md p-2 transition-colors ${
              viewMode === 'grid' ? 'bg-purple-100 text-purple-700 dark:bg-purple-900/30' : 'text-muted-foreground hover:text-foreground'
            }`}
            title="Xem dạng lưới"
            aria-pressed={viewMode === 'grid'}
          >
            <GridIcon />
          </button>
          <button
            type="button"
            onClick={() => persistViewMode('list')}
            className={`rounded-md p-2 transition-colors ${
              viewMode === 'list' ? 'bg-purple-100 text-purple-700 dark:bg-purple-900/30' : 'text-muted-foreground hover:text-foreground'
            }`}
            title="Xem dạng danh sách"
            aria-pressed={viewMode === 'list'}
          >
            <ListIcon />
          </button>
        </div>
      </div>

      {/* Dành cho bạn tab - trending feed */}
      {showForYou && (
        <SpotlightFeedInfinite
          initialData={initialData}
          initialPagination={initialPagination}
          filters={forYouFilters}
          viewMode={viewMode}
          basePath={basePath}
        />
      )}

      {/* Following tab content */}
      {showFollowing && (
        <>
          {!isAuthenticated && !isLoading ? (
            <div className="py-20 text-center">
              <p className="text-lg text-muted-foreground">
                Đăng nhập để xem video từ Creators bạn đang theo dõi
              </p>
              <Link
                href="/login?redirect=/spotlight?tab=following"
                className="mt-4 inline-block rounded-lg bg-purple-600 px-4 py-2 font-medium text-white hover:bg-purple-700"
              >
                Đăng nhập
              </Link>
            </div>
          ) : followingLoading ? (
            <div className="flex justify-center py-20">
              <div className="h-10 w-10 animate-spin rounded-full border-4 border-purple-600 border-t-transparent" />
            </div>
          ) : followingError ? (
            <div className="py-20 text-center text-muted-foreground">
              <p>{followingError}</p>
            </div>
          ) : followingData ? (
            <SpotlightFeedInfinite
              initialData={followingData.data}
              initialPagination={followingData.pagination}
              filters={{}}
              useFollowingApi
              viewMode={viewMode}
              basePath={basePath}
            />
          ) : null}
        </>
      )}

      {/* All tab content */}
      {showAll && (
        <SpotlightFeedInfinite
          initialData={initialData}
          initialPagination={initialPagination}
          filters={allFeedFilters}
          viewMode={viewMode}
          basePath={basePath}
        />
      )}
    </>
  );
}

function GridIcon(): JSX.Element {
  return (
    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
    </svg>
  );
}

function ListIcon(): JSX.Element {
  return (
    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
    </svg>
  );
}
