'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '@/lib/contexts/auth-context';
import { api } from '@/lib/api/api';
import { API_ENDPOINTS } from '@/lib/config/api';

interface Creator {
  id: string;
  display_name: string;
  bio?: string | null;
  avatar_url?: string | null;
  follower_count: number;
  total_redcomments: number;
  isVerified: boolean;
  user?: {
    id: string;
    firstName?: string;
    lastName?: string;
    avatar_url?: string | null;
    displayName?: string;
  };
}

interface VideoItem {
  id: string;
  title: string;
  video_url?: string | null;
  thumbnailUrl?: string | null;
  cover_image_url?: string;
  views: number | bigint;
  likes: number | bigint;
  redcomment_regions?: { region: { name: string } }[];
}

interface SpotlightCreatorClientProps {
  creator: Creator;
  videos: VideoItem[];
  pagination: { page: number; limit: number; total: number; totalPages: number };
}

export function SpotlightCreatorClient({
  creator,
  videos: initialVideos,
  pagination: initialPagination,
}: SpotlightCreatorClientProps): JSX.Element {
  const { isAuthenticated, isLoading } = useAuth();
  const [followed, setFollowed] = useState(false);
  const [followerCount, setFollowerCount] = useState(creator.follower_count);
  const [followLoading, setFollowLoading] = useState(false);

  useEffect(() => {
    if (isAuthenticated) {
      api
        .get<{ followed: boolean }>(
          API_ENDPOINTS.SPOTLIGHT.CREATOR_FOLLOWED(creator.id),
        )
        .then((r) => setFollowed(r.followed))
        .catch(() => {});
    }
  }, [creator.id, isAuthenticated]);

  const handleFollow = async () => {
    if (!isAuthenticated) {
      window.location.href = `/login?redirect=/spotlight/creator/${creator.id}`;
      return;
    }
    setFollowLoading(true);
    try {
      if (followed) {
        await api.del(API_ENDPOINTS.SPOTLIGHT.CREATOR_FOLLOW(creator.id));
        setFollowed(false);
        setFollowerCount((c) => Math.max(0, c - 1));
      } else {
        await api.post(API_ENDPOINTS.SPOTLIGHT.CREATOR_FOLLOW(creator.id));
        setFollowed(true);
        setFollowerCount((c) => c + 1);
      }
    } catch {
      // ignore
    } finally {
      setFollowLoading(false);
    }
  };

  const avatarUrl =
    creator.avatar_url ||
    creator.user?.avatar_url;
  const displayName =
    creator.display_name ||
    (creator.user
      ? `${creator.user.firstName || ''} ${creator.user.lastName || ''}`.trim()
      : 'Creator') ||
    'Creator';

  return (
    <div>
      {/* Creator header */}
      <div className="flex flex-col gap-6 rounded-xl border bg-card p-6 sm:flex-row sm:items-center">
        <div className="flex h-24 w-24 shrink-0 items-center justify-center overflow-hidden rounded-full bg-gradient-to-br from-purple-600 to-pink-600 text-3xl font-bold text-white">
          {avatarUrl ? (
            <img
              src={avatarUrl}
              alt={displayName}
              className="h-full w-full object-cover"
            />
          ) : (
            displayName[0]?.toUpperCase() || 'C'
          )}
        </div>
        <div className="flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <h1 className="font-heading text-2xl font-bold">{displayName}</h1>
            {creator.isVerified && (
              <span className="rounded-full bg-blue-100 px-2 py-0.5 text-xs font-medium text-blue-700 dark:bg-blue-900 dark:text-blue-300">
                Đã xác minh
              </span>
            )}
          </div>
          <div className="mt-2 flex flex-wrap gap-4 text-sm text-muted-foreground">
            <span>{followerCount.toLocaleString('vi-VN')} theo dõi</span>
            <span>{creator.total_redcomments} video</span>
          </div>
          {creator.bio && (
            <p className="mt-3 max-w-2xl text-muted-foreground">{creator.bio}</p>
          )}
          <div className="mt-4">
            <button
              type="button"
              onClick={handleFollow}
              disabled={followLoading}
              className={`rounded-lg px-5 py-2.5 font-semibold transition-all disabled:opacity-50 ${
                followed
                  ? 'border bg-muted hover:bg-muted/80'
                  : 'bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:shadow-lg'
              }`}
            >
              {followLoading
                ? 'Đang xử lý...'
                : followed
                  ? 'Đã theo dõi'
                  : 'Theo dõi'}
            </button>
          </div>
        </div>
      </div>

      {/* Video grid */}
      <div className="mt-8">
        <h2 className="mb-4 text-lg font-semibold">Video</h2>
        {initialVideos.length === 0 ? (
          <p className="py-12 text-center text-muted-foreground">
            Chưa có video nào
          </p>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {initialVideos.map((v) => (
              <Link
                key={v.id}
                href={`/spotlight/${v.id}`}
                className="group overflow-hidden rounded-xl border bg-card transition-all hover:shadow-lg"
              >
                <div className="relative aspect-video overflow-hidden bg-muted">
                  <img
                    src={
                      v.thumbnailUrl ||
                      v.cover_image_url ||
                      'https://placehold.co/640x360/1a1a2e/eee?text=Video'
                    }
                    alt={v.title}
                    className="h-full w-full object-cover transition-transform group-hover:scale-105"
                  />
                </div>
                <div className="p-4">
                  <h3 className="line-clamp-2 font-semibold group-hover:text-primary">
                    {v.title}
                  </h3>
                  <div className="mt-2 flex gap-2 text-sm text-muted-foreground">
                    <span>{(Number(v.views) || 0).toLocaleString('vi-VN')} xem</span>
                    <span>{(Number(v.likes) || 0).toLocaleString('vi-VN')} thích</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}

        {initialPagination.totalPages > 1 && (
          <nav className="mt-10 flex justify-center gap-2">
            {initialPagination.page > 1 && (
              <Link
                href={`/spotlight/creator/${creator.id}?page=${initialPagination.page - 1}`}
                className="rounded-lg border px-4 py-2 text-sm font-medium hover:bg-muted"
              >
                ← Trước
              </Link>
            )}
            <span className="rounded-lg bg-muted px-4 py-2 text-sm">
              Trang {initialPagination.page} / {initialPagination.totalPages}
            </span>
            {initialPagination.page < initialPagination.totalPages && (
              <Link
                href={`/spotlight/creator/${creator.id}?page=${initialPagination.page + 1}`}
                className="rounded-lg border px-4 py-2 text-sm font-medium hover:bg-muted"
              >
                Sau →
              </Link>
            )}
          </nav>
        )}
      </div>
    </div>
  );
}
