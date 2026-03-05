import { ContentLayout3Col } from '@/components/layout/content-layout-3-col';
import {
  THE_THAO_BANNERS_LEFT,
  THE_THAO_BANNERS_RIGHT,
} from '@/lib/config/sidebar-banners-sections';

const CONG_DONG_LEFT_NAV = [
  { label: 'Trang chủ', href: '/' },
  { label: 'Thể thao', href: '/the-thao' },
  { label: 'Tin tức thể thao', href: '/the-thao/tin-tuc' },
  { label: 'CLB Tennis', href: '/the-thao/clb-ban-chuyen-nghiep/tennis' },
  { label: 'CLB Pickleball', href: '/the-thao/clb-ban-chuyen-nghiep/pickleball' },
  { label: 'Run to Earn', href: '/the-thao/run-to-earn' },
  { label: 'KODO Wealth', href: '/wealth' },
  { label: 'Bất động sản', href: '/bat-dong-san' },
  { label: 'Hợp tác', href: '/hop-tac' },
];

export default function CongDongLayout({ children }: { children: React.ReactNode }): JSX.Element {
  return (
    <ContentLayout3Col
      leftNav={CONG_DONG_LEFT_NAV}
      leftBanners={THE_THAO_BANNERS_LEFT}
      rightBanners={THE_THAO_BANNERS_RIGHT}
    >
      {children}
    </ContentLayout3Col>
  );
}
