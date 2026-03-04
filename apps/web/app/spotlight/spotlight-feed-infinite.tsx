'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import Link from 'next/link';
import { api } from '@/lib/api/api';
import { API_ENDPOINTS } from '@/lib/config/api';

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
  tags?: string[];
  target_tags?: string[];
  seo_keywords?: string[];
  cta_buttons?: { id: string; text: string; target_url?: string | null; link_type?: string | null }[];
  creator?: {
    id?: string;
    user?: { firstName?: string; lastName?: string };
  };
  redcomment_regions?: { region: { name: string } }[];
}

const HOVER_PREVIEW_DELAY_MS = 400; // Delay trước khi load video (giảm tải khi di chuột nhanh)

function VideoCard({
  video: v,
  variant = 'grid',
  basePath = '/spotlight',
}: {
  video: VideoItem;
  variant?: 'grid' | 'list';
  basePath?: string;
}): JSX.Element {
  const [isHovered, setIsHovered] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const hoverTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (isHovered) {
      hoverTimerRef.current = setTimeout(() => setShowPreview(true), HOVER_PREVIEW_DELAY_MS);
    } else {
      if (hoverTimerRef.current) clearTimeout(hoverTimerRef.current);
      hoverTimerRef.current = null;
      setShowPreview(false);
    }
    return () => {
      if (hoverTimerRef.current) clearTimeout(hoverTimerRef.current);
    };
  }, [isHovered]);

  const videoUrl = v.videoUrl || v.video_url;
  const videoSource = v.videoSource || v.video_source;
  const previewUrl = getPreviewEmbedUrl(videoUrl, videoSource);
  const hasPreview = !!previewUrl;
  const thumbnail =
    v.thumbnailUrl || v.thumbnail_url || v.cover_image_url ||
    'https://placehold.co/640x360/1a1a2e/eee?text=Video';
  const creatorName =
    v.creator?.user
      ? `${v.creator.user.firstName || ''} ${v.creator.user.lastName || ''}`.trim() || 'Creator'
      : 'Lifestyle';
  const creatorHref = v.creator?.id ? `/spotlight/creator/${v.creator.id}` : null;

  const thumbBlock = (
    <div className={`relative overflow-hidden bg-muted ${variant === 'list' ? 'w-64 shrink-0' : ''}`}>
      <div className="aspect-video">
        {showPreview && previewUrl ? (
          <iframe
            src={previewUrl}
            title={v.title}
            className="absolute inset-0 z-10 h-full w-full object-cover animate-in fade-in duration-200"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope"
            allowFullScreen
          />
        ) : (
          <img
            src={thumbnail}
            alt={v.title}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        )}
        {hasPreview && !showPreview && (
          <div className="absolute inset-0 z-[5] flex items-center justify-center bg-black/20 opacity-0 transition-opacity duration-200 group-hover:opacity-100">
            <span className="rounded-full bg-black/60 p-3 text-2xl text-white backdrop-blur-sm" aria-hidden>
              ▶
            </span>
          </div>
        )}
        {(videoSource || v.video_source) && (
          <span className="absolute right-2 top-2 z-20 rounded bg-black/60 px-2 py-0.5 text-xs text-white">
            {(videoSource || v.video_source) === 'YOUTUBE' ? 'YouTube' : 'Facebook'}
          </span>
        )}
        {v.cta_buttons && v.cta_buttons.length > 0 && v.cta_buttons.some((c) => c.target_url) && (
          <Link
            href={`/spotlight/${v.id}`}
            className="absolute bottom-2 left-2 flex items-center gap-1 rounded-full bg-purple-600 px-2 py-1 text-xs font-medium text-white transition hover:bg-purple-700"
            onClick={(e) => e.stopPropagation()}
          >
            <span>🛒</span>
            <span>Mua sản phẩm</span>
          </Link>
        )}
      </div>
    </div>
  );

  const creatorContent = (
    <>
      <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
        {creatorHref ? (
          <Link href={creatorHref} className="hover:text-primary hover:underline">
            {creatorName}
          </Link>
        ) : (
          <span>{creatorName}</span>
        )}
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
      {(() => {
        const tagList = [...new Set([
          ...(v.tags || []),
          ...(v.target_tags || []),
          ...(v.seo_keywords || []),
        ])].filter(Boolean);
        if (!tagList.length) return null;
        return (
          <div className="mt-2 flex flex-wrap gap-1">
            {tagList.map((tag) => (
              <Link
                key={tag}
                href={`${basePath}?tag=${encodeURIComponent(tag)}`}
                className="rounded-full bg-purple-100 px-2 py-0.5 text-xs text-purple-700 transition-colors hover:bg-purple-200 dark:bg-purple-900/50 dark:text-purple-300 dark:hover:bg-purple-900"
                onClick={(e) => e.stopPropagation()}
              >
                #{tag}
              </Link>
            ))}
          </div>
        );
      })()}
    </>
  );

  if (variant === 'list') {
    return (
      <div
        className="group flex overflow-hidden rounded-xl border bg-card transition-all hover:shadow-lg"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <Link href={`/spotlight/${v.id}`} className="flex min-w-0 flex-1 items-stretch">
          {thumbBlock}
          <div className="flex min-w-0 flex-1 flex-col justify-center p-4">
            <h2 className="line-clamp-2 font-semibold group-hover:text-primary">{v.title}</h2>
          </div>
        </Link>
        <div className="flex shrink-0 flex-col justify-center border-l border-border px-4 py-2">{creatorContent}</div>
      </div>
    );
  }

  return (
    <div
      className="group overflow-hidden rounded-xl border bg-card transition-all hover:shadow-lg"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Link href={`/spotlight/${v.id}`} className="block">
        {thumbBlock}
        <div className="p-4 pt-3">
          <h2 className="line-clamp-2 font-semibold group-hover:text-primary">{v.title}</h2>
        </div>
      </Link>
      <div className="px-4 pb-4 pt-0">{creatorContent}</div>
    </div>
  );
}

