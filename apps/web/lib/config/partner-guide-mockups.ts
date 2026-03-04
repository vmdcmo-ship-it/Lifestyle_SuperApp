/**
 * Cấu hình mockup hướng dẫn từng bước - iPhone mockup + mũi tên + chữ đỏ
 * Mỗi bước điền thông tin có ảnh mockup tương ứng
 */

import type { BusinessGroupId } from './partner-registration';

export interface MockupAnnotation {
  /** Nội dung hướng dẫn (hiển thị màu đỏ) */
  text: string;
  /** Vị trí mũi tên: trái hoặc phải màn hình */
  arrowSide: 'left' | 'right';
  /** Thứ tự từ trên xuống */
  order: number;
  /** ID ô tương ứng trên mockup */
  targetId: string;
}

export interface GuideStepMockupData {
  stepTitle: string;
  stepDescription?: string;
  annotations: MockupAnnotation[];
  screenType: 'form_register' | 'form_contact' | 'app_menu' | 'app_product' | 'app_orders' | 'generic';
}

/** Mockup steps chung cho bước 1 - Form đăng ký web (giống nhau cho mọi nhóm) */
const STEP1_FORM_MOCKUP: GuideStepMockupData = {
  stepTitle: 'Bước 1: Điền form đăng ký trên web',
  stepDescription:
    'Điền đầy đủ thông tin theo từng ô bên dưới. Nội dung chữ đỏ là hướng dẫn chi tiết.',
  screenType: 'generic',
  annotations: [
    {
      targetId: 'field-group',
      text: 'Chọn nhóm: Giao thức ăn, Bách hóa, Giới thiệu dịch vụ hoặc Shopping Mall',
      arrowSide: 'left',
      order: 0,
    },
    {
      targetId: 'field-subcategory',
      text: 'Chọn ngành chi tiết. VD: Nhà hàng, Cà phê, Spa, Thời trang...',
      arrowSide: 'left',
      order: 1,
    },
    {
      targetId: 'field-store',
      text: 'Tên cửa hàng / thương hiệu — điền chính xác như trên biển hiệu',
      arrowSide: 'right',
      order: 0,
    },
    {
      targetId: 'field-contact',
      text: 'Họ tên người liên hệ (chủ cửa hàng hoặc quản lý)',
      arrowSide: 'right',
      order: 1,
    },
    {
      targetId: 'field-email',
      text: 'Email dùng để KODO gửi thông báo và hợp đồng',
      arrowSide: 'right',
      order: 2,
    },
    {
      targetId: 'field-phone',
      text: 'Số điện thoại — KODO sẽ gọi xác minh trong 1-2 ngày',
      arrowSide: 'right',
      order: 3,
    },
    {
      targetId: 'field-message',
      text: 'Mô tả ngắn về cửa hàng (tùy chọn) — giúp xét duyệt nhanh hơn',
      arrowSide: 'right',
      order: 4,
    },
  ],
};

/** Bước 4 - Setup menu trên App (Food Delivery) */
const STEP4_FOOD_APP_MOCKUP: GuideStepMockupData = {
  stepTitle: 'Bước 4: Thêm món ăn trên App Merchant',
  stepDescription:
    'Tải App KODO Merchant, đăng nhập và thêm từng món. Mỗi món cần: tên, giá, ảnh rõ nét.',
  screenType: 'app_menu',
  annotations: [
    {
      targetId: 'field-menu-name',
      text: 'Tên món — VD: Phở bò đặc biệt, Cà phê sữa đá',
      arrowSide: 'left',
      order: 0,
    },
    {
      targetId: 'field-menu-price',
      text: 'Giá (VNĐ) — Cập nhật chính xác, khách đặt theo giá hiển thị',
      arrowSide: 'left',
      order: 1,
    },
    {
      targetId: 'field-menu-photo',
      text: 'Ảnh món — Rõ nét, đúng món. Ảnh đẹp tăng tỉ lệ đặt hàng!',
      arrowSide: 'right',
      order: 0,
    },
  ],
};

/** Bước 4 - Cấu hình sản phẩm (Grocery) - dùng chung app_menu, annotation khác */
const STEP4_GROCERY_APP_MOCKUP: GuideStepMockupData = {
  stepTitle: 'Bước 4: Thêm sản phẩm trên App Merchant',
  stepDescription:
    'Đăng nhập App Merchant, thêm nhóm hàng và từng sản phẩm. Mua hộ: cấu hình phạm vi, thời gian phục vụ.',
  screenType: 'app_menu',
  annotations: [
    {
      targetId: 'field-menu-name',
      text: 'Tên sản phẩm — VD: Gạo ST25 5kg, Dầu ăn Simply',
      arrowSide: 'left',
      order: 0,
    },
    {
      targetId: 'field-menu-price',
      text: 'Giá bán — Giá niêm yết hoặc giá mua hộ + phí',
      arrowSide: 'left',
      order: 1,
    },
    {
      targetId: 'field-menu-photo',
      text: 'Ảnh sản phẩm — Ảnh bao bì, mã vạch giúp nhận diện',
      arrowSide: 'right',
      order: 0,
    },
  ],
};

