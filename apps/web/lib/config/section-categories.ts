/**
 * Cấu hình đề mục (categories) cho các section
 * Mỗi mục có thể dùng ảnh thiết kế (image) hoặc icon emoji fallback.
 * Đặt ảnh vào public/images/<section>/ - ví dụ: public/images/the-thao/tennis.png
 */

export interface SectionCategoryItem {
  href: string;
  title: string;
  description: string;
  /** Ảnh thiết kế/upload - ưu tiên khi có. Path: /images/the-thao/tennis.png */
  image?: string;
  /** Icon emoji fallback khi chưa có image */
  icon?: string;
}

/**
 * Đề mục Cộng đồng thể thao
 * Thêm ảnh: đặt file vào public/images/the-thao/ rồi thêm image: '/images/the-thao/tennis.png'
 * Khi có image, ảnh hiển thị thay cho icon - chuyên nghiệp, nhận diện brand tốt hơn
 */
export const THE_THAO_CATEGORIES: SectionCategoryItem[] = [
  {
    href: '/the-thao/tin-tuc',
    title: 'Tin tức thể thao',
    description: 'Tin tức Tennis, Pickleball, Run to Earn',
    icon: '📰',
    // image: '/images/the-thao/tin-tuc.png',
  },
  {
    href: '/the-thao/clb-ban-chuyen-nghiep/tennis',
    title: 'CLB Tennis',
    description: 'Câu lạc bộ Tennis bán chuyên',
    icon: '🎾',
    // image: '/images/the-thao/tennis.png',
  },
  {
    href: '/the-thao/clb-ban-chuyen-nghiep/pickleball',
    title: 'CLB Pickleball',
    description: 'Câu lạc bộ Pickleball',
    icon: '🏓',
    // image: '/images/the-thao/pickleball.png',
  },
  {
    href: '/the-thao/run-to-earn',
    title: 'Run to Earn',
    description: 'Chạy bộ kiếm thưởng',
    icon: '🏃',
    // image: '/images/the-thao/run-to-earn.png',
  },
];
