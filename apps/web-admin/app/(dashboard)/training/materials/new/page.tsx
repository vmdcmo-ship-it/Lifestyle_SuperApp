'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { trainingService } from '@/lib/training.service';
import type { TrainingCategory } from '@/lib/training.service';
import { toast } from '@/lib/toast';
import { RichTextEditor } from '@/components/RichTextEditor';
import { ArticlePreview } from '@/components/ArticlePreview';
import { Button } from '@/components/ui/button';
import { QuizContentEditor } from '@/components/QuizContentEditor';
import { FaqContentEditor } from '@/components/FaqContentEditor';

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

export default function NewMaterialPage(): JSX.Element {
  const router = useRouter();
  const [categories, setCategories] = useState<TrainingCategory[]>([]);
  const [categoryId, setCategoryId] = useState('');
  const [slug, setSlug] = useState('');
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [materialType, setMaterialType] = useState('ARTICLE');
  const [targetApps, setTargetApps] = useState('ALL');
  const [isPublished, setIsPublished] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [showPreview, setShowPreview] = useState(false);

  useEffect(() => {
    trainingService
      .listCategories()
      .then(setCategories)
      .catch(() => setCategories([]));
  }, []);

  useEffect(() => {
    if (categories.length && !categoryId) setCategoryId(categories[0].id);
  }, [categories, categoryId]);

  const handleTitleChange = (v: string) => {
    setTitle(v);
    if (!slug || slug === slugify(title)) setSlug(slugify(v));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!categoryId) return;
    setError('');
    setSubmitting(true);
    try {
      await trainingService.createMaterial({
        categoryId,
        slug: slug || slugify(title),
        title,
        content,
        materialType,
        targetApps: targetApps || undefined,
        isPublished,
      });
      toast.success('Đã tạo tài liệu');
      router.push('/training');
    } catch (err) {
      setError((err as Error).message);
      toast.error((err as Error).message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div>
      <Link href="/training" className="mb-4 inline-block text-sm text-primary hover:underline">
        ← Quay lại
      </Link>
      <h1 className="mb-6 text-2xl font-bold">Thêm tài liệu đào tạo</h1>
      {error && (
        <div className="mb-4 rounded-lg bg-destructive/10 px-4 py-3 text-sm text-destructive">
          {error}
        </div>
      )}
      <form onSubmit={handleSubmit} className="max-w-2xl space-y-4">
        <div>
          <label className="mb-1 block text-sm font-medium">Danh mục</label>
          <select
            value={categoryId}
            onChange={(e) => setCategoryId(e.target.value)}
            required
            className="w-full rounded-lg border border-input bg-background px-3 py-2"
          >
            <option value="">-- Chọn danh mục --</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium">Loại</label>
          <select
            value={materialType}
            onChange={(e) => setMaterialType(e.target.value)}
            className="w-full rounded-lg border border-input bg-background px-3 py-2"
          >
            <option value="ARTICLE">Bài viết</option>
            <option value="QUIZ">Trắc nghiệm</option>
            <option value="FAQ">Câu hỏi thường gặp</option>
          </select>
        </div>
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
          <label className="mb-1 block text-sm font-medium">Slug</label>
          <input
            type="text"
            value={slug}
            onChange={(e) => setSlug(e.target.value)}
            className="w-full rounded-lg border border-input bg-background px-3 py-2 font-mono text-sm"
          />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium">Nội dung</label>
          {materialType === 'ARTICLE' && (
            <RichTextEditor
              value={content}
              onChange={setContent}
              placeholder="Nhập nội dung tài liệu..."
              minHeight="280px"
            />
          )}
          {materialType === 'QUIZ' && <QuizContentEditor value={content} onChange={setContent} />}
          {materialType === 'FAQ' && <FaqContentEditor value={content} onChange={setContent} />}
        </div>
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
          <Button type="submit" disabled={submitting}>
            {submitting ? 'Đang tạo...' : 'Tạo tài liệu'}
          </Button>
          <Button type="button" variant="outline" onClick={() => setShowPreview(true)}>
            Xem trước
          </Button>
          <Link
            href="/training"
            className="rounded-lg border px-4 py-2 text-sm font-medium hover:bg-muted"
          >
            Hủy
          </Link>
        </div>
        {showPreview && (
          <ArticlePreview
            title={title}
            content={content}
            contentFormat={
              materialType === 'ARTICLE' ? 'ARTICLE' : materialType === 'QUIZ' ? 'QUIZ' : 'FAQ'
            }
            onClose={() => setShowPreview(false)}
          />
        )}
      </form>
    </div>
  );
}
