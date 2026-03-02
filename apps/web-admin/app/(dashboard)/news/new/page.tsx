'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { newsService } from '@/lib/news.service';
import { toast } from '@/lib/toast';
import { RichTextEditor } from '@/components/RichTextEditor';
import { ArticlePreview } from '@/components/ArticlePreview';
import { SeoPanel } from '@/components/SeoPanel';
import { FeaturedImageField } from '@/components/FeaturedImageField';

const TARGET_APPS_OPTIONS = [
  { value: 'ALL', label: 'Tất cả app' },
  { value: 'USER', label: 'App User' },
  { value: 'DRIVER', label: 'App Tài xế' },
  { value: 'MERCHANT', label: 'App Cửa hàng' },
];

function slugify(str: string): string {
  return str
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/g, 'd')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

export default function NewNewsPage(): JSX.Element {
  const router = useRouter();
  const [slug, setSlug] = useState('');
  const [title, setTitle] = useState('');
  const [excerpt, setExcerpt] = useState('');
  const [content, setContent] = useState('');
  const [featuredImage, setFeaturedImage] = useState<string | null>(null);
  const [seoTitle, setSeoTitle] = useState('');
  const [seoDescription, setSeoDescription] = useState('');
  const [targetApps, setTargetApps] = useState('ALL');
  const [isPublished, setIsPublished] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [showPreview, setShowPreview] = useState(false);

  const handleTitleChange = (v: string) => {
    setTitle(v);
    if (!slug || slug === slugify(title)) setSlug(slugify(v));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    try {
      await newsService.create({
        slug: slug || slugify(title),
        title,
        excerpt: excerpt || undefined,
        content,
        featuredImage: featuredImage || undefined,
        seoTitle: seoTitle || undefined,
        seoDescription: seoDescription || undefined,
        targetApps: targetApps || undefined,
        isPublished,
      });
      toast.success('Đã tạo tin tức');
      router.push('/news');
    } catch (err) {
      setError((err as Error).message);
      toast.error((err as Error).message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div>
      <Link href="/news" className="mb-4 inline-block text-sm text-primary hover:underline">
        ← Quay lại
      </Link>
      <h1 className="mb-6 text-2xl font-bold">Thêm tin tức</h1>
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
            onChange={(e) => handleTitleChange(e.target.value)}
            required
            className="w-full rounded-lg border border-input bg-background px-3 py-2"
          />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium">Slug (URL)</label>
          <input
            type="text"
            value={slug}
            onChange={(e) => setSlug(e.target.value)}
            className="w-full rounded-lg border border-input bg-background px-3 py-2 font-mono text-sm"
          />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium">Tóm tắt (excerpt)</label>
          <textarea
            value={excerpt}
            onChange={(e) => setExcerpt(e.target.value)}
            rows={2}
            className="w-full rounded-lg border border-input bg-background px-3 py-2"
            placeholder="Dùng cho SEO và preview"
          />
        </div>
        <FeaturedImageField value={featuredImage} onChange={setFeaturedImage} />
        <div>
          <label className="mb-1 block text-sm font-medium">Nội dung</label>
          <RichTextEditor
            value={content}
            onChange={setContent}
            placeholder="Nhập nội dung bài viết..."
            minHeight="280px"
          />
        </div>
        <SeoPanel
          seoTitle={seoTitle}
          seoDescription={seoDescription}
          onSeoTitleChange={setSeoTitle}
          onSeoDescriptionChange={setSeoDescription}
          displayTitle={title}
        />
        <div>
          <label className="mb-1 block text-sm font-medium">App hiển thị</label>
          <select
            value={targetApps}
            onChange={(e) => setTargetApps(e.target.value)}
            className="w-full max-w-xs rounded-lg border border-input bg-background px-3 py-2"
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
            id="isPub"
            checked={isPublished}
            onChange={(e) => setIsPublished(e.target.checked)}
            className="h-4 w-4 rounded"
          />
          <label htmlFor="isPub">Xuất bản ngay</label>
        </div>
        <div className="flex flex-wrap gap-2 pt-4">
          <button
            type="submit"
            disabled={submitting}
            className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
          >
            {submitting ? 'Đang tạo...' : 'Tạo tin tức'}
          </button>
          <button
            type="button"
            onClick={() => setShowPreview(true)}
            className="rounded-lg border px-4 py-2 text-sm font-medium hover:bg-muted"
          >
            Xem trước
          </button>
          <Link
            href="/news"
            className="rounded-lg border px-4 py-2 text-sm font-medium hover:bg-muted"
          >
            Hủy
          </Link>
        </div>
        {showPreview && (
          <ArticlePreview
            title={title}
            excerpt={excerpt || undefined}
            content={content}
            featuredImage={featuredImage}
            onClose={() => setShowPreview(false)}
          />
        )}
      </form>
    </div>
  );
}
