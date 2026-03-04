/**
 * Mock products for Shopping Mall Boutiques
 * Khi có API thật: thay bằng fetch từ GET /merchants/:id/products
 */

export interface ProductDetail {
  id: string;
  name: string;
  brand?: string;
  description?: string;
  imageUrl: string;
  price?: number;
  showPrice?: boolean;
  category?: string;
}

export const MOCK_PRODUCTS: Record<string, ProductDetail> = {
  '1': {
    id: '1',
    name: 'Áo khoác len cao cấp',
    brand: 'Luxe Fashion',
    description:
      'Áo khoác len dệt tay từ nguyên liệu cao cấp. Form dáng thanh lịch, phù hợp mọi dịp. Bảo hành 24 tháng.',
    imageUrl: 'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=800&q=85',
    price: 4500000,
    showPrice: false,
    category: 'fashion',
  },
  '2': {
    id: '2',
    name: 'Serum chống lão hóa',
    brand: 'Skin Science',
    description:
      'Serum chứa retinol và peptide, giúp làm mờ nếp nhăn, cải thiện độ đàn hồi da. Dùng 2-3 giọt mỗi tối.',
    imageUrl: 'https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=800&q=85',
    price: 1200000,
    showPrice: true,
    category: 'cosmetics',
  },
  '3': {
    id: '3',
    name: 'Đồng hồ Automatic',
    brand: 'Time Craft',
    description:
      'Đồng hồ cơ tự động, mặt kính sapphire, dây da Italia. Bảo hành 2 năm quốc tế.',
    imageUrl: 'https://images.unsplash.com/photo-1524592094714-0f0654e20314?w=800&q=85',
    price: 18500000,
    showPrice: false,
    category: 'watches',
  },
  '6': {
    id: '6',
    name: 'Túi xách da thật',
    brand: 'Leather Art',
    description:
      'Túi xách da bò thuộc Ý, thiết kế tối giản. Nội thất nhiều ngăn, khóa kéo YKK.',
    imageUrl: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=800&q=85',
    price: 8900000,
    showPrice: false,
    category: 'fashion',
  },
};

export function getProductById(id: string): ProductDetail | null {
  return MOCK_PRODUCTS[id] ?? null;
}

export function getAllProductIds(): string[] {
  return Object.keys(MOCK_PRODUCTS);
}
