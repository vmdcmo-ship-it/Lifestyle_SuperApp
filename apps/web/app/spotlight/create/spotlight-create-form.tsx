'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/lib/contexts/auth-context';
import { api } from '@/lib/api/api';
import { API_ENDPOINTS } from '@/lib/config/api';

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
        <label htmlFor="description" className="block text-sm font-medium">
          Mô tả
        </label>
        <textarea
          id="description"
          value={form.description}
          onChange={(e) => updateForm({ description: e.target.value })}
          maxLength={2000}
          rows={4}
          placeholder="Mô tả ngắn gọn về video..."
          className="mt-1 w-full rounded-lg border bg-background px-4 py-2.5"
        />
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
        <label htmlFor="tags" className="block text-sm font-medium">
          Tags (phân cách bằng dấu phẩy)
        </label>
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
