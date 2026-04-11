import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import { pageMetadata } from '@/lib/site-metadata';

export const metadata: Metadata = pageMetadata({
  path: '/timnhatro/tin-cua-toi',
  title: 'Tin cho thuê của tôi',
  description: 'Quản lý tin đăng cho thuê của bạn trên timnhaxahoi.com.',
  robots: { index: false, follow: false },
});

export default function TimnhatroTinCuaToiLayout({ children }: { children: ReactNode }) {
  return children;
}
