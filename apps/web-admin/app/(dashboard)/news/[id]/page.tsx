'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { newsService } from '@/lib/news.service';
import { toast } from '@/lib/toast';
import { RichTextEditor } from '@/components/RichTextEditor';
import { ArticlePreview } from '@/components/ArticlePreview';
import { SeoPanel } from '@/components/SeoPanel';
import { FeaturedImageField } from '@/components/FeaturedImageField';

const TARGET_APPS = [
  { value: 'ALL', label: 'Tất cả app' },
  { value: 'USER', label: 'App User' },
  { value: 'DRIVER', label: 'App Tài xế' },
  { value: 'MERCHANT', label: 'App Cửa hàng' },
];

export default function EditNewsPage(): JSX.Element {
  const params = useParams();
  const router = useRouter();
  const id = params?.id as string;
  const [title, setTitle] = useState('');
  const [excerpt, setExcerpt] = useState('');
  const [content, setContent] = useState('');
  const [featuredImage, setFeaturedImage] = useState<string | null>(null);
  const [seoTitle, setSeoTitle] = useState('');
  const [seoDescription, setSeoDescription] = useState('');
  const [targetApps, setTargetApps] = useState('ALL');
  const [isPublished, setIsPublished] = useState(false);
  const [author, setAuthor] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [showPreview, setShowPreview] = useState(false);

  useEffect(() => {
    if (!id) return;
    newsService
      .getById(id)
      .then((data) => {
        setTitle(data.title ?? '');
        setExcerpt(data.excerpt ?? '');
        setContent(data.content ?? '');
        setFeaturedImage(data.featuredImage ?? null);
        setSeoTitle(data.seoTitle ?? '');
        setSeoDescription(data.seoDescription ?? '');
        setTargetApps(data.targetApps || 'ALL');
        setIsPublished(data.isPublished ?? false);
        setAuthor(data.author ?? '');
      })
      .catch((err) => setError((err as Error).message))
      .finally(() => setLoading(false));
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    try {
      await newsService.update(id, {
        title,
        excerpt: excerpt || undefined,
        content,
        featuredImage: featuredImage || undefined,
        seoTitle: seoTitle || undefined,
        seoDescription: seoDescription || undefined,
        targetApps: targetApps || undefined,
        isPublished,
        author: author || undefined,
      });
      toast.success('Đã cập nhật');
      router.push('/news');
    } catch (err) {
      setError((err as Error).message || 'Không thể cập nhật');
      toast.error((err as Error).message);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <div className="py-12 text-center">Đang tải...</div>;
  if (error && !title)
    return (
      <div>
        <Link href="/news" className="text-primary">
          ← Quay lại
        </Link>
        <div className="mt-4 text-destructive">{error}</div>
      </div>
    );

  return (
    <div>
      <Link href="/news" className="mb-4 inline-block text-sm text-primary hover:underline">
        ← Quay lại
      </Link>
      <h1 className="mb-6 text-2xl font-bold">Chỉnh sửa tin tức</h1>
      {error && (
        <div className="mb-4 rounded-lg bg-destructive/10 px-4 py-3 text-sm text-destructive">
          {error}
        </div>
      )}
      <form onSubmit={handleSubmit} className="max-w-2xl space-y-4">
        <div>
          <label className="mb-1 block text-sm font-medium">Tiêu đề *</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            className="w-full rounded-lg border px-3 py-2 text-sm"
          />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium">Mô tả ngắn</label>
          <textarea
            value={excerpt}
            onChange={(e) => setExcerpt(e.target.value)}
            rows={2}
            className="w-full rounded-lg border px-3 py-2 text-sm"
            placeholder="Dùng cho SEO và preview"
          />
        </div>
        <FeaturedImageField value={featuredImage} onChange={setFeaturedImage} />
        <div>
          <label className="mb-1 block text-sm font-medium">Nội dung *</label>
          <RichTextEditor
            value={content}
            onChange={setContent}
            placeholder="Nhập nội dung..."
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
          <label className="mb-1 block text-sm font-medium">Đối tượng app</label>
          <select
            value={targetApps}
            onChange={(e) => setTargetApps(e.target.value)}
            className="w-full rounded-lg border px-3 py-2 text-sm"
          >
            {TARGET_APPS.map((t) => (
              <option key={t.value} value={t.value}>
                {t.label}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium">Tác giả</label>
          <input
            type="text"
            value={author}
            onChange={(e) => setAuthor(e.target.value)}
            className="w-full rounded-lg border px-3 py-2 text-sm"
          />
        </div>
        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            id="isPublished"
            checked={isPublished}
            onChange={(e) => setIsPublished(e.target.checked)}
            className="h-4 w-4 rounded"
          />
          <label htmlFor="isPublished" className="text-sm">
            Xuất bản
          </label>
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            type="submit"
            disabled={submitting}
            className="rounded-lg bg-primary px-4 py-2 text-sm text-primary-foreground disabled:opacity-50"
          >
            {submitting ? 'Đang lưu...' : 'Lưu'}
          </button>
          <button
            type="button"
            onClick={() => setShowPreview(true)}
            className="rounded-lg border px-4 py-2 text-sm hover:bg-muted"
          >
            Xem trước
          </button>
          <Link href="/news" className="rounded-lg border px-4 py-2 text-sm hover:bg-muted">
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
