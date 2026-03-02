'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { couponsService, type CouponStatsResponse } from '@/lib/coupons.service';
import { marketingService, type CampaignStats } from '@/lib/marketing.service';
import { luckyWheelService } from '@/lib/lucky-wheel.service';
import { affiliateService } from '@/lib/affiliate.service';
import { loyaltyXuService } from '@/lib/loyalty-xu.service';
import { runToEarnService } from '@/lib/run-to-earn.service';
import { dashboardService, type RegionStat } from '@/lib/dashboard.service';

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

function discountLabel(type: string, value: number): string {
  if (type === 'PERCENTAGE') return value + '%';
  return value.toLocaleString('vi-VN') + ' đ';
}

function formatMoney(n: number): string {
  return new Intl.NumberFormat('vi-VN').format(n);
}

export default function MarketingReportsPage(): JSX.Element {
  const [couponStats, setCouponStats] = useState<CouponStatsResponse | null>(null);
  const [campaignStats, setCampaignStats] = useState<CampaignStats | null>(null);
  const [luckyWheelStats, setLuckyWheelStats] = useState<{
    totalSpins: number;
    totalPrizesWon: number;
  } | null>(null);
  const [luckyWheelCampaigns, setLuckyWheelCampaigns] = useState<
    Array<{ budget: number; budgetUsed: number }>
  >([]);
  const [affiliateStats, setAffiliateStats] = useState<{ budgetSpentTotal: number } | null>(null);
  const [loyaltyXuStats, setLoyaltyXuStats] = useState<{
    totalXuEarned: number;
    totalXuSpent: number;
    estimatedBudgetImpactVnd: number;
  } | null>(null);
  const [runToEarnStats, setRunToEarnStats] = useState<{
    budgetUsedTotal: number;
    totalParticipations: number;
  } | null>(null);
  const [regionStats, setRegionStats] = useState<RegionStat[]>([]);
  const [regionDays, setRegionDays] = useState(30);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    Promise.all([
      couponsService
        .getStats()
        .then(setCouponStats)
        .catch(() => setCouponStats(null)),
      marketingService
        .getCampaignStats()
        .then(setCampaignStats)
        .catch(() => setCampaignStats(null)),
      luckyWheelService
        .getStats()
        .then((s) => {
          setLuckyWheelStats({ totalSpins: s.totalSpins, totalPrizesWon: s.totalPrizesWon });
          return s;
        })
        .then(() => luckyWheelService.listCampaigns())
        .then((c) =>
          setLuckyWheelCampaigns(
            c.map((x) => ({ budget: x.budget, budgetUsed: x.budgetUsed ?? 0 })),
          ),
        )
        .catch(() => {
          setLuckyWheelStats(null);
          setLuckyWheelCampaigns([]);
        }),
      affiliateService
        .getStats()
        .then(setAffiliateStats)
        .catch(() => setAffiliateStats(null)),
      loyaltyXuService
        .getStats()
        .then(setLoyaltyXuStats)
        .catch(() => setLoyaltyXuStats(null)),
      runToEarnService
        .getStats()
        .then(setRunToEarnStats)
        .catch(() => setRunToEarnStats(null)),
    ]).finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    dashboardService
      .getRegionStats(regionDays)
      .then(setRegionStats)
      .catch(() => setRegionStats([]));
  }, [regionDays]);

  const lwTotalBudgetUsed = luckyWheelCampaigns.reduce((s, c) => s + c.budgetUsed, 0);
  const totalBudgetSpent =
    lwTotalBudgetUsed +
    (affiliateStats?.budgetSpentTotal ?? 0) +
    (loyaltyXuStats?.estimatedBudgetImpactVnd ?? 0) +
    (runToEarnStats?.budgetUsedTotal ?? 0);

  return (
    <div>
      <Link href="/marketing" className="mb-4 inline-block text-sm text-primary hover:underline">
        ← Trung tâm Marketing
      </Link>
      <h1 className="mb-4 text-2xl font-bold">Báo cáo ngân sách khuyến mãi</h1>
      <p className="mb-6 text-sm text-muted-foreground">
        Tổng hợp ngân sách: Voucher, Lucky Wheel, Affiliate, Loyalty Xu, Run to Earn.
      </p>

      {error && (
        <div className="mb-4 rounded-lg bg-destructive/10 px-4 py-3 text-sm text-destructive">
          {error}
        </div>
      )}

      {loading ? (
        <div className="flex items-center justify-center py-12 text-muted-foreground">
          Đang tải...
        </div>
      ) : !couponStats &&
        !campaignStats &&
        !luckyWheelStats &&
        !affiliateStats &&
        !loyaltyXuStats &&
        !runToEarnStats ? (
        <div className="rounded-lg border bg-background p-12 text-center text-muted-foreground">
          Không thể tải báo cáo. Kiểm tra kết nối API.
        </div>
      ) : (
        <>
          {/* Tổng chi ngân sách */}
          <section className="mb-6 rounded-lg border-2 border-primary/30 bg-primary/5 p-6">
            <h2 className="mb-2 text-sm font-medium text-muted-foreground">
              Tổng chi từ ngân sách khuyến mãi
            </h2>
            <p className="text-3xl font-bold text-primary">{formatMoney(totalBudgetSpent)} đ</p>
            <p className="mt-1 text-xs text-muted-foreground">
              Lucky Wheel + Affiliate + Loyalty Xu (ước tính) + Run to Earn
            </p>
          </section>

          {/* Tổng quan theo chương trình */}
          <section className="mb-8">
            <h2 className="mb-4 text-lg font-semibold text-muted-foreground">
              Chi tiết theo chương trình
            </h2>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
              <Link
                href="/lucky-wheel"
                className="rounded-lg border bg-background p-4 transition-colors hover:bg-muted/50"
              >
                <p className="text-sm text-muted-foreground">Lucky Wheel - Đã chi</p>
                <p className="mt-1 text-2xl font-bold text-primary">
                  {formatMoney(lwTotalBudgetUsed)} đ
                </p>
                <p className="mt-1 text-xs text-muted-foreground">
                  {luckyWheelStats
                    ? `${luckyWheelStats.totalSpins} lượt quay • ${luckyWheelStats.totalPrizesWon} giải`
                    : '—'}
                </p>
              </Link>
              <Link
                href="/marketing/affiliate"
                className="rounded-lg border bg-background p-4 transition-colors hover:bg-muted/50"
              >
                <p className="text-sm text-muted-foreground">Affiliate - Đã chi</p>
                <p className="mt-1 text-2xl font-bold text-primary">
                  {formatMoney(affiliateStats?.budgetSpentTotal ?? 0)} đ
                </p>
                <p className="mt-1 text-xs text-muted-foreground">Giới thiệu bạn bè</p>
              </Link>
              <Link
                href="/marketing/loyalty-xu"
                className="rounded-lg border bg-background p-4 transition-colors hover:bg-muted/50"
              >
                <p className="text-sm text-muted-foreground">Loyalty Xu - Ước tính chi</p>
                <p className="mt-1 text-2xl font-bold">
                  {formatMoney(loyaltyXuStats?.estimatedBudgetImpactVnd ?? 0)} đ
                </p>
                <p className="mt-1 text-xs text-muted-foreground">
                  {loyaltyXuStats
                    ? `${loyaltyXuStats.totalXuEarned.toLocaleString()} Xu đã tích`
                    : '—'}
                </p>
              </Link>
              <Link
                href="/marketing/run-to-earn"
                className="rounded-lg border bg-background p-4 transition-colors hover:bg-muted/50"
              >
                <p className="text-sm text-muted-foreground">Run to Earn - Đã chi</p>
                <p className="mt-1 text-2xl font-bold text-primary">
                  {formatMoney(runToEarnStats?.budgetUsedTotal ?? 0)} đ
                </p>
                <p className="mt-1 text-xs text-muted-foreground">
                  {runToEarnStats
                    ? `${runToEarnStats.totalParticipations} lượt tham gia`
                    : 'Chạy kiếm Xu'}
                </p>
              </Link>
              <div className="rounded-lg border bg-background p-4">
                <p className="text-sm text-muted-foreground">Voucher - Lượt đã dùng</p>
                <p className="mt-1 text-2xl font-bold">{couponStats?.totalRedemptions ?? '—'}</p>
                <p className="mt-1 text-xs text-muted-foreground">Giá trị giảm khi áp dụng</p>
              </div>
            </div>
          </section>

          {/* Thống kê chiến dịch */}
          {campaignStats && (
            <section className="mb-8">
              <h2 className="mb-4 text-lg font-semibold text-muted-foreground">
                Thống kê chiến dịch
              </h2>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
                <Link
                  href="/marketing/campaigns"
                  className="rounded-lg border bg-background p-4 transition-colors hover:bg-muted/50"
                >
                  <p className="text-sm text-muted-foreground">Tổng chiến dịch</p>
                  <p className="mt-1 text-2xl font-bold">{campaignStats.total}</p>
                </Link>
                <Link
                  href="/marketing/campaigns?status=DRAFT"
                  className="rounded-lg border bg-background p-4 transition-colors hover:bg-muted/50"
                >
                  <p className="text-sm text-muted-foreground">Nháp</p>
                  <p className="mt-1 text-2xl font-bold text-amber-600">{campaignStats.draft}</p>
                </Link>
                <Link
                  href="/marketing/campaigns?status=ACTIVE"
                  className="rounded-lg border bg-background p-4 transition-colors hover:bg-muted/50"
                >
                  <p className="text-sm text-muted-foreground">Đang chạy</p>
                  <p className="mt-1 text-2xl font-bold text-green-600">{campaignStats.active}</p>
                </Link>
                <Link
                  href="/marketing/campaigns?status=PAUSED"
                  className="rounded-lg border bg-background p-4 transition-colors hover:bg-muted/50"
                >
                  <p className="text-sm text-muted-foreground">Tạm dừng</p>
                  <p className="mt-1 text-2xl font-bold text-gray-600">{campaignStats.paused}</p>
                </Link>
                <Link
                  href="/marketing/campaigns?status=ENDED"
                  className="rounded-lg border bg-background p-4 transition-colors hover:bg-muted/50"
                >
                  <p className="text-sm text-muted-foreground">Kết thúc</p>
                  <p className="mt-1 text-2xl font-bold text-muted-foreground">
                    {campaignStats.ended}
                  </p>
                </Link>
              </div>
            </section>
          )}

          {/* Báo cáo theo vùng */}
          <section className="mb-8">
            <div className="mb-4 flex flex-wrap items-center justify-between gap-4">
              <h2 className="text-lg font-semibold text-muted-foreground">
                Báo cáo đơn hàng & doanh thu theo vùng
              </h2>
              <select
                value={regionDays}
                onChange={(e) => setRegionDays(Number(e.target.value))}
                className="rounded border border-input bg-background px-2 py-1 text-sm"
              >
                <option value={7}>7 ngày</option>
                <option value={14}>14 ngày</option>
                <option value={30}>30 ngày</option>
                <option value={90}>90 ngày</option>
              </select>
            </div>
            {regionStats.length === 0 ? (
              <div className="rounded-lg border bg-background p-8 text-center text-muted-foreground">
                Chưa có dữ liệu đơn hàng theo vùng trong khoảng thời gian này.
              </div>
            ) : (
              <div className="overflow-x-auto rounded-lg border">
                <table className="w-full text-sm">
                  <thead className="border-b bg-muted/50">
                    <tr>
                      <th className="px-4 py-3 text-left font-medium">Thành phố / Vùng</th>
                      <th className="px-4 py-3 text-right font-medium">Số đơn hàng</th>
                      <th className="px-4 py-3 text-right font-medium">Doanh thu</th>
                    </tr>
                  </thead>
                  <tbody>
                    {regionStats.map((r) => (
                      <tr key={r.region} className="border-b last:border-0 hover:bg-muted/30">
                        <td className="px-4 py-3 font-medium">{r.region}</td>
                        <td className="px-4 py-3 text-right">{formatMoney(r.orderCount)}</td>
                        <td className="px-4 py-3 text-right font-medium">
                          {formatMoney(r.revenue)} đ
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </section>

          {/* Tổng quan coupon */}
          <section className="mb-8">
            <h2 className="mb-4 text-lg font-semibold text-muted-foreground">Tổng quan coupon</h2>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              <div className="rounded-lg border bg-background p-4">
                <p className="text-sm text-muted-foreground">Tổng coupon</p>
                <p className="mt-1 text-2xl font-bold">{couponStats?.totalCoupons ?? '—'}</p>
              </div>
              <div className="rounded-lg border bg-background p-4">
                <p className="text-sm text-muted-foreground">Đang hoạt động</p>
                <p className="mt-1 text-2xl font-bold text-green-600">
                  {couponStats?.activeCoupons ?? '—'}
                </p>
              </div>
              <div className="rounded-lg border bg-background p-4">
                <p className="text-sm text-muted-foreground">Tổng lượt đã dùng</p>
                <p className="mt-1 text-2xl font-bold text-primary">
                  {couponStats?.totalRedemptions ?? '—'}
                </p>
              </div>
            </div>
          </section>

          <section>
            <h2 className="mb-4 text-lg font-semibold text-muted-foreground">
              Top coupon theo lượt sử dụng
            </h2>
            {!couponStats?.topCouponsByUsage?.length ? (
              <div className="rounded-lg border bg-background p-8 text-center text-muted-foreground">
                Chưa có coupon nào được sử dụng
              </div>
            ) : (
              <div className="overflow-x-auto rounded-lg border">
                <table className="w-full text-sm">
                  <thead className="border-b bg-muted/50">
                    <tr>
                      <th className="px-4 py-3 text-left font-medium">Mã</th>
                      <th className="px-4 py-3 text-left font-medium">Tiêu đề</th>
                      <th className="px-4 py-3 text-right font-medium">Giảm giá</th>
                      <th className="px-4 py-3 text-right font-medium">Đã dùng</th>
                      <th className="px-4 py-3 text-center font-medium">Trạng thái</th>
                      <th className="px-4 py-3 text-left font-medium">Hạn</th>
                      <th className="px-4 py-3 text-left font-medium"></th>
                    </tr>
                  </thead>
                  <tbody>
                    {(couponStats?.topCouponsByUsage ?? []).map((c) => (
                      <tr key={c.id} className="border-b last:border-0 hover:bg-muted/30">
                        <td className="px-4 py-3 font-mono font-medium">{c.code}</td>
                        <td className="px-4 py-3">{c.title}</td>
                        <td className="px-4 py-3 text-right">
                          {discountLabel(c.discountType, c.discountValue)}
                        </td>
                        <td className="px-4 py-3 text-right">
                          {c.usedCount}
                          {c.usageLimit != null ? ' / ' + c.usageLimit : ''}
                        </td>
                        <td className="px-4 py-3 text-center">
                          <span
                            className={
                              c.isActive
                                ? 'inline-flex rounded-full bg-green-100 px-2 py-0.5 text-xs font-medium text-green-800'
                                : 'inline-flex rounded-full bg-gray-100 px-2 py-0.5 text-xs font-medium text-gray-600'
                            }
                          >
                            {c.isActive ? 'Đang áp dụng' : 'Tắt'}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-muted-foreground">{formatDate(c.endDate)}</td>
                        <td className="px-4 py-3">
                          <Link href={'/coupons/' + c.id} className="text-primary hover:underline">
                            Chi tiết
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </section>
        </>
      )}
    </div>
  );
}
