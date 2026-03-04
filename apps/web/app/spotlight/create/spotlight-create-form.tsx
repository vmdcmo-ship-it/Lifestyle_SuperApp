'use client';

import { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/lib/contexts/auth-context';
import { api } from '@/lib/api/api';
import { API_ENDPOINTS } from '@/lib/config/api';

function getVideoPreview(videoUrl: string): { embedUrl: string | null; thumbnail: string; source: 'youtube' | 'facebook' | null } {
  const u = videoUrl.trim();
  if (!u) return { embedUrl: null, thumbnail: 'https://placehold.co/640x360/1a1a2e/eee?text=Video', source: null };
  if (/youtube\.com|youtu\.be/i.test(u)) {
    const m1 = u.match(/[?&]v=([^&]+)/);
    const m2 = u.match(/youtu\.be\/([^?]+)/);
    const m3 = u.match(/youtube\.com\/embed\/([^?]+)/);
    const videoId = m1?.[1] || m2?.[1] || m3?.[1] || '';
    if (!videoId) return { embedUrl: null, thumbnail: 'https://placehold.co/640x360/1a1a2e/eee?text=YouTube', source: 'youtube' };
    return {
      embedUrl: `https://www.youtube.com/embed/${videoId}?rel=0`,
      thumbnail: `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`,
      source: 'youtube',
    };
  }
  if (/facebook\.com|fb\.watch|fb\.reel|fb\.com/i.test(u)) {
    const encoded = encodeURIComponent(u);
    return {
      embedUrl: `https://www.facebook.com/plugins/video.php?href=${encoded}&show_text=false`,
      thumbnail: 'https://placehold.co/640x360/1a1a2e/eee?text=Facebook+Video',
      source: 'facebook',
    };
  }
  return { embedUrl: null, thumbnail: 'https://placehold.co/640x360/1a1a2e/eee?text=Video', source: null };
}

const TARGET_TYPES = [
  { value: 'TRAVEL', label: 'Du lịch' },
  { value: 'FOOD', label: 'Ẩm thực' },
  { value: 'CAFE', label: 'Cà phê' },
  { value: 'HOTEL', label: 'Khách sạn' },
  { value: 'EXPERIENCE', label: 'Trải nghiệm' },
  { value: 'RESTAURANT', label: 'Nhà hàng' },
  { value: 'PRODUCT', label: 'Sản phẩm' },
  { value: 'EVENT', label: 'Sự kiện' },
];

interface CtaLink {
  text: string;
  url: string;
  linkType: 'INTERNAL' | 'AFFILIATE';
  priceDisplay: string;
}

interface SpotlightCreateFormProps {
  categories: { id: string; slug: string; name: string }[];
  locations: { id: string; code: string; name: string }[];
}

export function SpotlightCreateForm({
  categories,
  locations,
}: SpotlightCreateFormProps): JSX.Element {
  const router = useRouter();
  const { isAuthenticated, isLoading } = useAuth();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [suggestLoading, setSuggestLoading] = useState(false);
  const [suggestError, setSuggestError] = useState('');
  const [form, setForm] = useState({
    title: '',
    description: '',
    videoUrl: '',
    targetType: 'TRAVEL' as string,
    categorySlug: '',
    regionIds: [] as string[],
    tags: '',
    videoDuration: '',
    ctaLinks: [] as CtaLink[],
  });

  if (!isLoading && !isAuthenticated) {
    return (
      <div className="mt-8 rounded-lg border border-amber-200 bg-amber-50 p-6 dark:border-amber-800 dark:bg-amber-950/30">
        <p className="font-medium text-amber-800 dark:text-amber-200">
          Bạn cần đăng nhập để đăng video
        </p>
        <Link
          href={`/login?redirect=/spotlight/create`}
          className="mt-4 inline-block rounded-lg bg-amber-600 px-4 py-2 font-medium text-white hover:bg-amber-700"
        >
          Đăng nhập ngay
        </Link>
      </div>
    );
  }

  const updateForm = (updates: Partial<typeof form>) => {
    setForm((prev) => ({ ...prev, ...updates }));
    setError('');
  };

  const addCtaLink = () => {
    if (form.ctaLinks.length >= 5) return;
    updateForm({
      ctaLinks: [...form.ctaLinks, { text: '', url: '', linkType: 'INTERNAL', priceDisplay: '' }],
    });
  };

  const removeCtaLink = (idx: number) => {
    updateForm({
      ctaLinks: form.ctaLinks.filter((_, i) => i !== idx),
    });
  };

  const updateCtaLink = (idx: number, updates: Partial<CtaLink>) => {
    const next = [...form.ctaLinks];
    next[idx] = { ...next[idx], ...updates };
    updateForm({ ctaLinks: next });
  };

  const fetchSuggest = useCallback(async () => {
    setSuggestLoading(true);
    setSuggestError('');
    try {
      const category = categories.find((c) => c.slug === form.categorySlug);
      const regionNames = form.regionIds
        .map((id) => locations.find((r) => r.id === id)?.name)
        .filter(Boolean) as string[];
      const res = await fetch('/api/spotlight/suggest', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: form.title,
          description: form.description || undefined,
          tags: form.tags || undefined,
          targetType: form.targetType,
          categorySlug: form.categorySlug || undefined,
          regionNames,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Gợi ý thất bại');
      }
      return data as { descriptions: string[]; keywords: string[] };
    } catch (err) {
      setSuggestError(err instanceof Error ? err.message : 'Gợi ý thất bại');
      return null;
    } finally {
      setSuggestLoading(false);
    }
  }, [
    form.title,
    form.description,
    form.tags,
    form.categorySlug,
    form.regionIds,
    categories,
    locations,
  ]);

  const handleSuggestDescription = async () => {
    const data = await fetchSuggest();
    if (!data?.descriptions?.length) return;
    if (data.descriptions.length === 1) {
      updateForm({ description: data.descriptions[0] });
    } else {
      const chosen = data.descriptions[0];
      updateForm({ description: chosen });
    }
  };

  const handleSuggestKeywords = async () => {
    const data = await fetchSuggest();
    if (!data?.keywords?.length) return;
    const existing = form.tags
      .split(',')
      .map((t) => t.trim().toLowerCase())
      .filter(Boolean);
    const newKeys = data.keywords.filter(
      (k) => !existing.includes(k.trim().toLowerCase())
    );
    const merged = [...new Set([...existing, ...newKeys])].join(', ');
    updateForm({ tags: merged });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!form.title.trim()) {
      setError('Vui lòng nhập tiêu đề');
      return;
    }
    if (!form.videoUrl.trim()) {
      setError('Vui lòng nhập link video YouTube hoặc Facebook');
      return;
    }

    const validUrl =
      /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be|facebook\.com|fb\.watch|fb\.reel|fb\.com)\/.+/i;
    if (!validUrl.test(form.videoUrl.trim())) {
      setError('Link phải là YouTube (youtube.com, youtu.be) hoặc Facebook');
      return;
    }

    const ctaPayload = form.ctaLinks
      .filter((c) => c.text.trim() && c.url.trim())
      .map((c) => ({
        text: c.text.trim(),
        url: c.url.trim(),
        linkType: c.linkType,
        priceDisplay: c.priceDisplay.trim() || undefined,
      }));

    setSubmitting(true);
    try {
      const res = await api.post<{ id: string; redcommentNumber: string; seoSlug: string }>(
        API_ENDPOINTS.SPOTLIGHT.CREATE_POST,
        {
          title: form.title.trim(),
          description: form.description.trim() || undefined,
          videoUrl: form.videoUrl.trim(),
          format: 'VIDEO_REEL',
          targetType: form.targetType,
          categorySlug: form.categorySlug || undefined,
          regionIds: form.regionIds.length ? form.regionIds : undefined,
          tags: form.tags
            .split(',')
            .map((t) => t.trim())
            .filter(Boolean),
          videoDuration: form.videoDuration ? parseInt(form.videoDuration, 10) : undefined,
          ctaLinks: ctaPayload.length ? ctaPayload : undefined,
        },
      );
      router.push(`/spotlight/${res.id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Đăng video thất bại');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mt-8 space-y-6">
      {error ? (
        <div className="rounded-lg border border-destructive/50 bg-destructive/10 px-4 py-3 text-destructive">
          {error}
        </div>
      ) : null}

      <div>
        <label htmlFor="title" className="block text-sm font-medium">
          Tiêu đề *
        </label>
        <input
          id="title"
          type="text"
          value={form.title}
          onChange={(e) => updateForm({ title: e.target.value })}
          maxLength={300}
          placeholder="VD: Top 5 quán café view đẹp Đà Lạt"
          className="mt-1 w-full rounded-lg border bg-background px-4 py-2.5"
          required
        />
      </div>

      <div>
        <label htmlFor="videoUrl" className="block text-sm font-medium">
          Link video (YouTube hoặc Facebook) *
        </label>
        <input
          id="videoUrl"
          type="url"
          value={form.videoUrl}
          onChange={(e) => updateForm({ videoUrl: e.target.value })}
          placeholder="https://www.youtube.com/watch?v=... hoặc https://fb.watch/..."
          className="mt-1 w-full rounded-lg border bg-background px-4 py-2.5"
          required
        />
      </div>

      <div>
        <div className="flex items-center justify-between gap-2">
          <label htmlFor="description" className="block text-sm font-medium">
            Mô tả
          </label>
          <button
            type="button"
            onClick={handleSuggestDescription}
            disabled={suggestLoading}
            className="shrink-0 rounded-lg border border-purple-300 bg-purple-50 px-3 py-1.5 text-sm font-medium text-purple-700 transition-colors hover:bg-purple-100 disabled:opacity-50 dark:border-purple-700 dark:bg-purple-950/40 dark:text-purple-300 dark:hover:bg-purple-900/40"
          >
            {suggestLoading ? 'Đang gợi ý...' : '✨ Gợi ý mô tả'}
          </button>
        </div>
        <textarea
          id="description"
          value={form.description}
          onChange={(e) => updateForm({ description: e.target.value })}
          maxLength={2000}
          rows={4}
          placeholder="Mô tả ngắn gọn về video (hook thu hút → ấn tượng → độc đáo → di sản)..."
          className="mt-1 w-full rounded-lg border bg-background px-4 py-2.5"
        />
        {suggestError ? (
          <p className="mt-1 text-xs text-destructive">{suggestError}</p>
        ) : null}
      </div>

      <div>
        <label htmlFor="targetType" className="block text-sm font-medium">
          Thể loại đích
        </label>
        <select
          id="targetType"
          value={form.targetType}
          onChange={(e) => updateForm({ targetType: e.target.value })}
          className="mt-1 w-full rounded-lg border bg-background px-4 py-2.5"
        >
          {TARGET_TYPES.map((t) => (
            <option key={t.value} value={t.value}>
              {t.label}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor="categorySlug" className="block text-sm font-medium">
          Danh mục Spotlight
        </label>
        <select
          id="categorySlug"
          value={form.categorySlug}
          onChange={(e) => updateForm({ categorySlug: e.target.value })}
          className="mt-1 w-full rounded-lg border bg-background px-4 py-2.5"
        >
          <option value="">-- Chọn danh mục --</option>
          {categories.map((c) => (
            <option key={c.id} value={c.slug}>
              {c.name}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium">
          Địa điểm (tối đa 5)
        </label>
        <select
          multiple
          value={form.regionIds}
          onChange={(e) => {
            const selected = Array.from(e.target.selectedOptions, (o) => o.value);
            updateForm({ regionIds: selected.slice(0, 5) });
          }}
          className="mt-1 w-full rounded-lg border bg-background px-4 py-2.5"
          size={5}
        >
          {locations.map((r) => (
            <option key={r.id} value={r.id}>
              {r.name}
            </option>
          ))}
        </select>
        <p className="mt-1 text-xs text-muted-foreground">
          Giữ Ctrl (Windows) hoặc Cmd (Mac) để chọn nhiều
        </p>
      </div>

      <div>
        <div className="flex items-center justify-between gap-2">
          <label htmlFor="tags" className="block text-sm font-medium">
            Tags (phân cách bằng dấu phẩy)
          </label>
          <button
            type="button"
            onClick={handleSuggestKeywords}
            disabled={suggestLoading}
            className="shrink-0 rounded-lg border border-purple-300 bg-purple-50 px-3 py-1.5 text-sm font-medium text-purple-700 transition-colors hover:bg-purple-100 disabled:opacity-50 dark:border-purple-700 dark:bg-purple-950/40 dark:text-purple-300 dark:hover:bg-purple-900/40"
          >
            {suggestLoading ? 'Đang gợi ý...' : '🏷️ Gợi ý từ khóa'}
          </button>
        </div>
        <input
          id="tags"
          type="text"
          value={form.tags}
          onChange={(e) => updateForm({ tags: e.target.value })}
          placeholder="cafe, dalat, review"
          className="mt-1 w-full rounded-lg border bg-background px-4 py-2.5"
        />
      </div>

      <div>
        <label htmlFor="videoDuration" className="block text-sm font-medium">
          Thời lượng video (giây)
        </label>
        <input
          id="videoDuration"
          type="number"
          min={1}
          max={600}
          value={form.videoDuration}
          onChange={(e) => updateForm({ videoDuration: e.target.value })}
          placeholder="120"
          className="mt-1 w-full rounded-lg border bg-background px-4 py-2.5"
        />
      </div>

      {/* CTA Links */}
      <div>
        <div className="flex items-center justify-between">
          <label className="block text-sm font-medium">
            Link CTA (tối đa 5)
          </label>
          <button
            type="button"
            onClick={addCtaLink}
            disabled={form.ctaLinks.length >= 5}
            className="text-sm text-primary hover:underline disabled:opacity-50"
          >
            + Thêm link
          </button>
        </div>

        {form.ctaLinks.map((cta, idx) => (
          <div key={idx} className="mt-3 flex flex-col gap-2 rounded-lg border p-4">
            <div className="flex justify-between">
              <span className="text-sm font-medium">Link {idx + 1}</span>
              <button
                type="button"
                onClick={() => removeCtaLink(idx)}
                className="text-sm text-destructive hover:underline"
              >
                Xóa
              </button>
            </div>
            <input
              type="text"
              placeholder="Text hiển thị (VD: Đặt phòng từ 1.290.000đ)"
              value={cta.text}
              onChange={(e) => updateCtaLink(idx, { text: e.target.value })}
              className="rounded-lg border bg-background px-3 py-2 text-sm"
            />
            <input
              type="url"
              placeholder="URL"
              value={cta.url}
              onChange={(e) => updateCtaLink(idx, { url: e.target.value })}
              className="rounded-lg border bg-background px-3 py-2 text-sm"
            />
            <div className="flex gap-4">
              <select
                value={cta.linkType}
                onChange={(e) =>
                  updateCtaLink(idx, { linkType: e.target.value as 'INTERNAL' | 'AFFILIATE' })
                }
                className="rounded-lg border bg-background px-3 py-2 text-sm"
              >
                <option value="INTERNAL">Nội bộ</option>
                <option value="AFFILIATE">Affiliate</option>
              </select>
              <input
                type="text"
                placeholder="Giá hiển thị (VD: 1.290.000đ)"
                value={cta.priceDisplay}
                onChange={(e) => updateCtaLink(idx, { priceDisplay: e.target.value })}
                className="flex-1 rounded-lg border bg-background px-3 py-2 text-sm"
              />
            </div>
          </div>
        ))}
      </div>

      {/* F2: Preview trước khi đăng */}
      {(form.videoUrl.trim() || form.title.trim()) && (
        <div className="rounded-xl border-2 border-dashed border-purple-300 bg-purple-50/50 p-6 dark:border-purple-700 dark:bg-purple-950/20">
          <h3 className="mb-4 flex items-center gap-2 font-semibold text-purple-800 dark:text-purple-200">
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
            Xem trước bài đăng
          </h3>
          <div className="overflow-hidden rounded-lg border bg-card shadow-sm">
            <div className="relative aspect-video bg-muted">
              {(() => {
                const { embedUrl, thumbnail, source } = getVideoPreview(form.videoUrl);
                return embedUrl ? (
                  <iframe
                    src={embedUrl}
                    title="Preview"
                    className="h-full w-full"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope"
                    allowFullScreen
                  />
                ) : (
                  <div className="flex h-full items-center justify-center">
                    <img src={thumbnail} alt="Preview" className="h-full w-full object-cover" />
                    {source && (
                      <span className="absolute right-2 top-2 rounded bg-black/60 px-2 py-0.5 text-xs text-white">
                        {source === 'youtube' ? 'YouTube' : 'Facebook'}
                      </span>
                    )}
                  </div>
                );
              })()}
            </div>
            <div className="p-4">
              <h4 className="font-semibold text-foreground">
                {form.title.trim() || '(Chưa có tiêu đề)'}
              </h4>
              {form.description.trim() ? (
                <p className="mt-2 line-clamp-3 text-sm text-muted-foreground">
                  {form.description}
                </p>
              ) : null}
              {form.ctaLinks.some((c) => c.text.trim() && c.url.trim()) ? (
                <div className="mt-3 flex flex-wrap gap-2">
                  {form.ctaLinks
                    .filter((c) => c.text.trim() && c.url.trim())
                    .map((cta, i) => (
                      <span
                        key={i}
                        className="inline-flex items-center rounded-lg border border-purple-500/50 bg-purple-100 px-3 py-1.5 text-sm font-medium text-purple-800 dark:bg-purple-900/40 dark:text-purple-200"
                      >
                        {cta.text}
                        {cta.priceDisplay ? ` · ${cta.priceDisplay}` : ''}
                      </span>
                    ))}
                </div>
              ) : null}
            </div>
          </div>
        </div>
      )}

      <div className="flex gap-4 pt-6">
        <button
          type="submit"
          disabled={submitting}
          className="rounded-lg bg-gradient-to-r from-purple-600 to-pink-600 px-6 py-3 font-semibold text-white transition-all hover:shadow-lg disabled:opacity-50"
        >
          {submitting ? 'Đang đăng...' : 'Đăng video'}
        </button>
        <Link
          href="/spotlight"
          className="rounded-lg border px-6 py-3 font-medium transition-colors hover:bg-muted"
        >
          Hủy
        </Link>
      </div>
    </form>
  );
}
