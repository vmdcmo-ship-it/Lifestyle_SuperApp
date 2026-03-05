import type { Metadata } from 'next';
import { SectionSidebarLayout } from '@/components/layout/section-sidebar-layout';
import { ContentRightSidebar } from '@/components/layout/content-right-sidebar';
import {
  SECTION_BANNERS_LEFT,
  SECTION_BANNERS_RIGHT,
} from '@/lib/config/sidebar-banners-sections';

const AN_CU_RIGHT_LINKS = [
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
    default: 'An Cư Lạc Nghiệp - Nhà ở xã hội cho người lao động',
    template: '%s | An Cư Lạc Nghiệp',
  },
  description:
    'Chính sách nhà ở xã hội cho người lao động thu nhập thấp. Mua và thuê mua nhà. Văn bản quy định, bài viết SEO, dự án nhà ở xã hội tại TP.HCM, Bình Dương.',
  keywords: [
    'nhà ở xã hội',
    'chính sách nhà ở xã hội',
    'thuê mua nhà',
    'mua nhà xã hội',
    'nhà ở xã hội TP.HCM',
    'nhà ở xã hội Bình Dương',
    'an cư lạc nghiệp',
  ],
  metadataBase: new URL(BASE_URL),
  alternates: { canonical: '/an-cu-lac-nghiep' },
  openGraph: {
    type: 'website',
    locale: 'vi_VN',
    url: '/an-cu-lac-nghiep',
    siteName: 'Lifestyle Super App',
    title: 'An Cư Lạc Nghiệp - Nhà ở xã hội cho người lao động',
    description:
      'Chính sách nhà ở xã hội mua và thuê mua. Văn bản quy định, bài viết, dự án tại TP.HCM, Bình Dương. Đăng ký tư vấn.',
    images: [{ url: DEFAULT_OG, width: 1200, height: 630, alt: 'An Cư Lạc Nghiệp - Nhà ở xã hội' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'An Cư Lạc Nghiệp - Nhà ở xã hội cho người lao động',
    description: 'Chính sách nhà ở xã hội mua và thuê mua. TP.HCM, Bình Dương.',
    images: [DEFAULT_OG],
  },
};

const AN_CU_NAV = [
  { href: '/an-cu-lac-nghiep', label: 'Tổng quan' },
  { href: '/an-cu-lac-nghiep/chinh-sach', label: 'Chính sách & Văn bản' },
  { href: '/an-cu-lac-nghiep/bai-viet', label: 'Bài viết' },
  { href: '/an-cu-lac-nghiep/du-an', label: 'Dự án nhà ở xã hội' },
  { href: '/an-cu-lac-nghiep/tu-van', label: 'Đăng ký tư vấn' },
];

export default function AnCuLacNghiepLayout({
  children,
}: {
  children: React.ReactNode;
}): JSX.Element {
  return (
    <SectionSidebarLayout
      title="An Cư Lạc Nghiệp"
      icon={
        <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-emerald-600 to-teal-600 text-white">
          🏠
        </span>
      }
      navItems={AN_CU_NAV}
      rightSidebar={<ContentRightSidebar title="Khám phá thêm" crossSellLinks={AN_CU_RIGHT_LINKS} variant="light" />}
      leftBanners={SECTION_BANNERS_LEFT}
      rightBanners={SECTION_BANNERS_RIGHT}
    >
      <div className="an-cu-theme">{children}</div>
    </SectionSidebarLayout>
  );
}
