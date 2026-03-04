import { ContentLayout3Col } from '@/components/layout/content-layout-3-col';

const CONG_DONG_LEFT_NAV = [
  { label: 'Trang chủ', href: '/' },
  { label: 'Thể thao', href: '/the-thao' },
  { label: 'Tin tức thể thao', href: '/the-thao/tin-tuc' },
  { label: 'CLB Tennis', href: '/the-thao/clb-ban-chuyen-nghiep/tennis' },
  { label: 'CLB Pickleball', href: '/the-thao/clb-ban-chuyen-nghiep/pickleball' },
  { label: 'Run to Earn', href: '/the-thao/run-to-earn' },
  { label: 'KODO Wealth', href: '/wealth' },
  { label: 'An Cư Lạc Nghiệp', href: '/an-cu-lac-nghiep' },
  { label: 'Hợp tác', href: '/hop-tac' },
];

export default function CongDongLayout({ children }: { children: React.ReactNode }): JSX.Element {
  return (
    <ContentLayout3Col leftNav={CONG_DONG_LEFT_NAV}>
      {children}
    </ContentLayout3Col>
  );
}
