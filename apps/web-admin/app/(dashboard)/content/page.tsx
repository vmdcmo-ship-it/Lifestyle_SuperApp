'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { contentService } from '@/lib/content.service';
import type { ContentListItem } from '@/lib/content.service';

const SLUG_OPTIONS = [
  { value: '', label: 'Tất cả' },
  { value: 'privacy-policy', label: 'Chính sách bảo mật' },
  { value: 'terms-of-service', label: 'Điều khoản dịch vụ & Quyền sử dụng' },
  { value: 'terms-of-use', label: 'Quy chế hoạt động' },
  { value: 'terms-driver', label: 'Điều khoản tài xế' },
  { value: 'terms-merchant', label: 'Điều khoản cửa hàng' },
  { value: 'faq', label: 'FAQ' },
];

const TARGET_APP_LABELS: Record<string, string> = {
  ALL: 'Tất cả app',
  USER: 'App User',
  DRIVER: 'App Tài xế',
  MERCHANT: 'App Cửa hàng',
};

const LOCALE_OPTIONS = [
  { value: '', label: 'Tất cả' },
  { value: 'vi', label: 'Tiếng Việt' },
  { value: 'en', label: 'English' },
];

function formatTargetApps(val: string | null | undefined): string {
  if (!val || val.toUpperCase() === 'ALL') return 'Tất cả';
  return val
    .split(',')
    .map((a) => TARGET_APP_LABELS[a.trim().toUpperCase()] ?? a.trim())
    .join(', ');
}

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

export default function ContentListPage(): JSX.Element {
  const [items, setItems] = useState<ContentListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [slugFilter, setSlugFilter] = useState('');
  const [localeFilter, setLocaleFilter] = useState('');
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 1,
  });

  const fetchContent = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await contentService.list({
        page,
        limit,
        slug: slugFilter || undefined,
        locale: localeFilter || undefined,
      });
      setItems(res.data);
      setPagination(res.pagination);
    } catch (err) {
      setError((err as Error).message || 'Không thể tải danh sách');
      setItems([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchContent();
  }, [page, slugFilter, localeFilter]);

  return (
    <div>
      <div className="mb-4 flex flex-wrap items-center justify-between gap-4">
        <h1 className="text-2xl font-bold">Trung tâm thông tin</h1>
        <div className="flex flex-wrap items-center gap-2">
          {!loading && items.length > 0 && (
            <button
              type="button"
              onClick={() =>
                exportToCsv(
                  items.map((c) => ({
                    slug: c.slug,
                    title: c.title,
                    locale: c.locale,
                    targetApps: formatTargetApps(c.targetApps),
                    version: c.version,
                    effectiveFrom: formatDate(c.effectiveFrom),
                    status: c.isActive ? 'Kích hoạt' : 'Tắt',
                  })),
                  'trung-tam-thong-tin',
                  [
                    { key: 'slug', header: 'Slug' },
                    { key: 'title', header: 'Tiêu đề' },
                    { key: 'locale', header: 'Ngôn ngữ' },
                    { key: 'targetApps', header: 'App hiển thị' },
                    { key: 'version', header: 'Phiên bản' },
                    { key: 'effectiveFrom', header: 'Hiệu lực từ' },
                    { key: 'status', header: 'Trạng thái' },
                  ],
                )
              }
              className="rounded-lg border px-3 py-2 text-sm hover:bg-muted"
            >
              Export CSV
            </button>
          )}
          <Link
            href="/content/new"
            className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
          >
            Thêm văn bản
          </Link>
        </div>
      </div>

      <div className="mb-4 flex flex-wrap items-center gap-4">
        <label className="flex items-center gap-2 text-sm">
          <span className="text-muted-foreground">Slug:</span>
          <select
            value={slugFilter}
            onChange={(e) => {
              setSlugFilter(e.target.value);
              setPage(1);
            }}
            className="rounded-lg border border-input bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary"
          >
            {SLUG_OPTIONS.map((o) => (
              <option key={o.value || 'all'} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
        </label>
        <label className="flex items-center gap-2 text-sm">
          <span className="text-muted-foreground">Ngôn ngữ:</span>
          <select
            value={localeFilter}
            onChange={(e) => {
              setLocaleFilter(e.target.value);
              setPage(1);
            }}
            className="rounded-lg border border-input bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary"
          >
            {LOCALE_OPTIONS.map((o) => (
              <option key={o.value || 'all'} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
        </label>
      </div>

      {error && (
        <div className="mb-4 rounded-lg bg-destructive/10 px-4 py-3 text-sm text-destructive">
          {error}
        </div>
      )}

      <div className="overflow-x-auto rounded-lg border">
        {loading ? (
          <div className="flex items-center justify-center py-12 text-muted-foreground">
            Đang tải...
          </div>
        ) : items.length === 0 ? (
          <div className="py-12 text-center text-muted-foreground">Chưa có văn bản nào</div>
        ) : (
          <table className="w-full text-sm">
            <thead className="border-b bg-muted/50">
              <tr>
                <th className="px-4 py-3 text-left font-medium">Slug</th>
                <th className="px-4 py-3 text-left font-medium">Tiêu đề</th>
                <th className="px-4 py-3 text-left font-medium">Ngôn ngữ</th>
                <th className="px-4 py-3 text-left font-medium">App hiển thị</th>
                <th className="px-4 py-3 text-left font-medium">Ver</th>
                <th className="px-4 py-3 text-left font-medium">Hiệu lực từ</th>
                <th className="px-4 py-3 text-left font-medium">Trạng thái</th>
                <th className="px-4 py-3 text-left font-medium"></th>
              </tr>
            </thead>
            <tbody>
              {items.map((c) => (
                <tr key={c.id} className="border-b last:border-0 hover:bg-muted/30">
                  <td className="px-4 py-3 font-mono text-xs">{c.slug}</td>
                  <td className="px-4 py-3">{c.title}</td>
                  <td className="px-4 py-3 text-muted-foreground">{c.locale}</td>
                  <td className="px-4 py-3 text-xs text-muted-foreground">
                    {formatTargetApps(c.targetApps)}
                  </td>
                  <td className="px-4 py-3 font-mono">{c.version}</td>
                  <td className="px-4 py-3 text-muted-foreground">{formatDate(c.effectiveFrom)}</td>
                  <td className="px-4 py-3">
                    <span
                      className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${
                        c.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-700'
                      }`}
                    >
                      {c.isActive ? 'Kích hoạt' : 'Tắt'}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <Link href={`/content/${c.id}`} className="text-primary hover:underline">
                      Chỉnh sửa
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {!loading && pagination.totalPages > 1 && (
        <div className="mt-4 flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            Trang {pagination.page} / {pagination.totalPages} • Tổng {pagination.total} văn bản
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
    </div>
  );
}
