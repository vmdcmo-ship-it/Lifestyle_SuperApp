'use client';

import { useState, useEffect, useMemo, useCallback, Suspense } from 'react';
import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import { auditService } from '@/lib/audit.service';
import type { AuditLogItem } from '@/lib/audit.service';

const ACTION_OPTIONS = [
  { value: '', label: 'Tất cả' },
  { value: 'LOGIN', label: 'Đăng nhập' },
  { value: 'CREATE', label: 'Tạo mới' },
  { value: 'UPDATE', label: 'Cập nhật' },
  { value: 'DELETE', label: 'Xóa' },
  { value: 'VIEW', label: 'Xem' },
];

const RESOURCE_OPTIONS = [
  { value: '', label: 'Tất cả' },
  { value: 'auth', label: 'Auth' },
  { value: 'drivers', label: 'Tài xế' },
  { value: 'orders', label: 'Đơn hàng' },
  { value: 'merchants', label: 'Cửa hàng' },
  { value: 'pricing', label: 'Bảng giá' },
  { value: 'content', label: 'Nội dung' },
  { value: 'coupons', label: 'Khuyến mãi' },
];

function formatDate(iso: string): string {
  try {
    return new Date(iso).toLocaleString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  } catch {
    return iso;
  }
}

function formatDetails(details: unknown): string {
  if (details == null) return '—';
  if (typeof details === 'object') {
    try {
      return (
        JSON.stringify(details).slice(0, 80) + (JSON.stringify(details).length > 80 ? '...' : '')
      );
    } catch {
      return '—';
    }
  }
  return String(details);
}

function AuditContent(): JSX.Element {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const initialAction = useMemo(() => searchParams.get('action') || '', [searchParams]);
  const initialResource = useMemo(() => searchParams.get('resource') || '', [searchParams]);
  const initialPage = useMemo(
    () => parseInt(searchParams.get('page') || '1', 10) || 1,
    [searchParams],
  );

  const [logs, setLogs] = useState<AuditLogItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [page, setPage] = useState(initialPage);
  const [limit] = useState(20);
  const [action, setAction] = useState(initialAction);
  const [resource, setResource] = useState(initialResource);
  const [pagination, setPagination] = useState({ page: 1, limit: 20, total: 0, totalPages: 1 });

  const updateUrl = useCallback(
    (opts: { action?: string; resource?: string; page?: number }) => {
      const params = new URLSearchParams();
      if (opts.action) params.set('action', opts.action);
      if (opts.resource) params.set('resource', opts.resource);
      if (opts.page && opts.page > 1) params.set('page', String(opts.page));
      const q = params.toString();
      router.replace(q ? `${pathname}?${q}` : pathname, { scroll: false });
    },
    [pathname, router],
  );

  useEffect(() => {
    setAction(initialAction);
    setResource(initialResource);
    setPage(initialPage);
  }, [initialAction, initialResource, initialPage]);

  useEffect(() => {
    setLoading(true);
    setError('');
    auditService
      .list({
        page,
        limit,
        action: action || undefined,
        resource: resource || undefined,
      })
      .then((res) => {
        setLogs(res.data);
        setPagination(res.pagination);
      })
      .catch((err) => {
        setError((err as Error).message || 'Không thể tải nhật ký');
        setLogs([]);
      })
      .finally(() => setLoading(false));
    updateUrl({ action, resource, page });
  }, [page, action, resource, updateUrl]);

  return (
    <div>
      <h1 className="mb-4 text-2xl font-bold">Lịch sử thao tác (Audit Log)</h1>
      <p className="mb-6 text-sm text-muted-foreground">
        Xem lịch sử các thao tác của admin trên hệ thống.
      </p>

      <div className="mb-4 flex flex-wrap items-center gap-4">
        <label className="flex items-center gap-2 text-sm">
          <span className="text-muted-foreground">Hành động:</span>
          <select
            value={action}
            onChange={(e) => {
              setAction(e.target.value);
              setPage(1);
            }}
            className="rounded-lg border border-input bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary"
          >
            {ACTION_OPTIONS.map((o) => (
              <option key={o.value || 'all'} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
        </label>
        <label className="flex items-center gap-2 text-sm">
          <span className="text-muted-foreground">Tài nguyên:</span>
          <select
            value={resource}
            onChange={(e) => {
              setResource(e.target.value);
              setPage(1);
            }}
            className="rounded-lg border border-input bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary"
          >
            {RESOURCE_OPTIONS.map((o) => (
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
        ) : logs.length === 0 ? (
          <div className="py-12 text-center text-muted-foreground">Chưa có bản ghi nào</div>
        ) : (
          <table className="w-full text-sm">
            <thead className="border-b bg-muted/50">
              <tr>
                <th className="px-4 py-3 text-left font-medium">Thời gian</th>
                <th className="px-4 py-3 text-left font-medium">Người dùng</th>
                <th className="px-4 py-3 text-left font-medium">Hành động</th>
                <th className="px-4 py-3 text-left font-medium">Tài nguyên</th>
                <th className="px-4 py-3 text-left font-medium">Mã tài nguyên</th>
                <th className="px-4 py-3 text-left font-medium">Chi tiết</th>
              </tr>
            </thead>
            <tbody>
              {logs.map((log) => (
                <tr key={log.id} className="border-b last:border-0 hover:bg-muted/30">
                  <td className="px-4 py-3 text-muted-foreground">{formatDate(log.createdAt)}</td>
                  <td className="px-4 py-3">{log.userEmail}</td>
                  <td className="px-4 py-3">
                    <span className="inline-flex rounded-full bg-blue-100 px-2 py-0.5 text-xs font-medium text-blue-800">
                      {log.action}
                    </span>
                  </td>
                  <td className="px-4 py-3">{log.resource}</td>
                  <td className="px-4 py-3 font-mono text-xs">{log.resourceId || '—'}</td>
                  <td className="max-w-[200px] truncate px-4 py-3 text-muted-foreground">
                    {formatDetails(log.details)}
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
            Trang {pagination.page} / {pagination.totalPages} • Tổng {pagination.total} bản ghi
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

export default function AuditPage(): JSX.Element {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center py-12 text-muted-foreground">
          Đang tải...
        </div>
      }
    >
      <AuditContent />
    </Suspense>
  );
}
