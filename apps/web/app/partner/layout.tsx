import { ContentLayout3Col } from '@/components/layout/content-layout-3-col';

const NAV = [
  { label: 'Trang chủ', href: '/' },
  { label: 'Đối tác', href: '/partner' },
  { label: 'Hợp tác VinFast', href: '/hop-tac' },
  { label: 'Tài xế', href: '/signup/driver' },
  { label: 'Đặt xe', href: '/ride-hailing' },
  { label: 'KODO Wealth', href: '/wealth' },
];

export default function PartnerLayout({ children }: { children: React.ReactNode }): JSX.Element {
  return <ContentLayout3Col leftNav={NAV}>{children}</ContentLayout3Col>;
}
