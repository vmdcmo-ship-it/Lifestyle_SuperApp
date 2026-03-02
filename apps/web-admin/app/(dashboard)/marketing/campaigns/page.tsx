'use client';

import { useState, useEffect, useMemo, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { marketingService, type CampaignItem } from '@/lib/marketing.service';

const STATUS_LABEL: Record<string, string> = {
  DRAFT: 'Nháp',
  ACTIVE: 'Đang chạy',
  PAUSED: 'Tạm dừng',
  ENDED: 'Kết thúc',
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

function CampaignsContent(): JSX.Element {
  const searchParams = useSearchParams();
  const initialStatus = useMemo(() => searchParams.get('status') || '', [searchParams]);

  const [campaigns, setCampaigns] = useState<CampaignItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [status, setStatus] = useState(initialStatus);

  useEffect(() => {
    setStatus(initialStatus);
  }, [initialStatus]);

  useEffect(() => {
    setLoading(true);
    marketingService
      .listCampaigns(status || undefined)
      .then(setCampaigns)
      .catch((err) => setError((err as Error).message || 'Không thể tải danh sách'))
      .finally(() => setLoading(false));
  }, [status]);

  return (
    <div>
      <Link href="/marketing" className="mb-4 inline-block text-sm text-primary hover:underline">
        ← Trung tâm Marketing
      </Link>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <h1 className="text-2xl font-bold">Chiến dịch quảng cáo</h1>
        <Link
          href="/marketing/campaigns/new"
          className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
        >
          Tạo chiến dịch
        </Link>
      </div>

      <div className="mb-4 flex flex-wrap items-center gap-4">
        <label className="flex items-center gap-2 text-sm">
          <span className="text-muted-foreground">Trạng thái:</span>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="rounded-lg border border-input bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary"
          >
            <option value="">Tất cả</option>
            <option value="DRAFT">Nháp</option>
            <option value="ACTIVE">Đang chạy</option>
            <option value="PAUSED">Tạm dừng</option>
            <option value="ENDED">Kết thúc</option>
          </select>
        </label>
      </div>

      {error && (
        <div className="mb-4 rounded-lg bg-destructive/10 px-4 py-3 text-sm text-destructive">
          {error}
        </div>
      )}

      {loading ? (
        <div className="flex items-center justify-center py-12 text-muted-foreground">
          Đang tải...
        </div>
      ) : campaigns.length === 0 ? (
        <div className="rounded-lg border bg-background p-12 text-center text-muted-foreground">
          Chưa có chiến dịch nào. Nhấn &quot;Tạo chiến dịch&quot; để bắt đầu.
        </div>
      ) : (
        <div className="overflow-x-auto rounded-lg border">
          <table className="w-full text-sm">
            <thead className="border-b bg-muted/50">
              <tr>
                <th className="px-4 py-3 text-left font-medium">Tên</th>
                <th className="px-4 py-3 text-left font-medium">Trạng thái</th>
                <th className="px-4 py-3 text-left font-medium">Thời gian</th>
                <th className="px-4 py-3 text-right font-medium">Ngân sách</th>
                <th className="px-4 py-3 text-left font-medium"></th>
              </tr>
            </thead>
            <tbody>
              {campaigns.map((c) => (
                <tr key={c.id} className="border-b last:border-0 hover:bg-muted/30">
                  <td className="px-4 py-3">
                    <p className="font-medium">{c.name}</p>
                    {c.description && (
                      <p className="text-xs text-muted-foreground line-clamp-1">{c.description}</p>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${
                        c.status === 'ACTIVE'
                          ? 'bg-green-100 text-green-800'
                          : c.status === 'DRAFT'
                            ? 'bg-amber-100 text-amber-800'
                            : c.status === 'PAUSED'
                              ? 'bg-gray-100 text-gray-700'
                              : 'bg-gray-100 text-gray-500'
                      }`}
                    >
                      {STATUS_LABEL[c.status] ?? c.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">
                    {formatDate(c.startDate)} → {formatDate(c.endDate)}
                  </td>
                  <td className="px-4 py-3 text-right">
                    {c.budget != null ? formatCurrency(c.budget) : '—'}
                  </td>
                  <td className="px-4 py-3">
                    <Link
                      href={`/marketing/campaigns/${c.id}`}
                      className="text-primary hover:underline"
                    >
                      Chi tiết
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default function CampaignsListPage(): JSX.Element {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center py-12 text-muted-foreground">
          Đang tải...
        </div>
      }
    >
      <CampaignsContent />
    </Suspense>
  );
}
