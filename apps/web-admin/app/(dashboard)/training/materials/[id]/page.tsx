'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { trainingService } from '@/lib/training.service';
import { toast } from '@/lib/toast';
import { RichTextEditor } from '@/components/RichTextEditor';
import { ArticlePreview } from '@/components/ArticlePreview';
import { QuizContentEditor } from '@/components/QuizContentEditor';
import { FaqContentEditor } from '@/components/FaqContentEditor';

const MATERIAL_TYPES = [
  { value: 'ARTICLE', label: 'Bài viết' },
  { value: 'QUIZ', label: 'Trắc nghiệm' },
  { value: 'FAQ', label: 'FAQ' },
];

const TARGET_APPS = [
  { value: 'ALL', label: 'Tất cả app' },
  { value: 'USER', label: 'App User' },
  { value: 'DRIVER', label: 'App Tài xế' },
  { value: 'MERCHANT', label: 'App Cửa hàng' },
  { value: 'USER,DRIVER', label: 'User + Tài xế' },
];

export default function EditMaterialPage(): JSX.Element {
  const params = useParams();
  const router = useRouter();
  const id = params?.id as string;
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [materialType, setMaterialType] = useState<string>('ARTICLE');
  const [targetApps, setTargetApps] = useState('ALL');
  const [sortOrder, setSortOrder] = useState(0);
  const [isPublished, setIsPublished] = useState(false);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [showPreview, setShowPreview] = useState(false);

  useEffect(() => {
    if (!id) return;
    trainingService
      .getMaterialById(id)
      .then(
        (data: {
          title?: string;
          content?: string;
          materialType?: string;
          targetApps?: string;
          sortOrder?: number;
          isPublished?: boolean;
        }) => {
          setTitle(data.title ?? '');
          setContent(data.content ?? '');
          setMaterialType(data.materialType ?? 'ARTICLE');
          setTargetApps(data.targetApps || 'ALL');
          setSortOrder(data.sortOrder ?? 0);
          setIsPublished(data.isPublished ?? false);
        },
      )
      .catch((err) => setError((err as Error).message))
      .finally(() => setLoading(false));
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    try {
      await trainingService.updateMaterial(id, {
        title,
        content,
        materialType,
        targetApps: targetApps || undefined,
        sortOrder,
        isPublished,
      });
      toast.success('Đã cập nhật');
      router.push('/training');
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
        <Link href="/training" className="text-primary">
          ← Quay lại
        </Link>
        <div className="mt-4 text-destructive">{error}</div>
      </div>
    );

  return (
    <div>
      <Link href="/training" className="mb-4 inline-block text-sm text-primary hover:underline">
        ← Quay lại
      </Link>
      <h1 className="mb-6 text-2xl font-bold">Chỉnh sửa tài liệu</h1>
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
          <label className="mb-1 block text-sm font-medium">Loại</label>
          <select
            value={materialType}
            onChange={(e) => setMaterialType(e.target.value)}
            className="w-full rounded-lg border px-3 py-2 text-sm"
          >
            {MATERIAL_TYPES.map((t) => (
              <option key={t.value} value={t.value}>
                {t.label}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium">Nội dung *</label>
          {materialType === 'ARTICLE' && (
            <RichTextEditor
              value={content}
              onChange={setContent}
              placeholder="Nhập nội dung..."
              minHeight="280px"
            />
          )}
          {materialType === 'QUIZ' && <QuizContentEditor value={content} onChange={setContent} />}
          {materialType === 'FAQ' && <FaqContentEditor value={content} onChange={setContent} />}
        </div>
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
          <label className="mb-1 block text-sm font-medium">Thứ tự</label>
          <input
            type="number"
            value={sortOrder}
            onChange={(e) => setSortOrder(Number(e.target.value))}
            min={0}
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
          <Button type="submit" disabled={submitting}>
            {submitting ? 'Đang lưu...' : 'Lưu'}
          </Button>
          <Button type="button" variant="outline" onClick={() => setShowPreview(true)}>
            Xem trước
          </Button>
          <Link href="/training" className="rounded-lg border px-4 py-2 text-sm hover:bg-muted">
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
