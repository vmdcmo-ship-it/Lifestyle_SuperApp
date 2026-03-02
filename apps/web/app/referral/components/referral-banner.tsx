import { ReferralCampaign } from '@lifestyle/types';
import Image from 'next/image';

interface ReferralBannerProps {
  campaign: ReferralCampaign;
}

export function ReferralBanner({ campaign }: ReferralBannerProps) {
  return (
    <div className="relative overflow-hidden bg-gradient-to-r from-yellow-400 via-orange-400 to-yellow-500">
      <div className="mx-auto max-w-7xl px-4 py-12">
        <div className="flex flex-col items-center justify-between gap-8 md:flex-row">
          {/* Left: Text Content */}
          <div className="flex-1 text-center md:text-left">
            <div className="mb-4 inline-block rounded-full bg-white px-4 py-2 text-sm font-bold text-orange-600 shadow-lg">
              🔥 Chương trình Hot
            </div>
            <h1 className="mb-4 text-4xl font-extrabold text-white drop-shadow-lg md:text-5xl">
              {campaign.promoText || 'Nhận không giới hạn'}
            </h1>
            <p className="mb-6 text-lg text-white/90">
              Mời bạn bè - Cả hai cùng nhận quà!
            </p>
            <div className="flex flex-wrap gap-4">
              <div className="flex items-center gap-2 rounded-lg bg-white/20 px-4 py-2 backdrop-blur-sm">
                <span className="text-2xl">🎁</span>
                <div>
                  <div className="text-sm text-white/80">Người giới thiệu</div>
                  <div className="font-bold text-white">
                    {campaign.referrerRewards[0]?.amount.toLocaleString()}đ
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2 rounded-lg bg-white/20 px-4 py-2 backdrop-blur-sm">
                <span className="text-2xl">🎉</span>
                <div>
                  <div className="text-sm text-white/80">Người được mời</div>
                  <div className="font-bold text-white">
                    Voucher {campaign.refereeRewards[0]?.amount.toLocaleString()}đ
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right: Illustration */}
          <div className="relative flex-shrink-0">
            <div className="relative h-64 w-64">
              {/* Animated gift boxes */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="animate-bounce text-9xl">🎁</div>
              </div>
              <div className="absolute right-0 top-0 animate-pulse text-5xl">⭐</div>
              <div className="absolute bottom-0 left-0 animate-pulse text-5xl delay-300">💰</div>
            </div>
          </div>
        </div>
      </div>

      {/* Decorative elements */}
      <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-white/10 blur-3xl"></div>
      <div className="absolute -bottom-20 -left-20 h-64 w-64 rounded-full bg-white/10 blur-3xl"></div>
    </div>
  );
}
