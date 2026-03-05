'use client';

import { useState, useEffect, useMemo, useCallback } from 'react';
import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { franchiseService } from '@/lib/franchise.service';
import type { FranchisePartner, FranchiseStatus } from '@/lib/franchise.service';
import { exportToCsv } from '@/lib/utils/export-csv';

const STATUS_OPTIONS: Array<{ value: FranchiseStatus | ''; label: string }> = [
  { value: '', label: 'Tất cả' },
  { value: 'ACTIVE', label: 'Đang hoạt động' },
  { value: 'INACTIVE', label: 'Dừng' },
  { value: 'PENDING', label: 'Chờ duyệt' },
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

export default function FranchisePage(): JSX.Element {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const initialStatus = useMemo(
    () => (searchParams.get('status') || '') as FranchiseStatus | '',
    [searchParams]
  );
  const initialPage = useMemo(
    () => parseInt(searchParams.get('page') || '1', 10) || 1,
    [searchParams]
  );

  const [partners, setPartners] = useState<FranchisePartner[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [page, setPage] = useState(initialPage);
  const [limit] = useState(15);
  const [statusFilter, setStatusFilter] = useState<FranchiseStatus | ''>(initialStatus);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 15,
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
    [pathname, router]
  );

  useEffect(() => {
    setStatusFilter(initialStatus);
    setPage(initialPage);
  }, [initialStatus, initialPage]);

  useEffect(() => {
    setLoading(true);
    setError('');
    franchiseService
      .listPartners({ page, limit, status: statusFilter || undefined })
      .then((res) => {
        setPartners(res.items);
        setPagination(res.pagination);
      })
      .catch((err) => {
        setError((err as Error).message || 'Không thể tải danh sách');
        setPartners([]);
      })
      .finally(() => setLoading(false));
    updateUrl({ status: statusFilter || undefined, page });
  }, [page, statusFilter, limit, updateUrl]);

  const handleExport = () => {
    const rows = partners.map((p) => ({
      'Mã': p.code,
      'Tên': p.name,
      'Email': p.contact_email ?? '',
      'SĐT': p.contact_phone ?? '',
      'Trạng thái': p.status,
      'Ký HĐ': p.contract_signed_at ? formatDate(p.contract_signed_at) : '',
      'Hết HĐ': p.contract_expires_at ? formatDate(p.contract_expires_at) : '',
      'Vùng': (p.regions ?? [])
        .map((r) => `${r.region?.name ?? r.region_id} (${SERVICE_LABELS[r.service_type] ?? r.service_type})`)
        .join('; '),
      'Ngày tạo': formatDate(p.created_at),
    }));
    const columns = [
      { key: 'Mã', header: 'Mã' },
      { key: 'Tên', header: 'Tên' },
      { key: 'Email', header: 'Email' },
      { key: 'SĐT', header: 'SĐT' },
      { key: 'Trạng thái', header: 'Trạng thái' },
      { key: 'Ký HĐ', header: 'Ký HĐ' },
      { key: 'Hết HĐ', header: 'Hết HĐ' },
      { key: 'Vùng', header: 'Vùng' },
      { key: 'Ngày tạo', header: 'Ngày tạo' },
    ];
    exportToCsv(rows, 'doi-tac-nhuong-quyen', columns);
  };

  const STATUS_LABELS: Record<string, string> = {
    ACTIVE: 'Đang hoạt động',
    INACTIVE: 'Dừng',
    PENDING: 'Chờ duyệt',
  };

  return (
    <div>
      <div className="mb-4 flex flex-wrap items-center justify-between gap-4">
        <h1 className="text-2xl font-bold">Công tác nhượng quyền</h1>
        <div className="flex items-center gap-2">
          <Link
            href="/franchise/new"
            className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
          >
            Thêm đối tác
          </Link>
          <button
            type="button"
            onClick={handleExport}
            disabled={loading || partners.length === 0}
            className="rounded-lg border border-input bg-background px-4 py-2 text-sm hover:bg-muted disabled:opacity-50"
          >
            Xuất CSV
          </button>
        </div>
      </div>

      <p className="mb-4 text-sm text-muted-foreground">
        Quản lý đối tác nhượng quyền theo khu vực địa lý cho dịch vụ Gọi xe, Thức ăn, Bách hóa.
      </p>

      {error && (
        <div className="mb-4 rounded-lg bg-destructive/10 px-4 py-3 text-sm text-destructive">
          {error}
        </div>
      )}

      <div className="mb-4 flex flex-wrap gap-4">
        <label className="flex items-center gap-2 text-sm">
          <span className="text-muted-foreground">Trạng thái:</span>
          <select
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value as FranchiseStatus | '');
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
      </div>

      <div className="overflow-x-auto rounded-lg border">
        {loading ? (
          <div className="flex items-center justify-center py-12 text-muted-foreground">
            Đang tải...
          </div>
        ) : partners.length === 0 ? (
          <div className="py-12 text-center text-muted-foreground">
            Chưa có đối tác nào. Nhấn &quot;Thêm đối tác&quot; để tạo.
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead className="border-b bg-muted/50">
              <tr>
                <th className="px-4 py-3 text-left font-medium">Mã</th>
                <th className="px-4 py-3 text-left font-medium">Tên</th>
                <th className="px-4 py-3 text-left font-medium">Liên hệ</th>
                <th className="px-4 py-3 text-left font-medium">Vùng / Dịch vụ</th>
                <th className="px-4 py-3 text-center font-medium">Trạng thái</th>
                <th className="px-4 py-3 text-left font-medium"></th>
              </tr>
            </thead>
            <tbody>
              {partners.map((p) => (
                <tr key={p.id} className="border-b last:border-0 hover:bg-muted/30">
                  <td className="px-4 py-3 font-mono text-xs">{p.code}</td>
                  <td className="px-4 py-3 font-medium">{p.name}</td>
                  <td className="px-4 py-3 text-muted-foreground">
                    {p.contact_email || p.contact_phone || '—'}
                  </td>
                  <td className="px-4 py-3">
                    {(p.regions ?? []).length > 0 ? (
                      <span className="flex flex-wrap gap-1">
                        {(p.regions ?? []).slice(0, 3).map((r) => (
                          <span
                            key={r.id}
                            className="rounded bg-primary/10 px-2 py-0.5 text-xs"
                          >
                            {r.region?.name ?? r.region_id} ({SERVICE_LABELS[r.service_type] ?? r.service_type})
                          </span>
                        ))}
                        {(p.regions ?? []).length > 3 && (
                          <span className="text-muted-foreground">
                            +{(p.regions ?? []).length - 3}
                          </span>
                        )}
                      </span>
                    ) : (
                      <span className="text-muted-foreground">—</span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-center">
                    <span
                      className={`inline-flex rounded-full px-2 py-0.5 text-xs ${
                        p.status === 'ACTIVE'
                          ? 'bg-green-100 text-green-800'
                          : p.status === 'PENDING'
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-gray-100 text-gray-600'
                      }`}
                    >
                      {STATUS_LABELS[p.status] ?? p.status}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <Link
                      href={`/franchise/${p.id}`}
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
