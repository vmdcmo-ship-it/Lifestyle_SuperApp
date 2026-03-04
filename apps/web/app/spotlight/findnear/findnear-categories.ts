/**
 * Danh mục Findnear - map với MerchantType (API /search/nearby)
 */

export const FINDNEAR_CATEGORIES = [
  { id: '', name: 'Tất cả', type: undefined, icon: '📍' },
  { id: 'cafe', name: 'Quán cà phê', type: 'CAFE', icon: '☕' },
  { id: 'restaurant', name: 'Nhà hàng', type: 'RESTAURANT', icon: '🍜' },
  { id: 'pharmacy', name: 'Nhà thuốc', type: 'PHARMACY', icon: '💊' },
  { id: 'beauty', name: 'Spa & Làm đẹp', type: 'BEAUTY', icon: '💆' },
  { id: 'supermarket', name: 'Siêu thị', type: 'SUPERMARKET', icon: '🛒' },
  { id: 'fashion', name: 'Thời trang', type: 'FASHION', icon: '👗' },
  { id: 'sports', name: 'Phòng tập', type: 'SPORTS', icon: '🏋️' },
  { id: 'other', name: 'Khác', type: 'OTHER', icon: '🏪' },
] as const;
