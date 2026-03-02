'use client';

import React from 'react';
import Link from 'next/link';
import { useAuth } from '@/lib/contexts/auth-context';
import { api } from '@/lib/api/api';
import { API_ENDPOINTS } from '@/lib/config/api';
import { SpotlightFeedInfinite } from './spotlight-feed-infinite';

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
  filters: { category?: string; regionId?: string; sort?: string; tag?: string };
  categories: { id: string; slug: string; name: string }[];
  locations: { id: string; code: string; name: string }[];
}

function buildFeedUrl(overrides: Record<string, string | number | undefined>) {
  const p = new URLSearchParams();
  const merged = { ...overrides };
  if (merged.category) p.set('category', merged.category as string);
  if (merged.regionId) p.set('regionId', merged.regionId as string);
  if (merged.sort && merged.sort !== 'latest') p.set('sort', merged.sort as string);
  if (merged.tag) p.set('tag', merged.tag as string);
  if (merged.tab === 'for_you') p.set('tab', 'for_you');
  if (merged.tab === 'following') p.set('tab', 'following');
  const page = merged.page ?? 1;
  if (page > 1) p.set('page', String(page));
  return `/spotlight${p.toString() ? `?${p}` : ''}`;
}

async function fetchFeedPage(
  page: number,
  filters: { category?: string; regionId?: string; sort?: string; tag?: string },
): Promise<{ data: VideoItem[]; pagination: { page: number; totalPages: number } }> {
  const p = new URLSearchParams();
  p.set('page', String(page));
  p.set('limit', '20');
  p.set('format', 'VIDEO_REEL');
  if (filters.category) p.set('category', filters.category);
  if (filters.regionId) p.set('regionId', filters.regionId);
  if (filters.sort && filters.sort !== 'latest') p.set('sort', filters.sort);
  if (filters.tag) p.set('tag', filters.tag);
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
}: SpotlightFeedTabsProps): JSX.Element {
  const { isAuthenticated, isLoading } = useAuth();
  const [tab, setTab] = React.useState<'for_you' | 'all' | 'following'>(initialTab);
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
  };

  const forYouFilters = {
    ...allFeedFilters,
    sort: 'trending' as const,
  };

  return (
    <>
      {/* Tabs */}
      <div className="mb-6 flex gap-2 border-b">
        <Link
          href={buildFeedUrl({ tab: 'for_you', category: filters.category, regionId: filters.regionId, sort: 'trending', tag: filters.tag, page: 1 })}
          className={`border-b-2 px-4 py-2 text-sm font-medium transition-colors ${
            showForYou
              ? 'border-purple-600 text-purple-600'
              : 'border-transparent text-muted-foreground hover:text-foreground'
          }`}
        >
          Dành cho bạn
        </Link>
        <Link
          href={buildFeedUrl({ tab: undefined, category: filters.category, regionId: filters.regionId, sort: filters.sort, tag: filters.tag, page: 1 })}
          className={`border-b-2 px-4 py-2 text-sm font-medium transition-colors ${
            showAll
              ? 'border-purple-600 text-purple-600'
              : 'border-transparent text-muted-foreground hover:text-foreground'
          }`}
        >
          Tất cả
        </Link>
        <Link
          href={buildFeedUrl({ tab: 'following', page: 1 })}
          className={`border-b-2 px-4 py-2 text-sm font-medium transition-colors ${
            showFollowing
              ? 'border-purple-600 text-purple-600'
              : 'border-transparent text-muted-foreground hover:text-foreground'
          }`}
        >
          Đang theo dõi
        </Link>
      </div>

      {/* Dành cho bạn tab - trending feed */}
      {showForYou && (
        <SpotlightFeedInfinite
          initialData={initialData}
          initialPagination={initialPagination}
          filters={forYouFilters}
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
                href={`/login?redirect=/spotlight?tab=following`}
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
        />
      )}
    </>
  );
}
