/**
 * Cấu hình link Footer - Trung tâm thông tin
 * Các mục link đến nội dung từ Web Admin (content/[slug] hoặc route tương ứng)
 * Slug/URL có thể cập nhật khi admin tạo nội dung mới
 */

export interface FooterLink {
  label: string;
  /** URL - dùng /content/[slug] cho nội dung từ trung tâm thông tin */
  href: string;
}

export interface FooterSection {
  title: string;
  links: FooterLink[];
}

/** Base URL trung tâm thông tin (rỗng = dùng cùng domain). Có thể set sang domain Admin nếu cần */
const INFO_BASE = process.env.NEXT_PUBLIC_INFO_CENTER_BASE || '';

/** URL nội dung từ Admin - /content/[slug] hoặc base khác */
const contentUrl = (slug: string): string =>
  slug.startsWith('/') ? `${INFO_BASE}${slug}` : `${INFO_BASE}/content/${slug}`;

export const FOOTER_SECTIONS: FooterSection[] = [
  {
    title: 'Hỗ trợ',
    links: [
      { label: 'Hotline', href: '/contact' },
      { label: 'Email', href: '/contact' },
      { label: 'Câu hỏi thường gặp', href: contentUrl('faq') },
      { label: 'Nguyên tắc cộng đồng', href: '/phap-ly/tieu-chuan-cong-dong' },
      { label: 'Quy chế hoạt động', href: contentUrl('quy-che-hoat-dong') },
      { label: 'Điều khoản sử dụng', href: '/terms' },
      { label: 'Chính sách bảo mật', href: '/privacy' },
    ],
  },
  {
    title: 'Công ty',
    links: [
      { label: 'Về chúng tôi', href: '/about' },
      { label: 'Tin tức', href: '/the-thao/tin-tuc' },
      { label: 'Tuyển dụng', href: contentUrl('tuyen-dung') },
    ],
  },
  {
    title: 'Khách hàng cá nhân',
    links: [
      { label: 'Gọi xe', href: '/ride-hailing' },
      { label: 'Lái hộ', href: '/ride-hailing?service=driver' },
      { label: 'Giao đồ ăn', href: '/food-delivery' },
      { label: 'Mua sắm', href: '/shopping' },
      { label: 'Ví Lifestyle', href: '/wallet' },
      { label: 'KODO Wealth', href: '/wealth' },
      { label: 'Bất động sản', href: '/bat-dong-san' },
      { label: 'Spotlight', href: '/spotlight' },
      { label: 'Shopping Mall', href: '/shopping-mall' },
      { label: 'Run to Earn', href: '/the-thao/run-to-earn' },
      { label: 'Giới thiệu bạn bè', href: '/referral' },
    ],
  },
  {
    title: 'Đối tác',
    links: [
      { label: 'Hợp tác thuê mua VinFast', href: '/hop-tac' },
      { label: 'Tài xế', href: '/signup/driver' },
      { label: 'Đăng ký đối tác kinh doanh', href: '/dang-ky-doi-tac' },
      { label: 'Nhà sáng tạo nội dung', href: '/partner?type=koc' },
      { label: 'Chương trình thưởng', href: contentUrl('chuong-trinh-thuong') },
      { label: 'Cộng đồng đối tác', href: '/the-thao' },
    ],
  },
];

/**
 * Footer KODO Sport - Tiêu chuẩn cộng đồng & điều khoản riêng cho thể thao
 */
