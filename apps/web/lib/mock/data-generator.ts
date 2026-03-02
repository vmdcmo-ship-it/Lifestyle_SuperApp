/**
 * Mock Data Generator
 * For development and testing purposes
 * TODO: Remove when real API is ready
 */

import type {
  Restaurant,
  FoodItem,
  RideService,
  Product,
  ProductType,
  AvailabilityStatus,
  VehicleType,
} from '@lifestyle/types';

/**
 * Generate mock restaurants
 */
export const generateMockRestaurants = (count = 10): Restaurant[] => {
  const cuisines = ['Việt Nam', 'Nhật Bản', 'Hàn Quốc', 'Ý', 'Trung Hoa', 'Thái Lan'];
  const restaurants: Restaurant[] = [];

  for (let i = 0; i < count; i++) {
    restaurants.push({
      id: `restaurant-${i + 1}`,
      name: `Nhà hàng ${i + 1}`,
      slug: `nha-hang-${i + 1}`,
      description: `Nhà hàng chất lượng với nhiều món ngon`,
      logo: `/images/restaurants/logo-${i + 1}.jpg`,
      coverImage: `/images/restaurants/cover-${i + 1}.jpg`,
      location: {
        lat: 10.8231 + Math.random() * 0.1,
        lng: 106.6297 + Math.random() * 0.1,
        address: `${100 + i} Nguyễn Văn Linh`,
        city: 'Hồ Chí Minh',
        district: `Quận ${(i % 12) + 1}`,
        country: 'Vietnam',
      },
      cuisineTypes: [cuisines[i % cuisines.length]],
      rating: {
        average: 4 + Math.random(),
        count: Math.floor(Math.random() * 1000) + 100,
        distribution: { 1: 5, 2: 10, 3: 20, 4: 150, 5: 200 },
      },
      priceRange: ((i % 4) + 1) as 1 | 2 | 3 | 4,
      isActive: true,
      isOpen: Math.random() > 0.3,
      deliveryTime: {
        min: 20 + Math.floor(Math.random() * 10),
        max: 35 + Math.floor(Math.random() * 15),
      },
      deliveryFee: {
        amount: 15000 + Math.floor(Math.random() * 10000),
        currency: 'VND',
      },
      minimumOrder: 50000 + Math.floor(Math.random() * 50000),
      createdAt: new Date(),
      updatedAt: new Date(),
      metaTitle: `Nhà hàng ${i + 1} - Đặt món online`,
      metaDescription: `Đặt món từ Nhà hàng ${i + 1}. Giao nhanh, ưu đãi hấp dẫn.`,
    });
  }

  return restaurants;
};

/**
 * Generate mock food items
 */
export const generateMockFoodItems = (count = 20): FoodItem[] => {
  const foods = [
    'Phở bò',
    'Bún chả',
    'Cơm tấm',
    'Bánh mì',
    'Bún bò Huế',
    'Gỏi cuốn',
    'Pizza',
    'Burger',
    'Sushi',
    'Ramen',
  ];
  const items: FoodItem[] = [];

  for (let i = 0; i < count; i++) {
    const foodName = foods[i % foods.length];
    items.push({
      id: `food-${i + 1}`,
      restaurantId: `restaurant-${(i % 10) + 1}`,
      name: `${foodName} ${i + 1}`,
      slug: `${foodName.toLowerCase().replace(/\s+/g, '-')}-${i + 1}`,
      description: `Món ${foodName} ngon, đậm đà hương vị truyền thống`,
      images: [
        {
          id: `img-${i + 1}`,
          url: `/images/food/${i + 1}.jpg`,
          thumbnailUrl: `/images/food/thumb-${i + 1}.jpg`,
          alt: foodName,
          width: 800,
          height: 600,
          order: 1,
        },
      ],
      categoryId: `cat-${(i % 5) + 1}`,
      price: {
        amount: 30000 + Math.floor(Math.random() * 120000),
        currency: 'VND',
        originalAmount: Math.random() > 0.7 ? 50000 + Math.floor(Math.random() * 150000) : undefined,
      },
      availability: 'AVAILABLE' as AvailabilityStatus,
      isPopular: Math.random() > 0.7,
      isFeatured: Math.random() > 0.8,
      isVegetarian: Math.random() > 0.8,
      isVegan: false,
      isGlutenFree: false,
      spicyLevel: Math.floor(Math.random() * 4) as 0 | 1 | 2 | 3,
      calories: 300 + Math.floor(Math.random() * 500),
      preparationTime: 10 + Math.floor(Math.random() * 20),
      rating: {
        average: 4 + Math.random(),
        count: Math.floor(Math.random() * 500) + 50,
        distribution: { 1: 2, 2: 5, 3: 15, 4: 100, 5: 150 },
      },
      productType: 'NON_PHYSICAL' as ProductType.NON_PHYSICAL,
      createdAt: new Date(),
      updatedAt: new Date(),
      metaTitle: `${foodName} - Đặt món online`,
      metaDescription: `${foodName} ngon, giao nhanh. Đặt ngay!`,
    });
  }

  return items;
};

