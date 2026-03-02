'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/contexts/auth-context';
import { loyaltyService } from '@/lib/services/loyalty.service';
import { walletService } from '@/lib/services/wallet.service';

interface XuTransaction {
  id: string;
  type: 'earned' | 'redeemed';
  amount: number;
  source: string;
  description: string;
  date: string;
  icon: string;
  balanceAfter: number;
}

type MembershipTier = 'GOLD' | 'PLATINUM' | 'DIAMOND';

interface TierInfo {
  name: string;
  tier: MembershipTier;
  minPoints: number;
  color: string;
  gradient: string;
  icon: string;
  benefits: string[];
  earnRate: number;
}

const TIERS: TierInfo[] = [
  {
    name: 'Gold',
    tier: 'GOLD',
    minPoints: 0,
    color: 'text-yellow-600',
    gradient: 'from-yellow-400 to-yellow-600',
    icon: '🥇',
    earnRate: 100,
    benefits: [
      'Tích 1 Xu cho mỗi 1.000đ chi tiêu',
      'Sinh nhật tặng 500 Xu',
      'Ưu đãi đặc biệt từ đối tác',
      'Hỗ trợ khách hàng ưu tiên',
    ],
  },
  {
    name: 'Platinum',
    tier: 'PLATINUM',
    minPoints: 5000,
    color: 'text-slate-600',
    gradient: 'from-slate-400 to-slate-600',
    icon: '💎',
    earnRate: 120,
    benefits: [
      'Tích 1.2 Xu cho mỗi 1.000đ chi tiêu (+20%)',
      'Sinh nhật tặng 1.000 Xu',
      'Miễn phí vận chuyển đơn từ 0đ',
      'Voucher độc quyền hàng tháng',
      'Ưu tiên hỗ trợ 24/7',
      'Hoàn 2% giá trị đơn hàng',
    ],
  },
  {
    name: 'Diamond',
    tier: 'DIAMOND',
    minPoints: 15000,
    color: 'text-cyan-600',
    gradient: 'from-cyan-400 via-blue-500 to-purple-600',
    icon: '💠',
    earnRate: 150,
    benefits: [
      'Tích 1.5 Xu cho mỗi 1.000đ chi tiêu (+50%)',
      'Sinh nhật tặng 2.000 Xu',
      'Miễn phí vận chuyển mọi đơn hàng',
      'Voucher VIP độc quyền hàng tuần',
      'Chăm sóc khách hàng VIP 24/7',
      'Hoàn 5% giá trị đơn hàng',
      'Trải nghiệm dịch vụ cao cấp',
      'Ưu tiên đặt chỗ & booking',
    ],
  },
];

const SOURCE_ICONS: Record<string, string> = {
  XU_EARN: '💰',
  XU_SPEND: '🎁',
  BONUS: '🎉',
  default: '📌',
};

function mapWalletTxToXu(t: { id: string; type: string; amount: number; description?: string; createdAt: string; balanceAfter?: number }): XuTransaction {
  const isEarn = t.type === 'XU_EARN' || t.type === 'BONUS';
  return {
    id: t.id,
    type: isEarn ? 'earned' : 'redeemed',
    amount: isEarn ? Math.abs(t.amount) : -Math.abs(t.amount),
    source: t.type === 'XU_EARN' ? 'Tích Xu' : t.type === 'XU_SPEND' ? 'Đổi quà' : 'Bonus',
    description: t.description || (isEarn ? `+${t.amount} Xu` : `-${Math.abs(t.amount)} Xu`),
    date: t.createdAt,
    icon: SOURCE_ICONS[t.type] || SOURCE_ICONS.default,
    balanceAfter: t.balanceAfter ?? 0,
  };
}

