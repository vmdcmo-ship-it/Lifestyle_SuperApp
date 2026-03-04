'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import Link from 'next/link';
import { useAuth } from '@/lib/contexts/auth-context';
import { api } from '@/lib/api/api';
import { API_ENDPOINTS } from '@/lib/config/api';

/** Toast hiển thị sau khi copy link / share */
function CopyToast({ message, onDone }: { message: string; onDone: () => void }) {
  useEffect(() => {
    const t = setTimeout(onDone, 2500);
    return () => clearTimeout(t);
  }, [onDone]);
  return (
    <div className="fixed bottom-6 left-1/2 z-50 -translate-x-1/2 animate-in fade-in zoom-in-95 duration-200 rounded-lg border bg-background px-4 py-3 text-sm font-medium shadow-lg">
      {message}
    </div>
  );
}

/** Trái tim bay lên khi double-tap like */
function FloatingHeart({
  x,
  y,
  onDone,
}: {
  x: number;
  y: number;
  onDone: () => void;
}) {
  useEffect(() => {
    const t = setTimeout(onDone, 1000);
    return () => clearTimeout(t);
  }, [onDone]);
  return (
    <div
      className="pointer-events-none fixed z-50 animate-heart-float"
      style={{ left: x - 28, top: y - 28 }}
    >
      <span className="text-6xl drop-shadow-lg">❤️</span>
    </div>
  );
}

interface SpotlightDetailData {
  id: string;
  title: string;
  description?: string | null;
  video_url?: string | null;
  videoUrl?: string | null;
  video_source?: string | null;
  videoSource?: string | null;
  thumbnailUrl?: string | null;
  cover_image_url?: string;
  videoDuration?: number | null;
  views: number | bigint;
  likes: number | bigint;
  comments_count?: number;
  createdAt: string;
  creator?: {
    id: string;
    user?: {
      id: string;
      firstName?: string;
      lastName?: string;
      avatar_url?: string | null;
    };
    display_name?: string;
    follower_count?: number;
  };
  redcomment_regions?: { region: { id: string; name: string; code: string } }[];
  spotlight_category?: { slug: string; name: string } | null;
  target_tags?: string[];
  seo_keywords?: string[];
  cta_buttons?: {
    id: string;
    text: string;
    target_url?: string | null;
    link_type?: string | null;
    price_display?: string | null;
    clicks?: number;
  }[];
  comments?: {
    id: string;
    body: string;
    likes: number;
    createdAt: string;
    user?: {
      id: string;
      firstName?: string;
      lastName?: string;
      avatar_url?: string | null;
    };
  }[];
}

interface SpotlightDetailClientProps {
  data: SpotlightDetailData;
}

function getEmbedUrl(videoUrl: string, videoSource: string): string {
  const u = videoUrl.toLowerCase();
  if (videoSource === 'YOUTUBE') {
    const m1 = videoUrl.match(/[?&]v=([^&]+)/);
    const m2 = videoUrl.match(/youtu\.be\/([^?]+)/);
    const m3 = videoUrl.match(/youtube\.com\/embed\/([^?]+)/);
    const videoId = m1?.[1] || m2?.[1] || m3?.[1] || '';
    return `https://www.youtube.com/embed/${videoId}?rel=0`;
  }
  if (videoSource === 'FACEBOOK') {
    const encoded = encodeURIComponent(videoUrl);
    return `https://www.facebook.com/plugins/video.php?href=${encoded}&show_text=false`;
  }
  return videoUrl;
}

