import type { Metadata } from 'next';
import type { ReactNode } from 'react';

/** Trang sửa tin — không index; không gắn canonical tới URL động. */
export const metadata: Metadata = {
  title: 'Sửa tin cho thuê',
  description: 'Cập nhật nội dung tin đăng cho thuê của bạn trên timnhaxahoi.com.',
  robots: { index: false, follow: false },
};

export default function TimnhatroSuaTinLayout({ children }: { children: ReactNode }) {
  return children;
}
