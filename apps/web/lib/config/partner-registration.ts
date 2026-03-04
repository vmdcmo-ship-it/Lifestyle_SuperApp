/**
 * Cấu hình đăng ký đối tác kinh doanh
 * Tách hoàn toàn khỏi đăng ký tài xế (signup/driver)
 */

export const BUSINESS_GROUPS = [
  {
    id: 'FOOD_DELIVERY',
    label: 'Giao thức ăn',
    description: 'Quán ăn, nhà hàng, cà phê, tiệm bánh',
    subCategories: [
      { id: 'restaurant', label: 'Nhà hàng' },
      { id: 'cafe', label: 'Cà phê / Trà' },
      { id: 'fast_food', label: 'Đồ ăn nhanh' },
      { id: 'bakery', label: 'Tiệm bánh' },
      { id: 'other', label: 'Khác' },
    ],
  },
  {
    id: 'GROCERY',
    label: 'Bách hóa (mua hộ, đi chợ hộ)',
    description: 'Cửa hàng tạp hóa, siêu thị mini, đi chợ hộ',
    subCategories: [
      { id: 'convenience_store', label: 'Cửa hàng tạp hóa' },
      { id: 'supermarket', label: 'Siêu thị mini' },
      { id: 'wet_market', label: 'Đi chợ hộ / Mua hộ' },
      { id: 'other', label: 'Khác' },
    ],
  },
  {
    id: 'LOCAL_SERVICE',
    label: 'Giới thiệu dịch vụ',
    description: 'Hiển thị trên mục tìm dịch vụ quanh đây',
    subCategories: [
      { id: 'spa', label: 'Spa / Massage' },
      { id: 'salon', label: 'Salon / Gội đầu' },
      { id: 'gym', label: 'Phòng gym / Yoga' },
      { id: 'clinic', label: 'Phòng khám / Nha khoa' },
      { id: 'repair', label: 'Sửa chữa / Bảo trì' },
      { id: 'other', label: 'Khác' },
    ],
  },
  {
    id: 'SHOPPING_MALL',
    label: 'Shopping Mall',
    description: 'Thời trang, mỹ phẩm, quà tặng, thương hiệu',
    subCategories: [
      { id: 'fashion', label: 'Thời trang hàng hiệu' },
      { id: 'cosmetics', label: 'Mỹ phẩm' },
      { id: 'watches', label: 'Đồng hồ & Phụ kiện' },
      { id: 'flowers', label: 'Hoa tươi' },
      { id: 'hamper', label: 'Hamper & Quà tặng' },
      { id: 'other', label: 'Khác' },
    ],
  },
] as const;

export type BusinessGroupId = (typeof BUSINESS_GROUPS)[number]['id'];
export type SubCategoryId = string;

export function getSubCategoriesForGroup(groupId: BusinessGroupId) {
  const group = BUSINESS_GROUPS.find((g) => g.id === groupId);
  return group?.subCategories ?? [];
}
