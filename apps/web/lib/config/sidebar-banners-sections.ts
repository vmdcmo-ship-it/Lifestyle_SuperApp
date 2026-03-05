/**
 * Cấu hình banner sidebar 9:16 cho các trang section
 * Spotlight, KODO Wealth, Thể thao (CLB Tennis, Pickleball), Shopping Mall, v.v.
 * Dùng chung format: JPEG, PNG, SVG, MP4 - mỗi banner có link trang đích.
 */

import type { SidebarBanner } from './sidebar-banners';

const MIXKIT = 'https://assets.mixkit.co/videos';

/** Banner chung - dùng cho hầu hết các section (The-thao, Ride-hailing, Hợp tác, ...) */
export const SECTION_BANNERS_LEFT: SidebarBanner[] = [
  { href: '/spotlight', alt: 'Spotlight - Video du lịch', video: `${MIXKIT}/4076/4076-720.mp4` },
  { href: '/shopping-mall', alt: 'Shopping Mall - Mua sắm', icon: '🛍️' },
  { href: '/wealth', alt: 'KODO Wealth - Tài chính', icon: '💰' },
  { href: '/ride-hailing', alt: 'Đặt xe - Di chuyển', icon: '🚗' },
];

export const SECTION_BANNERS_RIGHT: SidebarBanner[] = [
  { href: '/spotlight/diem-den', alt: 'Review điểm đến', video: `${MIXKIT}/35540/35540-720.mp4` },
  { href: '/shopping-mall/boutiques', alt: 'Boutiques - Thời trang', video: `${MIXKIT}/44542/44542-720.mp4` },
  { href: '/the-thao/clb-ban-chuyen-nghiep/tennis', alt: 'CLB Tennis', icon: '🎾' },
  { href: '/bat-dong-san', alt: 'Bất động sản', icon: '🏢' },
];

/** Banner riêng cho Spotlight - quảng cáo video, điểm đến, mua sắm */
export const SPOTLIGHT_BANNERS_LEFT: SidebarBanner[] = [
  { href: '/spotlight/diem-den', alt: 'Điểm đến - Khám phá', video: `${MIXKIT}/4076/4076-720.mp4` },
  { href: '/shopping-mall', alt: 'Shopping Mall', icon: '🛍️' },
  { href: '/wealth', alt: 'KODO Wealth', icon: '💰' },
  { href: '/the-thao/run-to-earn', alt: 'Run to Earn', icon: '🏃' },
];

export const SPOTLIGHT_BANNERS_RIGHT: SidebarBanner[] = [
  { href: '/shopping-mall/boutiques', alt: 'Thời trang & Boutiques', video: `${MIXKIT}/44542/44542-720.mp4` },
  { href: '/the-thao/clb-ban-chuyen-nghiep/tennis', alt: 'CLB Tennis', icon: '🎾' },
  { href: '/the-thao/clb-ban-chuyen-nghiep/pickleball', alt: 'CLB Pickleball', icon: '🏓' },
  { href: '/ride-hailing', alt: 'Đặt xe', icon: '🚗' },
];

/** Banner riêng cho KODO Wealth */
export const WEALTH_BANNERS_LEFT: SidebarBanner[] = [
  { href: '/spotlight', alt: 'Spotlight', video: `${MIXKIT}/4076/4076-720.mp4` },
  { href: '/shopping-mall', alt: 'Shopping Mall', icon: '🛍️' },
  { href: '/the-thao', alt: 'Thể thao & Run', icon: '🏃' },
  { href: '/bat-dong-san', alt: 'Bất động sản', icon: '🏢' },
];

export const WEALTH_BANNERS_RIGHT: SidebarBanner[] = [
  { href: '/spotlight/diem-den', alt: 'Điểm đến', video: `${MIXKIT}/35540/35540-720.mp4` },
  { href: '/shopping-mall/gifting-concierge', alt: 'Sứ giả tặng quà', icon: '🎁' },
  { href: '/the-thao/clb-ban-chuyen-nghiep/tennis', alt: 'CLB Tennis', icon: '🎾' },
  { href: '/ride-hailing', alt: 'Đặt xe', icon: '🚗' },
];

/** Banner riêng cho Thể thao (CLB Tennis, Pickleball, Run to Earn) */
export const THE_THAO_BANNERS_LEFT: SidebarBanner[] = [
  { href: '/the-thao/clb-ban-chuyen-nghiep/tennis', alt: 'CLB Tennis', icon: '🎾' },
  { href: '/the-thao/clb-ban-chuyen-nghiep/pickleball', alt: 'CLB Pickleball', icon: '🏓' },
  { href: '/spotlight', alt: 'Spotlight', video: `${MIXKIT}/4076/4076-720.mp4` },
  { href: '/shopping-mall', alt: 'Shopping Mall', icon: '🛍️' },
];

export const THE_THAO_BANNERS_RIGHT: SidebarBanner[] = [
  { href: '/wealth', alt: 'KODO Wealth', icon: '💰' },
  { href: '/spotlight/diem-den', alt: 'Điểm đến', video: `${MIXKIT}/35540/35540-720.mp4` },
  { href: '/ride-hailing', alt: 'Đặt xe', icon: '🚗' },
  { href: '/bat-dong-san', alt: 'Bất động sản', icon: '🏢' },
];
