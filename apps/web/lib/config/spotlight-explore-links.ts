/**
 * Cấu hình "Khám phá thêm" cho Spotlight - cột phải
 * Cấu trúc: tiêu đề Trang chủ + icon Home, nhóm KODO Wealth, Cộng đồng, v.v.
 */

export interface ExploreLink {
  label: string;
  href: string;
  description?: string;
  /** 'home' = hiển thị như tiêu đề với icon Home */
  icon?: 'home';
  /** Danh mục con (hiển thị nhỏ hơn) */
  children?: { label: string; href: string; description?: string }[];
}

export const SPOTLIGHT_EXPLORE_LINKS: ExploreLink[] = [
  {
    label: 'Trang chủ',
    href: '/',
    icon: 'home',
  },
  {
    label: 'KODO Wealth',
    href: '/wealth',
    children: [
      { label: 'Kiến thức tài chính', href: '/wealth/knowledge' },
      { label: 'Công cụ lập kế hoạch', href: '/wealth/tools/insurance-benefit-calc' },
      { label: 'Hỏi đáp cùng AI Agent', href: '/wealth/chat' },
    ],
  },
  { label: 'Bất động sản', href: '/bat-dong-san' },
  {
    label: 'Cộng đồng',
    href: '/the-thao',
    children: [
      { label: 'CLB Tennis', href: '/the-thao/clb-ban-chuyen-nghiep/tennis' },
      { label: 'CLB Pickleball', href: '/the-thao/clb-ban-chuyen-nghiep/pickleball' },
      { label: 'KODO Walk & Run', href: '/the-thao/run-to-earn' },
    ],
  },
  {
    label: 'Hợp tác cùng KODO Platform',
    href: '/hop-tac',
  },
  { label: 'Shopping Mall', href: '/shopping-mall' },
  { label: 'Đặt xe', href: '/ride-hailing' },
];
