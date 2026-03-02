'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  affiliateService,
  type AffiliateStats,
  type AffiliateReferralItem,
} from '@/lib/affiliate.service';

function formatDate(iso: string): string {
  try {
    return new Date(iso).toLocaleDateString('vi-VN', {
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

function formatMoney(n: number): string {
  return new Intl.NumberFormat('vi-VN').format(n);
}

export default function AffiliatePage(): JSX.Element {
  const [stats, setStats] = useState<AffiliateStats | null>(null);
  const [data, setData] = useState<{
    data: AffiliateReferralItem[];
    pagination: { page: number; total: number; totalPages: number };
  } | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [page, setPage] = useState(1);
  const [status, setStatus] = useState('');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');

  const load = () => {
    setLoading(true);
    setError('');
    Promise.all([
      affiliateService.getStats(),
      affiliateService.list({
        page,
        limit: 20,
        status: status || undefined,
        dateFrom: dateFrom || undefined,
        dateTo: dateTo || undefined,
      }),
    ])
      .then(([s, list]) => {
        setStats(s);
        setData(list);
      })
      .catch((err) => setError((err as Error).message))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    load();
  }, [page, status, dateFrom, dateTo]);

  if (loading && !stats) {
    return (
      <div className="flex items-center justify-center py-12 text-muted-foreground">
        Đang tải...
      </div>
    );
  }

  return (
    <div>
      <Link href="/marketing" className="mb-4 inline-block text-sm text-primary hover:underline">
        ← Trung tâm Marketing
      </Link>
      <Link
        href="/marketing/reports"
        className="ml-4 inline-block text-sm text-primary hover:underline"
      >
        Báo cáo ngân sách
      </Link>
      <h1 className="mb-6 text-2xl font-bold">Affiliate - Giới thiệu bạn bè</h1>
      <p className="mb-6 text-sm text-muted-foreground">
        Chương trình giới thiệu: khi bạn bè sử dụng dịch vụ lần đầu, người giới thiệu và người được
        giới thiệu đều nhận quà. Ngân sách lấy từ ngân sách khuyến mãi.
      </p>

      {error && (
        <div className="mb-4 rounded-lg bg-destructive/10 px-4 py-3 text-sm text-destructive">
          {error}
        </div>
      )}

      {stats && (
        <div className="mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-6">
          <div className="rounded-lg border bg-background p-4">
            <p className="text-sm text-muted-foreground">Tổng lượt giới thiệu</p>
            <p className="text-2xl font-bold">{stats.totalReferrals}</p>
          </div>
          <div className="rounded-lg border bg-background p-4">
            <p className="text-sm text-muted-foreground">Đã hoàn thành</p>
            <p className="text-2xl font-bold text-green-600">{stats.completedReferrals}</p>
          </div>
          <div className="rounded-lg border bg-background p-4">
            <p className="text-sm text-muted-foreground">Đang chờ</p>
            <p className="text-2xl font-bold text-amber-600">{stats.pendingReferrals}</p>
          </div>
          <div className="rounded-lg border bg-background p-4">
            <p className="text-sm text-muted-foreground">Thưởng người giới thiệu</p>
            <p className="text-xl font-bold">{formatMoney(stats.budgetSpentReferrer)} đ</p>
          </div>
          <div className="rounded-lg border bg-background p-4">
            <p className="text-sm text-muted-foreground">Thưởng người được giới thiệu</p>
            <p className="text-xl font-bold">{formatMoney(stats.budgetSpentReferee)} đ</p>
          </div>
          <div className="rounded-lg border bg-background p-4">
            <p className="text-sm text-muted-foreground">Tổng ngân sách đã chi</p>
            <p className="text-xl font-bold text-primary">
              {formatMoney(stats.budgetSpentTotal)} đ
            </p>
          </div>
        </div>
      )}

      <section className="rounded-lg border bg-background p-4">
        <h2 className="mb-4 font-semibold">Lịch sử giới thiệu</h2>
        <div className="mb-4 flex flex-wrap items-center gap-4">
          <label className="flex items-center gap-2 text-sm">
            <span>Trạng thái:</span>
            <select
              value={status}
              onChange={(e) => {
                setStatus(e.target.value);
                setPage(1);
              }}
              className="rounded border px-2 py-1"
            >
              <option value="">Tất cả</option>
              <option value="PENDING">Chờ</option>
              <option value="COMPLETED">Hoàn thành</option>
            </select>
          </label>
          <label className="flex items-center gap-2 text-sm">
            <span>Từ:</span>
            <input
              type="date"
              value={dateFrom}
              onChange={(e) => {
                setDateFrom(e.target.value);
                setPage(1);
              }}
              className="rounded border px-2 py-1"
            />
          </label>
          <label className="flex items-center gap-2 text-sm">
            <span>Đến:</span>
            <input
              type="date"
              value={dateTo}
              onChange={(e) => {
                setDateTo(e.target.value);
                setPage(1);
              }}
              className="rounded border px-2 py-1"
            />
          </label>
        </div>
        <div className="overflow-x-auto">
          {data?.data.length === 0 ? (
            <p className="py-8 text-center text-muted-foreground">Chưa có lượt giới thiệu nào</p>
          ) : (
            <table className="w-full text-sm">
              <thead className="border-b bg-muted/50">
                <tr>
                  <th className="px-4 py-3 text-left font-medium">Người giới thiệu</th>
                  <th className="px-4 py-3 text-left font-medium">Người được giới thiệu</th>
                  <th className="px-4 py-3 text-center font-medium">Trạng thái</th>
                  <th className="px-4 py-3 text-right font-medium">Thưởng giới thiệu</th>
                  <th className="px-4 py-3 text-right font-medium">Thưởng người mới</th>
                  <th className="px-4 py-3 text-left font-medium">Ngày</th>
                </tr>
              </thead>
              <tbody>
                {data?.data.map((r) => (
                  <tr key={r.id} className="border-b last:border-0 hover:bg-muted/30">
                    <td className="px-4 py-3">
                      <div>{r.referrerName || r.referrerId}</div>
                      {r.referrerCode && (
                        <span className="text-muted-foreground text-xs">Mã: {r.referrerCode}</span>
                      )}
                    </td>
                    <td className="px-4 py-3">{r.refereeName || r.refereeId}</td>
                    <td className="px-4 py-3 text-center">
                      <span
                        className={`inline-flex rounded-full px-2 py-0.5 text-xs ${r.status === 'COMPLETED' ? 'bg-green-100 text-green-800' : 'bg-amber-100 text-amber-800'}`}
                      >
                        {r.status === 'COMPLETED' ? 'Hoàn thành' : 'Chờ'}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right">{formatMoney(r.referrerReward)} đ</td>
                    <td className="px-4 py-3 text-right">{formatMoney(r.refereeReward)} đ</td>
                    <td className="px-4 py-3 text-muted-foreground">{formatDate(r.createdAt)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
        {data && data.pagination.totalPages > 1 && (
          <div className="mt-4 flex justify-between">
            <p className="text-sm text-muted-foreground">
              Trang {data.pagination.page} / {data.pagination.totalPages} • Tổng{' '}
              {data.pagination.total}
            </p>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page <= 1}
                className="rounded border px-3 py-1 text-sm disabled:opacity-50"
              >
                Trước
              </button>
              <button
                type="button"
                onClick={() => setPage((p) => Math.min(data.pagination.totalPages, p + 1))}
                disabled={page >= data.pagination.totalPages}
                className="rounded border px-3 py-1 text-sm disabled:opacity-50"
              >
                Sau
              </button>
            </div>
          </div>
        )}
      </section>
    </div>
  );
}
