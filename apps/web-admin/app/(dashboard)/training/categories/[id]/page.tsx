'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { trainingService } from '@/lib/training.service';
import { toast } from '@/lib/toast';

export default function EditCategoryPage(): JSX.Element {
  const params = useParams();
  const router = useRouter();
  const id = params?.id as string;
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [sortOrder, setSortOrder] = useState(0);
  const [isActive, setIsActive] = useState(true);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!id) return;
    trainingService
      .getCategoryById(id)
      .then((data: any) => {
        setName(data.name ?? '');
        setDescription(data.description ?? '');
        setSortOrder(data.sortOrder ?? 0);
        setIsActive(data.isActive ?? true);
      })
      .catch((err) => setError((err as Error).message))
      .finally(() => setLoading(false));
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    try {
      await trainingService.updateCategory(id, {
        name,
        description: description || undefined,
        sortOrder,
        isActive,
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
  if (error && !name)
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
      <h1 className="mb-6 text-2xl font-bold">Chỉnh sửa danh mục</h1>
      {error && (
        <div className="mb-4 rounded-lg bg-destructive/10 px-4 py-3 text-sm text-destructive">
          {error}
        </div>
      )}
      <form onSubmit={handleSubmit} className="max-w-md space-y-4">
        <div>
          <label className="mb-1 block text-sm font-medium">Tên danh mục</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="w-full rounded-lg border px-3 py-2 text-sm"
          />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium">Mô tả</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={2}
            className="w-full rounded-lg border px-3 py-2 text-sm"
          />
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
            id="isActive"
            checked={isActive}
            onChange={(e) => setIsActive(e.target.checked)}
            className="h-4 w-4 rounded"
          />
          <label htmlFor="isActive" className="text-sm">
            Kích hoạt
          </label>
        </div>
        <div className="flex gap-2">
          <button
            type="submit"
            disabled={submitting}
            className="rounded-lg bg-primary px-4 py-2 text-sm text-primary-foreground disabled:opacity-50"
          >
            {submitting ? 'Đang lưu...' : 'Lưu'}
          </button>
          <Link href="/training" className="rounded-lg border px-4 py-2 text-sm">
            Hủy
          </Link>
        </div>
      </form>
    </div>
  );
}
