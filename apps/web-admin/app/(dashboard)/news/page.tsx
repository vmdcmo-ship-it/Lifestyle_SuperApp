'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { newsService } from '@/lib/news.service';
import type { NewsArticle } from '@/lib/news.service';
import { exportToCsv } from '@/lib/utils/export-csv';

function formatDate(iso: string | null | undefined): string {
  if (!iso) return '—';
  try {
    return new Date(iso).toLocaleDateString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  } catch {
    return iso;
  }
}

export default function NewsPage(): JSX.Element {
  const [items, setItems] = useState<NewsArticle[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({ page: 1, limit: 10, total: 0, totalPages: 1 });

  const fetchNews = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await newsService.list({ page, limit: 10 });
      setItems(res.data ?? []);
      setPagination(res.pagination ?? { page: 1, limit: 10, total: 0, totalPages: 1 });
    } catch (err) {
      setError((err as Error).message || 'Không thể tải danh sách');
      setItems([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNews();
  }, [page]);

  return (
    <div>
      <div className="mb-4 flex flex-wrap items-center justify-between gap-4">
        <h1 className="text-2xl font-bold">Tin tức</h1>
        <div className="flex flex-wrap items-center gap-2">
          {!loading && items.length > 0 && (
            <button
              type="button"
              onClick={() =>
                exportToCsv(
                  items.map((a) => ({
                    title: a.title,
                    slug: a.slug,
                    status: a.isPublished ? 'Đã đăng' : 'Nháp',
                    publishedAt: formatDate(a.publishedAt),
                  })),
                  'tin-tuc',
                  [
                    { key: 'title', header: 'Tiêu đề' },
                    { key: 'slug', header: 'Slug' },
                    { key: 'status', header: 'Trạng thái' },
                    { key: 'publishedAt', header: 'Ngày đăng' },
                  ],
                )
              }
              className="rounded-lg border px-3 py-2 text-sm hover:bg-muted"
            >
              Export CSV
            </button>
          )}
          <Link
            href="/news/new"
            className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
          >
            Thêm tin tức
          </Link>
        </div>
      </div>

      {error && (
        <div className="mb-4 rounded-lg bg-destructive/10 px-4 py-3 text-sm text-destructive">
          {error}
        </div>
      )}

      {loading ? (
        <div className="flex justify-center py-12 text-muted-foreground">Đang tải...</div>
      ) : items.length === 0 ? (
        <p className="py-12 text-center text-muted-foreground">
          Chưa có tin tức nào. Nhấn &quot;Thêm tin tức&quot; để tạo.
        </p>
      ) : (
        <div className="overflow-x-auto rounded-lg border">
          <table className="w-full text-sm">
            <thead className="border-b bg-muted/50">
              <tr>
                <th className="px-4 py-3 text-left font-medium">Tiêu đề</th>
                <th className="px-4 py-3 text-left font-medium">Slug</th>
                <th className="px-4 py-3 text-left font-medium">Xuất bản</th>
                <th className="px-4 py-3 text-left font-medium">Ngày đăng</th>
                <th className="px-4 py-3 text-left font-medium"></th>
              </tr>
            </thead>
            <tbody>
              {items.map((a) => (
                <tr key={a.id} className="border-b last:border-0 hover:bg-muted/30">
                  <td className="px-4 py-3 font-medium">{a.title}</td>
                  <td className="px-4 py-3 font-mono text-xs text-muted-foreground">{a.slug}</td>
                  <td className="px-4 py-3">
                    <span
                      className={`inline-flex rounded-full px-2 py-0.5 text-xs ${
                        a.isPublished ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-700'
                      }`}
                    >
                      {a.isPublished ? 'Đã đăng' : 'Nháp'}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">{formatDate(a.publishedAt)}</td>
                  <td className="px-4 py-3">
                    <Link href={`/news/${a.id}`} className="text-primary hover:underline">
                      Sửa
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {!loading && pagination.totalPages > 1 && (
        <div className="mt-4 flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            Trang {pagination.page} / {pagination.totalPages} • Tổng {pagination.total} bài
          </p>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page <= 1}
              className="rounded-lg border px-3 py-1.5 text-sm disabled:opacity-50"
            >
              Trước
            </button>
            <button
              type="button"
              onClick={() => setPage((p) => Math.min(pagination.totalPages, p + 1))}
              disabled={page >= pagination.totalPages}
              className="rounded-lg border px-3 py-1.5 text-sm disabled:opacity-50"
            >
              Sau
            </button>
          </div>
        </div>
      )}

      <p className="mt-6 text-sm text-muted-foreground">
        App lấy link qua API{' '}
        <code className="rounded bg-muted px-1">GET /news/public/links?audience=USER</code>. Web SEO
        tại /news/[slug]
      </p>
    </div>
  );
}
