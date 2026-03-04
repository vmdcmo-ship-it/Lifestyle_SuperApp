import { ContentLayout3Col } from '@/components/layout/content-layout-3-col';

const NAV = [
  { label: 'Trang chủ', href: '/' },
  { label: 'Hợp tác', href: '/hop-tac' },
  { label: 'Đăng ký tài xế', href: '/signup/driver' },
  { label: 'Đối tác', href: '/partner' },
  { label: 'Đặt xe', href: '/ride-hailing' },
  { label: 'KODO Wealth', href: '/wealth' },
];

export default function HopTacLayout({ children }: { children: React.ReactNode }): JSX.Element {
  return <ContentLayout3Col leftNav={NAV}>{children}</ContentLayout3Col>;
}
