import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import { pageMetadata } from '@/lib/site-metadata';

export const metadata: Metadata = pageMetadata({
  path: '/timnhatro/dang-tin',
  title: 'Đăng tin cho thuê',
  description: 'Đăng tin phòng trọ, nhà cho thuê trên timnhaxahoi.com — dành cho chủ trọ đã đăng nhập.',
  robots: { index: false, follow: false },
});

export default function TimnhatroDangTinLayout({ children }: { children: ReactNode }) {
  return children;
}
