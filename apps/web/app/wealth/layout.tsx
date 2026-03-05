import type { Metadata } from 'next';
import { SectionSidebarLayout } from '@/components/layout/section-sidebar-layout';
import { ContentRightSidebar } from '@/components/layout/content-right-sidebar';
import {
  WEALTH_BANNERS_LEFT,
  WEALTH_BANNERS_RIGHT,
} from '@/lib/config/sidebar-banners-sections';

const WEALTH_RIGHT_LINKS = [
  { label: 'Trang chủ', href: '/' },
  { label: 'Bất động sản', href: '/bat-dong-san', description: 'Tin tức, dự án BDS' },
  { label: 'Spotlight', href: '/spotlight', description: 'Video du lịch' },
  { label: 'Thể thao', href: '/the-thao', description: 'Thể thao & Run' },
  { label: 'Hợp tác', href: '/hop-tac', description: 'Thuê mua VinFast' },
  { label: 'Đặt xe', href: '/ride-hailing', description: 'Gọi xe' },
];

const BASE_URL = (process.env.NEXT_PUBLIC_BASE_URL || 'https://www.vmd.asia').replace(/\/$/, '');
const DEFAULT_OG = `${BASE_URL}/og-image.png`;

export const metadata: Metadata = {
  title: {
    default: 'KODO Wealth - Tư duy tài chính & Bảo hiểm thịnh vượng',
    template: '%s | KODO Wealth',
  },
  description:
    'Khám phá kiến thức tài chính, công cụ tính toán và giải pháp bảo hiểm để xây dựng cuộc sống thịnh vượng.',
  keywords: [
    'kodo wealth',
    'tư duy tài chính',
    'bảo hiểm thịnh vượng',
    'kế hoạch nghỉ hưu',
    'quản lý tài chính',
  ],
  metadataBase: new URL(BASE_URL),
  alternates: { canonical: '/wealth' },
  openGraph: {
    type: 'website',
    locale: 'vi_VN',
    url: '/wealth',
    siteName: 'Lifestyle Super App',
    title: 'KODO Wealth - Tư duy tài chính & Bảo hiểm thịnh vượng',
    description: 'Khám phá kiến thức tài chính, công cụ tính toán và giải pháp bảo hiểm.',
    images: [{ url: DEFAULT_OG, width: 1200, height: 630, alt: 'KODO Wealth' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'KODO Wealth - Tư duy tài chính & Bảo hiểm thịnh vượng',
    description: 'Khám phá kiến thức tài chính và bảo hiểm.',
    images: [DEFAULT_OG],
  },
};

const WEALTH_NAV = [
  { href: '/wealth', label: 'Tổng quan' },
  { href: '/wealth/knowledge', label: 'Kiến thức' },
  {
    href: '/wealth/tools/retirement-calculator',
    label: 'Công cụ',
    children: [
      { href: '/wealth/tools/retirement-calculator', label: 'Tính nghỉ hưu' },
      { href: '/wealth/tools/insurance-benefit-calc', label: 'Simulator quyền lợi BH' },
    ],
  },
  { href: '/wealth/products', label: 'Sản phẩm BH' },
  { href: '/wealth/chat', label: 'Hỏi đáp AI' },
  { href: '/wealth/consulting', label: 'Tư vấn 1-1' },
];

export default function WealthLayout({
  children,
}: {
  children: React.ReactNode;
}): JSX.Element {
  return (
    <SectionSidebarLayout
      title="KODO Wealth"
      icon={
        <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-[#D4AF37] to-amber-600 text-white">
          K
        </span>
      }
      navItems={WEALTH_NAV}
      rightSidebar={<ContentRightSidebar title="Khám phá thêm" crossSellLinks={WEALTH_RIGHT_LINKS} variant="light" />}
      leftBanners={WEALTH_BANNERS_LEFT}
      rightBanners={WEALTH_BANNERS_RIGHT}
    >
      <div className="wealth-theme">{children}</div>
    </SectionSidebarLayout>
  );
}