/** Bước 4 - Thiết lập thông tin (Local Service) */
const STEP4_LOCAL_APP_MOCKUP: GuideStepMockupData = {
  stepTitle: 'Bước 4: Cập nhật thông tin cơ sở trên App',
  stepDescription:
    'Điền địa chỉ GPS, giờ mở cửa, dịch vụ và bảng giá. Thông tin chính xác giúp khách tìm và đặt lịch dễ dàng.',
  screenType: 'app_menu',
  annotations: [
    {
      targetId: 'field-menu-name',
      text: 'Tên dịch vụ — VD: Massage body 60 phút, Cắt tóc nam',
      arrowSide: 'left',
      order: 0,
    },
    {
      targetId: 'field-menu-price',
      text: 'Giá dịch vụ — Bảng giá minh bạch tăng tỉ lệ đặt lịch',
      arrowSide: 'left',
      order: 1,
    },
    {
      targetId: 'field-menu-photo',
      text: 'Ảnh cơ sở — Không gian thực tế giúp khách tin tưởng',
      arrowSide: 'right',
      order: 0,
    },
  ],
};

/** Bước 4 - Đăng sản phẩm (Shopping Mall) */
const STEP4_MALL_APP_MOCKUP: GuideStepMockupData = {
  stepTitle: 'Bước 4: Đăng sản phẩm lên sàn',
  stepDescription:
    'Tạo shop, thêm sản phẩm với ảnh chất lượng cao, mô tả đầy đủ xuất xứ và chính sách đổi trả.',
  screenType: 'app_menu',
  annotations: [
    {
      targetId: 'field-menu-name',
      text: 'Tên sản phẩm — Thương hiệu + mô tả ngắn (VD: Đồng hồ Heritage Chronograph)',
      arrowSide: 'left',
      order: 0,
    },
    {
      targetId: 'field-menu-price',
      text: 'Giá bán — Giá niêm yết, chính hãng',
      arrowSide: 'left',
      order: 1,
    },
    {
      targetId: 'field-menu-photo',
      text: 'Ảnh sản phẩm — Chất lượng cao, đúng màu. Ảnh chính hãng tăng uy tín',
      arrowSide: 'right',
      order: 0,
    },
  ],
};

/** Bước 5 - Nhận đơn (dùng chung) */
const STEP5_ORDERS_MOCKUP: GuideStepMockupData = {
  stepTitle: 'Bước 5: Nhận đơn và phục vụ',
  stepDescription: 'Kích hoạt shop — Nhận thông báo đơn qua App, xác nhận và giao hàng đúng hẹn.',
  screenType: 'app_orders',
  annotations: [
    {
      targetId: 'orders',
      text: 'Đơn mới hiển thị tại đây — Nhấn để xem chi tiết và xác nhận',
      arrowSide: 'left',
      order: 0,
    },
  ],
};

/** Danh sách mockup theo nhóm - mỗi nhóm có các bước có mockup */
export const PARTNER_GUIDE_MOCKUPS: Record<
  BusinessGroupId,
  { stepIndex: number; mockup: GuideStepMockupData }[]
> = {
  FOOD_DELIVERY: [
    { stepIndex: 0, mockup: STEP1_FORM_MOCKUP },
    { stepIndex: 3, mockup: STEP4_FOOD_APP_MOCKUP },
    { stepIndex: 4, mockup: STEP5_ORDERS_MOCKUP },
  ],
  GROCERY: [
    { stepIndex: 0, mockup: STEP1_FORM_MOCKUP },
    { stepIndex: 3, mockup: STEP4_GROCERY_APP_MOCKUP },
    { stepIndex: 4, mockup: STEP5_ORDERS_MOCKUP },
  ],
  LOCAL_SERVICE: [
    { stepIndex: 0, mockup: STEP1_FORM_MOCKUP },
    { stepIndex: 3, mockup: STEP4_LOCAL_APP_MOCKUP },
    { stepIndex: 4, mockup: STEP5_ORDERS_MOCKUP },
  ],
  SHOPPING_MALL: [
    { stepIndex: 0, mockup: STEP1_FORM_MOCKUP },
    { stepIndex: 3, mockup: STEP4_MALL_APP_MOCKUP },
    { stepIndex: 4, mockup: STEP5_ORDERS_MOCKUP },
  ],
};

export interface PartnerGuideMockupItem {
  stepIndex: number;
  mockup: GuideStepMockupData;
}

export function getPartnerGuideMockups(groupId: BusinessGroupId): PartnerGuideMockupItem[] {
  return PARTNER_GUIDE_MOCKUPS[groupId] ?? PARTNER_GUIDE_MOCKUPS.SHOPPING_MALL;
}
