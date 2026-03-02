'use client';

import { useState, useEffect, useMemo, useCallback, Suspense } from 'react';
import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { merchantsService } from '@/lib/merchants.service';
import type { MerchantListItem } from '@/lib/merchants.service';
import { exportToCsv } from '@/lib/utils/export-csv';

const STATUS_OPTIONS = [
  { value: '', label: 'Tất cả' },
  { value: 'PENDING', label: 'Chờ duyệt' },
  { value: 'ACTIVE', label: 'Đang hoạt động' },
  { value: 'INACTIVE', label: 'Không hoạt động' },
  { value: 'SUSPENDED', label: 'Tạm khóa' },
  { value: 'REJECTED', label: 'Từ chối' },
];

const STATUS_LABEL: Record<string, string> = {
  PENDING: 'Chờ duyệt',
  ACTIVE: 'Đang hoạt động',
  INACTIVE: 'Không hoạt động',
  SUSPENDED: 'Tạm khóa',
  REJECTED: 'Từ chối',
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

function formatCurrency(value: number): string {
  return new Intl.NumberFormat('vi-VN').format(value) + ' đ';
}

function MerchantsContent(): JSX.Element {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const initialStatus = useMemo(() => searchParams.get('status') || '', [searchParams]);
  const initialSearch = useMemo(() => searchParams.get('search') || '', [searchParams]);
  const initialPage = useMemo(
    () => parseInt(searchParams.get('page') || '1', 10) || 1,
    [searchParams],
  );

  const [merchants, setMerchants] = useState<MerchantListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [page, setPage] = useState(initialPage);
  const [limit] = useState(10);
  const [status, setStatus] = useState(initialStatus);
  const [search, setSearch] = useState(initialSearch);
  const [searchDebounced, setSearchDebounced] = useState(initialSearch);
  const [pagination, setPagination] = useState({ page: 1, limit: 10, total: 0, totalPages: 1 });

  const updateUrl = useCallback(
    (opts: { status?: string; search?: string; page?: number }) => {
      const params = new URLSearchParams();
      if (opts.status) params.set('status', opts.status);
      if (opts.search) params.set('search', opts.search);
      if (opts.page && opts.page > 1) params.set('page', String(opts.page));
      const q = params.toString();
      router.replace(q ? `${pathname}?${q}` : pathname, { scroll: false });
    },
    [pathname, router],
  );

  useEffect(() => {
    setStatus(initialStatus);
    setSearch(initialSearch);
    setSearchDebounced(initialSearch);
    setPage(initialPage);
  }, [initialStatus, initialSearch, initialPage]);

  useEffect(() => {
    const t = setTimeout(() => setSearchDebounced(search), 400);
    return () => clearTimeout(t);
  }, [search]);

  useEffect(() => {
    setLoading(true);
    setError('');
    merchantsService
      .list({ page, limit, status: status || undefined, search: searchDebounced || undefined })
      .then((res) => {
        setMerchants(res.data);
        setPagination(res.pagination);
      })
      .catch((err) => {
        setError((err as Error).message || 'Không thể tải danh sách');
        setMerchants([]);
      })
      .finally(() => setLoading(false));
    updateUrl({ status, search: searchDebounced, page });
  }, [page, status, searchDebounced, updateUrl]);

  return (
    <div>
      <h1 className="mb-4 text-2xl font-bold">Quản lý cửa hàng</h1>

      <div className="mb-4 flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-4">
          <label className="flex items-center gap-2 text-sm">
            <span className="text-muted-foreground">Trạng thái:</span>
            <select
              value={status}
              onChange={(e) => {
                setStatus(e.target.value);
                setPage(1);
              }}
              className="rounded-lg border border-input bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary"
            >
              {STATUS_OPTIONS.map((o) => (
                <option key={o.value || 'all'} value={o.value}>
                  {o.label}
                </option>
              ))}
            </select>
          </label>
          <input
            type="search"
            placeholder="Tìm theo tên..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            className="rounded-lg border border-input bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary"
          />
        </div>
        {!loading && merchants.length > 0 && (
          <button
            type="button"
            onClick={() =>
              exportToCsv(
                merchants.map((m) => ({
                  merchantNumber: m.merchantNumber,
                  name: m.name,
                  type: m.type,
                  address: m.address?.fullAddress || m.address?.city || '',
                  totalOrders: m.stats?.totalOrders ?? '',
                  totalRevenue: m.stats?.totalRevenue ?? '',
                  status: STATUS_LABEL[m.status] ?? m.status,
                  createdAt: formatDate(m.createdAt),
                })),
                'cua-hang',
                [
                  { key: 'merchantNumber', header: 'Mã' },
                  { key: 'name', header: 'Tên' },
                  { key: 'type', header: 'Loại' },
                  { key: 'address', header: 'Địa chỉ' },
                  { key: 'totalOrders', header: 'Đơn hàng' },
                  { key: 'totalRevenue', header: 'Doanh thu' },
                  { key: 'status', header: 'Trạng thái' },
                  { key: 'createdAt', header: 'Ngày tạo' },
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
        ) : merchants.length === 0 ? (
          <div className="py-12 text-center text-muted-foreground">Chưa có cửa hàng nào</div>
        ) : (
          <table className="w-full text-sm">
            <thead className="border-b bg-muted/50">
              <tr>
                <th className="px-4 py-3 text-left font-medium">Mã</th>
                <th className="px-4 py-3 text-left font-medium">Tên</th>
                <th className="px-4 py-3 text-left font-medium">Loại</th>
                <th className="px-4 py-3 text-left font-medium">Địa chỉ</th>
                <th className="px-4 py-3 text-right font-medium">Đơn hàng</th>
                <th className="px-4 py-3 text-right font-medium">Doanh thu</th>
                <th className="px-4 py-3 text-left font-medium">Trạng thái</th>
                <th className="px-4 py-3 text-left font-medium">Ngày tạo</th>
                <th className="px-4 py-3 text-left font-medium"></th>
              </tr>
            </thead>
            <tbody>
              {merchants.map((m) => (
                <tr key={m.id} className="border-b last:border-0 hover:bg-muted/30">
                  <td className="px-4 py-3 font-mono text-xs">{m.merchantNumber}</td>
                  <td className="px-4 py-3 font-medium">{m.name}</td>
                  <td className="px-4 py-3 text-muted-foreground">{m.type}</td>
                  <td className="px-4 py-3 text-muted-foreground max-w-[180px] truncate">
                    {m.address?.fullAddress || m.address?.city || '—'}
                  </td>
                  <td className="px-4 py-3 text-right">{m.stats?.totalOrders ?? '—'}</td>
                  <td className="px-4 py-3 text-right tabular-nums">
                    {m.stats?.totalRevenue != null ? formatCurrency(m.stats.totalRevenue) : '—'}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${
                        m.status === 'ACTIVE'
                          ? 'bg-green-100 text-green-800'
                          : m.status === 'PENDING'
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-gray-100 text-gray-700'
                      }`}
                    >
                      {STATUS_LABEL[m.status] ?? m.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">{formatDate(m.createdAt)}</td>
                  <td className="px-4 py-3">
                    <Link href={'/merchants/' + m.id} className="text-primary hover:underline">
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
            Trang {pagination.page} / {pagination.totalPages} • Tổng {pagination.total} cửa hàng
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

export default function MerchantsPage(): JSX.Element {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center py-12 text-muted-foreground">
          Đang tải...
        </div>
      }
    >
      <MerchantsContent />
    </Suspense>
  );
}
