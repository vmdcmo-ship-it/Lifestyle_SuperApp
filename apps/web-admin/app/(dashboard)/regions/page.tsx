'use client';

import { useState, useEffect, useMemo, useCallback } from 'react';
import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { regionsService } from '@/lib/regions.service';
import type { RegionItem, RegionLevel } from '@/lib/regions.service';
import { exportToCsv } from '@/lib/utils/export-csv';

const LEVEL_OPTIONS: Array<{ value: RegionLevel | ''; label: string }> = [
  { value: '', label: 'Tất cả' },
  { value: 'PROVINCE', label: 'Tỉnh/Thành phố' },
  { value: 'DISTRICT', label: 'Quận/Huyện' },
  { value: 'AREA', label: 'Khu vực' },
];

const SERVICE_LABELS: Record<string, string> = {
  TRANSPORT: 'Gọi xe',
  FOOD: 'Thức ăn, quán ăn',
  GROCERY: 'Bách hóa, siêu thị',
};

function formatDate(iso: string): string {
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

export default function RegionsPage(): JSX.Element {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const initialLevel = useMemo(
    () => (searchParams.get('level') || '') as RegionLevel | '',
    [searchParams]
  );
  const initialPage = useMemo(
    () => parseInt(searchParams.get('page') || '1', 10) || 1,
    [searchParams]
  );

  const [regions, setRegions] = useState<RegionItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [page, setPage] = useState(initialPage);
  const [limit] = useState(15);
  const [level, setLevel] = useState<RegionLevel | ''>(initialLevel);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 15,
    total: 0,
    totalPages: 1,
  });

  const updateUrl = useCallback(
    (opts: { level?: string; page?: number }) => {
      const params = new URLSearchParams();
      if (opts.level) params.set('level', opts.level);
      if (opts.page && opts.page > 1) params.set('page', String(opts.page));
      const q = params.toString();
      router.replace(q ? `${pathname}?${q}` : pathname, { scroll: false });
    },
    [pathname, router]
  );

  useEffect(() => {
    setLevel(initialLevel);
    setPage(initialPage);
  }, [initialLevel, initialPage]);

  useEffect(() => {
    setLoading(true);
    setError('');
    regionsService
      .list({
        page,
        limit,
        level: level || undefined,
      })
      .then((res) => {
        setRegions(res.items);
        setPagination(res.pagination);
      })
      .catch((err) => {
        setError((err as Error).message || 'Không thể tải danh sách');
        setRegions([]);
      })
      .finally(() => setLoading(false));
    updateUrl({ level: level || undefined, page });
  }, [page, level, limit, updateUrl]);

  const handleExport = () => {
    const rows = regions.map((r) => ({
      Mã: r.code,
      Tên: r.name,
      Cấp: r.level,
      Tỉnh: r.province ?? '',
      Thành phố: r.city ?? '',
      Quận: r.district ?? '',
      Dịch vụ: (r.services ?? [])
        .map((s) => SERVICE_LABELS[s.service_type] ?? s.service_type)
        .join(', '),
      Kích hoạt: r.is_active ? 'Có' : 'Không',
      'Ngày tạo': formatDate(r.created_at),
    }));
    exportToCsv(rows, `khu-vuc-dia-ly-${new Date().toISOString().slice(0, 10)}`);
  };

  return (
    <div>
      <div className="mb-4 flex flex-wrap items-center justify-between gap-4">
        <h1 className="text-2xl font-bold">Khu vực địa lý</h1>
        <div className="flex items-center gap-2">
          <Link
            href="/regions/new"
            className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
          >
            Thêm khu vực
          </Link>
          <button
            type="button"
            onClick={handleExport}
            disabled={loading || regions.length === 0}
            className="rounded-lg border border-input bg-background px-4 py-2 text-sm hover:bg-muted disabled:opacity-50"
          >
            Xuất CSV
          </button>
        </div>
      </div>

      <p className="mb-4 text-sm text-muted-foreground">
        Quản lý khu vực địa lý cho dịch vụ Gọi xe, Thức ăn, Bách hóa. Sản phẩm tài chính và
        subscription không áp dụng theo khu vực.
      </p>

      {error && (
        <div className="mb-4 rounded-lg bg-destructive/10 px-4 py-3 text-sm text-destructive">
          {error}
        </div>
      )}

      <div className="mb-4 flex flex-wrap gap-4">
        <label className="flex items-center gap-2 text-sm">
          <span className="text-muted-foreground">Cấp:</span>
          <select
            value={level}
            onChange={(e) => {
              setLevel(e.target.value as RegionLevel | '');
              setPage(1);
            }}
            className="rounded-lg border border-input bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary"
          >
            {LEVEL_OPTIONS.map((o) => (
              <option key={o.value || 'all'} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
        </label>
      </div>

      <div className="overflow-x-auto rounded-lg border">
        {loading ? (
          <div className="flex items-center justify-center py-12 text-muted-foreground">
            Đang tải...
          </div>
        ) : regions.length === 0 ? (
          <div className="py-12 text-center text-muted-foreground">
            Chưa có khu vực nào. Nhấn &quot;Thêm khu vực&quot; để tạo.
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead className="border-b bg-muted/50">
              <tr>
                <th className="px-4 py-3 text-left font-medium">Mã</th>
                <th className="px-4 py-3 text-left font-medium">Tên</th>
                <th className="px-4 py-3 text-left font-medium">Cấp</th>
                <th className="px-4 py-3 text-left font-medium">Tỉnh/TP/Quận</th>
                <th className="px-4 py-3 text-left font-medium">Dịch vụ</th>
                <th className="px-4 py-3 text-center font-medium">TT</th>
                <th className="px-4 py-3 text-left font-medium"></th>
              </tr>
            </thead>
            <tbody>
              {regions.map((r) => (
                <tr key={r.id} className="border-b last:border-0 hover:bg-muted/30">
                  <td className="px-4 py-3 font-mono text-xs">{r.code}</td>
                  <td className="px-4 py-3 font-medium">{r.name}</td>
                  <td className="px-4 py-3">
                    {r.level === 'PROVINCE' && 'Tỉnh/TP'}
                    {r.level === 'DISTRICT' && 'Quận/Huyện'}
                    {r.level === 'AREA' && 'Khu vực'}
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">
                    {[r.province, r.city, r.district].filter(Boolean).join(' / ') || '-'}
                  </td>
                  <td className="px-4 py-3">
                    {(r.services ?? []).length > 0 ? (
                      <span className="flex flex-wrap gap-1">
                        {(r.services ?? []).map((s) => (
                          <span
                            key={s.id}
                            className="rounded bg-primary/10 px-2 py-0.5 text-xs"
                          >
                            {SERVICE_LABELS[s.service_type] ?? s.service_type}
                          </span>
                        ))}
                      </span>
                    ) : (
                      <span className="text-muted-foreground">-</span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-center">
                    <span
                      className={`inline-flex rounded-full px-2 py-0.5 text-xs ${
                        r.is_active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-600'
                      }`}
                    >
                      {r.is_active ? 'Bật' : 'Tắt'}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <Link
                      href={`/regions/${r.id}`}
                      className="text-primary hover:underline"
                    >
                      Chi tiết
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {pagination.totalPages > 1 && (
        <div className="mt-4 flex items-center justify-between text-sm">
          <span className="text-muted-foreground">
            Trang {pagination.page}/{pagination.totalPages} • Tổng {pagination.total}
          </span>
          <div className="flex gap-2">
            <button
              type="button"
              disabled={page <= 1}
              onClick={() => setPage((p) => p - 1)}
              className="rounded border px-3 py-1 disabled:opacity-50 hover:bg-muted"
            >
              Trước
            </button>
            <button
              type="button"
              disabled={page >= pagination.totalPages}
              onClick={() => setPage((p) => p + 1)}
              className="rounded border px-3 py-1 disabled:opacity-50 hover:bg-muted"
            >
              Sau
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
