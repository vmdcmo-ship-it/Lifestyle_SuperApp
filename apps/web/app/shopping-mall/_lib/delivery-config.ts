/**
 * Cấu hình giao hàng Kodo Mall
 * - Không dùng giao hàng TMĐT qua tầng 3 (shipper bên ngoài)
 * - Tập trung nội tỉnh, thành
 * - Giao hỏa tốc: tính cước theo khoảng cách (dùng dịch vụ giao hàng nội bộ)
 */

export const DELIVERY_POLICY = {
  /** Kodo Mall không áp dụng giao hàng thương mại điện tử qua tầng 3 */
  NO_THIRD_PARTY_LOGISTICS: true,
  /** Thông báo khi địa chỉ ngoài khu vực */
  OUT_OF_AREA_MESSAGE:
    'Dịch vụ, sản phẩm này chưa phục vụ tại khu vực quý khách. Hiện chúng tôi tập trung trải nghiệm mua hàng nội tỉnh, thành.',
  /** Lý do: quà tặng/sản phẩm cao cấp giao qua TMĐT không an toàn, nhiều rủi ro */
  PREMIUM_SAFETY_NOTE:
    'Quà tặng và sản phẩm cao cấp cần giao hàng cẩn trọng. Kodo Mall giao trực tiếp, không qua đơn vị thứ ba để đảm bảo an toàn.',
} as const;

/** Tỉnh/Thành phục vụ (nội tỉnh, thành). Không phục vụ = "Khác" → hiện thông báo */
export const SERVICE_CITIES = [
  { id: 'hcm', name: 'TP. Hồ Chí Minh' },
  { id: 'hn', name: 'Hà Nội' },
  { id: 'dn', name: 'Đà Nẵng' },
  { id: 'hp', name: 'Hải Phòng' },
  { id: 'ct', name: 'Cần Thơ' },
  { id: 'other', name: 'Khác (chưa phục vụ)', outOfArea: true },
] as const;

export type ServiceCityId = (typeof SERVICE_CITIES)[number]['id'];

/** Cấu hình phí giao hàng - lấy từ API bảng giá nền tảng */
export interface DeliveryFeeConfig {
  standardFee: number;
  expressBaseFee: number;
  expressPerKm: number;
}

/** Giá mặc định khi chưa có bảng giá (fallback) */
export const DEFAULT_DELIVERY_FEE_CONFIG: DeliveryFeeConfig = {
  standardFee: 50000,
  expressBaseFee: 30000,
  expressPerKm: 8000,
};

/** Tạo DELIVERY_TYPES từ config (dùng trong form) */
export function getDeliveryTypes(config: DeliveryFeeConfig) {
  return {
    STANDARD: {
      id: 'standard',
      label: 'Giao chuẩn (nội tỉnh)',
      description: 'Giao trong ngày, phí cố định',
      feeVnd: config.standardFee,
    },
    EXPRESS: {
      id: 'express',
      label: 'Giao hỏa tốc',
      description: 'Tính cước theo khoảng cách (dùng dịch vụ giao hàng Kodo)',
      baseFeeVnd: config.expressBaseFee,
      perKmVnd: config.expressPerKm,
    },
  };
}

/** Tính phí giao hỏa tốc theo km */
export function calcExpressFeeKm(km: number, config: DeliveryFeeConfig): number {
  return Math.round(config.expressBaseFee + config.expressPerKm * Math.max(0, km));
}

/** Loại hộp quà */
export const GIFT_BOX_TYPES = [
  { id: 'premium', label: 'Hộp cao cấp (giấy bọc sang trọng)', priceVnd: 0 },
  { id: 'eco', label: 'Hộp thân thiện môi trường', priceVnd: 0 },
  { id: 'custom', label: 'Hộp theo yêu cầu', priceVnd: 0, note: 'Ghi chú trong phần ghi chú' },
] as const;

/** Kiểm tra tỉnh/thành có trong khu vực phục vụ không */
export function isCityInServiceArea(cityId: string): boolean {
  return cityId !== 'other' && cityId !== '';
}