export function MyCoinsContent() {
  const router = useRouter();
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const [xuBalance, setXuBalance] = useState(0);
  const [currentTier, setCurrentTier] = useState<MembershipTier>('PLATINUM');
  const [showBenefits, setShowBenefits] = useState(false);
  const [transactions, setTransactions] = useState<XuTransaction[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!isAuthenticated) {
      setIsLoading(false);
      return;
    }
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const [xuRes, txRes] = await Promise.all([
          loyaltyService.getXuBalance(),
          walletService.getXuTransactions(1, 20),
        ]);
        setXuBalance(xuRes.xuBalance);
        setTransactions((txRes.data || []).map(mapWalletTxToXu));
      } catch {
        setXuBalance(0);
        setTransactions([]);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [isAuthenticated]);

  if (!authLoading && !isAuthenticated) {
    router.replace('/login');
    return null;
  }

  if (authLoading || (isAuthenticated && isLoading)) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-purple-600 border-t-transparent" />
      </div>
    );
  }

  const totalEarned = transactions
    .filter((tx) => tx.type === 'earned')
    .reduce((sum, tx) => sum + tx.amount, 0);

  const totalRedeemed = transactions
    .filter((tx) => tx.type === 'redeemed')
    .reduce((sum, tx) => sum + Math.abs(tx.amount), 0);

  const currentTierInfo = TIERS.find((t) => t.tier === currentTier) || TIERS[0];
  const currentTierIndex = TIERS.findIndex((t) => t.tier === currentTier);
  const nextTier = TIERS[currentTierIndex + 1];

  const progressToNextTier = nextTier
    ? ((xuBalance - currentTierInfo.minPoints) / (nextTier.minPoints - currentTierInfo.minPoints)) * 100
    : 100;

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 via-yellow-50 to-white dark:from-gray-900 dark:via-gray-850 dark:to-gray-950">
      {/* Header */}
      <section className="bg-gradient-to-br from-amber-500 via-orange-500 to-yellow-600 py-12 text-white">
        <div className="container mx-auto px-4">
          <div className="mb-4">
            <Link
              href="/profile"
              className="inline-flex items-center gap-2 text-white/80 hover:text-white"
            >
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Quay lại Tài khoản
            </Link>
          </div>
          <h1 className="text-3xl font-bold md:text-4xl">💰 Lifestyle Xu của tôi</h1>
          <p className="mt-2 text-white/90">Quản lý điểm tích lũy và đổi quà</p>
        </div>
      </section>

      {/* Membership Tier Card */}
      <section className="relative -mt-8 pb-8">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-4xl">
            {/* Tier Badge */}
            <div className={`mb-4 rounded-2xl bg-gradient-to-r ${currentTierInfo.gradient} p-6 text-center text-white shadow-2xl`}>
              <div className="mb-2 text-5xl">{currentTierInfo.icon}</div>
              <div className="text-2xl font-bold">Hạng {currentTierInfo.name}</div>
              <div className="text-sm opacity-90">Tỷ lệ tích điểm: {currentTierInfo.earnRate}%</div>

              {nextTier && (
                <div className="mt-4">
                  <div className="mb-2 text-sm">
                    Còn {(nextTier.minPoints - xuBalance).toLocaleString('vi-VN')} Xu để đạt hạng {nextTier.name}
                  </div>
                  <div className="h-2 overflow-hidden rounded-full bg-white/30">
                    <div
                      className="h-full bg-white transition-all duration-500"
                      style={{ width: `${Math.min(progressToNextTier, 100)}%` }}
                    ></div>
                  </div>
                </div>
              )}
            </div>

            {/* Balance Card */}
            <div className="group relative overflow-hidden rounded-3xl bg-gradient-to-br from-amber-400 via-orange-500 to-yellow-500 p-1 shadow-2xl transition-all hover:scale-[1.02] hover:shadow-3xl">
              <div className="relative rounded-3xl bg-gradient-to-br from-amber-50 to-yellow-100 p-8 dark:from-gray-800 dark:to-gray-900">
                {/* Animated background */}
                <div className="absolute inset-0 opacity-30">
                  <div className="absolute left-1/4 top-1/4 h-32 w-32 animate-pulse rounded-full bg-amber-300 blur-3xl"></div>
                  <div className="absolute bottom-1/4 right-1/4 h-40 w-40 animate-pulse rounded-full bg-orange-300 blur-3xl"></div>
                </div>

                <div className="relative text-center">
                  <div className="mb-3 text-sm font-medium text-amber-700 dark:text-amber-400">
                    Tổng số dư
                  </div>
                  <div className="mb-6 flex items-center justify-center gap-3">
                    <CoinIcon size="xlarge" />
                    <div className="text-6xl font-black tracking-tight text-amber-600 dark:text-amber-400 md:text-7xl">
                      {xuBalance.toLocaleString('vi-VN')}
                    </div>
                    <span className="text-3xl font-bold text-amber-600 dark:text-amber-400">
                      Xu
                    </span>
                  </div>

                  {/* Quick Stats */}
                  <div className="mt-6 grid grid-cols-2 gap-4">
                    <div className="rounded-xl bg-white/50 p-4 backdrop-blur-sm dark:bg-gray-700/50">
                      <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                        +{totalEarned.toLocaleString('vi-VN')}
                      </div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">
                        Tổng đã tích lũy
                      </div>
                    </div>
                    <div className="rounded-xl bg-white/50 p-4 backdrop-blur-sm dark:bg-gray-700/50">
                      <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                        {totalRedeemed.toLocaleString('vi-VN')}
                      </div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">
                        Tổng đã đổi quà
                      </div>
                    </div>
                  </div>

                  {/* CTA Buttons */}
                  <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-center">
                    <Link
                      href="/savings-packages"
                      className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 px-8 py-4 text-lg font-bold text-white shadow-lg transition-all hover:scale-105 hover:shadow-xl active:scale-95"
                    >
                      🎁 Đổi quà ngay
                      <svg
                        className="h-5 w-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M13 7l5 5m0 0l-5 5m5-5H6"
                        />
                      </svg>
                    </Link>
                    <button
                      onClick={() => setShowBenefits(!showBenefits)}
                      className="inline-flex items-center justify-center gap-2 rounded-xl border-2 border-amber-600 bg-white px-8 py-4 text-lg font-bold text-amber-600 transition-all hover:bg-amber-50 dark:bg-gray-800 dark:hover:bg-gray-700"
                    >
                      ⭐ Ưu đãi hạng của tôi
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      {showBenefits && (
        <section className="pb-8">
          <div className="container mx-auto px-4">
            <div className="mx-auto max-w-4xl rounded-2xl bg-white p-6 shadow-xl dark:bg-gray-800">
              <div className="mb-6 flex items-center justify-between">
                <h2 className="text-2xl font-bold">⭐ Quyền lợi hạng {currentTierInfo.name}</h2>
                <button
                  onClick={() => setShowBenefits(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  ✕
                </button>
              </div>
              <ul className="grid gap-3 md:grid-cols-2">
                {currentTierInfo.benefits.map((benefit, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="mt-0.5 text-green-500">✓</span>
                    <span className="text-gray-700 dark:text-gray-300">{benefit}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>
      )}

      {/* Transaction History */}
      <section className="pb-16">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-4xl">
            <div className="mb-6">
              <h2 className="mb-2 text-2xl font-bold">📊 Lịch sử điểm của tôi</h2>
              <p className="text-sm text-muted-foreground">
                Minh bạch mọi giao dịch Lifestyle Xu
              </p>
            </div>

            <div className="space-y-3 rounded-2xl bg-white p-6 shadow-lg dark:bg-gray-800">
              {transactions.map((tx) => (
                <div
                  key={tx.id}
                  className="group grid grid-cols-1 gap-4 rounded-xl border border-gray-200 p-4 transition-all hover:border-amber-300 hover:bg-amber-50 dark:border-gray-700 dark:hover:border-amber-600 dark:hover:bg-gray-750 md:grid-cols-12 md:items-center"
                >
                  {/* Icon */}
                  <div className="col-span-1">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-amber-100 to-yellow-100 text-2xl transition-transform group-hover:scale-110 dark:from-amber-900 dark:to-yellow-900">
                      {tx.icon}
                    </div>
                  </div>

                  {/* Info */}
                  <div className="col-span-5">
                    <div className="font-semibold">{tx.source}</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      {tx.description}
                    </div>
                    <div className="text-xs text-gray-500 md:hidden">
                      {new Date(tx.date).toLocaleString('vi-VN', {
                        day: '2-digit',
                        month: '2-digit',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </div>
                  </div>

                  {/* Amount */}
                  <div className="col-span-2 text-center">
                    <div
                      className={`text-xl font-bold ${
                        tx.type === 'earned'
                          ? 'text-green-600 dark:text-green-400'
                          : 'text-red-600 dark:text-red-400'
                      }`}
                    >
                      {tx.amount > 0 ? '+' : ''}
                      {tx.amount.toLocaleString('vi-VN')}
                    </div>
                    <div className="text-xs text-gray-500">
                      {tx.type === 'earned' ? 'Nhận' : 'Đổi quà'}
                    </div>
                  </div>

                  {/* Balance After */}
                  <div className="col-span-2 text-center">
                    <div className="font-semibold text-amber-600 dark:text-amber-400">
                      {tx.balanceAfter.toLocaleString('vi-VN')}
                    </div>
                    <div className="text-xs text-gray-500">Số dư</div>
                  </div>

                  {/* Date */}
                  <div className="col-span-2 hidden text-right md:block">
                    <div className="text-sm">
                      {new Date(tx.date).toLocaleDateString('vi-VN', {
                        day: '2-digit',
                        month: '2-digit',
                        year: 'numeric',
                      })}
                    </div>
                    <div className="text-xs text-gray-500">
                      {new Date(tx.date).toLocaleTimeString('vi-VN', {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Load More */}
            <div className="mt-6 text-center">
              <button className="rounded-lg border-2 border-dashed border-gray-300 px-6 py-3 font-semibold text-gray-600 transition-colors hover:border-amber-500 hover:text-amber-600 dark:border-gray-700 dark:text-gray-400 dark:hover:border-amber-400 dark:hover:text-amber-400">
                Xem thêm lịch sử →
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

interface CoinIconProps {
  size?: 'normal' | 'large' | 'xlarge';
}

function CoinIcon({ size = 'normal' }: CoinIconProps) {
  const sizeClasses = {
    normal: 'h-6 w-6',
    large: 'h-16 w-16',
    xlarge: 'h-20 w-20',
  };

  return (
    <svg
      className={`${sizeClasses[size]} inline-block text-amber-400 drop-shadow-lg`}
      viewBox="0 0 24 24"
      fill="currentColor"
    >
      <circle cx="12" cy="12" r="10" className="text-yellow-500" />
      <circle cx="12" cy="12" r="7" className="text-amber-400" />
      <text
        x="12"
        y="16"
        fontSize="10"
        fontWeight="bold"
        textAnchor="middle"
        className="fill-amber-600"
      >
        Xu
      </text>
    </svg>
  );
}
