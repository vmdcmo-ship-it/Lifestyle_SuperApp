# Frontend API Integration - Complete Setup

> **Hoàn thành**: Thiết lập cấu trúc Frontend lấy dữ liệu từ Backend với Services, Hooks, và Types chuẩn SEO.

---

## ✅ Đã hoàn thành

### 1. **Type Definitions** (`@lifestyle/types`)

Tạo đầy đủ TypeScript types cho toàn bộ domain:

#### 📁 Common Types (`packages/types/src/common.ts`)
- `BaseEntity` - Entity cơ bản với timestamps
- `PaginationMeta` & `PaginatedResponse` - Pagination
- `ApiResponse` & `ApiError` - API responses
- `ProductType` enum - **Phân loại PHYSICAL/NON_PHYSICAL**
- `Category` - Category với SEO fields
- `Location`, `RatingSummary`, `PriceInfo` - Common structures

#### 📁 Food Delivery Types (`packages/types/src/food-delivery.ts`)
- `Restaurant` - Nhà hàng với location, rating, SEO
- `FoodItem` - **Sản phẩm PHI VẬT LÝ** (món ăn)
- `RestaurantStructuredData` - Schema.org cho SEO
- `FoodItemStructuredData` - MenuItem Schema.org

#### 📁 Ride Hailing Types (`packages/types/src/ride-hailing.ts`)
- `RideService` - **Dịch vụ PHI VẬT LÝ** (đặt xe)
- `Vehicle` - Thông tin xe
- `Driver` - Tài xế
- `RideBooking` - Đơn đặt xe
- `VehicleType` enum - Các loại xe
- `RideServiceStructuredData` - Service Schema.org

#### 📁 Shopping Types (`packages/types/src/shopping.ts`)
- `Product` - **Hỗ trợ cả VẬT LÝ & PHI VẬT LÝ**
- `ShippingInfo` - Chỉ cho sản phẩm vật lý
- `DigitalProductInfo` - Chỉ cho sản phẩm phi vật lý
- `ProductDimensions`, `ProductVariant` - Chi tiết sản phẩm
- `Brand`, `Seller` - Thương hiệu và người bán
- `ProductStructuredData` - Product Schema.org
- `ProductFilters`, `ProductSortBy` - Filter và sort options

---

### 2. **API Client** (`@lifestyle/api-client`)

#### 📁 Client Setup (`packages/api-client/src/client.ts`)
- `ApiClient` class với:
  - Axios-based HTTP client
  - Auto token refresh
  - Request/Response interceptors
  - Error normalization
  - Generic CRUD methods (GET, POST, PUT, PATCH, DELETE)

#### 📁 Interceptors (`packages/api-client/src/interceptors.ts`)
- Request/Response logging
- Error logging
- Retry logic với exponential backoff
- Auto-retry cho 5xx errors

---

### 3. **Services Layer** (`apps/web/lib/services/`)

#### 📁 Food Delivery Service
```typescript
getRestaurants(params?)
getRestaurantById(id)
getPopularRestaurants(limit)
getFoodItems(params?)
getFoodItemById(id)
getPopularFoodItems(limit)
getFoodCategories()
searchFood(query)
```

#### 📁 Ride Hailing Service
```typescript
getRideServices()
getRideServiceById(id)
getRideEstimate(request)
bookRide(data)
getRideBookings()
getRideBookingById(id)
getAvailableDrivers(params)
cancelRideBooking(id, reason)
rateRide(id, rating, review)
```

#### 📁 Shopping Service
```typescript
getProducts(filters?, params?)
getProductById(id)
getFeaturedProducts(limit)
getPopularProducts(limit)
getProductsByType(productType, params?)  // PHYSICAL/NON_PHYSICAL
getShoppingCategories()
getBrands(params?)
searchProducts(query, filters?, params?)
getProductsByCategory(categoryId)
getProductsByBrand(brandId)
```

---

### 4. **Custom Hooks** (`apps/web/lib/hooks/`)

#### 📁 Food Delivery Hooks
```typescript
useRestaurants(params?)
usePopularRestaurants(limit)
useFoodItems(params?)
usePopularFoodItems(limit)
```

