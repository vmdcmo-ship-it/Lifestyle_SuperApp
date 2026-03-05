import { ContentLayout3Col } from '@/components/layout/content-layout-3-col';
import {
  SECTION_BANNERS_LEFT,
  SECTION_BANNERS_RIGHT,
} from '@/lib/config/sidebar-banners-sections';

const PHAP_LY_LEFT_NAV = [
  { label: 'Trang chủ', href: '/' },
  { label: 'Pháp lý', href: '/phap-ly' },
  { label: 'Tiêu chuẩn cộng đồng', href: '/phap-ly/tieu-chuan-cong-dong' },
  { label: 'Điều khoản', href: '/terms' },
  { label: 'Bảo mật', href: '/privacy' },
  { label: 'KODO Wealth', href: '/wealth' },
  { label: 'Bất động sản', href: '/bat-dong-san' },
];

export default function PhapLyLayout({ children }: { children: React.ReactNode }): JSX.Element {
  return (
    <ContentLayout3Col
      leftNav={PHAP_LY_LEFT_NAV}
      leftBanners={SECTION_BANNERS_LEFT}
      rightBanners={SECTION_BANNERS_RIGHT}
    >
      {children}
    </ContentLayout3Col>
  );
}
