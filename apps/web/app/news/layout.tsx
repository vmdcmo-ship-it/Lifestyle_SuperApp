import { ContentLayout3Col } from '@/components/layout/content-layout-3-col';

const NEWS_LEFT_NAV = [
  { label: 'Trang chủ', href: '/' },
  { label: 'Tin tức', href: '/the-thao/tin-tuc' },
  { label: 'KODO Wealth', href: '/wealth' },
  { label: 'Bất động sản', href: '/bat-dong-san' },
  { label: 'Spotlight', href: '/spotlight' },
  { label: 'Cộng đồng', href: '/the-thao' },
];

export default function NewsLayout({ children }: { children: React.ReactNode }): JSX.Element {
  return (
    <ContentLayout3Col leftNav={NEWS_LEFT_NAV}>
      {children}
    </ContentLayout3Col>
  );
}
