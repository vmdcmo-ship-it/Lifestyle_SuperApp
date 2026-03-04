import { ContentLayout3Col } from '@/components/layout/content-layout-3-col';

const PHAP_LY_LEFT_NAV = [
  { label: 'Trang chủ', href: '/' },
  { label: 'Pháp lý', href: '/phap-ly' },
  { label: 'Tiêu chuẩn cộng đồng', href: '/phap-ly/tieu-chuan-cong-dong' },
  { label: 'Điều khoản', href: '/terms' },
  { label: 'Bảo mật', href: '/privacy' },
  { label: 'KODO Wealth', href: '/wealth' },
  { label: 'An Cư Lạc Nghiệp', href: '/an-cu-lac-nghiep' },
];

export default function PhapLyLayout({ children }: { children: React.ReactNode }): JSX.Element {
  return (
    <ContentLayout3Col leftNav={PHAP_LY_LEFT_NAV}>
      {children}
    </ContentLayout3Col>
  );
}
