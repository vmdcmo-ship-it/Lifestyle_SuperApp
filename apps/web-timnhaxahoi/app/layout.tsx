import type { Metadata } from 'next';
import './globals.css';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://timnhaxahoi.com';

export const metadata: Metadata = {
  title: {
    default: 'Tìm nhà ở xã hội | timnhaxahoi.com',
    template: '%s | timnhaxahoi.com',
  },
  description:
    'Thẩm định điều kiện NOXH, dự án Miền Nam, tư vấn pháp lý và dòng tiền — timnhaxahoi.com.',
  metadataBase: new URL(siteUrl),
  openGraph: {
    siteName: 'timnhaxahoi.com',
    locale: 'vi_VN',
    type: 'website',
    title: 'timnhaxahoi.com',
    description:
      'Thẩm định điều kiện NOXH, dự án Miền Nam, tư vấn pháp lý và dòng tiền — timnhaxahoi.com.',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'timnhaxahoi.com',
    description:
      'Thẩm định điều kiện NOXH, dự án Miền Nam, tư vấn pháp lý và dòng tiền — timnhaxahoi.com.',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="vi">
      <body className="font-sans antialiased">{children}</body>
    </html>
  );
}
