'use client';

import { useState, useEffect, useMemo, useCallback, Suspense } from 'react';
import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { driversService } from '@/lib/drivers.service';
import type { DriverListItem } from '@/lib/drivers.service';
import { exportToCsv } from '@/lib/utils/export-csv';

const DEFAULT_PAGE = 1;
const DEFAULT_LIMIT = 10;

const STATUS_OPTIONS = [
  { value: '', label: 'Tất cả' },
  { value: 'PENDING_VERIFICATION', label: 'Đang chờ duyệt' },
  { value: 'ACTIVE', label: 'Đã duyệt (Active)' },
  { value: 'INACTIVE', label: 'Từ chối / Inactive' },
  { value: 'SUSPENDED', label: 'Tạm khóa' },
  { value: 'BANNED', label: 'Cấm' },
];

const STATUS_LABEL: Record<string, string> = {
  PENDING_VERIFICATION: 'Chờ duyệt',
  ACTIVE: 'Đã duyệt',
  INACTIVE: 'Từ chối',
  SUSPENDED: 'Tạm khóa',
  BANNED: 'Cấm',
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

function displayName(d: DriverListItem): string {
  const u = d.user;
  if (u?.firstName || u?.lastName) {
    return [u.firstName, u.lastName].filter(Boolean).join(' ').trim() || '—';
  }
  return d.driverNumber || '—';
}

function DriversContent(): JSX.Element {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const initialStatus = useMemo(() => searchParams.get('status') || '', [searchParams]);
  const initialPage = useMemo(
    () => parseInt(searchParams.get('page') || String(DEFAULT_PAGE), 10) || DEFAULT_PAGE,
    [searchParams],
  );

  const [drivers, setDrivers] = useState<DriverListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [page, setPage] = useState(initialPage);
  const [limit] = useState(DEFAULT_LIMIT);
  const [status, setStatus] = useState(initialStatus);
  const [pagination, setPagination] = useState({
    page: DEFAULT_PAGE,
    limit: DEFAULT_LIMIT,
    total: 0,
    totalPages: 1,
  });

  const updateUrl = useCallback(
    (opts: { status?: string; page?: number }) => {
      const params = new URLSearchParams();
      if (opts.status) params.set('status', opts.status);
      if (opts.page && opts.page > 1) params.set('page', String(opts.page));
      const q = params.toString();
      router.replace(q ? `${pathname}?${q}` : pathname, { scroll: false });
    },
    [pathname, router],
  );

  useEffect(() => {
    setStatus(initialStatus);
    setPage(initialPage);
  }, [initialStatus, initialPage]);

  const fetchDrivers = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const res = await driversService.list({
        page,
        limit,
        status: status || undefined,
      });
      setDrivers(res.data);
      setPagination(res.pagination);
    } catch (err) {
      setError((err as Error).message || 'Không thể tải danh sách');
      setDrivers([]);
    } finally {
      setLoading(false);
    }
  }, [page, limit, status]);

  useEffect(() => {
    fetchDrivers();
  }, [fetchDrivers]);

  const handleStatusChange = useCallback(
    (newStatus: string) => {
      setStatus(newStatus);
      setPage(1);
      updateUrl({ status: newStatus, page: 1 });
    },
    [updateUrl],
  );

  const handlePageChange = useCallback(
    (newPage: number) => {
      setPage(newPage);
      updateUrl({ status, page: newPage });
    },
    [status, updateUrl],
  );

  return (
    <div>
      <h1 className="mb-4 text-2xl font-bold">Quản lý tài xế</h1>

      <div className="mb-4 flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-4">
          <label className="flex items-center gap-2 text-sm">
            <span className="text-muted-foreground">Trạng thái:</span>
            <select
              value={status}
              onChange={(e) => handleStatusChange(e.target.value)}
              className="rounded-lg border border-input bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary"
            >
              {STATUS_OPTIONS.map((o) => (
                <option key={o.value || 'all'} value={o.value}>
                  {o.label}
                </option>
              ))}
            </select>
          </label>
        </div>
        {!loading && drivers.length > 0 && (
          <button
            type="button"
            onClick={() =>
              exportToCsv(
                drivers.map((d) => ({
                  driverNumber: d.driverNumber,
                  name: displayName(d),
                  email: d.user?.email ?? '',
                  status: STATUS_LABEL[d.status] ?? d.status,
                  createdAt: formatDate(d.createdAt),
                })),
                'tai-xe',
                [
                  { key: 'driverNumber', header: 'Mã' },
                  { key: 'name', header: 'Tên' },
                  { key: 'email', header: 'Email' },
                  { key: 'status', header: 'Trạng thái' },
                  { key: 'createdAt', header: 'Ngày đăng ký' },
                ],
              )
            }
            className="rounded-lg border px-3 py-2 text-sm hover:bg-muted"
          >
            Export CSV
          </button>
        )}
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
        ) : drivers.length === 0 ? (
          <div className="py-12 text-center text-muted-foreground">Chưa có tài xế nào</div>
        ) : (
          <table className="w-full text-sm">
            <thead className="border-b bg-muted/50">
              <tr>
                <th className="px-4 py-3 text-left font-medium">Mã</th>
                <th className="px-4 py-3 text-left font-medium">Tên</th>
                <th className="px-4 py-3 text-left font-medium">Email</th>
                <th className="px-4 py-3 text-left font-medium">Trạng thái</th>
                <th className="px-4 py-3 text-left font-medium">Ngày đăng ký</th>
                <th className="px-4 py-3 text-left font-medium"></th>
              </tr>
            </thead>
            <tbody>
              {drivers.map((d) => (
                <tr key={d.id} className="border-b last:border-0 hover:bg-muted/30">
                  <td className="px-4 py-3 font-mono text-xs">{d.driverNumber}</td>
                  <td className="px-4 py-3">{displayName(d)}</td>
                  <td className="px-4 py-3 text-muted-foreground">{d.user?.email ?? '—'}</td>
                  <td className="px-4 py-3">
                    <span
                      className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${
                        d.status === 'ACTIVE'
                          ? 'bg-green-100 text-green-800'
                          : d.status === 'PENDING_VERIFICATION'
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-gray-100 text-gray-700'
                      }`}
                    >
                      {STATUS_LABEL[d.status] ?? d.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">{formatDate(d.createdAt)}</td>
                  <td className="px-4 py-3">
                    <Link href={`/drivers/${d.id}`} className="text-primary hover:underline">
                      Chi tiết
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
            Trang {pagination.page} / {pagination.totalPages} • Tổng {pagination.total} tài xế
          </p>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => handlePageChange(Math.max(1, page - 1))}
              disabled={page <= 1}
              className="rounded-lg border px-3 py-1.5 text-sm disabled:opacity-50"
            >
              Trước
            </button>
            <button
              type="button"
              onClick={() => handlePageChange(Math.min(pagination.totalPages, page + 1))}
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

export default function DriversPage(): JSX.Element {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center py-12 text-muted-foreground">
          Đang tải...
        </div>
      }
    >
      <DriversContent />
    </Suspense>
  );
}
