'use client';

import { useState, useEffect } from 'react';
import { batDongSanService, type BdsArticle } from '@/lib/bat-dong-san.service';
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

export default function BdsArticlesPage(): JSX.Element {
  const [items, setItems] = useState<BdsArticle[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [page, setPage] = useState(1);
  const [tagFilter, setTagFilter] = useState('');

  const fetchArticles = async () => {
    setLoading(true);
    setError('');
    try {
      const params: Record<string, unknown> = { page, limit: 20 };
      if (tagFilter) params.tag = tagFilter;
      const res = await batDongSanService.listArticles(params);
      const data = res.data ?? (res as { data?: BdsArticle[] }).data ?? [];
      setItems(Array.isArray(data) ? data : []);
    } catch (err) {
      setError((err as Error).message || 'Không thể tải danh sách');
      setItems([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchArticles();
  }, [page, tagFilter]);

  const handleExport = () => {
    if (items.length === 0) return;
    exportToCsv(
      items.map((a) => ({
        title: a.title,
        slug: a.slug,
        tags: (a.tags ?? []).join('; '),
        publishedAt: formatDate(a.publishedAt ?? a.createdAt),
      })),
      'bds-articles',
      [
        { key: 'title', header: 'Tiêu đề' },
        { key: 'slug', header: 'Slug' },
        { key: 'tags', header: 'Tags' },
        { key: 'publishedAt', header: 'Ngày đăng' },
      ],
    );
  };

  return (
    <div>
      <div className="mb-4 flex flex-wrap items-center justify-between gap-4">
        <h2 className="text-xl font-semibold">Tin bài viết BDS</h2>
        <div className="flex flex-wrap items-center gap-2">
          {!loading && items.length > 0 && (
            <button
              type="button"
              onClick={handleExport}
              className="rounded-lg border px-3 py-2 text-sm hover:bg-muted"
            >
              Export CSV
            </button>
          )}
          <span className="text-sm text-muted-foreground">
            Thêm/Sửa bài viết (cần backend CRUD)
          </span>
        </div>
      </div>

      <div className="mb-4 flex flex-wrap items-center gap-4 rounded-lg border bg-muted/30 p-4">
        <div className="flex items-center gap-2">
          <label className="text-sm font-medium">Tag</label>
          <input
            type="text"
            placeholder="Lọc theo tag..."
            value={tagFilter}
            onChange={(e) => {
              setTagFilter(e.target.value);
              setPage(1);
            }}
            className="rounded-lg border border-input bg-background px-3 py-2 text-sm w-48"
          />
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
          Chưa có bài viết nào. Backend cần triển khai GET /api/v1/bat-dong-san/articles. Có thể thêm bài viết khi backend sẵn sàng.
        </p>
      ) : (
        <div className="overflow-x-auto rounded-lg border">
          <table className="w-full text-sm">
            <thead className="border-b bg-muted/50">
              <tr>
                <th className="px-4 py-3 text-left font-medium">Tiêu đề</th>
                <th className="px-4 py-3 text-left font-medium">Slug</th>
                <th className="px-4 py-3 text-left font-medium">Tags</th>
                <th className="px-4 py-3 text-left font-medium">Ngày</th>
                <th className="px-4 py-3 text-left font-medium"></th>
              </tr>
            </thead>
            <tbody>
              {items.map((a) => (
                <tr key={a.id} className="border-b last:border-0 hover:bg-muted/30">
                  <td className="px-4 py-3 font-medium">{a.title}</td>
                  <td className="px-4 py-3 font-mono text-xs">{a.slug}</td>
                  <td className="px-4 py-3">
                    {(a.tags ?? []).map((t) => (
                      <span
                        key={t}
                        className="mr-1 rounded bg-primary/10 px-2 py-0.5 text-xs text-primary"
                      >
                        {t}
                      </span>
                    ))}
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">
                    {formatDate(a.publishedAt ?? a.createdAt)}
                  </td>
                  <td className="px-4 py-3">
                    <a
                      href={`${process.env.NEXT_PUBLIC_WEB_APP_URL || 'http://localhost:3000'}/bat-dong-san/tin-bat-dong-san/${a.slug}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary hover:underline"
                      onClick={(e) => e.stopPropagation()}
                    >
                      Xem
                    </a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
