'use client';

import React, { useState, useEffect } from 'react';
import {
  sellerLeadsService,
  SELLER_LEAD_STATUSES,
  type SellerLead,
  type SellerLeadStatus,
} from '@/lib/seller-leads.service';
import { exportToCsv } from '@/lib/utils/export-csv';

const STATUS_LABELS: Record<string, string> = {
  PENDING: 'Chờ xử lý',
  CONTACTED: 'Đã liên hệ',
  DONE: 'Hoàn thành',
  REJECTED: 'Từ chối',
};

const BUSINESS_GROUP_LABELS: Record<string, string> = {
  FOOD_DELIVERY: 'Giao thức ăn',
  GROCERY: 'Bách hóa',
  LOCAL_SERVICE: 'Giới thiệu dịch vụ',
  SHOPPING_MALL: 'Shopping Mall',
};

const SUB_CATEGORY_LABELS: Record<string, string> = {
  restaurant: 'Nhà hàng',
  cafe: 'Cà phê',
  fast_food: 'Đồ ăn nhanh',
  bakery: 'Tiệm bánh',
  convenience_store: 'Tạp hóa',
  supermarket: 'Siêu thị mini',
  wet_market: 'Mua hộ',
  spa: 'Spa',
  salon: 'Salon',
  gym: 'Gym',
  clinic: 'Phòng khám',
  repair: 'Sửa chữa',
  fashion: 'Thời trang',
  cosmetics: 'Mỹ phẩm',
  watches: 'Đồng hồ',
  flowers: 'Hoa tươi',
  hamper: 'Hamper',
  other: 'Khác',
};

function formatGroupSub(l: SellerLead): string {
  const g = l.businessGroup ? BUSINESS_GROUP_LABELS[l.businessGroup] || l.businessGroup : '';
  const s = l.subCategory ? SUB_CATEGORY_LABELS[l.subCategory] || l.subCategory : '';
  if (g && s) return `${g} / ${s}`;
  if (l.category) return SUB_CATEGORY_LABELS[l.category] || l.category;
  return '—';
}

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

export default function SellerLeadsPage(): JSX.Element {
  const [items, setItems] = useState<SellerLead[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [limit] = useState(20);
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const totalPages = Math.max(1, Math.ceil(total / limit));

  const fetchLeads = async () => {
    setLoading(true);
    setError('');
    try {
      const params: { page: number; limit: number; status?: string } = {
        page,
        limit,
      };
      if (statusFilter) params.status = statusFilter;
      const res = await sellerLeadsService.list(params);
      setItems(res.data ?? []);
      setTotal(res.total ?? 0);
    } catch (err) {
      setError((err as Error).message || 'Không thể tải danh sách');
      setItems([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setPage(1);
  }, [statusFilter]);

  useEffect(() => {
    fetchLeads();
  }, [page, statusFilter]);

  const handleExport = () => {
    exportToCsv(
      items.map((l) => ({
        storeName: l.storeName,
        contactName: l.contactName,
        phone: l.phone,
        email: l.email,
        businessGroup: l.businessGroup ? BUSINESS_GROUP_LABELS[l.businessGroup] || l.businessGroup : '',
        subCategory: l.subCategory ? SUB_CATEGORY_LABELS[l.subCategory] || l.subCategory : '',
        message: l.message ?? '',
        source: l.source,
        status: STATUS_LABELS[l.status] || l.status,
        createdAt: formatDate(l.createdAt),
      })),
      'seller-leads',
      [
        { key: 'storeName', header: 'Tên cửa hàng' },
        { key: 'contactName', header: 'Người liên hệ' },
        { key: 'phone', header: 'SĐT' },
        { key: 'email', header: 'Email' },
        { key: 'businessGroup', header: 'Nhóm' },
        { key: 'subCategory', header: 'Ngành' },
        { key: 'message', header: 'Mô tả' },
        { key: 'source', header: 'Nguồn' },
        { key: 'status', header: 'Trạng thái' },
        { key: 'createdAt', header: 'Ngày tạo' },
      ]
    );
  };

  const handleStatusChange = async (lead: SellerLead, newStatus: SellerLeadStatus) => {
    setUpdatingId(lead.id);
    try {
      await sellerLeadsService.updateStatus(lead.id, newStatus);
      setItems((prev) =>
        prev.map((l) => (l.id === lead.id ? { ...l, status: newStatus } : l))
      );
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <div>
      <div className="mb-4 flex flex-wrap items-center justify-between gap-4">
        <h1 className="text-2xl font-bold">
          Seller Leads – Đăng ký đối tác kinh doanh
        </h1>
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
            {SELLER_LEAD_STATUSES.map((s) => (
              <option key={s} value={s}>
                {STATUS_LABELS[s]}
              </option>
            ))}
          </select>
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
                <th className="px-4 py-3 text-left font-medium">Cửa hàng</th>
                <th className="px-4 py-3 text-left font-medium">Liên hệ</th>
                <th className="px-4 py-3 text-left font-medium">SĐT</th>
                <th className="px-4 py-3 text-left font-medium">Email</th>
                <th className="px-4 py-3 text-left font-medium">Nhóm / Ngành</th>
                <th className="px-4 py-3 text-left font-medium">Trạng thái</th>
                <th className="px-4 py-3 text-left font-medium">Ngày tạo</th>
                <th className="px-4 py-3 text-left font-medium"></th>
              </tr>
            </thead>
            <tbody>
              {items.map((l) => (
                <React.Fragment key={l.id}>
                  <tr
                    className="cursor-pointer border-b last:border-0 hover:bg-muted/30"
                    onClick={() =>
                      setExpandedId((prev) => (prev === l.id ? null : l.id))
                    }
                  >
                    <td className="px-4 py-3 font-medium">{l.storeName}</td>
                    <td className="px-4 py-3">{l.contactName}</td>
                    <td className="px-4 py-3">{l.phone}</td>
                    <td className="px-4 py-3">{l.email}</td>
                    <td className="px-4 py-3">
                      {formatGroupSub(l)}
                    </td>
                    <td className="px-4 py-3" onClick={(e) => e.stopPropagation()}>
                      <select
                        value={l.status}
                        onChange={(e) =>
                          handleStatusChange(
                            l,
                            e.target.value as SellerLeadStatus
                          )
                        }
                        disabled={updatingId === l.id}
                        className="rounded border border-input bg-background px-2 py-1 text-xs"
                      >
                        {(
                          ['PENDING', 'CONTACTED', 'DONE', 'REJECTED'] as const
                        ).map((s) => (
                          <option key={s} value={s}>
                            {STATUS_LABELS[s]}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">
                      {formatDate(l.createdAt)}
                    </td>
                    <td className="px-4 py-3">
                      <span className="rounded-full bg-primary/10 px-2 py-0.5 text-xs text-primary">
                        {l.source}
                      </span>
                    </td>
                  </tr>
                  {expandedId === l.id && l.message && (
                    <tr className="border-b bg-muted/20">
                      <td colSpan={8} className="px-4 py-3">
                        <p className="text-xs font-medium text-muted-foreground">
                          Mô tả:
                        </p>
                        <p className="mt-1 text-sm">{l.message}</p>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {!loading && totalPages > 1 && (
        <div className="mt-4 flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            Trang {page} / {totalPages} • Tổng {total} lead
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
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page >= totalPages}
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

