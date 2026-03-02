'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { couponsService } from '@/lib/coupons.service';
import type { CouponListItem } from '@/lib/coupons.service';
import { exportToCsv } from '@/lib/utils/export-csv';

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

function formatMoney(n: number): string {
  return new Intl.NumberFormat('vi-VN').format(n);
}

export default function CouponsPage(): JSX.Element {
  const [items, setItems] = useState<CouponListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 1,
  });

  const fetchList = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await couponsService.list({ page, limit: 10, activeOnly: false });
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
    fetchList();
  }, [page]);

  return (
    <div>
      <div className="mb-4 flex flex-wrap items-center justify-between gap-4">
        <h1 className="text-2xl font-bold">Trung tâm khuyến mãi</h1>
        <div className="flex gap-2">
          {!loading && items.length > 0 && (
            <button
              type="button"
              onClick={() =>
                exportToCsv(
                  items.map((c) => ({
                    code: c.code,
                    title: c.title,
                    discountType: c.discountType === 'PERCENTAGE' ? '%' : 'VNĐ',
                    discountValue:
                      c.discountType === 'PERCENTAGE'
                        ? `${c.discountValue}%`
                        : formatMoney(c.discountValue),
                    usedCount: c.usedCount,
                    usageLimit: c.usageLimit ?? '',
                    endDate: formatDate(c.endDate),
                    isActive: c.isActive ? 'Kích hoạt' : 'Tắt',
                  })),
                  'coupons',
                  [
                    { key: 'code', header: 'Mã' },
                    { key: 'title', header: 'Tiêu đề' },
                    { key: 'discountType', header: 'Loại giảm' },
                    { key: 'discountValue', header: 'Giá trị' },
                    { key: 'usedCount', header: 'Đã dùng' },
                    { key: 'usageLimit', header: 'Giới hạn' },
                    { key: 'endDate', header: 'Hạn' },
                    { key: 'isActive', header: 'Trạng thái' },
                  ],
                )
              }
              className="rounded-lg border px-3 py-2 text-sm hover:bg-muted"
            >
              Export CSV
            </button>
          )}
          <Link
            href="/coupons/new"
            className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
          >
            Thêm coupon
          </Link>
        </div>
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
          <div className="py-12 text-center text-muted-foreground">Chưa có coupon nào</div>
        ) : (
          <table className="w-full text-sm">
            <thead className="border-b bg-muted/50">
              <tr>
                <th className="px-4 py-3 text-left font-medium">Mã</th>
                <th className="px-4 py-3 text-left font-medium">Tiêu đề</th>
                <th className="px-4 py-3 text-left font-medium">Loại giảm</th>
                <th className="px-4 py-3 text-right font-medium">Giá trị</th>
                <th className="px-4 py-3 text-left font-medium">Đã dùng</th>
                <th className="px-4 py-3 text-left font-medium">Hạn</th>
                <th className="px-4 py-3 text-left font-medium">Trạng thái</th>
                <th className="px-4 py-3 text-left font-medium"></th>
              </tr>
            </thead>
            <tbody>
              {items.map((c) => (
                <tr key={c.id} className="border-b last:border-0 hover:bg-muted/30">
                  <td className="px-4 py-3 font-mono font-medium">{c.code}</td>
                  <td className="px-4 py-3">{c.title}</td>
                  <td className="px-4 py-3 text-muted-foreground">
                    {c.discountType === 'PERCENTAGE' ? '%' : 'VNĐ'}
                  </td>
                  <td className="px-4 py-3 text-right">
                    {c.discountType === 'PERCENTAGE'
                      ? `${c.discountValue}%`
                      : formatMoney(c.discountValue)}
                  </td>
                  <td className="px-4 py-3">
                    {c.usedCount}
                    {c.usageLimit ? `/${c.usageLimit}` : ''}
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">{formatDate(c.endDate)}</td>
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
                    <Link href={`/coupons/${c.id}`} className="text-primary hover:underline">
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
            Trang {pagination.page} / {pagination.totalPages} • Tổng {pagination.total}
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
