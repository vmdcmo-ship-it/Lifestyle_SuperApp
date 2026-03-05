import { ContentLayout3Col } from '@/components/layout/content-layout-3-col';
import {
  SECTION_BANNERS_LEFT,
  SECTION_BANNERS_RIGHT,
} from '@/lib/config/sidebar-banners-sections';

const NAV = [
  { label: 'Trang chủ', href: '/' },
  { label: 'Hợp tác', href: '/hop-tac' },
  { label: 'Đăng ký tài xế', href: '/signup/driver' },
  { label: 'Đối tác', href: '/partner' },
  { label: 'Đặt xe', href: '/ride-hailing' },
  { label: 'KODO Wealth', href: '/wealth' },
];

export default function HopTacLayout({ children }: { children: React.ReactNode }): JSX.Element {
  return (
    <ContentLayout3Col
      leftNav={NAV}
      leftBanners={SECTION_BANNERS_LEFT}
      rightBanners={SECTION_BANNERS_RIGHT}
    >
      {children}
    </ContentLayout3Col>
  );
}
