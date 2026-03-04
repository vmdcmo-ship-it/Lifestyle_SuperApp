import { ContentLayout3Col } from '@/components/layout/content-layout-3-col';

const SPOTLIGHT_LEFT_NAV = [
  { label: 'Trang chủ', href: '/' },
  { label: 'Spotlight', href: '/spotlight' },
  { label: 'Video của tôi', href: '/spotlight/my' },
  { label: 'Điểm đến', href: '/spotlight/diem-den' },
  { label: 'Ẩm thực', href: '/spotlight/an-uong' },
  { label: 'Phong cách', href: '/spotlight/phong-cach' },
  { label: 'KODO Wealth', href: '/wealth' },
  { label: 'An Cư Lạc Nghiệp', href: '/an-cu-lac-nghiep' },
  { label: 'Thể thao', href: '/the-thao' },
  { label: 'Hợp tác', href: '/hop-tac' },
];

export default function SpotlightLayout({ children }: { children: React.ReactNode }): JSX.Element {
  return (
    <ContentLayout3Col leftNav={SPOTLIGHT_LEFT_NAV}>
      {children}
    </ContentLayout3Col>
  );
}
