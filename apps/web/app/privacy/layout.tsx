import { ContentLayout3Col } from '@/components/layout/content-layout-3-col';

const LEGAL_LEFT_NAV = [
  { label: 'Trang chủ', href: '/' },
  { label: 'Điều khoản', href: '/terms' },
  { label: 'Bảo mật', href: '/privacy' },
  { label: 'Pháp lý', href: '/phap-ly' },
  { label: 'Tiêu chuẩn cộng đồng', href: '/phap-ly/tieu-chuan-cong-dong' },
  { label: 'KODO Wealth', href: '/wealth' },
  { label: 'Hợp tác', href: '/hop-tac' },
];

export default function PrivacyLayout({ children }: { children: React.ReactNode }): JSX.Element {
  return (
    <ContentLayout3Col leftNav={LEGAL_LEFT_NAV}>
      {children}
    </ContentLayout3Col>
  );
}
