import { ContentLayout3Col } from '@/components/layout/content-layout-3-col';

const NAV = [
  { label: 'Trang chủ', href: '/' },
  { label: 'Đặt xe', href: '/ride-hailing' },
  { label: 'Thuê xe tự lái', href: '/car-rental' },
  { label: 'Hợp tác tài xế', href: '/hop-tac' },
  { label: 'KODO Wealth', href: '/wealth' },
  { label: 'Spotlight', href: '/spotlight' },
];

export default function RideHailingLayout({ children }: { children: React.ReactNode }): JSX.Element {
  return <ContentLayout3Col leftNav={NAV}>{children}</ContentLayout3Col>;
}
