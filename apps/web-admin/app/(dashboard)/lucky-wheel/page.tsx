'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { luckyWheelService } from '@/lib/lucky-wheel.service';
import type { LuckyWheelStats, LuckyWheelCampaign } from '@/lib/lucky-wheel.service';

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

const STATUS_LABELS: Record<string, string> = {
  DRAFT: 'Nháp',
  ACTIVE: 'Đang chạy',
  PAUSED: 'Tạm dừng',
  ENDED: 'Kết thúc',
};

const STATUS_CLASS: Record<string, string> = {
  DRAFT: 'bg-gray-100 text-gray-700',
  ACTIVE: 'bg-green-100 text-green-800',
  PAUSED: 'bg-yellow-100 text-yellow-800',
  ENDED: 'bg-red-100 text-red-800',
};

export default function LuckyWheelPage(): JSX.Element {
  const [stats, setStats] = useState<LuckyWheelStats | null>(null);
  const [campaigns, setCampaigns] = useState<LuckyWheelCampaign[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const load = () => {
    setLoading(true);
    setError('');
    Promise.all([luckyWheelService.getStats(), luckyWheelService.listCampaigns()])
      .then(([s, c]) => {
        setStats(s);
        setCampaigns(c);
      })
      .catch((err) => setError((err as Error).message))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    load();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12 text-muted-foreground">
        Đang tải...
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold">Lucky Wheel - Vòng quay may mắn</h1>
        <Link
          href="/lucky-wheel/new"
          className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
        >
          Tạo campaign
        </Link>
      </div>

      {error && (
        <div className="mb-4 rounded-lg bg-destructive/10 px-4 py-3 text-sm text-destructive">
          {error}
        </div>
      )}

      {stats && (
        <div className="mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-lg border bg-background p-4">
            <p className="text-sm text-muted-foreground">Tổng campaign</p>
            <p className="text-2xl font-bold">{stats.totalCampaigns}</p>
          </div>
          <div className="rounded-lg border bg-background p-4">
            <p className="text-sm text-muted-foreground">Đang chạy</p>
            <p className="text-2xl font-bold text-green-600">{stats.activeCampaigns}</p>
          </div>
          <div className="rounded-lg border bg-background p-4">
            <p className="text-sm text-muted-foreground">Tổng lượt quay</p>
            <p className="text-2xl font-bold">{stats.totalSpins}</p>
          </div>
          <div className="rounded-lg border bg-background p-4">
            <p className="text-sm text-muted-foreground">Đã trúng thưởng</p>
            <p className="text-2xl font-bold">{stats.totalPrizesWon}</p>
          </div>
        </div>
      )}

      {stats?.recentSpins && stats.recentSpins.length > 0 && (
        <section className="mb-6 rounded-lg border bg-background p-4">
          <h2 className="mb-3 font-semibold">Lượt quay gần nhất</h2>
          <div className="space-y-2 text-sm">
            {stats.recentSpins.slice(0, 5).map((s) => (
              <div
                key={s.id}
                className="flex items-center justify-between rounded border px-3 py-2"
              >
                <span className="text-muted-foreground">
                  {s.campaignName} - {s.participantType === 'DRIVER' ? 'Tài xế' : 'User'}
                </span>
                <span className="font-medium">{s.prizeName}</span>
                <span className="text-muted-foreground">{formatDate(s.createdAt)}</span>
              </div>
            ))}
          </div>
        </section>
      )}

      <section className="rounded-lg border bg-background p-4">
        <h2 className="mb-3 font-semibold">Danh sách campaign</h2>
        {campaigns.length === 0 ? (
          <p className="py-8 text-center text-muted-foreground">
            Chưa có campaign. Nhấn Tạo campaign để bắt đầu.
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="border-b bg-muted/50">
                <tr>
                  <th className="px-4 py-3 text-left font-medium">Tên</th>
                  <th className="px-4 py-3 text-left font-medium">Thời gian</th>
                  <th className="px-4 py-3 text-right font-medium">Ngân sách</th>
                  <th className="px-4 py-3 text-right font-medium">Đã dùng</th>
                  <th className="px-4 py-3 text-center font-medium">Giải</th>
                  <th className="px-4 py-3 text-center font-medium">Lượt quay</th>
                  <th className="px-4 py-3 text-left font-medium">Trạng thái</th>
                  <th className="px-4 py-3 text-left font-medium"></th>
                </tr>
              </thead>
              <tbody>
                {campaigns.map((c) => (
                  <tr key={c.id} className="border-b last:border-0 hover:bg-muted/30">
                    <td className="px-4 py-3 font-medium">{c.name}</td>
                    <td className="px-4 py-3 text-muted-foreground">
                      {formatDate(c.startDate)} - {formatDate(c.endDate)}
                    </td>
                    <td className="px-4 py-3 text-right">{formatMoney(c.budget)} đ</td>
                    <td className="px-4 py-3 text-right text-muted-foreground">
                      {formatMoney(c.budgetUsed ?? 0)} đ
                    </td>
                    <td className="px-4 py-3 text-center">{c.prizeCount ?? 0}</td>
                    <td className="px-4 py-3 text-center">{c.spinCount ?? 0}</td>
                    <td className="px-4 py-3">
                      <span
                        className={`inline-flex rounded-full px-2 py-0.5 text-xs ${STATUS_CLASS[c.status] ?? 'bg-gray-100'}`}
                      >
                        {STATUS_LABELS[c.status] ?? c.status}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <Link href={`/lucky-wheel/${c.id}`} className="text-primary hover:underline">
                        Chi tiết
                      </Link>
                      <span className="mx-1 text-muted-foreground">|</span>
                      <Link
                        href={`/lucky-wheel/spins?campaignId=${c.id}`}
                        className="text-primary hover:underline"
                      >
                        Lịch sử quay
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}