function getPreviewEmbedUrl(videoUrl: string | null | undefined, videoSource: string | null | undefined): string | null {
  if (!videoUrl || !videoSource) return null;
  if (videoSource === 'YOUTUBE') {
    const m1 = videoUrl.match(/[?&]v=([^&]+)/);
    const m2 = videoUrl.match(/youtu\.be\/([^?]+)/);
    const m3 = videoUrl.match(/youtube\.com\/embed\/([^?]+)/);
    const videoId = m1?.[1] || m2?.[1] || m3?.[1] || '';
    if (!videoId) return null;
    return `https://www.youtube.com/embed/${videoId}?rel=0&autoplay=1&mute=1`;
  }
  if (videoSource === 'FACEBOOK') {
    const encoded = encodeURIComponent(videoUrl);
    return `https://www.facebook.com/plugins/video.php?href=${encoded}&show_text=false&autoplay=true&muted=true`;
  }
  return null;
}

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

export type ViewMode = 'grid' | 'list';

interface SpotlightFeedInfiniteProps {
  initialData: VideoItem[];
  initialPagination: { page: number; limit: number; total: number; totalPages: number };
  filters: { category?: string; regionId?: string; sort?: string; tag?: string; merchantId?: string };
  /** Khi true, dùng API feed/following (auth) cho load more */
  useFollowingApi?: boolean;
  /** C3: Chế độ xem grid hoặc list */
  viewMode?: ViewMode;
  /** Base path cho link (vd: /spotlight, /spotlight/an-uong) */
  basePath?: string;
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

const DEFAULT_PAGINATION = { page: 1, limit: 20, total: 0, totalPages: 0 };

export function SpotlightFeedInfinite({
  initialData,
  initialPagination,
  filters,
  useFollowingApi = false,
  viewMode = 'grid',
  basePath = '/spotlight',
}: SpotlightFeedInfiniteProps): JSX.Element {
  const pagination = initialPagination ?? DEFAULT_PAGINATION;
  const [videos, setVideos] = useState<VideoItem[]>(initialData ?? []);
  const [page, setPage] = useState(pagination.page);
  const [totalPages, setTotalPages] = useState(pagination.totalPages);
  const [loading, setLoading] = useState(false);
  const sentinelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setVideos(initialData ?? []);
    setPage(pagination.page);
    setTotalPages(pagination.totalPages);
  }, [initialData, pagination.page, pagination.totalPages, filters.category, filters.regionId, filters.sort, filters.tag, filters.merchantId]);

  const loadMore = useCallback(async () => {
    if (loading || page >= totalPages) return;
    setLoading(true);
    try {
      const nextPage = page + 1;
      const res = useFollowingApi
        ? await fetchFollowingPage(nextPage)
        : await fetchFeedPage(nextPage, filters);
      if (res.data?.length) {
        setVideos((prev) => [...prev, ...res.data]);
      }
      setPage(nextPage);
      if (res.pagination && typeof res.pagination.totalPages === 'number') {
        setTotalPages(res.pagination.totalPages);
      }
    } finally {
      setLoading(false);
    }
  }, [page, totalPages, loading, filters, useFollowingApi]);

  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel || page >= totalPages) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) loadMore();
      },
      { rootMargin: '200px', threshold: 0 },
    );
    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [loadMore, page, totalPages]);

  if (!videos.length) {
    return (
      <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border bg-muted/30 px-6 py-16 text-center">
        <span className="mb-4 text-6xl" aria-hidden>🎬</span>
        <h3 className="text-xl font-semibold text-foreground">
          Chưa có video nào
        </h3>
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
            <Link
              href="/spotlight/an-uong"
              className="rounded-full bg-muted px-4 py-2 text-sm font-medium transition-colors hover:bg-muted/80 hover:text-foreground"
            >
              🍜 Ẩm thực
            </Link>
            <Link
              href="/spotlight/diem-den"
              className="rounded-full bg-muted px-4 py-2 text-sm font-medium transition-colors hover:bg-muted/80 hover:text-foreground"
            >
              ✈️ Điểm đến
            </Link>
            <Link
              href="/spotlight/phong-cach"
              className="rounded-full bg-muted px-4 py-2 text-sm font-medium transition-colors hover:bg-muted/80 hover:text-foreground"
            >
              🌿 Phong cách sống
            </Link>
          </div>
        </div>
        <p className="mt-6 text-sm text-muted-foreground">
          Khám phá video theo chủ đề yêu thích
        </p>
      </div>
    );
  }

  const gridClass = viewMode === 'list'
    ? 'flex flex-col gap-4'
    : 'grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4';

  return (
    <>
      <div className={gridClass}>
        {videos.map((v) => (
          <VideoCard key={v.id} video={v} variant={viewMode} basePath={basePath} />
        ))}
      </div>
      <div ref={sentinelRef} className="flex justify-center py-8">
        {loading && (
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-purple-600 border-t-transparent" />
        )}
      </div>
      {page >= totalPages && totalPages > 1 && (
        <p className="py-4 text-center text-sm text-muted-foreground">
          Đã xem hết {videos.length} video
        </p>
      )}
    </>
  );
}
