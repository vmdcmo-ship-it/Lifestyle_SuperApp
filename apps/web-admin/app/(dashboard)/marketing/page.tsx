'use client';

import Link from 'next/link';

const CARDS = [
  {
    href: '/coupons',
    title: 'Voucher / Mã giảm giá',
    description: 'Tạo và quản lý coupon, thiết lập % giảm hoặc VND, min order, hạn dùng.',
    icon: '🎫',
  },
  {
    href: '/lucky-wheel',
    title: 'Lucky Wheel - Vòng quay may mắn',
    description:
      'Tài xế: 100k doanh thu = 1 lượt. User: mỗi giao dịch = 1 lượt. Nạp ví 500k = 1 lượt. Giải: voucher, tiền ví, hiện vật.',
    icon: '🎡',
  },
  {
    href: '/marketing/campaigns',
    title: 'Chiến dịch quảng cáo',
    description: 'Tạo và quản lý chiến dịch, theo dõi trạng thái và ngân sách.',
    icon: '📢',
  },
  {
    href: '/marketing/affiliate',
    title: 'Affiliate - Giới thiệu bạn bè',
    description:
      'Theo dõi lượt giới thiệu, ngân sách đã chi. Người giới thiệu & người mới đều nhận quà.',
    icon: '🤝',
  },
  {
    href: '/marketing/loyalty-xu',
    title: 'Loyalty Xu',
    description: 'Xu tích lũy từ chi tiêu (0,1%). Theo dõi số Xu đã cấp, ước tính chi phí.',
    icon: '🪙',
  },
  {
    href: '/marketing/run-to-earn',
    title: 'Run to Earn',
    description:
      'Cuộc thi chạy kiếm Xu. Tạo campaign, cấu hình giải linh hoạt (Xu, Voucher, hiện vật).',
    icon: '🏃',
  },
  {
    href: '/marketing/reports',
    title: 'Báo cáo ngân sách khuyến mãi',
    description: 'Tổng hợp: Voucher, Lucky Wheel, Affiliate, Loyalty Xu, Run to Earn.',
    icon: '📊',
  },
];

export default function MarketingPage(): JSX.Element {
  return (
    <div>
      <h1 className="mb-4 text-2xl font-bold">Trung tâm Marketing</h1>
      <p className="mb-6 text-muted-foreground">
        Quản lý khuyến mãi, chiến dịch và theo dõi hiệu quả marketing.
      </p>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {CARDS.map((card) => (
          <Link
            key={card.title}
            href={card.href}
            className="flex flex-col gap-2 rounded-lg border bg-background p-5 transition-colors hover:bg-muted/50 hover:border-primary/30"
          >
            <span className="text-2xl" role="img" aria-hidden>
              {card.icon}
            </span>
            <h2 className="font-semibold">{card.title}</h2>
            <p className="text-sm text-muted-foreground">{card.description}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
