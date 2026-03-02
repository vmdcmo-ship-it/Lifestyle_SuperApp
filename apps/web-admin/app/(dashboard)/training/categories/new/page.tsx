'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { trainingService } from '@/lib/training.service';
import { toast } from '@/lib/toast';

export default function NewCategoryPage(): JSX.Element {
  const router = useRouter();
  const [slug, setSlug] = useState('');
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [sortOrder, setSortOrder] = useState(0);
  const [isActive, setIsActive] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    try {
      await trainingService.createCategory({
        slug: slug.trim(),
        name: name.trim(),
        description: description.trim() || undefined,
        sortOrder,
        isActive,
      });
      toast.success('Đã tạo danh mục');
      router.push('/training');
    } catch (err) {
      setError((err as Error).message || 'Không thể tạo');
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
      <h1 className="mb-6 text-2xl font-bold">Thêm danh mục đào tạo</h1>
      {error && (
        <div className="mb-4 rounded-lg bg-destructive/10 px-4 py-3 text-sm text-destructive">
          {error}
        </div>
      )}
      <form onSubmit={handleSubmit} className="max-w-md space-y-4">
        <div>
          <label className="mb-1 block text-sm font-medium">Slug</label>
          <input
            type="text"
            value={slug}
            onChange={(e) => setSlug(e.target.value)}
            required
            className="w-full rounded-lg border px-3 py-2 text-sm"
            placeholder="vd: driver-etiquette"
          />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium">Tên danh mục</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="w-full rounded-lg border px-3 py-2 text-sm"
            placeholder="vd: Đào tạo tài xế quy tắc ứng xử"
          />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium">Mô tả (tùy chọn)</label>
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
            {submitting ? 'Đang tạo...' : 'Tạo'}
          </button>
          <Link href="/training" className="rounded-lg border px-4 py-2 text-sm">
            Hủy
          </Link>
        </div>
      </form>
    </div>
  );
}
