import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import { pageMetadata } from '@/lib/site-metadata';

export const metadata: Metadata = pageMetadata({
  path: '/timnhatro/dang-ky',
  title: 'Đăng ký chủ trọ',
  description: 'Tạo tài khoản để đăng tin cho thuê trên timnhaxahoi.com.',
  robots: { index: false, follow: false },
});

export default function TimnhatroDangKyLayout({ children }: { children: ReactNode }) {
  return children;
}
