'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { contentService } from '@/lib/content.service';
import { toast } from '@/lib/toast';
import { RichTextEditor } from '@/components/RichTextEditor';
import { ArticlePreview } from '@/components/ArticlePreview';

const SLUG_OPTIONS = [
  { value: 'privacy-policy', label: 'Chính sách bảo mật' },
  { value: 'terms-of-service', label: 'Điều khoản dịch vụ & Quyền sử dụng' },
  { value: 'terms-of-use', label: 'Quy chế hoạt động' },
  { value: 'terms-driver', label: 'Điều khoản tài xế' },
  { value: 'terms-merchant', label: 'Điều khoản cửa hàng' },
  { value: 'faq', label: 'FAQ' },
];

const TARGET_APPS_OPTIONS = [
  { value: 'ALL', label: 'Tất cả app (User, Driver, Merchant)' },
  { value: 'USER', label: 'Chỉ App User (Hành khách)' },
  { value: 'DRIVER', label: 'Chỉ App Tài xế' },
  { value: 'MERCHANT', label: 'Chỉ App Cửa hàng' },
  { value: 'USER,DRIVER', label: 'App User + App Tài xế' },
  { value: 'USER,MERCHANT', label: 'App User + App Cửa hàng' },
  { value: 'DRIVER,MERCHANT', label: 'App Tài xế + App Cửa hàng' },
];

export default function NewContentPage(): JSX.Element {
  const router = useRouter();
  const [slug, setSlug] = useState('privacy-policy');
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [locale, setLocale] = useState('vi');
  const [effectiveFrom, setEffectiveFrom] = useState(() => {
    const d = new Date();
    return d.toISOString().slice(0, 16);
  });
  const [effectiveTo, setEffectiveTo] = useState('');
  const [isActive, setIsActive] = useState(true);
  const [targetApps, setTargetApps] = useState('ALL');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [showPreview, setShowPreview] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    try {
      const payload = {
        slug,
        locale,
        title,
        content,
        effectiveFrom: new Date(effectiveFrom).toISOString(),
        effectiveTo: effectiveTo ? new Date(effectiveTo).toISOString() : undefined,
        isActive,
        targetApps: targetApps || undefined,
      };
      const created = await contentService.create(payload);
      toast.success('Đã tạo văn bản thành công');
      router.push(`/content/${created.id}`);
    } catch (err) {
      const msg = (err as Error).message || 'Không thể tạo văn bản';
      setError(msg);
      toast.error(msg);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div>
      <Link href="/content" className="mb-4 inline-block text-sm text-primary hover:underline">
        ← Quay lại danh sách
      </Link>

      <h1 className="mb-6 text-2xl font-bold">Thêm văn bản mới</h1>

      {error && (
        <div className="mb-4 rounded-lg bg-destructive/10 px-4 py-3 text-sm text-destructive">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="max-w-2xl space-y-4">
        <div>
          <label className="mb-1 block text-sm font-medium">Slug</label>
          <select
            value={slug}
            onChange={(e) => setSlug(e.target.value)}
            required
            className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary"
          >
            {SLUG_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium">Ngôn ngữ</label>
          <select
            value={locale}
            onChange={(e) => setLocale(e.target.value)}
            className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary"
          >
            <option value="vi">Tiếng Việt</option>
            <option value="en">English</option>
          </select>
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium">Tiêu đề</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary"
            placeholder="VD: Chính sách bảo mật"
          />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium">Nội dung</label>
          <RichTextEditor
            value={content}
            onChange={setContent}
            placeholder="Nhập nội dung văn bản..."
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
              required
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
          <p className="mt-1 text-xs text-muted-foreground">
            App User/Driver/Merchant lấy link qua API public/links theo audience
          </p>
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
            {submitting ? 'Đang tạo...' : 'Tạo văn bản'}
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
