'use client';

import { useState, useEffect, useCallback } from 'react';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { driversService } from '@/lib/drivers.service';
import { usersService } from '@/lib/users.service';

const DashboardCharts = dynamic(
  () => import('@/components/dashboard-charts').then((m) => m.DashboardCharts),
  { ssr: false, loading: () => <div className="h-[280px] animate-pulse rounded-lg border bg-muted" /> }
);
import { dashboardService } from '@/lib/dashboard.service';
import type { DriverStats } from '@/lib/drivers.service';
import type { UserStats } from '@/lib/users.service';
import type { ChartStatsResponse, QuickStatsResponse } from '@/lib/dashboard.service';

interface DashboardData {
  driverStats: DriverStats | null;
  userStats: UserStats | null;
  quickStats: QuickStatsResponse | null;
  chartStats: ChartStatsResponse | null;
  regionStats: import('@/lib/dashboard.service').RegionStat[] | null;
}

function StatCardSkeleton(): JSX.Element {
  return (
    <div className="rounded-lg border bg-background p-4 animate-pulse">
      <div className="h-4 w-24 rounded bg-muted" />
      <div className="mt-2 h-8 w-16 rounded bg-muted" />
    </div>
  );
}

export default function DashboardPage(): JSX.Element {
  const [data, setData] = useState<DashboardData>({
    driverStats: null,
    userStats: null,
    quickStats: null,
    chartStats: null,
    regionStats: null,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [chartDays, setChartDays] = useState(7);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [driverStats, userStats, quickStats, chartStats, regionStats] = await Promise.all([
        driversService.stats().catch((e) => {
          console.warn('Driver stats failed:', e);
          return null;
        }),
        usersService.stats().catch((e) => {
          console.warn('User stats failed:', e);
          return null;
        }),
        dashboardService.getQuickStats().catch((e) => {
          console.warn('Quick stats failed:', e);
          return null;
        }),
        dashboardService.getChartStats(chartDays).catch((e) => {
          console.warn('Chart stats failed:', e);
          return null;
        }),
        dashboardService.getRegionStats(30).catch((e) => {
          console.warn('Region stats failed:', e);
          return null;
        }),
      ]);
      if (!driverStats && !userStats) {
        setError('Không thể tải thống kê. Kiểm tra kết nối API.');
      }
      setData({
        driverStats: driverStats ?? null,
        userStats: userStats ?? null,
        quickStats: quickStats ?? null,
        chartStats: chartStats ?? null,
        regionStats: Array.isArray(regionStats) ? regionStats : null,
      });
    } finally {
      setLoading(false);
    }
  }, [chartDays]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const chartData = data.chartStats
    ? data.chartStats.bookings.daily.map((b, i) => ({
        date: b.date,
        bookingCount: b.count,
        bookingRevenue: Number(b.revenue),
        orderCount: data.chartStats?.orders.daily[i]?.count ?? 0,
        orderRevenue: Number(data.chartStats?.orders.daily[i]?.revenue ?? 0),
      }))
    : [];

  const QUICK_LINKS = [
    { href: '/drivers', label: 'Quản lý tài xế', icon: '👤' },
    { href: '/merchants', label: 'Cửa hàng', icon: '🏪' },
    { href: '/orders', label: 'Đơn hàng', icon: '📦' },
    { href: '/pricing', label: 'Bảng giá', icon: '💰' },
    { href: '/coupons', label: 'Khuyến mãi', icon: '🎫' },
    { href: '/marketing', label: 'Trung tâm Marketing', icon: '📢' },
    { href: '/content', label: 'Trung tâm thông tin', icon: '📄' },
    { href: '/audit', label: 'Audit Log', icon: '📋' },
    { href: '/settings', label: 'Cài đặt', icon: '⚙️' },
  ];

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold">Dashboard</h1>
        {!loading && (
          <button
            type="button"
            onClick={fetchData}
            className="text-sm text-muted-foreground hover:text-foreground"
          >
            Làm mới
          </button>
        )}
      </div>

      {error && (
        <div className="mb-4 rounded-lg bg-destructive/10 px-4 py-3 text-sm text-destructive flex items-center justify-between">
          <span>{error}</span>
          <button
            type="button"
            onClick={fetchData}
            className="rounded border border-destructive/50 px-2 py-1 text-xs hover:bg-destructive/10"
          >
            Thử lại
          </button>
        </div>
      )}

      {loading ? (
        <>
          <section className="mb-8">
            <div className="mb-4 h-6 w-48 rounded bg-muted animate-pulse" />
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {[1, 2, 3].map((i) => (
                <StatCardSkeleton key={i} />
              ))}
            </div>
          </section>
          <section className="mb-8">
            <div className="mb-4 h-6 w-40 rounded bg-muted animate-pulse" />
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {[1, 2, 3, 4].map((i) => (
                <StatCardSkeleton key={i} />
              ))}
            </div>
          </section>
          <section className="mb-8">
            <div className="mb-4 h-6 w-40 rounded bg-muted animate-pulse" />
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {[1, 2, 3, 4].map((i) => (
                <StatCardSkeleton key={i} />
              ))}
            </div>
          </section>
          <section>
            <div className="mb-4 h-6 w-32 rounded bg-muted animate-pulse" />
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="h-[72px] rounded-lg border bg-background animate-pulse" />
              ))}
            </div>
          </section>
        </>
      ) : (
        <>
          {/* Thống kê nhanh: Cửa hàng & Đơn hàng */}
          {data.quickStats && (
            <section className="mb-8">
              <h2 className="mb-4 text-lg font-semibold text-muted-foreground">
                Thống kê Cửa hàng & Đơn hàng
              </h2>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                <Link
                  href="/merchants"
                  className="rounded-lg border bg-background p-4 transition-colors hover:bg-muted/50"
                >
                  <p className="text-sm text-muted-foreground">Tổng cửa hàng</p>
                  <p className="mt-1 text-2xl font-bold">{data.quickStats.totalMerchants}</p>
                </Link>
                <Link
                  href="/orders"
                  className="rounded-lg border bg-background p-4 transition-colors hover:bg-muted/50"
                >
                  <p className="text-sm text-muted-foreground">Tổng đơn hàng</p>
                  <p className="mt-1 text-2xl font-bold">{data.quickStats.totalOrders}</p>
                </Link>
                <Link
                  href="/orders?status=PENDING"
                  className="rounded-lg border bg-background p-4 transition-colors hover:bg-muted/50"
                >
                  <p className="text-sm text-muted-foreground">Đơn đang chờ xác nhận</p>
                  <p className="mt-1 text-2xl font-bold text-amber-600">
                    {data.quickStats.pendingOrders}
                  </p>
                </Link>
              </div>
            </section>
          )}

          {/* Thống kê tài xế */}
          <section className="mb-8">
            <h2 className="mb-4 text-lg font-semibold text-muted-foreground">Thống kê tài xế</h2>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-6">
              <Link
                href="/drivers"
                className="rounded-lg border bg-background p-4 transition-colors hover:bg-muted/50"
              >
                <p className="text-sm text-muted-foreground">Tổng tài xế</p>
                <p className="mt-1 text-2xl font-bold">{data.driverStats?.total ?? '—'}</p>
              </Link>
              <Link
                href="/drivers?status=PENDING_VERIFICATION"
                className="rounded-lg border bg-background p-4 transition-colors hover:bg-muted/50"
              >
                <p className="text-sm text-muted-foreground">Đang chờ duyệt</p>
                <p className="mt-1 text-2xl font-bold text-amber-600">
                  {data.driverStats?.pending ?? '—'}
                </p>
              </Link>
              <Link
                href="/drivers?status=ACTIVE"
                className="rounded-lg border bg-background p-4 transition-colors hover:bg-muted/50"
              >
                <p className="text-sm text-muted-foreground">Đã duyệt (Active)</p>
                <p className="mt-1 text-2xl font-bold text-green-600">
                  {data.driverStats?.active ?? '—'}
                </p>
              </Link>
              <div className="rounded-lg border bg-background p-4">
                <p className="text-sm text-muted-foreground">Đang online</p>
                <p className="mt-1 text-2xl font-bold">{data.driverStats?.online ?? '—'}</p>
              </div>
              <div className="rounded-lg border bg-background p-4">
                <p className="text-sm text-muted-foreground">Tỷ lệ nhận đơn TB</p>
                <p className="mt-1 text-2xl font-bold">
                  {data.driverStats?.averageAcceptanceRate != null
                    ? `${(data.driverStats.averageAcceptanceRate * 100).toFixed(1)}%`
                    : '—'}
                </p>
              </div>
              <div className="rounded-lg border bg-background p-4">
                <p className="text-sm text-muted-foreground">Điểm đánh giá TB</p>
                <p className="mt-1 text-2xl font-bold">
                  {data.driverStats?.averageRating != null
                    ? data.driverStats.averageRating.toFixed(1)
                    : '—'}
                </p>
              </div>
              <div className="rounded-lg border bg-background p-4">
                <p className="text-sm text-muted-foreground">Tổng thu nhập tài xế</p>
                <p className="mt-1 text-2xl font-bold">
                  {typeof data.driverStats?.totalDriverEarnings === 'number'
                    ? data.driverStats.totalDriverEarnings >= 1_000_000
                      ? `${(data.driverStats.totalDriverEarnings / 1_000_000).toFixed(1)}M đ`
                      : data.driverStats.totalDriverEarnings >= 1_000
                        ? `${(data.driverStats.totalDriverEarnings / 1_000).toFixed(0)}K đ`
                        : `${data.driverStats.totalDriverEarnings} đ`
                    : '—'}
                </p>
              </div>
              <div className="rounded-lg border bg-background p-4">
                <p className="text-sm text-muted-foreground">Thu nhập hôm nay (đặt xe)</p>
                <p className="mt-1 text-2xl font-bold text-blue-600">
                  {typeof data.driverStats?.todayEarnings === 'number'
                    ? data.driverStats.todayEarnings >= 1_000_000
                      ? `${(data.driverStats.todayEarnings / 1_000_000).toFixed(1)}M đ`
                      : data.driverStats.todayEarnings >= 1_000
                        ? `${(data.driverStats.todayEarnings / 1_000).toFixed(0)}K đ`
                        : `${data.driverStats.todayEarnings} đ`
                    : '—'}
                </p>
              </div>
              <div className="rounded-lg border bg-background p-4">
                <p className="text-sm text-muted-foreground">Thu nhập 7 ngày (đặt xe)</p>
                <p className="mt-1 text-2xl font-bold text-blue-600">
                  {typeof data.driverStats?.weekEarnings === 'number'
                    ? data.driverStats.weekEarnings >= 1_000_000
                      ? `${(data.driverStats.weekEarnings / 1_000_000).toFixed(1)}M đ`
                      : data.driverStats.weekEarnings >= 1_000
                        ? `${(data.driverStats.weekEarnings / 1_000).toFixed(0)}K đ`
                        : `${data.driverStats.weekEarnings} đ`
                    : '—'}
                </p>
              </div>
            </div>
          </section>

          {/* Thống kê người dùng */}
          <section className="mb-8">
            <h2 className="mb-4 text-lg font-semibold text-muted-foreground">Thống kê hệ thống</h2>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <div className="rounded-lg border bg-background p-4">
                <p className="text-sm text-muted-foreground">Tổng người dùng</p>
                <p className="mt-1 text-2xl font-bold">{data.userStats?.totalUsers ?? '—'}</p>
              </div>
              <div className="rounded-lg border bg-background p-4">
                <p className="text-sm text-muted-foreground">Người dùng đang hoạt động</p>
                <p className="mt-1 text-2xl font-bold text-green-600">
                  {data.userStats?.activeUsers ?? '—'}
                </p>
              </div>
              <div className="rounded-lg border bg-background p-4">
                <p className="text-sm text-muted-foreground">Merchants</p>
                <p className="mt-1 text-2xl font-bold">{data.userStats?.merchants ?? '—'}</p>
              </div>
              <div className="rounded-lg border bg-background p-4">
                <p className="text-sm text-muted-foreground">Đã khóa / Không hoạt động</p>
                <p className="mt-1 text-2xl font-bold text-gray-500">
                  {data.userStats?.inactiveUsers ?? '—'}
                </p>
              </div>
            </div>
          </section>

          {/* Báo cáo theo vùng */}
          {data.regionStats && data.regionStats.length > 0 && (
            <section className="mb-8">
              <h2 className="mb-4 text-lg font-semibold text-muted-foreground">
                Đơn hàng & doanh thu theo vùng (30 ngày)
              </h2>
              <div className="overflow-x-auto rounded-lg border">
                <table className="w-full text-sm">
                  <thead className="border-b bg-muted/50">
                    <tr>
                      <th className="px-4 py-2 text-left font-medium">Thành phố / Vùng</th>
                      <th className="px-4 py-2 text-right font-medium">Số đơn</th>
                      <th className="px-4 py-2 text-right font-medium">Doanh thu</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.regionStats.map((r) => (
                      <tr key={r.region} className="border-b last:border-0">
                        <td className="px-4 py-2">{r.region}</td>
                        <td className="px-4 py-2 text-right">{r.orderCount}</td>
                        <td className="px-4 py-2 text-right">
                          {r.revenue >= 1_000_000
                            ? `${(r.revenue / 1_000_000).toFixed(1)}M đ`
                            : r.revenue >= 1_000
                              ? `${(r.revenue / 1_000).toFixed(0)}K đ`
                              : `${r.revenue} đ`}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          )}

          {/* Biểu đồ thống kê theo ngày */}
          {chartData.length > 0 && (
            <section className="mb-8">
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-lg font-semibold text-muted-foreground">
                  Thống kê theo ngày
                </h2>
                <select
                  value={chartDays}
                  onChange={(e) => setChartDays(Number(e.target.value))}
                  className="rounded border border-input bg-background px-2 py-1 text-sm outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value={7}>7 ngày</option>
                  <option value={14}>14 ngày</option>
                  <option value={30}>30 ngày</option>
                </select>
              </div>
              <DashboardCharts data={chartData} />
              <div className="mt-4 overflow-x-auto rounded-lg border">
                <table className="w-full text-sm">
                  <thead className="border-b bg-muted/50">
                    <tr>
                      <th className="px-4 py-2 text-left font-medium">Ngày</th>
                      <th className="px-4 py-2 text-right font-medium">Đặt xe</th>
                      <th className="px-4 py-2 text-right font-medium">Đơn hàng</th>
                      <th className="px-4 py-2 text-right font-medium">Doanh thu đặt xe</th>
                      <th className="px-4 py-2 text-right font-medium">Doanh thu đơn</th>
                    </tr>
                  </thead>
                  <tbody>
                    {chartData.map((d) => (
                      <tr key={d.date} className="border-b last:border-0">
                        <td className="px-4 py-2">{d.date}</td>
                        <td className="px-4 py-2 text-right">{d.bookingCount}</td>
                        <td className="px-4 py-2 text-right">{d.orderCount}</td>
                        <td className="px-4 py-2 text-right">
                          {d.bookingRevenue >= 1_000_000
                            ? `${(d.bookingRevenue / 1_000_000).toFixed(1)}M`
                            : d.bookingRevenue >= 1_000
                              ? `${(d.bookingRevenue / 1_000).toFixed(0)}K`
                              : d.bookingRevenue}
                          {' đ'}
                        </td>
                        <td className="px-4 py-2 text-right">
                          {d.orderRevenue >= 1_000_000
                            ? `${(d.orderRevenue / 1_000_000).toFixed(1)}M`
                            : d.orderRevenue >= 1_000
                              ? `${(d.orderRevenue / 1_000).toFixed(0)}K`
                              : d.orderRevenue}
                          {' đ'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          )}

          {/* Quick links */}
          <section>
            <h2 className="mb-4 text-lg font-semibold text-muted-foreground">Truy cập nhanh</h2>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {QUICK_LINKS.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="flex items-center gap-3 rounded-lg border bg-background p-4 transition-colors hover:bg-muted/50"
                >
                  <span className="text-2xl" role="img" aria-hidden>
                    {item.icon}
                  </span>
                  <span className="font-medium">{item.label}</span>
                </Link>
              ))}
            </div>
          </section>
        </>
      )}

      <p className="mt-8 text-muted-foreground">
        Chào mừng đến với Web Admin. Sử dụng menu bên trái để điều hướng.
      </p>
    </div>
  );
}
