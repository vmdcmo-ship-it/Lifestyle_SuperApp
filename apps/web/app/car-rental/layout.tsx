import { ContentLayout3Col } from '@/components/layout/content-layout-3-col';

const CAR_RENTAL_LEFT_NAV = [
  { label: 'Trang chủ', href: '/' },
  { label: 'Thuê xe tự lái', href: '/car-rental' },
  { label: 'Đặt xe', href: '/ride-hailing' },
  { label: 'Hợp tác', href: '/hop-tac' },
  { label: 'KODO Wealth', href: '/wealth' },
  { label: 'An Cư Lạc Nghiệp', href: '/an-cu-lac-nghiep' },
];

export default function CarRentalLayout({ children }: { children: React.ReactNode }): JSX.Element {
  return (
    <ContentLayout3Col leftNav={CAR_RENTAL_LEFT_NAV}>
      {children}
    </ContentLayout3Col>
  );
}
