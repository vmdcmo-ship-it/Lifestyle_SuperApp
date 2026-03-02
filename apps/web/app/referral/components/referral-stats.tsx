import { ReferralStats as ReferralStatsType } from '@lifestyle/types';

interface ReferralStatsProps {
  stats: ReferralStatsType;
}

export function ReferralStats({ stats }: ReferralStatsProps) {
  return (
    <div className="mb-8 rounded-xl bg-white p-6 shadow-lg dark:bg-gray-800">
      <div className="mb-6 flex items-center justify-between">
        <h3 className="text-xl font-bold">📊 Thống kê của bạn</h3>
        {stats.rank && (
          <div className="rounded-lg bg-gradient-to-r from-yellow-400 to-orange-500 px-4 py-2 text-sm font-bold text-white shadow-lg">
            🏆 Hạng #{stats.rank}
          </div>
        )}
      </div>

      {/* Main Stats Grid */}
      <div className="mb-6 grid grid-cols-2 gap-4 md:grid-cols-4">
        <StatCard
          icon="👥"
          value={stats.totalInvitesSent}
          label="Tổng số mời"
          color="blue"
        />
        <StatCard
          icon="✅"
          value={stats.completedInvites}
          label="Đã thành công"
          color="green"
        />
        <StatCard
          icon="💰"
          value={`${(stats.totalLifestyleBalance / 1000000).toFixed(1)}M`}
          label="Tổng thu nhập"
          color="purple"
        />
        <StatCard
          icon="🪙"
          value={stats.totalLifestyleXu.toLocaleString()}
          label="Lifestyle Xu"
          color="yellow"
        />
      </div>

      {/* Secondary Stats */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        {/* This Month */}
        <div className="rounded-lg border-2 border-purple-200 bg-purple-50 p-4 dark:border-purple-800 dark:bg-purple-900/20">
          <div className="mb-2 text-sm font-medium text-gray-600 dark:text-gray-400">
            Tháng này
          </div>
          <div className="flex items-baseline gap-2">
            <div className="text-3xl font-bold text-purple-600 dark:text-purple-400">
              {stats.thisMonthInvites}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              lời mời
            </div>
          </div>
          <div className="mt-1 text-sm font-semibold text-purple-600 dark:text-purple-400">
            +{(stats.thisMonthRewards / 1000).toFixed(0)}K VND
          </div>
        </div>

        {/* Pending */}
        <div className="rounded-lg border-2 border-orange-200 bg-orange-50 p-4 dark:border-orange-800 dark:bg-orange-900/20">
          <div className="mb-2 text-sm font-medium text-gray-600 dark:text-gray-400">
            Đang chờ
          </div>
          <div className="flex items-baseline gap-2">
            <div className="text-3xl font-bold text-orange-600 dark:text-orange-400">
              {stats.pendingInvites + stats.registeredInvites}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              người
            </div>
          </div>
          <div className="mt-1 text-xs text-orange-600 dark:text-orange-400">
            {stats.pendingInvites} chưa đăng ký · {stats.registeredInvites} đã đăng ký
          </div>
        </div>

        {/* Vouchers */}
        <div className="rounded-lg border-2 border-green-200 bg-green-50 p-4 dark:border-green-800 dark:bg-green-900/20">
          <div className="mb-2 text-sm font-medium text-gray-600 dark:text-gray-400">
            Voucher nhận được
          </div>
          <div className="flex items-baseline gap-2">
            <div className="text-3xl font-bold text-green-600 dark:text-green-400">
              {stats.totalVouchers}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              phiếu
            </div>
          </div>
          <a
            href="/profile/vouchers"
            className="mt-1 inline-block text-xs font-semibold text-green-600 hover:underline dark:text-green-400"
          >
            Xem voucher →
          </a>
        </div>
      </div>

      {/* Progress to Next Reward */}
      {stats.invitesForNextReward && (
        <div className="mt-6 rounded-lg border-2 border-dashed border-purple-300 bg-purple-50/50 p-4 dark:border-purple-700 dark:bg-purple-900/10">
          <div className="mb-2 flex items-center justify-between text-sm">
            <span className="font-medium text-gray-700 dark:text-gray-300">
              Tiến độ đến phần thưởng tiếp theo
            </span>
            <span className="font-bold text-purple-600 dark:text-purple-400">
              {stats.invitesForNextReward} lời mời nữa
            </span>
          </div>
          <div className="h-3 overflow-hidden rounded-full bg-gray-200 dark:bg-gray-700">
            <div
              className="h-full bg-gradient-to-r from-purple-600 to-pink-600 transition-all"
              style={{
                width: `${Math.min(
                  ((stats.completedInvites % 10) / 10) * 100,
                  100
                )}%`,
              }}
            ></div>
          </div>
          <p className="mt-2 text-xs text-gray-600 dark:text-gray-400">
            💡 Mỗi 10 lời mời thành công, bạn sẽ nhận thêm bonus đặc biệt!
          </p>
        </div>
      )}
    </div>
  );
}

function StatCard({
  icon,
  value,
  label,
  color,
}: {
  icon: string;
  value: string | number;
  label: string;
  color: 'blue' | 'green' | 'purple' | 'yellow';
}) {
  const colorClasses = {
    blue: 'from-blue-500 to-blue-600',
    green: 'from-green-500 to-green-600',
    purple: 'from-purple-500 to-purple-600',
    yellow: 'from-yellow-500 to-orange-500',
  };

  return (
    <div
      className={`rounded-xl bg-gradient-to-br ${colorClasses[color]} p-4 text-white shadow-lg`}
    >
      <div className="mb-2 text-3xl">{icon}</div>
      <div className="mb-1 text-2xl font-bold">{value}</div>
      <div className="text-xs text-white/80">{label}</div>
    </div>
  );
}
