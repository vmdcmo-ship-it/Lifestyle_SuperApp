/**
 * Cấu hình banner sidebar 9:16 cho trang Shopping Mall
 * Hỗ trợ: JPEG, PNG, SVG (image), MP4 (video từ Spotlight).
 * Quảng cáo: mua sắm, thời trang, review điểm đến.
 */

import type { SidebarBanner } from './sidebar-banners';

const MIXKIT = 'https://assets.mixkit.co/videos';

/**
 * Banner cột trái - dưới danh mục. Tối đa 4.
 * Thêm image/video: đặt file vào public/images/mall-banners/ hoặc dùng URL.
 */
export const MALL_SIDEBAR_BANNERS_LEFT: SidebarBanner[] = [
  {
    href: '/spotlight',
    alt: 'Spotlight - Video du lịch & điểm đến',
    video: `${MIXKIT}/4076/4076-720.mp4`,
  },
  {
    href: '/shopping-mall/boutiques?category=fashion',
    alt: 'Thời trang hàng hiệu',
    video: `${MIXKIT}/44542/44542-720.mp4`,
  },
  {
    href: '/shopping-mall/boutiques?category=cosmetics',
    alt: 'Nước hoa & Mỹ phẩm',
    icon: '💄',
  },
  {
    href: '/shopping-mall/gifting-concierge',
    alt: 'Hamper & Quà tặng cao cấp',
    icon: '🎁',
  },
];

/**
 * Banner cột phải - dưới Sứ giả tặng quà. Tối đa 4.
 */
export const MALL_SIDEBAR_BANNERS_RIGHT: SidebarBanner[] = [
  {
    href: '/spotlight/diem-den',
    alt: 'Review điểm đến - Khám phá',
    video: `${MIXKIT}/35540/35540-720.mp4`,
  },
  {
    href: '/shopping-mall/boutiques',
    alt: 'Boutiques - Mua sắm',
    video: `${MIXKIT}/44500/44500-720.mp4`,
  },
  {
    href: '/wealth',
    alt: 'KODO Wealth - Tài chính',
    icon: '💰',
  },
  {
    href: '/ride-hailing',
    alt: 'Đặt xe - Di chuyển',
    icon: '🚗',
  },
];
