import { ContentLayout3Col } from '@/components/layout/content-layout-3-col';
import {
  SECTION_BANNERS_LEFT,
  SECTION_BANNERS_RIGHT,
} from '@/lib/config/sidebar-banners-sections';

const CAR_RENTAL_LEFT_NAV = [
  { label: 'Trang chủ', href: '/' },
  { label: 'Thuê xe tự lái', href: '/car-rental' },
  { label: 'Đặt xe', href: '/ride-hailing' },
  { label: 'Hợp tác', href: '/hop-tac' },
  { label: 'KODO Wealth', href: '/wealth' },
  { label: 'Bất động sản', href: '/bat-dong-san' },
];

export default function CarRentalLayout({ children }: { children: React.ReactNode }): JSX.Element {
  return (
    <ContentLayout3Col
      leftNav={CAR_RENTAL_LEFT_NAV}
      leftBanners={SECTION_BANNERS_LEFT}
      rightBanners={SECTION_BANNERS_RIGHT}
    >
      {children}
    </ContentLayout3Col>
  );
}
