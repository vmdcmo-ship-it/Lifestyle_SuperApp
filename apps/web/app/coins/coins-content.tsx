/**
 * Coins Page Content - Client Component
 * Interactive content with real-time data
 */

'use client';

import { useCoinBalance, useCoinTransactions, usePopularRedemptionItems } from '@/lib/hooks';
import { CoinTransactionType, MembershipTier } from '@lifestyle/types';
import Link from 'next/link';

export function CoinsPageContent(): JSX.Element {
  const { balance, isLoading: balanceLoading } = useCoinBalance();
  const { transactions, isLoading: transactionsLoading } = useCoinTransactions({
    limit: 10,
  });
  const { items: redemptionItems, isLoading: itemsLoading } =
    usePopularRedemptionItems(8);

  return (
    <>
      {/* Balance Overview */}
      <section className="border-b py-12">
        <div className="container mx-auto px-4">
          <h2 className="mb-8 text-center text-3xl font-bold">Số dư Lifestyle Xu</h2>

          {balanceLoading ? (
            <BalanceSkeleton />
          ) : balance ? (
            <div className="mx-auto grid max-w-5xl gap-6 md:grid-cols-3">
              {/* Main Balance */}
              <div className="rounded-2xl border-2 border-amber-200 bg-gradient-to-br from-amber-50 to-yellow-50 p-6 shadow-lg dark:border-amber-800 dark:from-amber-950 dark:to-yellow-950 md:col-span-2">
                <div className="mb-2 text-sm text-muted-foreground">Số xu hiện có</div>
                <div className="mb-4 flex items-baseline gap-2">
                  <span className="text-5xl font-bold text-amber-600 dark:text-amber-400">
                    {balance.totalCoins.toLocaleString('vi-VN')}
                  </span>
                  <span className="text-2xl text-amber-600 dark:text-amber-400">
                    Xu
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <TierBadge tier={balance.membershipTier} />
                </div>
              </div>

              {/* Stats */}
              <div className="space-y-4">
                <StatCard
                  label="Xu đã tích"
                  value={balance.lifetimeEarned.toLocaleString('vi-VN')}
                />
                <StatCard
                  label="Xu đã dùng"
                  value={balance.lifetimeSpent.toLocaleString('vi-VN')}
                />
              </div>
            </div>
          ) : (
            <EmptyBalance />
          )}
        </div>
      </section>

      {/* How to Earn */}
      <section id="how-it-works" className="bg-muted/50 py-16">
        <div className="container mx-auto px-4">
          <div className="mb-12 text-center">
            <h2 className="mb-4 text-3xl font-bold">Cách tích Lifestyle Xu</h2>
            <p className="text-lg text-muted-foreground">
              Nhận xu cho mỗi giao dịch và chuyển đổi xu thành quà tặng
            </p>
          </div>

          <div className="mx-auto grid max-w-5xl gap-8 md:grid-cols-4">
            <EarnMethodCard
              icon="🍔"
              title="Giao đồ ăn"
              description="1 xu/10,000đ"
            />
            <EarnMethodCard icon="🚗" title="Đặt xe" description="1 xu/10,000đ" />
            <EarnMethodCard
              icon="🛍️"
              title="Mua sắm"
              description="1 xu/10,000đ"
            />
            <EarnMethodCard
              icon="👥"
              title="Giới thiệu bạn"
              description="500 xu/bạn"
            />
          </div>
        </div>
      </section>

      {/* Redemption Items */}
      <section id="redemption" className="py-16">
        <div className="container mx-auto px-4">
          <div className="mb-12 flex items-center justify-between">
            <div>
              <h2 className="mb-2 text-3xl font-bold">Đổi xu lấy quà</h2>
              <p className="text-lg text-muted-foreground">
                Voucher và quà tặng hấp dẫn
              </p>
            </div>
            <Link
              href="/coins/redemption"
              className="text-amber-600 hover:underline"
            >
              Xem tất cả →
            </Link>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {itemsLoading
              ? Array.from({ length: 8 }).map((_, i) => (
                  <div
                    key={i}
                    className="h-80 animate-pulse rounded-2xl border bg-card"
                  />
                ))
              : redemptionItems.map((item) => (
                  <RedemptionItemCard key={item.id} item={item} />
                ))}
          </div>
        </div>
      </section>

      {/* Recent Transactions */}
      <section className="border-t bg-muted/50 py-16">
        <div className="container mx-auto px-4">
          <div className="mb-12 flex items-center justify-between">
            <div>
              <h2 className="mb-2 text-3xl font-bold">Lịch sử giao dịch</h2>
              <p className="text-lg text-muted-foreground">
                Theo dõi xu tích lũy và sử dụng
              </p>
            </div>
            <Link
              href="/coins/history"
              className="text-amber-600 hover:underline"
            >
              Xem tất cả →
            </Link>
          </div>

          {transactionsLoading ? (
            <TransactionsSkeleton />
          ) : transactions.length > 0 ? (
            <div className="mx-auto max-w-4xl space-y-3">
              {transactions.slice(0, 5).map((tx) => (
                <TransactionItem key={tx.id} transaction={tx} />
              ))}
            </div>
          ) : (
            <EmptyTransactions />
          )}
        </div>
      </section>

      {/* Membership Tiers */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="mb-12 text-center">
            <h2 className="mb-4 text-3xl font-bold">Hạng thành viên</h2>
            <p className="text-lg text-muted-foreground">
              Tích xu càng nhiều, ưu đãi càng lớn
            </p>
          </div>

          <div className="mx-auto grid max-w-6xl gap-6 md:grid-cols-5">
            <TierCard
              tier={MembershipTier.BRONZE}
              name="Đồng"
              minCoins="0"
              benefits={['Tích xu cơ bản', 'Đổi quà']}
              color="from-amber-700 to-amber-900"
            />
            <TierCard
              tier={MembershipTier.SILVER}
              name="Bạc"
              minCoins="1,000"
              benefits={['Tích xu +10%', 'Giảm phí ship']}
              color="from-slate-400 to-slate-600"
            />
            <TierCard
              tier={MembershipTier.GOLD}
              name="Vàng"
              minCoins="5,000"
              benefits={['Tích xu +20%', 'Ưu tiên hỗ trợ']}
              color="from-yellow-400 to-yellow-600"
            />
            <TierCard
              tier={MembershipTier.PLATINUM}
              name="Bạch Kim"
              minCoins="10,000"
              benefits={['Tích xu +30%', 'Quà sinh nhật']}
              color="from-gray-300 to-gray-500"
            />
            <TierCard
              tier={MembershipTier.DIAMOND}
              name="Kim Cương"
              minCoins="50,000"
              benefits={['Tích xu +50%', 'VIP toàn diện']}
              color="from-cyan-400 to-blue-600"
            />
          </div>
        </div>
      </section>
    </>
  );
}

// Component Types and Helpers
interface StatCardProps {
  label: string;
  value: string;
}

interface EarnMethodCardProps {
  icon: string;
  title: string;
  description: string;
}

interface TierCardProps {
  tier: MembershipTier;
  name: string;
  minCoins: string;
  benefits: string[];
  color: string;
}

// Child Components
function BalanceSkeleton(): JSX.Element {
  return (
    <div className="mx-auto grid max-w-5xl gap-6 md:grid-cols-3">
      <div className="h-48 animate-pulse rounded-2xl bg-muted md:col-span-2" />
      <div className="space-y-4">
        <div className="h-20 animate-pulse rounded-xl bg-muted" />
        <div className="h-20 animate-pulse rounded-xl bg-muted" />
      </div>
    </div>
  );
}

function EmptyBalance(): JSX.Element {
  return (
    <div className="mx-auto max-w-md text-center">
      <p className="text-muted-foreground">
        Bạn chưa có Lifestyle Xu. Hãy sử dụng dịch vụ để bắt đầu tích xu!
      </p>
    </div>
  );
}

function StatCard({ label, value }: StatCardProps): JSX.Element {
  return (
    <div className="rounded-xl border bg-card p-4">
      <div className="text-sm text-muted-foreground">{label}</div>
      <div className="text-2xl font-bold">{value} Xu</div>
    </div>
  );
}

function TierBadge({ tier }: { tier: MembershipTier }): JSX.Element {
  const tierColors = {
    [MembershipTier.BRONZE]: 'bg-amber-700 text-white',
    [MembershipTier.SILVER]: 'bg-slate-500 text-white',
    [MembershipTier.GOLD]: 'bg-yellow-500 text-white',
    [MembershipTier.PLATINUM]: 'bg-gray-400 text-white',
    [MembershipTier.DIAMOND]: 'bg-cyan-500 text-white',
  };

  const tierNames = {
    [MembershipTier.BRONZE]: 'Đồng',
    [MembershipTier.SILVER]: 'Bạc',
    [MembershipTier.GOLD]: 'Vàng',
    [MembershipTier.PLATINUM]: 'Bạch Kim',
    [MembershipTier.DIAMOND]: 'Kim Cương',
  };

  return (
    <span
      className={`inline-flex items-center rounded-full px-3 py-1 text-sm font-semibold ${tierColors[tier]}`}
    >
      ⭐ {tierNames[tier]}
    </span>
  );
}

function EarnMethodCard({ icon, title, description }: EarnMethodCardProps): JSX.Element {
  return (
    <div className="rounded-2xl border bg-card p-6 text-center transition-all hover:shadow-lg">
      <div className="mb-4 text-5xl" role="img" aria-label={title}>
        {icon}
      </div>
      <h3 className="mb-2 font-semibold">{title}</h3>
      <p className="text-sm text-amber-600 dark:text-amber-400">{description}</p>
    </div>
  );
}

function RedemptionItemCard({ item }: { item: any }): JSX.Element {
  return (
    <div className="group overflow-hidden rounded-2xl border bg-card transition-all hover:shadow-lg">
      <div className="aspect-square bg-gradient-to-br from-amber-100 to-orange-100 dark:from-amber-900 dark:to-orange-900" />
      <div className="p-4">
        <h3 className="mb-2 font-semibold line-clamp-2">{item.name}</h3>
        <div className="mb-3 flex items-center gap-2">
          <svg className="h-5 w-5 text-amber-500" viewBox="0 0 24 24" fill="currentColor">
            <circle cx="12" cy="12" r="10" />
          </svg>
          <span className="font-bold text-amber-600 dark:text-amber-400">
            {item.coinCost.toLocaleString('vi-VN')} Xu
          </span>
        </div>
        <button className="w-full rounded-lg bg-amber-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-amber-700">
          Đổi ngay
        </button>
      </div>
    </div>
  );
}

function TransactionsSkeleton(): JSX.Element {
  return (
    <div className="mx-auto max-w-4xl space-y-3">
      {Array.from({ length: 5 }).map((_, i) => (
        <div key={i} className="h-16 animate-pulse rounded-xl bg-muted" />
      ))}
    </div>
  );
}

function EmptyTransactions(): JSX.Element {
  return (
    <div className="mx-auto max-w-md text-center">
      <p className="text-muted-foreground">Chưa có giao dịch nào</p>
    </div>
  );
}

function TransactionItem({ transaction }: { transaction: any }): JSX.Element {
  const isEarn = transaction.type === CoinTransactionType.EARN;

  return (
    <div className="flex items-center justify-between rounded-xl border bg-card p-4">
      <div className="flex items-center gap-3">
        <div
          className={`flex h-10 w-10 items-center justify-center rounded-full ${
            isEarn ? 'bg-green-100 dark:bg-green-900' : 'bg-red-100 dark:bg-red-900'
          }`}
        >
          <span className="text-xl">{isEarn ? '➕' : '➖'}</span>
        </div>
        <div>
          <div className="font-medium">{transaction.description}</div>
          <div className="text-sm text-muted-foreground">
            {new Date(transaction.createdAt).toLocaleDateString('vi-VN')}
          </div>
        </div>
      </div>
      <div
        className={`text-lg font-bold ${
          isEarn ? 'text-green-600' : 'text-red-600'
        }`}
      >
        {isEarn ? '+' : '-'}
        {Math.abs(transaction.amount).toLocaleString('vi-VN')} Xu
      </div>
    </div>
  );
}

function TierCard({ tier, name, minCoins, benefits, color }: TierCardProps): JSX.Element {
  return (
    <div className="group rounded-2xl border bg-card p-6 text-center transition-all hover:scale-105 hover:shadow-lg">
      <div
        className={`mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br ${color}`}
      >
        <span className="text-2xl">⭐</span>
      </div>
      <h3 className="mb-2 text-xl font-bold">{name}</h3>
      <p className="mb-4 text-sm text-amber-600 dark:text-amber-400">
        Từ {minCoins} xu
      </p>
      <ul className="space-y-2 text-left text-sm text-muted-foreground">
        {benefits.map((benefit, i) => (
          <li key={i} className="flex items-start gap-2">
            <span className="text-green-500">✓</span>
            <span>{benefit}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
