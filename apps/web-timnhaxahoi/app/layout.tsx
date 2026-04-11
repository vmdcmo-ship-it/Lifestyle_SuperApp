import type { Metadata } from 'next';
import './globals.css';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://timnhaxahoi.com';

const defaultDescription =
  'Nhà ở xã hội và tìm nhà trọ: danh mục dự án, wiki pháp lý tham khảo, công cụ ước tính và tin cho thuê minh bạch — timnhaxahoi.com.';

export const metadata: Metadata = {
  title: {
    default: 'timnhaxahoi.com — Nhà ở xã hội & nhà trọ',
    template: '%s | timnhaxahoi.com',
  },
  description: defaultDescription,
  metadataBase: new URL(siteUrl),
  openGraph: {
    siteName: 'timnhaxahoi.com',
    locale: 'vi_VN',
    type: 'website',
    title: 'timnhaxahoi.com',
    description: defaultDescription,
  },
  twitter: {
    card: 'summary_large_image',
    title: 'timnhaxahoi.com',
    description: defaultDescription,
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="vi">
      <body className="font-sans antialiased">{children}</body>
    </html>
  );
}
