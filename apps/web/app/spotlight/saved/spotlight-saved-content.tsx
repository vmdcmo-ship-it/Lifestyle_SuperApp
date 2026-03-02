'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { useAuth } from '@/lib/contexts/auth-context';
import { api } from '@/lib/api/api';
import { API_ENDPOINTS } from '@/lib/config/api';

interface VideoItem {
  id: string;
  title: string;
  thumbnailUrl?: string | null;
  thumbnail_url?: string | null;
  cover_image_url?: string;
  video_source?: string | null;
  views: number | bigint;
  likes: number | bigint;
  creator?: {
    id?: string;
    user?: { firstName?: string; lastName?: string };
  };
  redcomment_regions?: { region: { name: string } }[];
}

export function SpotlightSavedContent(): JSX.Element {
  const { isAuthenticated, isLoading } = useAuth();
  const [videos, setVideos] = useState<VideoItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [pagination, setPagination] = useState({
    page: 1,
    totalPages: 0,
    total: 0,
  });

  const loadPage = (pageNum: number, append = false) => {
    if (!isAuthenticated) return;
    if (pageNum === 1 && !append) setLoading(true);
    else setLoadingMore(true);
    api
      .get<{ data: VideoItem[]; pagination: { page: number; totalPages: number; total: number } }>(
        API_ENDPOINTS.SPOTLIGHT.SAVED,
        { page: pageNum, limit: 20 },
      )
      .then((res) => {
        const data = res.data || [];
        setVideos((prev) => (append ? [...prev, ...data] : data));
        setPagination(res.pagination || { page: 1, totalPages: 0, total: 0 });
      })
      .catch(() => (pageNum === 1 ? setVideos([]) : void 0))
      .finally(() => {
        setLoading(false);
        setLoadingMore(false);
      });
  };

  useEffect(() => {
    if (!isLoading && !isAuthenticated) return;
    if (!isAuthenticated) {
      setLoading(false);
      return;
    }
    loadPage(1);
  }, [isAuthenticated, isLoading]);

  if (!isLoading && !isAuthenticated) {
    return (
      <div className="rounded-lg border border-amber-200 bg-amber-50 p-8 text-center dark:border-amber-800 dark:bg-amber-950/30">
        <p className="font-medium text-amber-800 dark:text-amber-200">
          Bạn cần đăng nhập để xem video đã lưu
        </p>
        <Link
          href={`/login?redirect=/spotlight/saved`}
          className="mt-4 inline-block rounded-lg bg-amber-600 px-4 py-2 font-medium text-white hover:bg-amber-700"
        >
          Đăng nhập
        </Link>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex min-h-[200px] items-center justify-center">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-purple-600 border-t-transparent" />
      </div>
    );
  }

  if (!videos.length) {
    return (
      <div className="py-20 text-center text-muted-foreground">
        <p className="text-lg">Chưa có video nào được lưu</p>
        <Link
          href="/spotlight"
          className="mt-4 inline-block text-primary underline"
        >
          Khám phá video
        </Link>
      </div>
    );
  }

  const creatorName = (v: VideoItem) =>
    v.creator?.user
      ? `${v.creator.user.firstName || ''} ${v.creator.user.lastName || ''}`.trim() || 'Creator'
      : 'Lifestyle';
  const hasMore = pagination.page < pagination.totalPages;

  return (
    <div>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {videos.map((v) => (
          <div
            key={v.id}
            className="group overflow-hidden rounded-xl border bg-card transition-all hover:shadow-lg"
          >
            <Link href={`/spotlight/${v.id}`} className="block">
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
              </div>
              <div className="p-4 pt-3">
                <h2 className="line-clamp-2 font-semibold group-hover:text-primary">
                  {v.title}
                </h2>
              </div>
            </Link>
            <div className="px-4 pb-4 pt-0">
              <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
                {v.creator?.id ? (
                  <Link
                    href={`/spotlight/creator/${v.creator.id}`}
                    className="hover:text-primary hover:underline"
                    onClick={(e) => e.stopPropagation()}
                  >
                    {creatorName(v)}
                  </Link>
                ) : (
                  <span>{creatorName(v)}</span>
                )}
                <span>•</span>
                <span>{(Number(v.views) || 0).toLocaleString('vi-VN')} lượt xem</span>
              </div>
            </div>
          </div>
        ))}
      </div>
      {hasMore && (
        <div className="mt-8 flex justify-center">
          <button
            type="button"
            onClick={() => loadPage(pagination.page + 1, true)}
            disabled={loadingMore}
            className="rounded-lg border bg-muted px-6 py-2 text-sm font-medium transition-colors hover:bg-muted/80 disabled:opacity-50"
          >
            {loadingMore ? 'Đang tải...' : 'Xem thêm'}
          </button>
        </div>
      )}
    </div>
  );
}
