import { Metadata } from 'next';
import { ReferralContent } from './referral-content';

export const metadata: Metadata = {
  title: 'Giới thiệu & Nhận ưu đãi | Lifestyle Super App',
  description:
    'Giới thiệu bạn bè sử dụng Lifestyle và nhận ngay ưu đãi hấp dẫn. Không giới hạn số lần giới thiệu, không giới hạn phần thưởng!',
  keywords: [
    'giới thiệu',
    'referral',
    'affiliate',
    'nhận quà',
    'ưu đãi',
    'mã giới thiệu',
    'refer a friend',
    'lifestyle xu',
  ],
  openGraph: {
    title: 'Giới thiệu & Nhận ưu đãi | Lifestyle',
    description: 'Mời bạn bè, nhận ưu đãi không giới hạn!',
    images: ['/og-referral.jpg'],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Giới thiệu & Nhận ưu đãi | Lifestyle',
    description: 'Mời bạn bè, nhận ưu đãi không giới hạn!',
  },
};

export default function ReferralPage() {
  return <ReferralContent />;
}