#### 📁 Ride Hailing Hooks
```typescript
useRideServices()
useRideEstimate()
```

#### 📁 Shopping Hooks
```typescript
useProducts(filters?, params?)
useFeaturedProducts(limit)
usePopularProducts(limit)
useProductsByType(productType, params?)  // Lọc theo PHYSICAL/NON_PHYSICAL
useProductSearch(query, filters?, params?)  // Auto-debounced 300ms
```

**Tất cả hooks trả về:**
```typescript
{
  data: T[];              // Data array
  meta?: PaginationMeta;  // Pagination info
  isLoading: boolean;     // Loading state
  error: Error | null;    // Error state
  refetch: () => Promise<void>;  // Manual refetch
}
```

---

### 5. **Configuration**

#### 📁 API Config (`apps/web/lib/config/api.ts`)
- `API_CONFIG` - Base URL, timeout, headers
- `API_ENDPOINTS` - Tất cả endpoints được define rõ ràng

#### 📁 Environment Variables
```bash
NEXT_PUBLIC_API_URL=http://localhost:4000/api
NEXT_PUBLIC_BASE_URL=http://localhost:3000
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX
NEXT_PUBLIC_GOOGLE_VERIFICATION=your-code
```

---

### 6. **Mock Data** (Development Only)

#### 📁 Data Generator (`apps/web/lib/mock/data-generator.ts`)
```typescript
generateMockRestaurants(count)
generateMockFoodItems(count)
generateMockRideServices()
generateMockProducts(count)  // Bao gồm cả PHYSICAL & NON_PHYSICAL
```

---

### 7. **Example Components**

#### 📁 Home Sections (`apps/web/app/(main)/home-sections.tsx`)
- `FeaturedServicesSection` - Sử dụng `useRideServices()`
- `PopularRestaurantsSection` - Sử dụng `usePopularRestaurants()`
- `PopularProductsSection` - Sử dụng `usePopularProducts()`

**Features:**
- Loading skeletons
- Error handling
- Empty state handling
- Real-time data fetching

---

## 🏷️ Phân Loại Sản Phẩm

### **Sản phẩm Vật lý** (`ProductType.PHYSICAL`)

**Đặc điểm:**
- ✅ Cần vận chuyển
- ✅ Có trọng lượng, kích thước (`dimensions`, `weight`)
- ✅ Có tồn kho (`stockQuantity`)
- ✅ Có SKU
- ✅ Có thông tin shipping (`shippingInfo`)

**Ví dụ:** Điện thoại, quần áo, laptop, sách giấy, đồ gia dụng

```typescript
const physicalProduct: Product = {
  productType: ProductType.PHYSICAL,
  stockQuantity: 50,
  sku: 'SKU-12345',
  weight: 500, // grams
  dimensions: { length: 20, width: 15, height: 5 },
  shippingInfo: {
    isFreeShipping: false,
    shippingFee: { amount: 30000, currency: 'VND' },
    estimatedDeliveryDays: { min: 2, max: 5 },
  },
};
```

### **Sản phẩm Phi vật lý** (`ProductType.NON_PHYSICAL`)

**Đặc điểm:**
- ✅ Không cần vận chuyển
- ✅ Digital products/services
- ✅ Không có tồn kho, trọng lượng
- ✅ Có thông tin digital (`digitalInfo`)
- ✅ Instant delivery hoặc service-based

**Ví dụ:** 
- 🍔 **Món ăn** (FoodItem)
- 🚗 **Dịch vụ đặt xe** (RideService)
- 📚 **Ebook, khóa học online**
- 🎮 **Game, software**
- 🎵 **Music, videos**

