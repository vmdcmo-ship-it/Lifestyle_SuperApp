'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { loyaltyXuService } from '@/lib/loyalty-xu.service';

function formatMoney(n: number): string {
  return new Intl.NumberFormat('vi-VN').format(n);
}

export default function LoyaltyXuPage(): JSX.Element {
  const [stats, setStats] = useState<Awaited<ReturnType<typeof loyaltyXuService.getStats>> | null>(
    null,
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loyaltyXuService
      .getStats()
      .then(setStats)
      .catch((err) => setError((err as Error).message))
      .finally(() => setLoading(false));
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
      <Link href="/marketing" className="mb-4 inline-block text-sm text-primary hover:underline">
        ← Trung tâm Marketing
      </Link>
      <h1 className="mb-4 text-2xl font-bold">Loyalty Xu</h1>
      <p className="mb-6 text-sm text-muted-foreground">
        Xu tích lũy từ chi tiêu dịch vụ (0,1% số tiền chi). Xu dùng thanh toán trên nền tảng, không
        đổi ra tiền mặt.
      </p>

      {error && (
        <div className="mb-4 rounded-lg bg-destructive/10 px-4 py-3 text-sm text-destructive">
          {error}
        </div>
      )}

      {stats && (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-lg border bg-background p-4">
            <p className="text-sm text-muted-foreground">Tổng Xu đã tích</p>
            <p className="mt-1 text-2xl font-bold">{stats.totalXuEarned.toLocaleString()}</p>
          </div>
          <div className="rounded-lg border bg-background p-4">
            <p className="text-sm text-muted-foreground">Tổng Xu đã tiêu</p>
            <p className="mt-1 text-2xl font-bold text-primary">
              {stats.totalXuSpent.toLocaleString()}
            </p>
          </div>
          <div className="rounded-lg border bg-background p-4">
            <p className="text-sm text-muted-foreground">Số dư Xu hiện tại</p>
            <p className="mt-1 text-2xl font-bold">{stats.currentXuBalance.toLocaleString()}</p>
          </div>
          <div className="rounded-lg border bg-background p-4">
            <p className="text-sm text-muted-foreground">Ước tính chi phí (từ Xu đã cấp)</p>
            <p className="mt-1 text-2xl font-bold text-amber-600">
              {formatMoney(stats.estimatedBudgetImpactVnd)} đ
            </p>
          </div>
        </div>
      )}

      {stats && (
        <div className="mt-6 rounded-lg border bg-background p-4">
          <h2 className="mb-3 font-semibold">Thống kê ví</h2>
          <p className="text-sm text-muted-foreground">
            {stats.walletCountWithXu} ví có Xu / {stats.totalWallets} ví tổng
          </p>
        </div>
      )}
    </div>
  );
}
