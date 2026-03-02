## Frontend Data Fetching Architecture

Hướng dẫn sử dụng Services và Hooks để lấy dữ liệu từ Backend.

### 📁 Cấu trúc thư mục

```
lib/
├── api/              # API client configuration
│   └── client.ts     # Initialized API client instance
├── config/           # Configuration files
│   └── api.ts        # API endpoints & config
├── services/         # Service layer - Business logic
│   ├── food-delivery.service.ts
│   ├── ride-hailing.service.ts
│   ├── shopping.service.ts
│   └── index.ts
├── hooks/            # React custom hooks
│   ├── use-restaurants.ts
│   ├── use-food-items.ts
│   ├── use-ride-services.ts
│   ├── use-products.ts
│   └── index.ts
└── mock/             # Mock data (for development)
    └── data-generator.ts
```

---

## 🔧 Cách sử dụng

### 1. Sử dụng Hooks (Khuyến nghị)

**Ví dụ: Lấy danh sách nhà hàng**

```typescript
'use client';

import { useRestaurants } from '@/lib/hooks';

export default function RestaurantsPage() {
  const { restaurants, isLoading, error } = useRestaurants({
    page: 1,
    limit: 10,
  });

  if (isLoading) return <div>Đang tải...</div>;
  if (error) return <div>Lỗi: {error.message}</div>;

  return (
    <div>
      {restaurants.map((restaurant) => (
        <div key={restaurant.id}>{restaurant.name}</div>
      ))}
    </div>
  );
}
```

**Ví dụ: Lấy sản phẩm vật lý**

```typescript
'use client';

import { useProductsByType } from '@/lib/hooks';
import { ProductType } from '@lifestyle/types';

export default function PhysicalProductsPage() {
  const { products, isLoading, error } = useProductsByType(
    ProductType.PHYSICAL,
    { page: 1, limit: 20 }
  );

  // ... render logic
}
```

**Ví dụ: Lấy sản phẩm phi vật lý (Digital)**

```typescript
'use client';

import { useProductsByType } from '@/lib/hooks';
import { ProductType } from '@lifestyle/types';

export default function DigitalProductsPage() {
  const { products, isLoading, error } = useProductsByType(
    ProductType.NON_PHYSICAL,
    { page: 1, limit: 20 }
  );

  // ... render logic
}
```

---

### 2. Sử dụng Services trực tiếp

**Trong Server Components (Next.js 14)**

```typescript
import { getRestaurants } from '@/lib/services';

export default async function RestaurantsPage() {
  const { data: restaurants, meta } = await getRestaurants({
    page: 1,
    limit: 10,
  });

  return (
    <div>
      {restaurants.map((restaurant) => (
        <div key={restaurant.id}>{restaurant.name}</div>
      ))}
    </div>
  );
}
```

---

## 📝 Các Hooks có sẵn

### Food Delivery

```typescript
// Lấy danh sách nhà hàng
const { restaurants, meta, isLoading, error, refetch } = useRestaurants(params);

// Lấy nhà hàng phổ biến
const { restaurants, isLoading, error } = usePopularRestaurants(10);

// Lấy món ăn
const { foodItems, meta, isLoading, error } = useFoodItems({
  restaurantId: 'xxx',
  categoryId: 'yyy',
});

// Lấy món ăn phổ biến
const { foodItems, isLoading, error } = usePopularFoodItems(10);
```

### Ride Hailing

```typescript
// Lấy các loại xe
const { services, isLoading, error } = useRideServices();

// Ước tính giá chuyến đi
const { estimate, isLoading, error, getEstimate } = useRideEstimate();

// Gọi getEstimate khi cần
await getEstimate({
  pickup: { lat: 10.8231, lng: 106.6297, ... },
  dropoff: { lat: 10.7769, lng: 106.7009, ... },
  vehicleType: VehicleType.CAR_4_SEATS,
});
```

### Shopping

```typescript
// Lấy sản phẩm
const { products, meta, isLoading, error } = useProducts(filters, params);

// Lấy sản phẩm nổi bật
const { products, isLoading, error } = useFeaturedProducts(10);

// Lấy sản phẩm phổ biến
const { products, isLoading, error } = usePopularProducts(10);

// Lấy sản phẩm theo loại (Vật lý/Phi vật lý)
const { products, meta, isLoading, error } = useProductsByType(
  ProductType.PHYSICAL,
  params
);

// Tìm kiếm sản phẩm
const { products, meta, isLoading, error } = useProductSearch(
  'iPhone',
  filters,
  params
);
```

---

## 🏷️ Phân loại Sản phẩm

