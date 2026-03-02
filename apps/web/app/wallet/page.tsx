import { Metadata } from 'next';
import { WalletContent } from './wallet-content';

export const metadata: Metadata = {
  title: 'Ví Lifestyle - Nạp tiền & Thanh toán | Lifestyle Super App',
  description:
    'Quản lý Ví Lifestyle của bạn: nạp tiền, thanh toán dễ dàng cho mọi dịch vụ trong hệ sinh thái Lifestyle. An toàn, bảo mật, nhiều ưu đãi.',
  keywords: [
    'ví lifestyle',
    'lifestyle wallet',
    'nạp tiền',
    'thanh toán',
    'quản lý số dư',
    'lịch sử giao dịch',
    'ví thanh toán',
    'payment',
    'e-wallet vietnam',
  ],
  openGraph: {
    title: 'Ví Lifestyle - Nạp tiền & Thanh toán Tiện Lợi',
    description:
      'Quản lý tài chính thông minh với Ví Lifestyle. Nạp tiền nhanh, thanh toán an toàn cho tất cả dịch vụ.',
    type: 'website',
    images: [
      {
        url: '/og-wallet.jpg',
        width: 1200,
        height: 630,
        alt: 'Ví Lifestyle',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Ví Lifestyle - Nạp tiền & Thanh toán',
    description:
      'Quản lý tài chính thông minh, thanh toán mọi dịch vụ với Ví Lifestyle',
  },
};

export default function WalletPage() {
  return <WalletContent />;
}
