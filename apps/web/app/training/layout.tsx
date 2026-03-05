import { ContentLayout3Col } from '@/components/layout/content-layout-3-col';
import {
  SECTION_BANNERS_LEFT,
  SECTION_BANNERS_RIGHT,
} from '@/lib/config/sidebar-banners-sections';

const TRAINING_LEFT_NAV = [
  { label: 'Trang chủ', href: '/' },
  { label: 'Đào tạo', href: '/training' },
  { label: 'KODO Wealth', href: '/wealth' },
  { label: 'Thể thao', href: '/the-thao' },
  { label: 'Hợp tác', href: '/hop-tac' },
];

export default function TrainingLayout({ children }: { children: React.ReactNode }): JSX.Element {
  return (
    <ContentLayout3Col
      leftNav={TRAINING_LEFT_NAV}
      leftBanners={SECTION_BANNERS_LEFT}
      rightBanners={SECTION_BANNERS_RIGHT}
    >
      {children}
    </ContentLayout3Col>
  );
}
