'use client';

import { useState, useEffect } from 'react';
import { ReferralBanner } from './components/referral-banner';
import { ReferralCodeDisplay } from './components/referral-code-display';
import { ShareButtons } from './components/share-buttons';
import { ReferralHowItWorks } from './components/referral-how-it-works';
import { ReferralStats } from './components/referral-stats';
import { ReferralHistory } from './components/referral-history';
import {
  ReferralCode,
  ReferralStats as ReferralStatsType,
  ReferralHistoryItem,
  ReferralCampaign,
  ReferralStatus,
  ReferralRewardType,
} from '@lifestyle/types';
import { useAuth } from '@/lib/contexts/auth-context';
import { loyaltyService } from '@/lib/services/loyalty.service';

function buildCampaignFromApi(rewardPerReferral: number, refereeReward: number): ReferralCampaign {
  return {
    id: 'campaign-default',
    name: 'Combo Quà Giới Thiệu',
    description: `Nhận ${rewardPerReferral.toLocaleString()}đ khi giới thiệu bạn bè hoàn thành chuyến đi đầu tiên`,
    startDate: new Date('2024-01-01'),
    endDate: new Date('2025-12-31'),
    isActive: true,
    referrerRewards: [
      {
        type: ReferralRewardType.LIFESTYLE_BALANCE,
        amount: rewardPerReferral,
        description: `${rewardPerReferral.toLocaleString()}đ vào Ví Lifestyle`,
        conditions: 'Sau khi người được giới thiệu hoàn thành chuyến đi đầu tiên',
      },
    ],
    refereeRewards: [
      {
        type: ReferralRewardType.DISCOUNT_VOUCHER,
        amount: refereeReward,
        description: `Voucher giảm ${refereeReward.toLocaleString()}đ`,
        conditions: 'Áp dụng cho chuyến đi đầu tiên',
      },
    ],
    bannerImage: '/images/referral-banner.jpg',
    promoText: `Nhận ${rewardPerReferral.toLocaleString()}đ mỗi lời mời thành công`,
  };
}

function mapApiHistoryToUi(
  items: { id: string; refereeId: string; status: string; referrerReward: number; completedAt: string | null; createdAt: string }[]
): ReferralHistoryItem[] {
  return items.map((r) => ({
    id: r.id,
    date: new Date(r.createdAt),
    refereeName: `Người dùng #${r.refereeId.slice(0, 8)}`,
    status: r.status as ReferralStatus,
    rewardReceived:
      r.status === 'COMPLETED' && r.referrerReward > 0
        ? {
            type: ReferralRewardType.LIFESTYLE_BALANCE,
            amount: r.referrerReward,
            description: `${r.referrerReward.toLocaleString()}đ vào Ví`,
          }
        : undefined,
    progressPercentage: r.status === 'COMPLETED' ? 100 : r.status === 'REGISTERED' ? 60 : 20,
  }));
}