### Sản phẩm Vật lý (`ProductType.PHYSICAL`)

- Cần vận chuyển
- Có trọng lượng, kích thước
- Có tồn kho (`stockQuantity`)
- Có thông tin shipping
- **Ví dụ**: Điện thoại, quần áo, laptop, sách giấy

```typescript
const physicalProduct: Product = {
  // ... other fields
  productType: ProductType.PHYSICAL,
  stockQuantity: 50,
  sku: 'SKU-12345',
  weight: 500, // grams
  dimensions: { length: 20, width: 15, height: 5 }, // cm
  shippingInfo: {
    isFreeShipping: false,
    shippingFee: { amount: 30000, currency: 'VND' },
    estimatedDeliveryDays: { min: 2, max: 5 },
  },
};
```

### Sản phẩm Phi vật lý (`ProductType.NON_PHYSICAL`)

- Không cần vận chuyển
- Digital products, services
- Không có tồn kho, trọng lượng
- Có thông tin digital
- **Ví dụ**: Khóa học online, game, ebook, software, dịch vụ

```typescript
const nonPhysicalProduct: Product = {
  // ... other fields
  productType: ProductType.NON_PHYSICAL,
  digitalInfo: {
    instantDelivery: true,
    requiresActivation: false,
    fileSize: 100 * 1024 * 1024, // 100MB
    fileFormat: 'PDF',
    licenseType: 'SINGLE_USER',
    validityPeriod: 365, // days
  },
};
```

---

## 🔍 SEO - Structured Data

Tất cả entities đều có các trường SEO:

```typescript
interface SEOFields {
  metaTitle?: string;
  metaDescription?: string;
  metaKeywords?: string[];
  structuredData?: any; // Schema.org JSON-LD
}
```

**Ví dụ: Restaurant Structured Data**

```typescript
const restaurant: Restaurant = {
  // ... other fields
  structuredData: {
    '@context': 'https://schema.org',
    '@type': 'Restaurant',
    name: 'Nhà hàng ABC',
    image: 'https://example.com/image.jpg',
    address: {
      '@type': 'PostalAddress',
      streetAddress: '123 Nguyễn Văn Linh',
      addressLocality: 'Hồ Chí Minh',
      addressCountry: 'VN',
    },
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: 4.5,
      reviewCount: 250,
    },
  },
};
```

**Sử dụng trong component:**

```typescript
export default function RestaurantDetail({ restaurant }: Props) {
  return (
    <>
      {/* Inject structured data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(restaurant.structuredData),
        }}
      />

      {/* Rest of component */}
    </>
  );
}
```

---

## 🌐 Environment Variables

Tạo file `.env.local`:

```bash
# API Configuration
NEXT_PUBLIC_API_URL=http://localhost:4000/api
NEXT_PUBLIC_BASE_URL=http://localhost:3000

# Google Analytics (optional)
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX

# Google Verification (optional)
NEXT_PUBLIC_GOOGLE_VERIFICATION=your-verification-code
```

---

## 🚀 Best Practices

### 1. Error Handling

```typescript
const { data, isLoading, error } = useRestaurants();

if (error) {
  // Log error to monitoring service (Sentry, etc.)
  console.error('Failed to fetch restaurants:', error);

  // Show user-friendly message
  return <ErrorMessage message="Không thể tải dữ liệu. Vui lòng thử lại." />;
}
```

### 2. Loading States

```typescript
if (isLoading) {
  return <RestaurantsSkeleton />; // Use skeleton UI
}
```

### 3. Refetch Data

```typescript
const { restaurants, refetch } = useRestaurants();

const handleRefresh = async () => {
  await refetch();
};
```

### 4. Debounced Search

```typescript
const [query, setQuery] = useState('');
const { products } = useProductSearch(query); // Auto-debounced 300ms
```

---

## 📦 Type Safety

Tất cả types đều import từ `@lifestyle/types`:

```typescript
import type {
  Restaurant,
  FoodItem,
  RideService,
  Product,
  ProductType,
  PaginatedResponse,
  ApiQueryParams,
} from '@lifestyle/types';
```

---

## 🧪 Testing với Mock Data

Trong development, có thể sử dụng mock data:

```typescript
import {
  generateMockRestaurants,
  generateMockProducts,
} from '@/lib/mock';

// Development only
if (process.env.NODE_ENV === 'development') {
  const mockRestaurants = generateMockRestaurants(10);
  const mockProducts = generateMockProducts(20);
}
```

---

## 📞 Liên hệ

Nếu có câu hỏi hoặc cần hỗ trợ, vui lòng liên hệ team Backend để sync API endpoints.
