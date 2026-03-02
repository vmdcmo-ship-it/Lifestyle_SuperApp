'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { contentService } from '@/lib/content.service';
import type { ContentDetail } from '@/lib/content.service';
import { toast } from '@/lib/toast';
import { RichTextEditor } from '@/components/RichTextEditor';
import { ArticlePreview } from '@/components/ArticlePreview';

const TARGET_APPS_OPTIONS = [
  { value: 'ALL', label: 'Tất cả app (User, Driver, Merchant)' },
  { value: 'USER', label: 'Chỉ App User (Hành khách)' },
  { value: 'DRIVER', label: 'Chỉ App Tài xế' },
  { value: 'MERCHANT', label: 'Chỉ App Cửa hàng' },
  { value: 'USER,DRIVER', label: 'App User + App Tài xế' },
  { value: 'USER,MERCHANT', label: 'App User + App Cửa hàng' },
  { value: 'DRIVER,MERCHANT', label: 'App Tài xế + App Cửa hàng' },
];

export default function EditContentPage(): JSX.Element {
  const params = useParams();
  const router = useRouter();
  const id = params?.id as string;

  const [item, setItem] = useState<ContentDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [effectiveFrom, setEffectiveFrom] = useState('');
  const [effectiveTo, setEffectiveTo] = useState('');
  const [isActive, setIsActive] = useState(true);
  const [targetApps, setTargetApps] = useState('ALL');
  const [submitting, setSubmitting] = useState(false);
  const [showPreview, setShowPreview] = useState(false);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    setError('');
    contentService
      .getById(id)
      .then((data) => {
        setItem(data);
        setTitle(data.title);
        setContent(data.content);
        setEffectiveFrom(
          data.effectiveFrom ? new Date(data.effectiveFrom).toISOString().slice(0, 16) : '',
        );
        setEffectiveTo(
          data.effectiveTo ? new Date(data.effectiveTo).toISOString().slice(0, 16) : '',
        );
        setIsActive(data.isActive);
        setTargetApps(data.targetApps || 'ALL');
      })
      .catch((err) => setError((err as Error).message || 'Không thể tải văn bản'))
      .finally(() => setLoading(false));
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id) return;
    setError('');
    setSubmitting(true);
    try {
      await contentService.update(id, {
        title,
        content,
        effectiveFrom: effectiveFrom ? new Date(effectiveFrom).toISOString() : undefined,
        effectiveTo: effectiveTo ? new Date(effectiveTo).toISOString() : undefined,
        isActive,
        targetApps: targetApps || undefined,
      });
      toast.success('Đã cập nhật văn bản');
      router.push('/content');
    } catch (err) {
      const msg = (err as Error).message || 'Không thể cập nhật';
      setError(msg);
      toast.error(msg);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12 text-muted-foreground">
        Đang tải...
      </div>
    );
  }

  if (error && !item) {
    return (
      <div>
        <Link href="/content" className="mb-4 inline-block text-sm text-primary hover:underline">
          ← Quay lại danh sách
        </Link>
        <div className="rounded-lg bg-destructive/10 p-4 text-destructive">{error}</div>
      </div>
    );
  }

  return (
    <div>
      <Link href="/content" className="mb-4 inline-block text-sm text-primary hover:underline">
        ← Quay lại danh sách
      </Link>

      <h1 className="mb-6 text-2xl font-bold">
        Chỉnh sửa văn bản
        {item && (
          <span className="ml-2 text-base font-normal text-muted-foreground">
            {item.slug} • {item.locale} • v{item.version}
          </span>
        )}
      </h1>

      {error && (
        <div className="mb-4 rounded-lg bg-destructive/10 px-4 py-3 text-sm text-destructive">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="max-w-2xl space-y-4">
        <div>
          <label className="mb-1 block text-sm font-medium">Tiêu đề</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary"
          />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium">Nội dung</label>
          <RichTextEditor
            value={content}
            onChange={setContent}
            placeholder="Nhập nội dung..."
            minHeight="280px"
          />
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-1 block text-sm font-medium">Hiệu lực từ</label>
            <input
              type="datetime-local"
              value={effectiveFrom}
              onChange={(e) => setEffectiveFrom(e.target.value)}
              className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium">Hiệu lực đến (tùy chọn)</label>
            <input
              type="datetime-local"
              value={effectiveTo}
              onChange={(e) => setEffectiveTo(e.target.value)}
              className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium">Đối tượng app hiển thị</label>
          <select
            value={targetApps}
            onChange={(e) => setTargetApps(e.target.value)}
            className="w-full max-w-xs rounded-lg border border-input bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary"
          >
            {TARGET_APPS_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            id="isActive"
            checked={isActive}
            onChange={(e) => setIsActive(e.target.checked)}
            className="h-4 w-4 rounded border-input"
          />
          <label htmlFor="isActive" className="text-sm">
            Kích hoạt
          </label>
        </div>

        <div className="flex flex-wrap gap-2 pt-4">
          <button
            type="submit"
            disabled={submitting}
            className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
          >
            {submitting ? 'Đang lưu...' : 'Lưu thay đổi'}
          </button>
          <button
            type="button"
            onClick={() => setShowPreview(true)}
            className="rounded-lg border px-4 py-2 text-sm font-medium hover:bg-muted"
          >
            Xem trước
          </button>
          <Link
            href="/content"
            className="rounded-lg border px-4 py-2 text-sm font-medium hover:bg-muted"
          >
            Hủy
          </Link>
        </div>
        {showPreview && (
          <ArticlePreview title={title} content={content} onClose={() => setShowPreview(false)} />
        )}
      </form>
    </div>
  );
}
