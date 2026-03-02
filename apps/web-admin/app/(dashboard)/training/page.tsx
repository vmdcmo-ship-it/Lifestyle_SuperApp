'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { trainingService } from '@/lib/training.service';
import type { TrainingCategory, TrainingMaterial } from '@/lib/training.service';
import { exportToCsv } from '@/lib/utils/export-csv';
import { Button } from '@/components/ui/button';

const TARGET_APP_LABELS: Record<string, string> = {
  ALL: 'Tất cả',
  USER: 'User',
  DRIVER: 'Tài xế',
  MERCHANT: 'Cửa hàng',
};

const MATERIAL_TYPE_LABELS: Record<string, string> = {
  ARTICLE: 'Bài viết',
  QUIZ: 'Trắc nghiệm',
  FAQ: 'FAQ',
};

export default function TrainingPage(): JSX.Element {
  const [categories, setCategories] = useState<TrainingCategory[]>([]);
  const [materials, setMaterials] = useState<TrainingMaterial[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState<'categories' | 'materials'>('categories');

  const fetchData = async () => {
    setLoading(true);
    setError('');
    try {
      const [cats, mat] = await Promise.all([
        trainingService.listCategories(),
        trainingService.listMaterials({ limit: 20 }),
      ]);
      setCategories(Array.isArray(cats) ? cats : []);
      setMaterials(mat?.data ?? []);
    } catch (err) {
      setError((err as Error).message || 'Không thể tải dữ liệu');
      setCategories([]);
      setMaterials([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleExportCategories = () => {
    exportToCsv(categories, 'training_categories', [
      { key: 'slug', header: 'Slug' },
      { key: 'name', header: 'Tên' },
      { key: 'sortOrder', header: 'Thứ tự' },
      { key: 'isActive', header: 'Kích hoạt' },
    ]);
  };

  const handleExportMaterials = () => {
    const payload = materials.map((material) => ({
      title: material.title,
      category: material.category?.name ?? '',
      materialType: material.materialType,
      targetApps: material.targetApps ?? '',
      isPublished: material.isPublished ? 'Đã xuất bản' : 'Nháp',
    }));
    exportToCsv(payload, 'training_materials', [
      { key: 'title', header: 'Tiêu đề' },
      { key: 'category', header: 'Danh mục' },
      { key: 'materialType', header: 'Loại' },
      { key: 'targetApps', header: 'Apps' },
      { key: 'isPublished', header: 'Xuất bản' },
    ]);
  };

  return (
    <div>
      <div className="mb-4 flex flex-wrap items-center justify-between gap-4">
        <h1 className="text-2xl font-bold">Đào tạo</h1>
        <div className="flex gap-2 flex-wrap">
          <Button asChild size="sm">
            <Link href="/training/categories/new">Thêm danh mục</Link>
          </Button>
          <Button asChild variant="outline" size="sm">
            <Link href="/training/materials/new">Thêm tài liệu</Link>
          </Button>
          <Button onClick={() => handleExportCategories()} variant="ghost" size="sm">
            Xuất CSV danh mục
          </Button>
          <Button onClick={() => handleExportMaterials()} variant="ghost" size="sm">
            Xuất CSV tài liệu
          </Button>
        </div>
      </div>

      <div className="mb-4 flex gap-2 border-b">
        <button
          type="button"
          onClick={() => setActiveTab('categories')}
          className={`border-b-2 px-4 py-2 text-sm font-medium ${activeTab === 'categories' ? 'border-primary text-primary' : 'border-transparent text-muted-foreground hover:text-foreground'}`}
        >
          Danh mục
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('materials')}
          className={`border-b-2 px-4 py-2 text-sm font-medium ${activeTab === 'materials' ? 'border-primary text-primary' : 'border-transparent text-muted-foreground hover:text-foreground'}`}
        >
          Tài liệu
        </button>
      </div>

      {error && (
        <div className="mb-4 rounded-lg bg-destructive/10 px-4 py-3 text-sm text-destructive">
          {error}
        </div>
      )}

      {loading ? (
        <div className="flex justify-center py-12 text-muted-foreground">Đang tải...</div>
      ) : activeTab === 'categories' ? (
        <div className="overflow-x-auto rounded-lg border">
          {categories.length === 0 ? (
            <div className="py-12 text-center text-muted-foreground">
              Chưa có danh mục.{' '}
              <Link href="/training/categories/new" className="text-primary hover:underline">
                Thêm danh mục
              </Link>
            </div>
          ) : (
            <table className="w-full text-sm">
              <thead className="border-b bg-muted/50">
                <tr>
                  <th className="px-4 py-3 text-left font-medium">Slug</th>
                  <th className="px-4 py-3 text-left font-medium">Tên</th>
                  <th className="px-4 py-3 text-right font-medium">Số tài liệu</th>
                  <th className="px-4 py-3 text-left font-medium">Trạng thái</th>
                  <th className="px-4 py-3"></th>
                </tr>
              </thead>
              <tbody>
                {categories.map((c) => (
                  <tr key={c.id} className="border-b last:border-0 hover:bg-muted/30">
                    <td className="px-4 py-3 font-mono text-xs">{c.slug}</td>
                    <td className="px-4 py-3">{c.name}</td>
                    <td className="px-4 py-3 text-right">{c._count?.materials ?? 0}</td>
                    <td className="px-4 py-3">
                      <span
                        className={`inline-flex rounded-full px-2 py-0.5 text-xs ${c.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100'}`}
                      >
                        {c.isActive ? 'Kích hoạt' : 'Tắt'}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <Link
                        href={`/training/categories/${c.id}`}
                        className="text-primary hover:underline"
                      >
                        Chỉnh sửa
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      ) : (
        <div className="overflow-x-auto rounded-lg border">
          {materials.length === 0 ? (
            <div className="py-12 text-center text-muted-foreground">
              Chưa có tài liệu.{' '}
              <Link href="/training/materials/new" className="text-primary hover:underline">
                Thêm tài liệu
              </Link>
            </div>
          ) : (
            <table className="w-full text-sm">
              <thead className="border-b bg-muted/50">
                <tr>
                  <th className="px-4 py-3 text-left font-medium">Tiêu đề</th>
                  <th className="px-4 py-3 text-left font-medium">Danh mục</th>
                  <th className="px-4 py-3 text-left font-medium">Loại</th>
                  <th className="px-4 py-3 text-left font-medium">App</th>
                  <th className="px-4 py-3 text-left font-medium">Xuất bản</th>
                  <th className="px-4 py-3"></th>
                </tr>
              </thead>
              <tbody>
                {materials.map((m) => (
                  <tr key={m.id} className="border-b last:border-0 hover:bg-muted/30">
                    <td className="px-4 py-3">{m.title}</td>
                    <td className="px-4 py-3 text-muted-foreground">{m.category?.name ?? '—'}</td>
                    <td className="px-4 py-3">
                      {MATERIAL_TYPE_LABELS[m.materialType] ?? m.materialType}
                    </td>
                    <td className="px-4 py-3 text-xs">
                      {m.targetApps
                        ? m.targetApps
                            .split(',')
                            .map((a) => TARGET_APP_LABELS[a.trim()] ?? a)
                            .join(', ')
                        : 'Tất cả'}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`inline-flex rounded-full px-2 py-0.5 text-xs ${m.isPublished ? 'bg-green-100 text-green-800' : 'bg-amber-100'}`}
                      >
                        {m.isPublished ? 'Đã xuất bản' : 'Nháp'}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <Link
                        href={`/training/materials/${m.id}`}
                        className="text-primary hover:underline"
                      >
                        Chỉnh sửa
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}

      <p className="mt-6 text-sm text-muted-foreground">
        App lấy link qua API GET /api/v1/training/public/links?audience=USER|DRIVER|MERCHANT
      </p>
    </div>
  );
}
