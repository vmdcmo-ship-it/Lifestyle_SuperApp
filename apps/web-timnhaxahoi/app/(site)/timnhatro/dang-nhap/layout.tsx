import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import { pageMetadata } from '@/lib/site-metadata';

export const metadata: Metadata = pageMetadata({
  path: '/timnhatro/dang-nhap',
  title: 'Đăng nhập chủ trọ',
  description: 'Đăng nhập để quản lý tin cho thuê trên timnhaxahoi.com.',
  robots: { index: false, follow: false },
});

export default function TimnhatroDangNhapLayout({ children }: { children: ReactNode }) {
  return children;
}
