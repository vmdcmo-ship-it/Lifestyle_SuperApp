'use client';

import Link from 'next/link';

type MembershipTier = 'GOLD' | 'PLATINUM' | 'DIAMOND';

interface TierInfo {
  name: string;
  tier: MembershipTier;
  minPoints: number;
  color: string;
  gradient: string;
  icon: string;
  benefits: string[];
  earnRate: number; // % bonus khi tích điểm
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

export function LifestyleXuContent() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 via-yellow-50 to-white dark:from-gray-900 dark:via-gray-850 dark:to-gray-950">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-amber-500 via-orange-500 to-yellow-600 py-20 text-white">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-[url('/patterns/coins.svg')] opacity-10"></div>
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
        </div>
        <div className="container relative z-10 mx-auto px-4">
          <div className="mx-auto max-w-3xl text-center">
            <div className="mb-6 inline-block animate-bounce">
              <CoinIcon size="xlarge" />
            </div>
            <h1 className="mb-4 text-5xl font-bold md:text-6xl">
              Lifestyle Xu
            </h1>
            <p className="mb-8 text-xl text-white/90 md:text-2xl">
              Tích điểm từ mọi hoạt động - Thăng hạng - Nhận ưu đãi đặc biệt
            </p>
            <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
              <Link
                href="/signup"
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-white px-8 py-4 text-lg font-bold text-orange-600 shadow-xl transition-all hover:scale-105 hover:shadow-2xl"
              >
                Đăng ký ngay
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
              <Link
                href="/login"
                className="inline-flex items-center justify-center gap-2 rounded-xl border-2 border-white bg-transparent px-8 py-4 text-lg font-bold text-white transition-all hover:bg-white/10"
              >
                Đăng nhập để xem điểm
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-5xl">
            <h2 className="mb-12 text-center text-4xl font-bold">
              🎯 Cách thức hoạt động
            </h2>
            <div className="grid gap-8 md:grid-cols-3">
              <StepCard
                step="1"
                icon="🛒"
                title="Mua sắm & Sử dụng dịch vụ"
                description="Mỗi giao dịch trên Lifestyle đều được tích điểm Xu"
              />
              <StepCard
                step="2"
                icon="📈"
                title="Tích lũy & Thăng hạng"
                description="Càng nhiều Xu, hạng thành viên càng cao với ưu đãi tốt hơn"
              />
              <StepCard
                step="3"
                icon="🎁"
                title="Đổi quà & Nhận ưu đãi"
                description="Sử dụng Xu để đổi voucher, giảm giá và quà tặng hấp dẫn"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Membership Tiers */}
      <section className="bg-gradient-to-br from-purple-50 to-pink-50 py-16 dark:from-gray-900 dark:to-gray-850">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-6xl">
            <div className="mb-12 text-center">
              <h2 className="mb-4 text-4xl font-bold">
                ⭐ Hạng thành viên & Quyền lợi
              </h2>
              <p className="text-lg text-muted-foreground">
                Ba hạng thành viên với chính sách ưu đãi tăng dần
              </p>
            </div>
            <div className="grid gap-6 md:grid-cols-3">
              {TIERS.map((tier) => (
                <TierCard key={tier.tier} tier={tier} />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* How to Earn */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-5xl">
            <h2 className="mb-12 text-center text-4xl font-bold">
              💰 Cách tích lũy Lifestyle Xu
            </h2>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
              <EarnCard
                icon="🏃"
                title="Run to Earn"
                description="Chạy bộ mỗi ngày nhận ngay Xu"
                example="5km = 100 Xu"
              />
              <EarnCard
                icon="🚗"
                title="Đặt xe"
                description="Mỗi chuyến đi tích lũy Xu"
                example="100.000đ = 100 Xu"
              />
              <EarnCard
                icon="🛍️"
                title="Mua sắm"
                description="Mua sắm càng nhiều, Xu càng nhiều"
                example="1.000đ = 1 Xu"
              />
              <EarnCard
                icon="🍔"
                title="Giao đồ ăn"
                description="Đặt món nhận Xu thưởng"
                example="50.000đ = 50 Xu"
              />
              <EarnCard
                icon="💰"
                title="Gói Tiết Kiệm"
                description="Mua gói combo nhận Xu thưởng"
                example="Premium = 500 Xu"
              />
              <EarnCard
                icon="👥"
                title="Giới thiệu bạn bè"
                description="Mời bạn bè nhận Xu"
                example="1 bạn = 100 Xu"
              />
              <EarnCard
                icon="🎂"
                title="Sinh nhật"
                description="Nhận quà sinh nhật"
                example="Theo hạng"
              />
              <EarnCard
                icon="🎉"
                title="Sự kiện đặc biệt"
                description="Tham gia event, mini game"
                example="Thưởng bonus"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Comparison Table */}
      <section className="bg-gray-50 py-16 dark:bg-gray-900">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-6xl">
            <h2 className="mb-12 text-center text-4xl font-bold">
              📊 So sánh quyền lợi các hạng
            </h2>
            <div className="overflow-x-auto rounded-2xl bg-white shadow-xl dark:bg-gray-800">
              <table className="w-full">
                <thead className="bg-gradient-to-r from-amber-500 to-orange-500 text-white">
                  <tr>
                    <th className="p-4 text-left">Quyền lợi</th>
                    <th className="p-4 text-center">🥇 Gold</th>
                    <th className="p-4 text-center">💎 Platinum</th>
                    <th className="p-4 text-center">💠 Diamond</th>
                  </tr>
                </thead>
                <tbody className="divide-y dark:divide-gray-700">
                  <tr>
                    <td className="p-4 font-semibold">Điều kiện</td>
                    <td className="p-4 text-center">0+ Xu</td>
                    <td className="p-4 text-center">5.000+ Xu</td>
                    <td className="p-4 text-center">15.000+ Xu</td>
                  </tr>
                  <tr className="bg-amber-50 dark:bg-gray-750">
                    <td className="p-4 font-semibold">Tỷ lệ tích điểm</td>
                    <td className="p-4 text-center">100%</td>
                    <td className="p-4 text-center text-green-600 font-bold">120% 🔥</td>
                    <td className="p-4 text-center text-purple-600 font-bold">150% 🔥🔥</td>
                  </tr>
                  <tr>
                    <td className="p-4 font-semibold">Quà sinh nhật</td>
                    <td className="p-4 text-center">500 Xu</td>
                    <td className="p-4 text-center">1.000 Xu</td>
                    <td className="p-4 text-center">2.000 Xu</td>
                  </tr>
                  <tr className="bg-amber-50 dark:bg-gray-750">
                    <td className="p-4 font-semibold">Hoàn tiền đơn hàng</td>
                    <td className="p-4 text-center">-</td>
                    <td className="p-4 text-center">2%</td>
                    <td className="p-4 text-center">5%</td>
                  </tr>
                  <tr>
                    <td className="p-4 font-semibold">Miễn phí vận chuyển</td>
                    <td className="p-4 text-center">-</td>
                    <td className="p-4 text-center">Đơn từ 0đ</td>
                    <td className="p-4 text-center">Mọi đơn</td>
                  </tr>
                  <tr className="bg-amber-50 dark:bg-gray-750">
                    <td className="p-4 font-semibold">Voucher độc quyền</td>
                    <td className="p-4 text-center">-</td>
                    <td className="p-4 text-center">Hàng tháng</td>
                    <td className="p-4 text-center">Hàng tuần</td>
                  </tr>
                  <tr>
                    <td className="p-4 font-semibold">Hỗ trợ khách hàng</td>
                    <td className="p-4 text-center">Ưu tiên</td>
                    <td className="p-4 text-center">24/7</td>
                    <td className="p-4 text-center">VIP 24/7</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>

      {/* Example Calculation */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-4xl">
            <h2 className="mb-12 text-center text-4xl font-bold">
              🧮 Ví dụ tích điểm
            </h2>
            <div className="rounded-2xl bg-gradient-to-br from-blue-50 to-cyan-50 p-8 shadow-xl dark:from-gray-800 dark:to-gray-900">
              <div className="mb-6 text-center">
                <div className="text-lg font-semibold text-gray-700 dark:text-gray-300">
                  Bạn chi tiêu <span className="text-2xl font-bold text-blue-600">500.000đ</span> trong tháng
                </div>
              </div>
              <div className="grid gap-4 md:grid-cols-3">
                <div className="rounded-xl bg-white p-6 text-center shadow dark:bg-gray-800">
                  <div className="mb-2 text-3xl">🥇</div>
                  <div className="mb-2 font-bold">Hạng Gold</div>
                  <div className="text-3xl font-bold text-yellow-600">500 Xu</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    (100% tỷ lệ)
                  </div>
                </div>
                <div className="rounded-xl bg-white p-6 text-center shadow dark:bg-gray-800">
                  <div className="mb-2 text-3xl">💎</div>
                  <div className="mb-2 font-bold">Hạng Platinum</div>
                  <div className="text-3xl font-bold text-slate-600">600 Xu</div>
                  <div className="text-sm text-green-600">
                    (+100 Xu bonus!)
                  </div>
                </div>
                <div className="rounded-xl bg-white p-6 text-center shadow dark:bg-gray-800">
                  <div className="mb-2 text-3xl">💠</div>
                  <div className="mb-2 font-bold">Hạng Diamond</div>
                  <div className="text-3xl font-bold text-cyan-600">750 Xu</div>
                  <div className="text-sm text-purple-600">
                    (+250 Xu bonus!!)
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQs */}
      <section className="bg-gray-50 py-16 dark:bg-gray-900">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-3xl">
            <h2 className="mb-12 text-center text-4xl font-bold">
              ❓ Câu hỏi thường gặp
            </h2>
            <div className="space-y-4">
              <FAQItem
                question="Làm sao để kiểm tra số dư Lifestyle Xu của tôi?"
                answer="Đăng nhập vào tài khoản, sau đó truy cập mục 'Tài khoản' > 'Lifestyle Xu' để xem số dư và lịch sử giao dịch chi tiết."
              />
              <FAQItem
                question="Lifestyle Xu có thời hạn sử dụng không?"
                answer="Có, Xu tích lũy có hiệu lực trong 12 tháng kể từ ngày nhận. Hệ thống sẽ nhắc nhở trước 30 ngày khi Xu sắp hết hạn."
              />
              <FAQItem
                question="Tôi có thể chuyển Xu cho người khác không?"
                answer="Hiện tại Lifestyle Xu không thể chuyển nhượng. Tuy nhiên bạn có thể tặng quà bằng cách đổi Xu lấy voucher và gửi mã voucher cho người khác."
              />
              <FAQItem
                question="Làm sao để thăng hạng thành viên?"
                answer="Hạng thành viên được xác định dựa trên tổng số Xu bạn đang có. Tích lũy đủ Xu sẽ tự động thăng hạng và nhận ưu đãi cao hơn."
              />
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-3xl rounded-2xl bg-gradient-to-br from-amber-500 via-orange-500 to-yellow-600 p-12 text-center text-white shadow-2xl">
            <div className="mb-4 text-6xl">🎉</div>
            <h2 className="mb-4 text-3xl font-bold">
              Bắt đầu tích lũy Lifestyle Xu ngay hôm nay!
            </h2>
            <p className="mb-8 text-lg text-white/90">
              Đăng ký tài khoản để nhận 500 Xu thưởng và bắt đầu hành trình tích điểm
            </p>
            <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
              <Link
                href="/signup"
                className="inline-flex items-center gap-2 rounded-xl bg-white px-8 py-4 text-lg font-bold text-orange-600 shadow-xl transition-all hover:scale-105 hover:shadow-2xl"
              >
                Đăng ký nhận 500 Xu
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
              <Link
                href="/login"
                className="inline-flex items-center gap-2 rounded-xl border-2 border-white bg-transparent px-8 py-4 text-lg font-bold text-white transition-all hover:bg-white/10"
              >
                Đăng nhập
              </Link>
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
    xlarge: 'h-24 w-24',
  };

  return (
    <svg
      className={`${sizeClasses[size]} inline-block text-amber-400 drop-shadow-2xl`}
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

interface StepCardProps {
  step: string;
  icon: string;
  title: string;
  description: string;
}

function StepCard({ step, icon, title, description }: StepCardProps) {
  return (
    <div className="relative rounded-2xl border-2 border-amber-200 bg-white p-6 text-center transition-all hover:scale-105 hover:shadow-xl dark:border-amber-800 dark:bg-gray-800">
      <div className="absolute -top-4 left-1/2 flex h-10 w-10 -translate-x-1/2 items-center justify-center rounded-full bg-gradient-to-r from-amber-500 to-orange-500 text-lg font-bold text-white">
        {step}
      </div>
      <div className="mb-4 mt-2 text-5xl">{icon}</div>
      <h3 className="mb-2 text-xl font-bold">{title}</h3>
      <p className="text-sm text-gray-600 dark:text-gray-400">{description}</p>
    </div>
  );
}

interface TierCardProps {
  tier: TierInfo;
}

function TierCard({ tier }: TierCardProps) {
  return (
    <div className="rounded-2xl border-2 border-gray-300 bg-white p-6 transition-all hover:scale-105 hover:shadow-2xl dark:border-gray-700 dark:bg-gray-800">
      <div className="mb-4 text-center">
        <div className="mb-2 text-6xl">{tier.icon}</div>
        <h3 className={`mb-1 text-2xl font-bold ${tier.color}`}>{tier.name}</h3>
        <div className="text-sm text-gray-600 dark:text-gray-400">
          Từ {tier.minPoints.toLocaleString('vi-VN')} Xu
        </div>
        <div className={`mt-2 rounded-full bg-gradient-to-r ${tier.gradient} px-4 py-1 text-sm font-bold text-white`}>
          Tích điểm: {tier.earnRate}%
        </div>
      </div>

      <ul className="space-y-2">
        {tier.benefits.map((benefit, idx) => (
          <li key={idx} className="flex items-start gap-2 text-sm">
            <span className="mt-0.5 text-green-500">✓</span>
            <span className="text-gray-700 dark:text-gray-300">{benefit}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

interface EarnCardProps {
  icon: string;
  title: string;
  description: string;
  example: string;
}

function EarnCard({ icon, title, description, example }: EarnCardProps) {
  return (
    <div className="rounded-xl bg-white p-6 text-center shadow-lg transition-all hover:scale-105 hover:shadow-xl dark:bg-gray-800">
      <div className="mb-4 text-5xl">{icon}</div>
      <h3 className="mb-2 text-lg font-bold">{title}</h3>
      <p className="mb-2 text-sm text-gray-600 dark:text-gray-400">{description}</p>
      <div className="rounded-lg bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-700 dark:bg-amber-900/30 dark:text-amber-400">
        {example}
      </div>
    </div>
  );
}

interface FAQItemProps {
  question: string;
  answer: string;
}

function FAQItem({ question, answer }: FAQItemProps) {
  return (
    <details className="group rounded-xl bg-white p-6 shadow transition-all hover:shadow-lg dark:bg-gray-800">
      <summary className="flex cursor-pointer items-center justify-between font-semibold">
        <span>{question}</span>
        <svg
          className="h-5 w-5 transition-transform group-open:rotate-180"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </summary>
      <p className="mt-4 text-sm text-gray-600 dark:text-gray-400">{answer}</p>
    </details>
  );
}
