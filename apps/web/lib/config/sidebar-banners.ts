/**
 * Cấu hình banner sidebar (khổ dọc 9:16)
 * Mỗi vị trí (trái, phải) tối đa 4 banner.
 * Mỗi banner có ảnh/video + link dẫn sang trang đích.
 * Định dạng: JPEG, PNG, SVG (image), MP4 (video - từ Spotlight).
 * Để image/video rỗng = dùng gradient placeholder.
 */

export interface SidebarBanner {
  /** URL ảnh - JPEG, PNG, SVG. Để rỗng = dùng video hoặc placeholder */
  image?: string;
  /** URL video MP4 (ưu tiên nếu có) - từ Spotlight, quảng cáo mua sắm, thời trang, review điểm đến */
  video?: string;
  /** Link khi click - /spotlight, /shopping-mall, /ride-hailing, v.v. */
  href: string;
  /** Alt text / nhãn hiển thị */
  alt: string;
  /** Icon/emoji cho placeholder (khi không có ảnh/video) */
  icon?: string;
}

/** Banner cột trái - dưới mục Tải App. Tối đa 4. */
export const SIDEBAR_BANNERS_LEFT: SidebarBanner[] = [
  { href: '/spotlight', alt: 'Spotlight - Video lifestyle', icon: '🎬' },
  { href: '/shopping-mall', alt: 'Shopping Mall - Mua sắm', icon: '🛍️' },
];

/** Banner cột phải - dưới danh mục Ecosystem. Tối đa 4. */
export const SIDEBAR_BANNERS_RIGHT: SidebarBanner[] = [
  { href: '/ride-hailing', alt: 'Gọi xe - Di chuyển', icon: '🚗' },
  { href: '/wealth', alt: 'KODO Wealth - Tài chính', icon: '💰' },
];

/**
 * Thêm ảnh thật: thêm field image vào mỗi banner, ví dụ:
 * { image: '/images/sidebar-banner/spotlight.jpg', href: '/spotlight', alt: '...' }
 * Đặt ảnh vào public/images/sidebar-banner/ (tỷ lệ 9:16).
 */
