# Quick Reference - Frontend Data Fetching

> Tài liệu tham khảo nhanh cho developers.

---

## 🚀 Quick Start

### 1. Import Types
```typescript
import type { 
  Restaurant, 
  FoodItem, 
  Product, 
  ProductType 
} from '@lifestyle/types';
```

### 2. Use Hooks (Client Components)
```typescript
'use client';
import { useRestaurants } from '@/lib/hooks';

const { restaurants, isLoading, error } = useRestaurants();
```

### 3. Use Services (Server Components)
```typescript
import { getRestaurants } from '@/lib/services';

const { data: restaurants } = await getRestaurants();
```

---

## 📦 Common Patterns

### Loading State
```typescript
if (isLoading) return <Skeleton />;
```

### Error Handling
```typescript
if (error) {
  console.error(error);
  return <ErrorMessage />;
}
```

### Empty State
```typescript
if (!isLoading && data.length === 0) {
  return <EmptyState />;
}
```

### Pagination
```typescript
const { data, meta } = useProducts({}, { page: 1, limit: 20 });

// Access: meta.totalPages, meta.hasNext, etc.
```

### Filtering
```typescript
// Physical products only
const { products } = useProducts({
  productType: ProductType.PHYSICAL,
  minPrice: 100000,
  maxPrice: 5000000
});
```

---

## 🏷️ Product Types

### Physical (Vật lý)
```typescript
productType: ProductType.PHYSICAL

// Has:
- stockQuantity
- sku
- dimensions
- weight
- shippingInfo
```

### Non-Physical (Phi vật lý)
```typescript
productType: ProductType.NON_PHYSICAL

// Has:
- digitalInfo
- instantDelivery
- licenseType

// Examples: Food, Rides, Ebooks, Courses
```

---

## 🔍 SEO Checklist

```typescript
// Essential fields
✅ metaTitle (50-60 chars)
✅ metaDescription (150-160 chars)
✅ metaKeywords (5-10 keywords)
✅ slug (URL-friendly)
✅ images with alt text

// Advanced
✅ structuredData (Schema.org)
```

### Inject Structured Data
```tsx
<script
  type="application/ld+json"
  dangerouslySetInnerHTML={{
    __html: JSON.stringify(product.structuredData)
  }}
/>
```

---

## 🎣 Available Hooks

### Food Delivery
```typescript
useRestaurants(params?)
usePopularRestaurants(limit)
useFoodItems(params?)
usePopularFoodItems(limit)
```

### Ride Hailing
```typescript
useRideServices()
useRideEstimate()
```

### Shopping
```typescript
useProducts(filters?, params?)
useFeaturedProducts(limit)
usePopularProducts(limit)
useProductsByType(type, params?)
useProductSearch(query, filters?, params?)
```

---

## 🛠️ Service Functions

### Food Delivery
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

### Ride Hailing
```typescript
getRideServices()
getRideServiceById(id)
getRideEstimate(request)
bookRide(data)
getRideBookings()
cancelRideBooking(id, reason)
rateRide(id, rating, review)
```

### Shopping
```typescript
getProducts(filters?, params?)
getProductById(id)
getFeaturedProducts(limit)
getPopularProducts(limit)
getProductsByType(type, params?)
getShoppingCategories()
getBrands(params?)
searchProducts(query, filters?, params?)
```

---

## 🌍 Environment Variables

```bash
NEXT_PUBLIC_API_URL=http://localhost:4000/api
NEXT_PUBLIC_BASE_URL=http://localhost:3000
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX
```

---

## 🧪 Mock Data (Development)

```typescript
import {
  generateMockRestaurants,
  generateMockProducts,
  generateMockRideServices,
} from '@/lib/mock';

const mockData = generateMockProducts(20);
```

---

## ⚡ Performance Tips

### 1. Use Loading Skeletons
```typescript
{isLoading ? <Skeleton /> : <Content />}
```

### 2. Implement Pagination
```typescript
const { data, meta } = useProducts({}, { 
  page: currentPage, 
  limit: 20 
});
```

### 3. Debounce Search
```typescript
// Auto-debounced in useProductSearch
const { products } = useProductSearch(searchQuery); // 300ms
```

### 4. Error Boundaries
```tsx
<ErrorBoundary fallback={<ErrorPage />}>
  <ProductsList />
</ErrorBoundary>
```

---

## 🎨 UI Components Pattern

```typescript
interface ComponentProps {
  data: T[];
  isLoading: boolean;
  error: Error | null;
}

export function Component({ data, isLoading, error }: ComponentProps) {
  if (error) return <ErrorMessage error={error} />;
  if (isLoading) return <Skeleton count={5} />;
  if (data.length === 0) return <EmptyState />;
  
  return (
    <div>
      {data.map(item => (
        <Card key={item.id} item={item} />
      ))}
    </div>
  );
}
```

---

## 📝 Type Guards

### Check Product Type
```typescript
function isPhysicalProduct(product: Product): boolean {
  return product.productType === ProductType.PHYSICAL;
}

// Usage
{isPhysicalProduct(product) && (
  <ShippingInfo info={product.shippingInfo} />
)}
```

### Check Availability
```typescript
function isAvailable(product: Product): boolean {
  return product.availability === AvailabilityStatus.AVAILABLE;
}
```

---

## 🔗 Useful Links

- **Full Docs**: `apps/web/lib/README.md`
- **Types**: `packages/types/src/`
- **SEO Guide**: `docs/SEO_FIELDS_GUIDE.md`
- **Integration Guide**: `FRONTEND_API_INTEGRATION.md`

---

## 🆘 Common Issues

### Issue: Type errors
```bash
# Solution: Check import path
import type { Product } from '@lifestyle/types'; // ✅
import type { Product } from '@/types'; // ❌
```

### Issue: Hook not updating
```bash
# Solution: Check dependencies
useEffect(() => {
  fetchData();
}, [JSON.stringify(params)]); // Serialize objects
```

### Issue: CORS errors
```bash
# Solution: Check API URL
NEXT_PUBLIC_API_URL=http://localhost:4000/api
# NOT: http://localhost:4000 (missing /api)
```

---

## 💡 Pro Tips

1. **Always type your data**
   ```typescript
   const data: Product[] = await getProducts();
   ```

2. **Use optional chaining**
   ```typescript
   product.shippingInfo?.isFreeShipping
   ```

3. **Format prices consistently**
   ```typescript
   new Intl.NumberFormat('vi-VN', {
     style: 'currency',
     currency: 'VND'
   }).format(price)
   ```

4. **Handle null/undefined**
   ```typescript
   const image = product.images[0]?.url || '/placeholder.jpg';
   ```

5. **Use enums for constants**
   ```typescript
   if (product.productType === ProductType.PHYSICAL) { }
   // NOT: if (product.productType === 'PHYSICAL')
   ```

---

**Keep this reference handy!** 📌
