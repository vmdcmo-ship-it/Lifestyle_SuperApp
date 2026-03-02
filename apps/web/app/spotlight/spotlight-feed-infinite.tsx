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
  creator?: {
    id?: string;
    user?: { firstName?: string; lastName?: string };
  };
  redcomment_regions?: { region: { name: string } }[];
}

function VideoCard({ video: v }: { video: VideoItem }): JSX.Element {
  const [isHovered, setIsHovered] = useState(false);
  const videoUrl = v.videoUrl || v.video_url;
  const videoSource = v.videoSource || v.video_source;
  const previewUrl = getPreviewEmbedUrl(videoUrl, videoSource);
  const thumbnail =
    v.thumbnailUrl || v.thumbnail_url || v.cover_image_url ||
    'https://placehold.co/640x360/1a1a2e/eee?text=Video';
  const creatorName =
    v.creator?.user
      ? `${v.creator.user.firstName || ''} ${v.creator.user.lastName || ''}`.trim() || 'Creator'
      : 'Lifestyle';
  const creatorHref = v.creator?.id ? `/spotlight/creator/${v.creator.id}` : null;

  return (
    <div
      className="group overflow-hidden rounded-xl border bg-card transition-all hover:shadow-lg"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Link href={`/spotlight/${v.id}`} className="block">
        <div className="relative aspect-video overflow-hidden bg-muted">
          {isHovered && previewUrl ? (
            <iframe
              src={previewUrl}
              title={v.title}
              className="absolute inset-0 h-full w-full object-cover"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope"
              allowFullScreen
            />
          ) : (
            <img
              src={thumbnail}
              alt={v.title}
              className="h-full w-full object-cover transition-transform group-hover:scale-105"
            />
          )}
          {(videoSource || v.video_source) && (
            <span className="absolute right-2 top-2 rounded bg-black/60 px-2 py-0.5 text-xs text-white">
              {(videoSource || v.video_source) === 'YOUTUBE' ? 'YouTube' : 'Facebook'}
            </span>
          )}
        </div>
        <div className="p-4 pt-3">
          <h2 className="line-clamp-2 font-semibold group-hover:text-primary">
            {v.title}
          </h2>
        </div>
      </Link>
      <div className="px-4 pb-4 pt-0">
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
      </div>
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

interface SpotlightFeedInfiniteProps {
  initialData: VideoItem[];
  initialPagination: { page: number; limit: number; total: number; totalPages: number };
  filters: { category?: string; regionId?: string; sort?: string; tag?: string };
  /** Khi true, dùng API feed/following (auth) cho load more */
  useFollowingApi?: boolean;
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

export function SpotlightFeedInfinite({
  initialData,
  initialPagination,
  filters,
  useFollowingApi = false,
}: SpotlightFeedInfiniteProps): JSX.Element {
  const [videos, setVideos] = useState<VideoItem[]>(initialData);
  const [page, setPage] = useState(initialPagination.page);
  const [totalPages, setTotalPages] = useState(initialPagination.totalPages);
  const [loading, setLoading] = useState(false);
  const sentinelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setVideos(initialData);
    setPage(initialPagination.page);
    setTotalPages(initialPagination.totalPages);
  }, [initialData, initialPagination.page, initialPagination.totalPages, filters.category, filters.regionId, filters.sort, filters.tag]);

  const loadMore = useCallback(async () => {
    if (loading || page >= totalPages) return;
    setLoading(true);
    try {
      const nextPage = page + 1;
      const res = useFollowingApi
        ? await fetchFollowingPage(nextPage)
        : await fetchFeedPage(nextPage, filters);
      if (res.data.length) {
        setVideos((prev) => [...prev, ...res.data]);
      }
      setPage(nextPage);
      if (res.pagination.totalPages) {
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
      <div className="py-20 text-center text-muted-foreground">
        <p className="text-lg">Chưa có video nào. Hãy là người đầu tiên đăng!</p>
        <Link href="/spotlight/create" className="mt-4 inline-block text-primary underline">
          Đăng video ngay
        </Link>
      </div>
    );
  }

  return (
    <>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {videos.map((v) => (
          <VideoCard key={v.id} video={v} />
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