/**
 * Generate mock ride services
 */
export const generateMockRideServices = (): RideService[] => {
  return [
    {
      id: 'ride-1',
      type: 'MOTORBIKE' as VehicleType,
      name: 'Xe máy',
      description: 'Di chuyển nhanh trong thành phố',
      icon: '🏍️',
      basePrice: { amount: 10000, currency: 'VND' },
      pricePerKm: 8000,
      pricePerMinute: 500,
      minimumFare: 15000,
      maximumCapacity: 1,
      features: ['Nhanh nhất', 'Tiết kiệm', 'Phù hợp đường phố'],
      isActive: true,
      estimatedArrivalTime: 3,
      productType: 'NON_PHYSICAL' as ProductType.NON_PHYSICAL,
      createdAt: new Date(),
      updatedAt: new Date(),
      metaTitle: 'Đặt xe máy - Giao nhanh',
      metaDescription: 'Đặt xe máy, di chuyển nhanh trong thành phố',
    },
    {
      id: 'ride-2',
      type: 'CAR_4_SEATS' as VehicleType,
      name: 'Xe 4 chỗ',
      description: 'Thoải mái và tiện nghi',
      icon: '🚗',
      basePrice: { amount: 15000, currency: 'VND' },
      pricePerKm: 12000,
      pricePerMinute: 1000,
      minimumFare: 25000,
      maximumCapacity: 4,
      features: ['Điều hòa', 'Rộng rãi', 'An toàn'],
      isActive: true,
      estimatedArrivalTime: 5,
      productType: 'NON_PHYSICAL' as ProductType.NON_PHYSICAL,
      createdAt: new Date(),
      updatedAt: new Date(),
      metaTitle: 'Đặt xe 4 chỗ - Thoải mái',
      metaDescription: 'Đặt xe 4 chỗ, thoải mái và tiện nghi',
    },
    {
      id: 'ride-3',
      type: 'CAR_7_SEATS' as VehicleType,
      name: 'Xe 7 chỗ',
      description: 'Cho gia đình hoặc nhóm bạn',
      icon: '🚙',
      basePrice: { amount: 20000, currency: 'VND' },
      pricePerKm: 16000,
      pricePerMinute: 1500,
      minimumFare: 35000,
      maximumCapacity: 7,
      features: ['Rộng rãi', 'Hành lý nhiều', 'Gia đình'],
      isActive: true,
      estimatedArrivalTime: 7,
      productType: 'NON_PHYSICAL' as ProductType.NON_PHYSICAL,
      createdAt: new Date(),
      updatedAt: new Date(),
      metaTitle: 'Đặt xe 7 chỗ - Gia đình',
      metaDescription: 'Đặt xe 7 chỗ cho gia đình và nhóm đông',
    },
    {
      id: 'ride-4',
      type: 'LUXURY' as VehicleType,
      name: 'Xe sang',
      description: 'Đẳng cấp và chuyên nghiệp',
      icon: '🚕',
      basePrice: { amount: 30000, currency: 'VND' },
      pricePerKm: 25000,
      pricePerMinute: 2000,
      minimumFare: 50000,
      maximumCapacity: 4,
      features: ['Premium', 'VIP', 'Sang trọng', 'Tài xế chuyên nghiệp'],
      isActive: true,
      estimatedArrivalTime: 10,
      productType: 'NON_PHYSICAL' as ProductType.NON_PHYSICAL,
      createdAt: new Date(),
      updatedAt: new Date(),
      metaTitle: 'Đặt xe sang - VIP',
      metaDescription: 'Đặt xe sang, trải nghiệm đẳng cấp',
    },
  ];
};

