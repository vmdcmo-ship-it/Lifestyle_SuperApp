'use client';

import { useState, useEffect } from 'react';
import { anCuService, type AnCuLead, type LeadStatus } from '@/lib/an-cu.service';
import { exportToCsv } from '@/lib/utils/export-csv';
import { AnCuLeadDetailModal } from './lead-detail-modal';

const STATUS_LABELS: Record<LeadStatus, string> = {
  PENDING: 'Chờ xử lý',
  CONTACTED: 'Đã liên hệ',
  DONE: 'Hoàn thành',
};

function formatDate(iso: string | null | undefined): string {
  if (!iso) return '—';
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

export default function AnCuLeadsPage(): JSX.Element {
  const [items, setItems] = useState<AnCuLead[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 20,
    total: 0,
    totalPages: 1,
  });
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [detailLeadId, setDetailLeadId] = useState<string | null>(null);
  const [detailOpen, setDetailOpen] = useState(false);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const fetchLeads = async () => {
    setLoading(true);
    setError('');
    try {
      const params: {
        page: number;
        limit: number;
        status?: string;
        dateFrom?: string;
        dateTo?: string;
      } = { page, limit: 20 };
      if (statusFilter) params.status = statusFilter;
      if (dateFrom) params.dateFrom = dateFrom;
      if (dateTo) params.dateTo = dateTo;

      const res = await anCuService.listLeads(params);
      setItems(res.data ?? []);
      setPagination(
        res.pagination ?? { page: 1, limit: 20, total: 0, totalPages: 1 },
      );
    } catch (err) {
      setError((err as Error).message || 'Không thể tải danh sách');
      setItems([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setPage(1);
  }, [statusFilter, dateFrom, dateTo]);

  useEffect(() => {
    fetchLeads();
  }, [page, statusFilter, dateFrom, dateTo]);

  const handleExport = () => {
    exportToCsv(
      items.map((l) => ({
        fullName: l.fullName,
        phone: l.phone,
        email: l.email,
        note: l.note ?? '',
        source: l.source,
        status: l.status ?? '',
        createdAt: formatDate(l.createdAt),
      })),
      'an-cu-leads',
      [
        { key: 'fullName', header: 'Họ tên' },
        { key: 'phone', header: 'SĐT' },
        { key: 'email', header: 'Email' },
        { key: 'note', header: 'Ghi chú' },
        { key: 'source', header: 'Nguồn' },
        { key: 'status', header: 'Trạng thái' },
        { key: 'createdAt', header: 'Ngày tạo' },
      ],
    );
  };

  const handleStatusChange = async (lead: AnCuLead, newStatus: LeadStatus) => {
    setUpdatingId(lead.id);
    try {
      await anCuService.updateStatus(lead.id, newStatus);
      setItems((prev) =>
        prev.map((l) => (l.id === lead.id ? { ...l, status: newStatus } : l)),
      );
    } finally {
      setUpdatingId(null);
    }
  };

  const openDetail = (lead: AnCuLead) => {
    setDetailLeadId(lead.id);
    setDetailOpen(true);
  };

  return (
    <div>
      <div className="mb-4 flex flex-wrap items-center justify-between gap-4">
        <h1 className="text-2xl font-bold">An Cư Lạc Nghiệp – Leads tư vấn nhà ở xã hội</h1>
        {!loading && items.length > 0 && (
          <button
            type="button"
            onClick={handleExport}
            className="rounded-lg border px-3 py-2 text-sm hover:bg-muted"
          >
            Export CSV
          </button>
        )}
      </div>

      <div className="mb-4 flex flex-wrap items-center gap-4 rounded-lg border bg-muted/30 p-4">
        <div className="flex items-center gap-2">
          <label className="text-sm font-medium">Trạng thái</label>
          <select
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value);
              setPage(1);
            }}
            className="rounded-lg border border-input bg-background px-3 py-2 text-sm"
          >
            <option value="">Tất cả</option>
            <option value="PENDING">Chờ xử lý</option>
            <option value="CONTACTED">Đã liên hệ</option>
            <option value="DONE">Hoàn thành</option>
          </select>
        </div>
        <div className="flex items-center gap-2">
          <label className="text-sm font-medium">Từ ngày</label>
          <input
            type="date"
            value={dateFrom}
            onChange={(e) => setDateFrom(e.target.value)}
            className="rounded-lg border border-input bg-background px-3 py-2 text-sm"
          />
        </div>
        <div className="flex items-center gap-2">
          <label className="text-sm font-medium">Đến ngày</label>
          <input
            type="date"
            value={dateTo}
            onChange={(e) => setDateTo(e.target.value)}
            className="rounded-lg border border-input bg-background px-3 py-2 text-sm"
          />
        </div>
      </div>

      {error && (
        <div className="mb-4 rounded-lg bg-destructive/10 px-4 py-3 text-sm text-destructive">
          {error}
        </div>
      )}

      {loading ? (
        <div className="flex justify-center py-12 text-muted-foreground">
          Đang tải...
        </div>
      ) : items.length === 0 ? (
        <p className="py-12 text-center text-muted-foreground">
          Chưa có lead nào.
        </p>
      ) : (
        <div className="overflow-x-auto rounded-lg border">
          <table className="w-full text-sm">
            <thead className="border-b bg-muted/50">
              <tr>
                <th className="px-4 py-3 text-left font-medium">Họ tên</th>
                <th className="px-4 py-3 text-left font-medium">SĐT</th>
                <th className="px-4 py-3 text-left font-medium">Email</th>
                <th className="px-4 py-3 text-left font-medium">Trạng thái</th>
                <th className="px-4 py-3 text-left font-medium">Nguồn</th>
                <th className="px-4 py-3 text-left font-medium">Ngày tạo</th>
                <th className="px-4 py-3 text-left font-medium"></th>
              </tr>
            </thead>
            <tbody>
              {items.map((l) => (
                <tr
                  key={l.id}
                  className="cursor-pointer border-b last:border-0 hover:bg-muted/30"
                  onClick={() => openDetail(l)}
                >
                  <td className="px-4 py-3 font-medium">{l.fullName}</td>
                  <td className="px-4 py-3">{l.phone}</td>
                  <td className="px-4 py-3">{l.email}</td>
                  <td className="px-4 py-3" onClick={(e) => e.stopPropagation()}>
                    <select
                      value={l.status}
                      onChange={(e) =>
                        handleStatusChange(l, e.target.value as LeadStatus)
                      }
                      disabled={updatingId === l.id}
                      className="rounded border border-input bg-background px-2 py-1 text-xs"
                    >
                      {(['PENDING', 'CONTACTED', 'DONE'] as const).map((s) => (
                        <option key={s} value={s}>
                          {STATUS_LABELS[s]}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td className="px-4 py-3">
                    <span className="rounded-full bg-primary/10 px-2 py-0.5 text-xs text-primary">
                      {l.source}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">
                    {formatDate(l.createdAt)}
                  </td>
                  <td className="px-4 py-3">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        openDetail(l);
                      }}
                      className="text-xs text-primary hover:underline"
                    >
                      Chi tiết
                    </button>
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
            Trang {pagination.page} / {pagination.totalPages} • Tổng {pagination.total} lead
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
              onClick={() =>
                setPage((p) => Math.min(pagination.totalPages, p + 1))
              }
              disabled={page >= pagination.totalPages}
              className="rounded-lg border px-3 py-1.5 text-sm disabled:opacity-50"
            >
              Sau
            </button>
          </div>
        </div>
      )}

      <AnCuLeadDetailModal
        leadId={detailLeadId}
        open={detailOpen}
        onClose={() => {
          setDetailOpen(false);
          setDetailLeadId(null);
        }}
        onStatusChange={fetchLeads}
      />
    </div>
  );
}
