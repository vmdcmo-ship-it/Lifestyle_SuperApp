import type { Metadata } from 'next';
import { BdsBreadcrumb } from '../../_components/bds-breadcrumb';

export const metadata: Metadata = {
  title: 'Đăng tin cho thuê - Nhà cho thuê',
  description: 'Đăng tin cho thuê nhà, phòng trọ, căn hộ. Chủ nhà và môi giới đăng tin miễn phí.',
  keywords: ['đăng tin cho thuê', 'cho thuê nhà', 'cho thuê phòng trọ', 'cho thuê căn hộ'],
  alternates: { canonical: '/bat-dong-san/nha-cho-thue/dang-tin' },
  openGraph: {
    title: 'Đăng tin cho thuê miễn phí',
    description: 'Chủ nhà và môi giới đăng tin cho thuê nhà, phòng trọ, căn hộ miễn phí.',
    url: '/bat-dong-san/nha-cho-thue/dang-tin',
    type: 'website',
  },
};

export default function DangTinLayout({ children }: { children: React.ReactNode }): JSX.Element {
  return (
    <>
      <BdsBreadcrumb
        items={[
          { label: 'Nhà cho thuê', href: '/bat-dong-san/nha-cho-thue' },
          { label: 'Đăng tin', href: '/bat-dong-san/nha-cho-thue/dang-tin' },
        ]}
      />
      {children}
    </>
  );
}