export function SpotlightDetailClient({
  data,
}: SpotlightDetailClientProps): JSX.Element {
  const { isAuthenticated } = useAuth();
  const [liked, setLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(Number(data.likes) || 0);
  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);
  const [likeAnimating, setLikeAnimating] = useState(false);
  const [commentText, setCommentText] = useState('');
  const [comments, setComments] = useState(data.comments || []);
  const [commentCount, setCommentCount] = useState(data.comments_count || 0);
  const [submitting, setSubmitting] = useState(false);
  const [commentError, setCommentError] = useState('');
  const [followed, setFollowed] = useState(false);
  const [followLoading, setFollowLoading] = useState(false);
  const [followerCount, setFollowerCount] = useState(
    data.creator?.follower_count ?? 0,
  );
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [shareOpen, setShareOpen] = useState(false);
  const shareRef = useRef<HTMLDivElement>(null);
  const lastTapRef = useRef(0);
  const [hearts, setHearts] = useState<{ id: number; x: number; y: number }[]>([]);
  const [relatedVideos, setRelatedVideos] = useState<
    { id: string; title: string; views: number | bigint; likes: number | bigint; thumbnailUrl?: string | null; thumbnail_url?: string | null; cover_image_url?: string }[]
  >([]);

  useEffect(() => {
    api
      .get<{ data: { id: string; title: string; views: number | bigint; likes: number | bigint; thumbnailUrl?: string | null; thumbnail_url?: string | null; cover_image_url?: string }[] }>(API_ENDPOINTS.SPOTLIGHT.RELATED(data.id))
      .then((r) => setRelatedVideos(r.data || []))
      .catch(() => {});
  }, [data.id]);

  useEffect(() => {
    if (isAuthenticated) {
      api
        .get<{ saved: boolean }>(API_ENDPOINTS.SPOTLIGHT.SAVED_STATUS(data.id))
        .then((res) => setSaved(res.saved))
        .catch(() => {});
    }
  }, [data.id, isAuthenticated]);

  useEffect(() => {
    if (isAuthenticated && data.creator?.id) {
      api
        .get<{ followed: boolean }>(
          API_ENDPOINTS.SPOTLIGHT.CREATOR_FOLLOWED(data.creator.id),
        )
        .then((r) => setFollowed(r.followed))
        .catch(() => {});
    }
  }, [isAuthenticated, data.creator?.id]);

  const handleFollow = async () => {
    if (!isAuthenticated) {
      window.location.href = `/login?redirect=/spotlight/${data.id}`;
      return;
    }
    if (!data.creator?.id) return;
    setFollowLoading(true);
    try {
      if (followed) {
        await api.del(API_ENDPOINTS.SPOTLIGHT.CREATOR_FOLLOW(data.creator.id));
        setFollowed(false);
        setFollowerCount((c) => Math.max(0, c - 1));
      } else {
        await api.post(API_ENDPOINTS.SPOTLIGHT.CREATOR_FOLLOW(data.creator.id));
        setFollowed(true);
        setFollowerCount((c) => c + 1);
      }
    } catch {
      // ignore
    } finally {
      setFollowLoading(false);
    }
  };

  const handleLike = async () => {
    if (!isAuthenticated) {
      window.location.href = `/login?redirect=/spotlight/${data.id}`;
      return;
    }
    if (liked) return;
    setLikeAnimating(true);
    setTimeout(() => setLikeAnimating(false), 600);
    try {
      await api.post(API_ENDPOINTS.SPOTLIGHT.LIKE(data.id));
      setLiked(true);
      setLikesCount((c) => c + 1);
    } catch {
      // ignore
    }
  };

  const handleSave = async () => {
    if (!isAuthenticated) {
      window.location.href = `/login?redirect=/spotlight/${data.id}`;
      return;
    }
    setSaving(true);
    try {
      if (saved) {
        await api.del(API_ENDPOINTS.SPOTLIGHT.SAVE(data.id));
        setSaved(false);
      } else {
        await api.post(API_ENDPOINTS.SPOTLIGHT.SAVE(data.id));
        setSaved(true);
      }
    } catch {
      // ignore
    } finally {
      setSaving(false);
    }
  };

  const showToast = useCallback((msg: string) => {
    setToastMessage(msg);
  }, []);

  const copyToClipboard = useCallback(async () => {
    const url = typeof window !== 'undefined' ? window.location.href : '';
    try {
      await navigator.clipboard.writeText(url);
      showToast('Đã copy link!');
    } catch {
      showToast('Không thể copy. Vui lòng thử lại.');
    }
    setShareOpen(false);
  }, [showToast]);

  const handleShareNative = useCallback(async () => {
    const url = typeof window !== 'undefined' ? window.location.href : '';
    const shareData: ShareData = { title: data.title, url };
    if (navigator.share && navigator.canShare?.(shareData)) {
      try {
        await navigator.share(shareData);
        showToast('Đã chia sẻ!');
      } catch (err) {
        if ((err as Error).name !== 'AbortError') {
          await copyToClipboard();
        }
      }
    } else {
      await copyToClipboard();
    }
    setShareOpen(false);
  }, [data.title, showToast, copyToClipboard]);

  const shareUrl = typeof window !== 'undefined' ? encodeURIComponent(window.location.href) : '';
  const shareTitle = encodeURIComponent(data.title);
  const zaloShareUrl = `https://zalo.me/share?link=${shareUrl}&title=${shareTitle}`;
  const facebookShareUrl = `https://www.facebook.com/sharer/sharer.php?u=${shareUrl}`;

  useEffect(() => {
    function closeShare(e: MouseEvent) {
      if (shareRef.current && !shareRef.current.contains(e.target as Node)) {
        setShareOpen(false);
      }
    }
    if (shareOpen) {
      document.addEventListener('click', closeShare);
      return () => document.removeEventListener('click', closeShare);
    }
  }, [shareOpen]);

  const triggerLikeWithAnimation = useCallback(
    (clientX: number, clientY: number) => {
      if (!isAuthenticated) {
        window.location.href = `/login?redirect=/spotlight/${data.id}`;
        return;
      }
      if (liked) return;
      setHearts((prev) => [...prev.slice(-4), { id: Date.now(), x: clientX, y: clientY }]);
      setLikeAnimating(true);
      setTimeout(() => setLikeAnimating(false), 600);
      api.post(API_ENDPOINTS.SPOTLIGHT.LIKE(data.id)).then(
        () => {
          setLiked(true);
          setLikesCount((c) => c + 1);
        },
        () => {},
      );
    },
    [data.id, isAuthenticated, liked],
  );

  const handleVideoDoubleTap = useCallback(
    (e: React.MouseEvent) => {
      const now = Date.now();
      if (now - lastTapRef.current < 400) {
        lastTapRef.current = 0;
        triggerLikeWithAnimation(e.clientX, e.clientY);
      } else {
        lastTapRef.current = now;
      }
    },
    [triggerLikeWithAnimation],
  );

  const handleComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isAuthenticated) {
      window.location.href = `/login?redirect=/spotlight/${data.id}`;
      return;
    }
    if (!commentText.trim()) {
      setCommentError('Vui lòng nhập nội dung bình luận');
      return;
    }
    setSubmitting(true);
    setCommentError('');
    try {
      const newComment = await api.post<{
        id: string;
        body: string;
        likes: number;
        createdAt: string;
        user?: { id: string; firstName?: string; lastName?: string; avatar_url?: string | null };
      }>(API_ENDPOINTS.SPOTLIGHT.COMMENT(data.id), {
        content: commentText.trim(),
      });
      setComments((prev) => [newComment, ...prev]);
      setCommentCount((c) => c + 1);
      setCommentText('');
    } catch (err) {
      setCommentError(err instanceof Error ? err.message : 'Gửi thất bại');
    } finally {
      setSubmitting(false);
    }
  };

  const handleCtaClick = async (cta: { id: string; target_url?: string | null }) => {
    try {
      await api.post(API_ENDPOINTS.SPOTLIGHT.LINK_CLICK(data.id), {
        ctaButtonId: cta.id,
      });
    } catch {
      // ignore tracking error
    }
    if (cta.target_url) {
      window.open(cta.target_url, '_blank');
    }
  };

  const videoUrl = data.videoUrl || data.video_url;
  const videoSource = data.videoSource || data.video_source;
  const embedUrl =
    videoUrl && videoSource
      ? getEmbedUrl(videoUrl, videoSource)
      : null;

  const creatorName =
    data.creator?.user
      ? `${data.creator.user.firstName || ''} ${data.creator.user.lastName || ''}`.trim() ||
        data.creator.display_name ||
        'Creator'
      : data.creator?.display_name || 'Creator';

  return (
    <article>
      {/* Video embed - double-tap to like */}
      <div
        className="relative overflow-hidden rounded-xl border bg-black select-none cursor-pointer"
        onDoubleClick={handleVideoDoubleTap}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => e.key === 'Enter' && (e.target as HTMLElement).click()}
      >
        {embedUrl ? (
          <iframe
            src={embedUrl}
            title={data.title}
            className="aspect-video w-full"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        ) : (
          <div className="aspect-video flex items-center justify-center bg-muted">
            <img
              src={
                data.thumbnailUrl ||
                (data as { thumbnail_url?: string }).thumbnail_url ||
                data.cover_image_url ||
                'https://placehold.co/640x360/1a1a2e/eee?text=Video'
              }
              alt={data.title}
              className="h-full w-full object-contain"
            />
          </div>
        )}
        {/* Hint - pointer-events-none để không chặn click vào video */}
        <div
          className="absolute bottom-2 left-0 right-0 z-10 pointer-events-none text-center"
          aria-hidden
        >
          <span className="rounded bg-black/50 px-2 py-1 text-xs text-white/80">
            Double-tap để thích
          </span>
        </div>
        {/* Floating hearts - fixed để hiện đúng vị trí tap */}
        {hearts.map((h) => (
          <FloatingHeart key={h.id} x={h.x} y={h.y} onDone={() => setHearts((p) => p.filter((x) => x.id !== h.id))} />
        ))}
      </div>

      {/* Meta */}
      <div className="mt-6 flex flex-wrap gap-4 text-sm text-muted-foreground">
        {data.redcomment_regions?.length ? (
          <span>
            {data.redcomment_regions.map((rr) => rr.region.name).join(', ')}
          </span>
        ) : null}
        {data.spotlight_category ? (
          <span className="rounded-full bg-purple-100 px-2 py-0.5 text-purple-700 dark:bg-purple-900 dark:text-purple-300">
            {data.spotlight_category.name}
          </span>
        ) : null}
        <span>{(Number(data.views) || 0).toLocaleString('vi-VN')} lượt xem</span>
        <span>
          {new Date(data.createdAt).toLocaleDateString('vi-VN', {
            day: 'numeric',
            month: 'long',
            year: 'numeric',
          })}
        </span>
      </div>

      <h1 className="mt-4 font-heading text-2xl font-bold md:text-3xl">
        {data.title}
      </h1>

      {data.description ? (
        <p className="mt-2 whitespace-pre-wrap text-muted-foreground">
          {data.description}
        </p>
      ) : null}

      {/* Hashtags (Phase 2.3 - clickable) */}
      {((data.target_tags?.length || 0) + (data.seo_keywords?.length || 0)) > 0 ? (
        <div className="mt-4 flex flex-wrap gap-2">
          {[...new Set([...(data.target_tags || []), ...(data.seo_keywords || [])])]
            .filter(Boolean)
            .map((tag) => (
              <Link
                key={tag}
                href={`/spotlight?tag=${encodeURIComponent(tag)}`}
                className="rounded-full bg-purple-100 px-3 py-1 text-sm text-purple-700 transition-colors hover:bg-purple-200 dark:bg-purple-900/50 dark:text-purple-300 dark:hover:bg-purple-900"
              >
                #{tag}
              </Link>
            ))}
        </div>
      ) : null}

      {/* Creator */}
      <div className="mt-6">
        {data.creator?.id ? (
          <div className="flex flex-wrap items-center justify-between gap-3">
            <Link
              href={`/spotlight/creator/${data.creator.id}`}
              className="flex items-center gap-3 rounded-lg transition-colors hover:bg-muted/50"
            >
              <div className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-full bg-gradient-to-br from-purple-600 to-pink-600 text-lg font-semibold text-white">
                {data.creator?.user?.avatar_url ? (
                  <img
                    src={data.creator.user.avatar_url}
                    alt={creatorName}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  creatorName[0]?.toUpperCase() || 'C'
                )}
              </div>
              <div>
                <p className="font-medium">{creatorName}</p>
                <p className="text-sm text-muted-foreground">
                  {followerCount.toLocaleString('vi-VN')} theo dõi
                </p>
              </div>
            </Link>
            {isAuthenticated && (
              <button
                type="button"
                onClick={handleFollow}
                disabled={followLoading}
                className={`shrink-0 rounded-lg px-4 py-2 font-semibold transition-all disabled:opacity-50 ${
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
            )}
          </div>
        ) : (
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center overflow-hidden rounded-full bg-gradient-to-br from-purple-600 to-pink-600 text-lg font-semibold text-white">
              {creatorName[0]?.toUpperCase() || 'C'}
            </div>
            <div>
              <p className="font-medium">{creatorName}</p>
            </div>
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="mt-6 flex flex-wrap gap-3">
        <button
          type="button"
          onClick={handleLike}
          disabled={liked}
          className={`flex items-center gap-2 rounded-lg px-4 py-2 transition-all duration-300 ${
            liked
              ? 'bg-pink-100 text-pink-700 dark:bg-pink-900 dark:text-pink-300 scale-105'
              : 'bg-muted hover:bg-muted/80 hover:scale-105 active:scale-95'
          } ${likeAnimating ? 'animate-bounce' : ''}`}
        >
          <span className={likeAnimating ? 'animate-pulse' : ''}>❤️</span>
          <span>{likesCount.toLocaleString('vi-VN')} thích</span>
        </button>
        <button
          type="button"
          onClick={handleSave}
          disabled={saving}
          className={`flex items-center gap-2 rounded-lg px-4 py-2 transition-colors ${
            saved
              ? 'bg-amber-100 text-amber-700 dark:bg-amber-900 dark:text-amber-300'
              : 'bg-muted hover:bg-muted/80'
          }`}
        >
          <span>{saved ? '📁' : '📂'}</span>
          <span>{saved ? 'Đã lưu' : 'Lưu video'}</span>
        </button>
        <div className="relative" ref={shareRef}>
          <button
            type="button"
            onClick={() => setShareOpen((o) => !o)}
            className="flex items-center gap-2 rounded-lg bg-muted px-4 py-2 transition-colors hover:bg-muted/80"
          >
            <span>↗️</span>
            <span>Chia sẻ</span>
          </button>
          {shareOpen ? (
            <div className="absolute left-0 top-full z-20 mt-1 min-w-[180px] rounded-lg border bg-background py-1 shadow-lg">
              <button
                type="button"
                className="flex w-full items-center gap-2 px-4 py-2 text-left text-sm hover:bg-muted/80"
                onClick={copyToClipboard}
              >
                <span>📋</span>
                Copy link
              </button>
              <a
                href={zaloShareUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex w-full items-center gap-2 px-4 py-2 text-left text-sm hover:bg-muted/80"
                onClick={() => setShareOpen(false)}
              >
                <span>💬</span>
                Chia sẻ Zalo
              </a>
              <a
                href={facebookShareUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex w-full items-center gap-2 px-4 py-2 text-left text-sm hover:bg-muted/80"
                onClick={() => setShareOpen(false)}
              >
                <span>📘</span>
                Chia sẻ Facebook
              </a>
              {typeof navigator !== 'undefined' && navigator.share ? (
                <button
                  type="button"
                  className="flex w-full items-center gap-2 px-4 py-2 text-left text-sm hover:bg-muted/80"
                  onClick={handleShareNative}
                >
                  <span>↗️</span>
                  Chia sẻ (ứng dụng)
                </button>
              ) : null}
            </div>
          ) : null}
        </div>
      </div>

      {/* 🛒 Mua sản phẩm - CTA buttons */}
      {data.cta_buttons && data.cta_buttons.length > 0 ? (
        <div className="mt-6 rounded-xl border border-purple-200 bg-purple-50/50 p-4 dark:border-purple-800 dark:bg-purple-950/30">
          <div className="mb-3 flex items-center gap-2 text-purple-700 dark:text-purple-300">
            <span className="text-xl">🛒</span>
            <span className="font-semibold">Mua sản phẩm</span>
          </div>
          <div className="flex flex-wrap gap-3">
          {data.cta_buttons.map((cta) => (
            <a
              key={cta.id}
              href={cta.target_url || '#'}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => {
                e.preventDefault();
                handleCtaClick(cta);
              }}
              className="inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-purple-600 to-pink-600 px-4 py-2.5 font-semibold text-white transition-all hover:shadow-lg hover:scale-105"
            >
              {cta.text}
              {cta.price_display ? (
                <span className="text-sm opacity-90">({cta.price_display})</span>
              ) : null}
            </a>
          ))}
          </div>
        </div>
      ) : null}

      {/* Video liên quan (Phase 2.3) */}
      {relatedVideos.length > 0 ? (
        <section className="mt-12 border-t pt-8">
          <h2 className="text-xl font-semibold">Video liên quan</h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {relatedVideos.map((v) => (
              <Link
                key={v.id}
                href={`/spotlight/${v.id}`}
                className="group overflow-hidden rounded-xl border bg-card transition-all hover:shadow-lg"
              >
                <div className="relative aspect-video overflow-hidden bg-muted">
                  <img
                    src={
                      v.thumbnailUrl ||
                      (v as { thumbnail_url?: string }).thumbnail_url ||
                      v.cover_image_url ||
                      'https://placehold.co/640x360/1a1a2e/eee?text=Video'
                    }
                    alt={v.title}
                    className="h-full w-full object-cover transition-transform group-hover:scale-105"
                  />
                </div>
                <div className="p-3">
                  <h3 className="line-clamp-2 text-sm font-semibold group-hover:text-primary">
                    {v.title}
                  </h3>
                  <p className="mt-1 text-xs text-muted-foreground">
                    {(Number(v.views) || 0).toLocaleString('vi-VN')} lượt xem •{' '}
                    {(Number(v.likes) || 0).toLocaleString('vi-VN')} thích
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </section>
      ) : null}

      {/* Comments */}
      <section className="mt-12 border-t pt-8">
        <h2 className="text-xl font-semibold">
          {commentCount} bình luận
        </h2>

        {isAuthenticated ? (
          <form onSubmit={handleComment} className="mt-4">
            <textarea
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              placeholder="Viết bình luận..."
              className="w-full rounded-lg border bg-background px-4 py-3"
              rows={3}
              maxLength={1000}
            />
            {commentError ? (
              <p className="mt-1 text-sm text-destructive">{commentError}</p>
            ) : null}
            <button
              type="submit"
              disabled={submitting}
              className="mt-2 rounded-lg bg-purple-600 px-4 py-2 font-medium text-white disabled:opacity-50"
            >
              {submitting ? 'Đang gửi...' : 'Gửi bình luận'}
            </button>
          </form>
        ) : (
          <p className="mt-4 text-muted-foreground">
            <Link href={`/login?redirect=/spotlight/${data.id}`} className="text-primary underline">
              Đăng nhập
            </Link>{' '}
            để bình luận
          </p>
        )}

        <div className="mt-8 space-y-4">
          {comments.map((c) => (
            <div key={c.id} className="flex gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-full bg-muted text-sm font-medium">
                {c.user?.avatar_url ? (
                  <img
                    src={c.user.avatar_url}
                    alt=""
                    className="h-full w-full object-cover"
                  />
                ) : (
                  `${(c.user?.firstName || 'U')[0]}`.toUpperCase()
                )}
              </div>
              <div>
                <p className="font-medium">
                  {c.user
                    ? `${c.user.firstName || ''} ${c.user.lastName || ''}`.trim() || 'User'
                    : 'User'}
                </p>
                <p className="text-sm text-muted-foreground">
                  {new Date(c.createdAt).toLocaleDateString('vi-VN')}
                </p>
                <p className="mt-1">{c.body}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {toastMessage ? (
        <CopyToast message={toastMessage} onDone={() => setToastMessage(null)} />
      ) : null}
    </article>
  );
}
