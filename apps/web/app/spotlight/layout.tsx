import { ContentLayout3Col } from '@/components/layout/content-layout-3-col';
import { SpotlightExploreSidebar } from '@/components/layout/spotlight-explore-sidebar';
import {
  SPOTLIGHT_BANNERS_LEFT,
  SPOTLIGHT_BANNERS_RIGHT,
} from '@/lib/config/sidebar-banners-sections';

/** Cột trái: Chỉ đề mục chính của Spotlight (nội dung cột giữa) */
const SPOTLIGHT_LEFT_NAV = [
  { label: 'Spotlight', href: '/spotlight' },
  { label: 'Video của tôi', href: '/spotlight/my' },
  { label: 'Điểm đến', href: '/spotlight/diem-den' },
  { label: 'Ẩm thực', href: '/spotlight/an-uong' },
  { label: 'Phong cách', href: '/spotlight/phong-cach' },
  { label: 'Nghỉ dưỡng', href: '/spotlight/nghi-duong' },
  { label: 'Trải nghiệm', href: '/spotlight/trai-nghiem' },
  { label: 'Tâm lý', href: '/spotlight/tam-ly' },
  { label: 'Học tập', href: '/spotlight/hoc-tap' },
];

export default function SpotlightLayout({ children }: { children: React.ReactNode }): JSX.Element {
  return (
    <ContentLayout3Col
      leftNav={SPOTLIGHT_LEFT_NAV}
      rightSidebar={<SpotlightExploreSidebar variant="light" />}
      leftBanners={SPOTLIGHT_BANNERS_LEFT}
      rightBanners={SPOTLIGHT_BANNERS_RIGHT}
    >
      {children}
    </ContentLayout3Col>
  );
}