export const FOOTER_SECTIONS_SPORT: FooterSection[] = [
  {
    title: 'KODO Sport',
    links: [
      { label: 'Tổng quan', href: '/the-thao' },
      { label: 'CLB Tennis', href: '/the-thao/clb-ban-chuyen-nghiep/tennis' },
      { label: 'CLB Pickleball', href: '/the-thao/clb-ban-chuyen-nghiep/pickleball' },
      { label: 'Tiêu chuẩn cộng đồng Sport', href: contentUrl('tieu-chuan-cong-dong-sport') },
      { label: 'Điều khoản KODO Sport', href: contentUrl('dieu-khoan-kodo-sport') },
    ],
  },
  {
    title: 'Công ty',
    links: [
      { label: 'Về chúng tôi', href: '/about' },
      { label: 'Tin tức', href: '/the-thao/tin-tuc' },
      { label: 'Tuyển dụng', href: contentUrl('tuyen-dung') },
    ],
  },
];

/**
 * Footer Bất động sản
 */
export const FOOTER_SECTIONS_BAT_DONG_SAN: FooterSection[] = [
  {
    title: 'Bất động sản',
    links: [
      { label: 'Tổng quan', href: '/bat-dong-san' },
      { label: 'Tin Bất Động Sản', href: '/bat-dong-san/tin-bat-dong-san' },
      { label: 'Nhà ở xã hội', href: '/bat-dong-san/nha-o-xa-hoi' },
      { label: 'Dự án chung cư', href: '/bat-dong-san/du-an-chung-cu' },
      { label: 'Nhà cho thuê', href: '/bat-dong-san/nha-cho-thue' },
      { label: 'Tìm bất động sản', href: '/bat-dong-san/tim-bat-dong-san' },
    ],
  },
  {
    title: 'Công ty',
    links: [
      { label: 'Về chúng tôi', href: '/about' },
      { label: 'Tin tức', href: '/the-thao/tin-tuc' },
      { label: 'Tuyển dụng', href: contentUrl('tuyen-dung') },
    ],
  },
];

/**
 * Footer Run to Earn - Tiêu chuẩn cộng đồng & điều khoản riêng cho vận động
 */
/**
 * Footer Shopping Mall - Điều khoản & hỗ trợ riêng cho sàn TMĐT
 */
export const FOOTER_SECTIONS_SHOPPING_MALL: FooterSection[] = [
  {
    title: 'Shopping Mall',
    links: [
      { label: 'Điều khoản TMĐT', href: '/shopping-mall/dieu-khoan' },
      { label: 'Chính sách đổi trả', href: contentUrl('chinh-sach-doi-tra-shopping-mall') },
      { label: 'Hướng dẫn mua hàng', href: contentUrl('huong-dan-mua-hang-shopping-mall') },
      { label: 'Sứ giả tặng quà', href: '/shopping-mall/gifting-concierge' },
      { label: 'Đăng ký bán hàng', href: '/shopping-mall/dang-ky-ban-hang' },
    ],
  },
  {
    title: 'Hỗ trợ',
    links: [
      { label: 'Hotline', href: '/contact' },
      { label: 'Email', href: '/contact' },
    ],
  },
  {
    title: 'Công ty',
    links: [
      { label: 'Về chúng tôi', href: '/about' },
      { label: 'Tin tức', href: '/the-thao/tin-tuc' },
      { label: 'Tuyển dụng', href: contentUrl('tuyen-dung') },
    ],
  },
];

export const FOOTER_SECTIONS_RUN_TO_EARN: FooterSection[] = [
  {
    title: 'Run to Earn',
    links: [
      { label: 'Tổng quan', href: '/the-thao/run-to-earn' },
      { label: 'Tiêu chuẩn cộng đồng Run', href: contentUrl('tieu-chuan-cong-dong-run') },
      { label: 'Điều khoản Run to Earn', href: contentUrl('dieu-khoan-run-to-earn') },
      { label: 'Thử thách & Sự kiện', href: contentUrl('run-thu-thach-su-kien') },
    ],
  },
  {
    title: 'Công ty',
    links: [
      { label: 'Về chúng tôi', href: '/about' },
      { label: 'Tin tức', href: '/the-thao/tin-tuc' },
      { label: 'Tuyển dụng', href: contentUrl('tuyen-dung') },
    ],
  },
];
