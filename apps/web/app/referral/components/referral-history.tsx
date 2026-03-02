import { ReferralHistoryItem, ReferralStatus } from '@lifestyle/types';

interface ReferralHistoryProps {
  history: ReferralHistoryItem[];
}

export function ReferralHistory({ history }: ReferralHistoryProps) {
  return (
    <div className="rounded-xl bg-white p-6 shadow-lg dark:bg-gray-800">
      <div className="mb-6 flex items-center justify-between">
        <h3 className="text-xl font-bold">📜 Lịch sử giới thiệu</h3>
        <span className="text-sm text-gray-600 dark:text-gray-400">
          {history.length} lời mời
        </span>
      </div>

      <div className="space-y-4">
        {history.map((item) => (
          <HistoryItem key={item.id} item={item} />
        ))}
      </div>

      {/* View All */}
      <div className="mt-6 text-center">
        <button className="rounded-lg border-2 border-purple-600 px-6 py-2 font-semibold text-purple-600 transition-all hover:bg-purple-50 dark:border-purple-400 dark:text-purple-400 dark:hover:bg-purple-900/20">
          Xem tất cả
        </button>
      </div>
    </div>
  );
}

function HistoryItem({ item }: { item: ReferralHistoryItem }) {
  const getStatusConfig = (status: ReferralStatus) => {
    switch (status) {
      case ReferralStatus.COMPLETED:
        return {
          icon: '✅',
          label: 'Đã nhận thưởng',
          color: 'text-green-600 dark:text-green-400',
          bgColor: 'bg-green-50 dark:bg-green-900/20',
        };
      case ReferralStatus.REGISTERED:
        return {
          icon: '⏳',
          label: 'Đang chờ hoàn thành',
          color: 'text-blue-600 dark:text-blue-400',
          bgColor: 'bg-blue-50 dark:bg-blue-900/20',
        };
      case ReferralStatus.PENDING:
        return {
          icon: '📩',
          label: 'Chưa đăng ký',
          color: 'text-orange-600 dark:text-orange-400',
          bgColor: 'bg-orange-50 dark:bg-orange-900/20',
        };
      case ReferralStatus.EXPIRED:
        return {
          icon: '⏰',
          label: 'Hết hạn',
          color: 'text-gray-600 dark:text-gray-400',
          bgColor: 'bg-gray-50 dark:bg-gray-900/20',
        };
      default:
        return {
          icon: '❌',
          label: 'Đã hủy',
          color: 'text-red-600 dark:text-red-400',
          bgColor: 'bg-red-50 dark:bg-red-900/20',
        };
    }
  };

  const statusConfig = getStatusConfig(item.status);

  return (
    <div className="flex items-center gap-4 rounded-lg border border-gray-200 p-4 transition-all hover:border-purple-300 dark:border-gray-700 dark:hover:border-purple-600">
      {/* Avatar/Icon */}
      <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-purple-500 to-pink-500 text-2xl text-white">
        {item.refereeName.charAt(0).toUpperCase()}
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <div className="mb-1 font-semibold text-gray-900 dark:text-gray-100">
          {item.refereeName}
        </div>
        <div className="text-xs text-gray-500 dark:text-gray-400">
          {item.date.toLocaleDateString('vi-VN', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
          })}
        </div>
        
        {/* Progress Bar (for non-completed) */}
        {item.status !== ReferralStatus.COMPLETED && item.progressPercentage > 0 && (
          <div className="mt-2">
            <div className="mb-1 flex justify-between text-xs">
              <span className="text-gray-600 dark:text-gray-400">Tiến độ</span>
              <span className="font-semibold text-purple-600 dark:text-purple-400">
                {item.progressPercentage}%
              </span>
            </div>
            <div className="h-1.5 overflow-hidden rounded-full bg-gray-200 dark:bg-gray-700">
              <div
                className="h-full bg-gradient-to-r from-purple-600 to-pink-600 transition-all"
                style={{ width: `${item.progressPercentage}%` }}
              ></div>
            </div>
          </div>
        )}
      </div>

      {/* Status & Reward */}
      <div className="flex flex-col items-end gap-2">
        <div
          className={`flex items-center gap-1 rounded-full ${statusConfig.bgColor} px-3 py-1 text-xs font-semibold ${statusConfig.color}`}
        >
          <span>{statusConfig.icon}</span>
          <span>{statusConfig.label}</span>
        </div>
        
        {item.rewardReceived && (
          <div className="text-right">
            <div className="text-sm font-bold text-green-600 dark:text-green-400">
              +{item.rewardReceived.amount.toLocaleString()}đ
            </div>
            <div className="text-xs text-gray-500 dark:text-gray-400">
              Ví Lifestyle
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