```typescript
const nonPhysicalProduct: Product = {
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

**Tất cả entities có SEO fields:**

```typescript
interface SEOFields {
  metaTitle?: string;
  metaDescription?: string;
  metaKeywords?: string[];
  structuredData?: any; // Schema.org JSON-LD
}
```

**Cách sử dụng trong component:**

```typescript
export default function ProductPage({ product }: Props) {
  return (
    <>
      {/* Inject structured data for SEO */}
      {product.structuredData && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(product.structuredData),
          }}
        />
      )}
      
      <Head>
        <title>{product.metaTitle}</title>
        <meta name="description" content={product.metaDescription} />
        <meta name="keywords" content={product.metaKeywords?.join(', ')} />
      </Head>

      {/* Component content */}
    </>
  );
}
```

**Supported Schema.org Types:**
- `Restaurant` - Nhà hàng
- `MenuItem` - Món ăn
- `Service` - Dịch vụ (đặt xe)
- `Product` - Sản phẩm
- `AggregateRating` - Đánh giá
- `Offer` - Giá cả

---

## 📖 Cách sử dụng

### **1. Trong Client Components**

```typescript
'use client';

import { useProducts } from '@/lib/hooks';
import { ProductType } from '@lifestyle/types';

export default function ProductsList() {
  // Lấy sản phẩm vật lý
  const { products, isLoading, error } = useProducts(
    { productType: ProductType.PHYSICAL },
    { page: 1, limit: 20 }
  );

  if (isLoading) return <LoadingSkeleton />;
  if (error) return <ErrorMessage error={error} />;

  return (
    <div>
      {products.map(product => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}
```

### **2. Trong Server Components**

```typescript
import { getProducts } from '@/lib/services';
import { ProductType } from '@lifestyle/types';

export default async function ProductsPage() {
  // Lấy sản phẩm phi vật lý (digital)
  const { data: products } = await getProducts(
    { productType: ProductType.NON_PHYSICAL },
    { page: 1, limit: 20 }
  );

  return (
    <div>
      {products.map(product => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}
```

### **3. Filter & Search**

```typescript
// Tìm kiếm với filter
const { products } = useProductSearch('iPhone', {
  productType: ProductType.PHYSICAL,
  minPrice: 1000000,
  maxPrice: 50000000,
  brandId: 'apple',
});

// Lọc theo loại
const { products: digitalProducts } = useProductsByType(
  ProductType.NON_PHYSICAL,
  { page: 1, limit: 10 }
);
```

---

## 🎯 Best Practices

### ✅ **DO's**

1. **Always handle loading and error states**
   ```typescript
   if (isLoading) return <Skeleton />;
   if (error) return <ErrorMessage />;
   ```

2. **Use TypeScript types from `@lifestyle/types`**
   ```typescript
   import type { Product, ProductType } from '@lifestyle/types';
   ```

3. **Implement SEO structured data**
   ```typescript
   <script type="application/ld+json">
     {JSON.stringify(product.structuredData)}
   </script>
   ```

4. **Check product type before rendering shipping info**
   ```typescript
   {product.productType === ProductType.PHYSICAL && (
     <ShippingInfo info={product.shippingInfo} />
   )}
   ```

### ❌ **DON'Ts**

1. ❌ Don't use `any` type
2. ❌ Don't forget error boundaries
3. ❌ Don't hardcode API URLs
4. ❌ Don't show shipping info for digital products
5. ❌ Don't forget to handle empty states

---

## 🚀 Next Steps

### **Backend Integration**
1. Kết nối với Backend API thật
2. Update `NEXT_PUBLIC_API_URL` trong `.env.local`
3. Sync API endpoints với Backend team

### **Testing**
1. Unit tests cho services
2. Integration tests cho hooks
3. E2E tests cho user flows

### **Optimization**
1. Implement caching (React Query/SWR)
2. Add infinite scroll
3. Optimize images
4. Add service worker

---

## 📚 Documentation

Chi tiết hơn xem tại:
- **`apps/web/lib/README.md`** - Full documentation
- **`packages/types/src/`** - All type definitions
- **`apps/web/lib/hooks/`** - Hook implementations
- **`apps/web/lib/services/`** - Service implementations

---

## 🛠️ Tech Stack

- **Types**: TypeScript strict mode
- **HTTP Client**: Axios
- **State Management**: React Hooks (useState, useEffect)
- **Framework**: Next.js 14 (App Router)
- **API Pattern**: Service Layer + Custom Hooks
- **SEO**: Structured Data (Schema.org JSON-LD)

---

**Status**: ✅ **COMPLETED** - Ready for Backend integration