/**
 * Generate mock products (Physical & Non-Physical)
 */
export const generateMockProducts = (count = 20): Product[] => {
  const productNames = [
    'iPhone 15 Pro',
    'Samsung Galaxy S24',
    'Áo thun basic',
    'Quần jean nam',
    'Laptop Dell XPS',
    'Tai nghe AirPods',
    'Khóa học tiếng Anh', // Digital
    'Game Steam', // Digital
    'Sách điện tử', // Digital
    'Plugin WordPress', // Digital
  ];

  const products: Product[] = [];

  for (let i = 0; i < count; i++) {
    const isDigital = i % 5 === 0; // Every 5th product is digital
    const productName = productNames[i % productNames.length];

    products.push({
      id: `product-${i + 1}`,
      sellerId: `seller-${(i % 5) + 1}`,
      name: `${productName} ${i + 1}`,
      slug: `${productName.toLowerCase().replace(/\s+/g, '-')}-${i + 1}`,
      description: `Mô tả chi tiết cho ${productName}. Chất lượng cao, giá tốt.`,
      shortDescription: `${productName} chính hãng`,
      images: [
        {
          id: `img-${i + 1}`,
          url: `/images/products/${i + 1}.jpg`,
          thumbnailUrl: `/images/products/thumb-${i + 1}.jpg`,
          alt: productName,
          width: 800,
          height: 800,
          order: 1,
        },
      ],
      categoryId: `cat-${(i % 8) + 1}`,
      price: {
        amount: isDigital ? 99000 + Math.floor(Math.random() * 500000) : 150000 + Math.floor(Math.random() * 50000000),
        currency: 'VND',
        originalAmount: Math.random() > 0.6 ? 200000 + Math.floor(Math.random() * 60000000) : undefined,
      },
      productType: isDigital ? ('NON_PHYSICAL' as ProductType) : ('PHYSICAL' as ProductType),
      availability: 'AVAILABLE' as AvailabilityStatus,
      stockQuantity: isDigital ? undefined : Math.floor(Math.random() * 100) + 10,
      sku: isDigital ? undefined : `SKU-${i + 1}`,
      shippingInfo: isDigital
        ? undefined
        : {
            isFreeShipping: Math.random() > 0.5,
            shippingFee: { amount: 30000, currency: 'VND' },
            estimatedDeliveryDays: { min: 2, max: 5 },
            shippingMethods: [],
          },
      dimensions: isDigital ? undefined : { length: 20, width: 15, height: 5 },
      weight: isDigital ? undefined : 500 + Math.floor(Math.random() * 2000),
      digitalInfo: isDigital
        ? {
            instantDelivery: true,
            requiresActivation: false,
            fileSize: 100 * 1024 * 1024, // 100MB
            fileFormat: 'PDF',
            licenseType: 'SINGLE_USER',
          }
        : undefined,
      variants: [],
      attributes: [
        { name: 'Thương hiệu', value: 'Brand Name' },
        { name: 'Xuất xứ', value: 'Vietnam' },
      ],
      rating: {
        average: 4 + Math.random(),
        count: Math.floor(Math.random() * 1000) + 50,
        distribution: { 1: 5, 2: 10, 3: 30, 4: 200, 5: 300 },
      },
      viewCount: Math.floor(Math.random() * 10000),
      soldCount: Math.floor(Math.random() * 1000),
      isFeatured: Math.random() > 0.8,
      isPopular: Math.random() > 0.7,
      isBestseller: Math.random() > 0.85,
      createdAt: new Date(),
      updatedAt: new Date(),
      metaTitle: `${productName} - Mua online giá tốt`,
      metaDescription: `${productName} chính hãng, giá tốt nhất. Giao hàng nhanh, đổi trả dễ dàng.`,
    });
  }

  return products;
};
