'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { batDongSanService } from '@/lib/bat-dong-san.service';

export default function BatDongSanDashboardPage(): JSX.Element {
  const [stats, setStats] = useState({
    leads: 0,
    articles: 0,
    rentals: 0,
    backendReady: true,
  });

  useEffect(() => {
    Promise.all([
      batDongSanService.listFindRequests({ page: 1, limit: 1 }),
      batDongSanService.listArticles({ limit: 1 }),
      batDongSanService.listRentalListings({ limit: 1 }),
    ])
      .then(([leadsRes, articlesRes, rentalsRes]) => {
        const leadsTotal = (leadsRes as { pagination?: { total?: number } })?.pagination?.total ?? 0;
        const articlesTotal = (articlesRes as { pagination?: { total?: number }; data?: unknown[] })?.pagination?.total ??
          (articlesRes as { data?: unknown[] })?.data?.length ?? 0;
        const rentalsTotal = (rentalsRes as { total?: number; pagination?: { total?: number }; data?: unknown[] })?.total ??
          (rentalsRes as { pagination?: { total?: number } })?.pagination?.total ??
          (rentalsRes as { data?: unknown[] })?.data?.length ?? 0;

        setStats({
          leads: typeof leadsTotal === 'number' ? leadsTotal : 0,
          articles: typeof articlesTotal === 'number' ? articlesTotal : 0,
          rentals: typeof rentalsTotal === 'number' ? rentalsTotal : 0,
          backendReady: true,
        });
      })
      .catch(() => {
        setStats((s) => ({ ...s, backendReady: false }));
      });
  }, []);

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
      <Link
        href="/bat-dong-san/leads"
        className="rounded-xl border bg-card p-6 transition-shadow hover:shadow-md"
      >
        <div className="text-3xl opacity-60">📋</div>
        <h2 className="mt-2 font-semibold">Yêu cầu tìm BDS</h2>
        <p className="mt-1 text-2xl font-bold">{stats.leads}</p>
        <p className="mt-1 text-sm text-muted-foreground">Lead từ form Tìm BDS</p>
      </Link>

      <Link
        href="/bat-dong-san/articles"
        className="rounded-xl border bg-card p-6 transition-shadow hover:shadow-md"
      >
        <div className="text-3xl opacity-60">📰</div>
        <h2 className="mt-2 font-semibold">Tin bài viết</h2>
        <p className="mt-1 text-2xl font-bold">{stats.articles}</p>
        <p className="mt-1 text-sm text-muted-foreground">Bài viết Tin BDS</p>
      </Link>

      <Link
        href="/bat-dong-san/rental-listings"
        className="rounded-xl border bg-card p-6 transition-shadow hover:shadow-md"
      >
        <div className="text-3xl opacity-60">🏠</div>
        <h2 className="mt-2 font-semibold">Tin cho thuê</h2>
        <p className="mt-1 text-2xl font-bold">{stats.rentals}</p>
        <p className="mt-1 text-sm text-muted-foreground">Tin đăng từ chủ/môi giới</p>
      </Link>

      <div className="rounded-xl border bg-muted/30 p-6">
        <div className="text-3xl opacity-60">🔗</div>
        <h2 className="mt-2 font-semibold">Trang công khai</h2>
        <a
          href={`${process.env.NEXT_PUBLIC_WEB_APP_URL || 'http://localhost:3000'}/bat-dong-san`}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-2 inline-block text-sm text-primary hover:underline"
        >
          Xem trang Bất động sản →
        </a>
        <p className="mt-1 text-xs text-muted-foreground">
          Mở tab mới (NEXT_PUBLIC_WEB_APP_URL)
        </p>
      </div>

      {!stats.backendReady && (
        <div className="col-span-full rounded-lg border border-amber-200 bg-amber-50 p-4 text-sm">
          <strong>Lưu ý:</strong> Backend (main-api) chưa triển khai đầy đủ module{' '}
          <code className="rounded bg-amber-100 px-1">/api/v1/bat-dong-san</code>. Các số liệu có thể
          hiển thị 0. Khi main-api triển khai xong, dữ liệu sẽ hiển thị đầy đủ.
        </div>
      )}
    </div>
  );
}
