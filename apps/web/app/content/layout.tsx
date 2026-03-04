import { ContentLayout3Col } from '@/components/layout/content-layout-3-col';

const CONTENT_LEFT_NAV = [
  { label: 'Trang chủ', href: '/' },
  { label: 'Pháp lý', href: '/phap-ly' },
  { label: 'Điều khoản', href: '/terms' },
  { label: 'Bảo mật', href: '/privacy' },
  { label: 'KODO Wealth', href: '/wealth' },
  { label: 'Hợp tác', href: '/hop-tac' },
];

export default function ContentLayout({ children }: { children: React.ReactNode }): JSX.Element {
  return (
    <ContentLayout3Col leftNav={CONTENT_LEFT_NAV}>
      {children}
    </ContentLayout3Col>
  );
}