export function ReferralContent() {
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const [referralCode, setReferralCode] = useState<ReferralCode | null>(null);
  const [campaign, setCampaign] = useState<ReferralCampaign | null>(null);
  const [stats, setStats] = useState<ReferralStatsType | null>(null);
  const [history, setHistory] = useState<ReferralHistoryItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      if (!isAuthenticated) {
        setIsLoading(false);
        return;
      }
      setIsLoading(true);
      try {
        const [referralInfo, referralsList] = await Promise.all([
          loyaltyService.getReferralInfo(),
          loyaltyService.getMyReferrals(1, 10),
        ]);

        const completed = referralInfo.completedReferrals;
        const pending = referralInfo.totalReferrals - completed;

        setReferralCode({
          userId: '',
          code: referralInfo.referralCode,
          isCustom: false,
          createdAt: new Date(),
          isActive: true,
          totalInvites: referralInfo.totalReferrals,
          successfulInvites: completed,
          totalRewardsEarned: referralInfo.totalReward,
          lifestyleXuEarned: 0,
        });

        setCampaign(buildCampaignFromApi(referralInfo.rewardPerReferral, referralInfo.refereeReward));

        setStats({
          userId: '',
          totalInvitesSent: referralInfo.totalReferrals,
          pendingInvites: pending,
          registeredInvites: 0,
          completedInvites: completed,
          totalLifestyleXu: 0,
          totalLifestyleBalance: referralInfo.totalReward,
          totalVouchers: 0,
          thisMonthInvites: 0,
          thisMonthRewards: 0,
          invitesForNextReward: Math.max(0, 10 - (completed % 10)),
        });

        setHistory(mapApiHistoryToUi(referralsList.data));
      } catch {
        setReferralCode(null);
        setCampaign(null);
        setStats(null);
        setHistory([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [isAuthenticated]);

  if (authLoading || (isAuthenticated && isLoading)) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="mb-4 inline-block h-12 w-12 animate-spin rounded-full border-4 border-purple-600 border-t-transparent"></div>
          <p className="text-gray-600 dark:text-gray-400">Đang tải...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="flex min-h-screen items-center justify-center px-4">
        <div className="max-w-md text-center">
          <div className="mb-6 text-6xl">🎁</div>
          <h1 className="mb-4 text-3xl font-bold">
            Giới thiệu & Nhận ưu đãi
          </h1>
          <p className="mb-6 text-gray-600 dark:text-gray-400">
            Đăng nhập để xem mã giới thiệu của bạn và bắt đầu kiếm thưởng!
          </p>
          <button
            onClick={() => (window.location.href = '/login')}
            className="rounded-lg bg-gradient-to-r from-purple-600 to-pink-600 px-8 py-3 font-bold text-white shadow-lg transition-all hover:scale-105"
          >
            Đăng nhập ngay
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 pb-20 dark:from-gray-900 dark:via-gray-850 dark:to-gray-950">
      {/* Banner */}
      {campaign && <ReferralBanner campaign={campaign} />}

      <div className="mx-auto max-w-6xl px-4 py-8">
        {/* Referral Code Section */}
        <div className="mb-8">
          <h1 className="mb-2 text-3xl font-bold">
            Giới thiệu & nhận ngay gói quà ưu đãi 500K
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Chia sẻ mã giới thiệu của bạn
          </p>
        </div>

        {referralCode && (
          <>
            <ReferralCodeDisplay referralCode={referralCode} />
            
            <div className="mb-8">
              <h2 className="mb-4 text-xl font-bold">
                Hướng dẫn bạn bè thực hiện qua các bước sau để cả 2 đều nhận quà
              </h2>
              <ShareButtons referralCode={referralCode.code} />
            </div>
          </>
        )}

        {/* Stats */}
        {stats && <ReferralStats stats={stats} />}

        {/* How It Works */}
        {campaign && <ReferralHowItWorks campaign={campaign} />}

        {/* History */}
        {history.length > 0 && <ReferralHistory history={history} />}

        {/* Terms & Conditions */}
        <div className="mt-8 rounded-xl bg-white p-6 shadow-lg dark:bg-gray-800">
          <h3 className="mb-4 text-lg font-bold">📜 Điều kiện & Điều khoản</h3>
          <div className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
            <p>
              • Mã giới thiệu có thể được đặt lại theo ý thích (tối đa 1 lần);
              số lượng ký tự trong khoảng 6-20 ký tự, bao gồm chữ số và chữ cái
              không dấu.
            </p>
            <p>
              • Người được giới thiệu phải là người dùng mới chưa từng đăng ký
              tài khoản Lifestyle.
            </p>
            <p>
              • Phần thưởng sẽ được tự động cộng vào &quot;TỪ GÓI HỘI VIÊN&quot; trong
              phần &quot;Khuyến mại&quot; sau khi người được giới thiệu hoàn thành chuyến
              đi đầu tiên (chỉ áp dụng cho các dịch vụ beTransport: beBike,
              beCar).
            </p>
            <p>
              • Lifestyle có quyền thay đổi hoặc tạm dừng chương trình mà không
              cần báo trước.
            </p>
          </div>
          
          <a
            href="/terms/referral"
            className="mt-4 inline-block text-sm font-semibold text-purple-600 hover:underline"
          >
            Xem chi tiết Điều kiện & Điều khoản sử dụng →
          </a>
        </div>
      </div>
    </div>
  );
}
