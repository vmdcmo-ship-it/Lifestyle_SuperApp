import { Metadata } from 'next';
import { LifestyleXuContent } from './lifestyle-xu-content';

export const metadata: Metadata = {
  title: 'Lifestyle Xu - Tích điểm & Đổi quà | Lifestyle Super App',
  description:
    'Kiểm tra số dư Lifestyle Xu, xem lịch sử tích điểm từ Run to Earn, đặt xe, mua sắm và đổi quà hấp dẫn.',
  keywords: [
    'lifestyle xu',
    'tích điểm',
    'đổi quà',
    'run to earn',
    'loyalty program',
    'điểm thưởng',
    'xu lifestyle',
  ],
  openGraph: {
    title: 'Lifestyle Xu - Tích điểm & Đổi quà',
    description:
      'Tích lũy Lifestyle Xu từ mọi hoạt động, đổi quà và nhận ưu đãi hấp dẫn',
    type: 'website',
    images: [
      {
        url: '/og-lifestyle-xu.jpg',
        width: 1200,
        height: 630,
        alt: 'Lifestyle Xu',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Lifestyle Xu - Tích điểm & Đổi quà',
    description: 'Tích lũy Lifestyle Xu, đổi quà và nhận ưu đãi hấp dẫn',
  },
};

export default function LifestyleXuPage() {
  return <LifestyleXuContent />;
}
