import type { Metadata } from 'next';
import { SectionSidebarLayout } from '@/components/layout/section-sidebar-layout';
import { ContentRightSidebar } from '@/components/layout/content-right-sidebar';
import {
  SECTION_BANNERS_LEFT,
  SECTION_BANNERS_RIGHT,
} from '@/lib/config/sidebar-banners-sections';

const BDS_RIGHT_LINKS = [
  { label: 'Trang chủ', href: '/' },
  { label: 'KODO Wealth', href: '/wealth', description: 'Tài chính & Bảo hiểm' },
  { label: 'Spotlight', href: '/spotlight', description: 'Video du lịch' },
  { label: 'Thể thao', href: '/the-thao', description: 'Thể thao & Run' },
  { label: 'Hợp tác', href: '/hop-tac', description: 'Thuê mua VinFast' },
  { label: 'Đặt xe', href: '/ride-hailing', description: 'Gọi xe' },
];

const BASE_URL = (process.env.NEXT_PUBLIC_BASE_URL || 'https://www.vmd.asia').replace(/\/$/, '');
const DEFAULT_OG = `${BASE_URL}/og-image.png`;

export const metadata: Metadata = {
  title: {
    default: 'Bất động sản - Tin tức, dự án, mua bán cho thuê',
    template: '%s | Bất động sản',
  },
  description:
    'Tin bất động sản, nhà ở xã hội, dự án chung cư nổi bật, nhà cho thuê. Đăng tin và tìm kiếm bất động sản theo nhu cầu.',
  keywords: [
    'bất động sản',
    'tin bất động sản',
    'nhà ở xã hội',
    'chung cư',
    'nhà cho thuê',
    'mua nhà',
    'cho thuê nhà',
    'dự án bất động sản',
  ],
  metadataBase: new URL(BASE_URL),
  alternates: { canonical: '/bat-dong-san' },
  openGraph: {
    type: 'website',
    locale: 'vi_VN',
    url: '/bat-dong-san',
    siteName: 'Lifestyle Super App',
    title: 'Bất động sản - Tin tức, dự án, mua bán cho thuê',
    description: 'Tin bất động sản, nhà ở xã hội, chung cư, đăng tin cho thuê, tìm kiếm theo nhu cầu.',
    images: [{ url: DEFAULT_OG, width: 1200, height: 630, alt: 'Bất động sản' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Bất động sản - Tin tức, dự án, mua bán cho thuê',
    description: 'Tin bất động sản, nhà ở xã hội, chung cư, đăng tin cho thuê.',
    images: [DEFAULT_OG],
  },
};

const BDS_NAV = [
  { href: '/bat-dong-san', label: 'Tổng quan' },
  { href: '/bat-dong-san/tin-bat-dong-san', label: 'Tin Bất Động Sản' },
  { href: '/bat-dong-san/nha-o-xa-hoi', label: 'Nhà ở xã hội' },
  { href: '/bat-dong-san/du-an-chung-cu', label: 'Dự án chung cư nổi bật' },
  { href: '/bat-dong-san/nha-cho-thue', label: 'Nhà cho thuê' },
  { href: '/bat-dong-san/tim-bat-dong-san', label: 'Tìm bất động sản' },
];

export default function BatDongSanLayout({
  children,
}: {
  children: React.ReactNode;
}): JSX.Element {
  return (
    <SectionSidebarLayout
      title="Bất động sản"
      icon={
        <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-amber-600 to-orange-600 text-white">
          🏢
        </span>
      }
      navItems={BDS_NAV}
      rightSidebar={<ContentRightSidebar title="Khám phá thêm" crossSellLinks={BDS_RIGHT_LINKS} variant="light" />}
      leftBanners={SECTION_BANNERS_LEFT}
      rightBanners={SECTION_BANNERS_RIGHT}
    >
      <div className="bds-theme">{children}</div>
    </SectionSidebarLayout>
  );
}
