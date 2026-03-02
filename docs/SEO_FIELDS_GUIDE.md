# SEO Fields Guide - Lifestyle Super App

> Hướng dẫn chi tiết về các trường thông tin quan trọng và chuẩn SEO trong hệ thống.

---

## 📋 Table of Contents

1. [SEO Essential Fields](#seo-essential-fields)
2. [Structured Data (Schema.org)](#structured-data)
3. [Product Fields](#product-fields)
4. [Food Delivery Fields](#food-delivery-fields)
5. [Ride Hailing Fields](#ride-hailing-fields)
6. [Shopping Fields](#shopping-fields)
7. [Best Practices](#best-practices)

---

## 🔍 SEO Essential Fields

### **Common SEO Fields** (Tất cả entities)

```typescript
interface SEOFields {
  // Meta tags
  metaTitle?: string;           // 50-60 characters
  metaDescription?: string;     // 150-160 characters
  metaKeywords?: string[];      // 5-10 keywords
  
  // Structured data
  structuredData?: object;      // Schema.org JSON-LD
  
  // URL
  slug: string;                 // URL-friendly identifier
  
  // Content
  name: string;                 // Display name
  description: string;          // Full description
}
```

### **Best Practices cho Meta Tags**

#### 1. **Meta Title**
- **Độ dài**: 50-60 ký tự
- **Format**: `[Tên sản phẩm/dịch vụ] - [USP] | [Brand Name]`
- **Ví dụ**: 
  - ✅ "iPhone 15 Pro Max 256GB - Chính hãng VN/A | Lifestyle Shop"
  - ✅ "Phở Bò Hà Nội - Đậm đà hương vị truyền thống | Quán Phở ABC"
  - ❌ "Mua sản phẩm" (quá ngắn, không cụ thể)

#### 2. **Meta Description**
- **Độ dài**: 150-160 ký tự
- **Bao gồm**: Benefits, USP, Call-to-action
- **Ví dụ**:
  - ✅ "iPhone 15 Pro Max 256GB chính hãng VN/A. Giao hàng nhanh 2h, bảo hành 12 tháng, trả góp 0%. Đặt ngay để nhận ưu đãi!"
  - ✅ "Phở bò Hà Nội ngon đậm đà với nước dùng hầm 12 tiếng. Giao nhanh trong 30 phút. Đặt món ngay!"

#### 3. **Meta Keywords**
- **Số lượng**: 5-10 keywords
- **Độ dài mỗi keyword**: 2-3 từ
- **Ví dụ**:
  ```typescript
  metaKeywords: [
    "iphone 15 pro max",
    "điện thoại apple",
    "iphone chính hãng",
    "mua iphone",
    "giá iphone 15"
  ]
  ```

---

## 📊 Structured Data (Schema.org)

### **1. Product Schema**

```typescript
const productSchema = {
  "@context": "https://schema.org",
  "@type": "Product",
  "name": "iPhone 15 Pro Max 256GB",
  "image": [
    "https://example.com/image1.jpg",
    "https://example.com/image2.jpg"
  ],
  "description": "iPhone 15 Pro Max với chip A17 Pro mạnh mẽ",
  "sku": "IPHONE15-256-BLACK",
  "mpn": "MLXXX/A",
  "brand": {
    "@type": "Brand",
    "name": "Apple"
  },
  "offers": {
    "@type": "Offer",
    "url": "https://example.com/product/iphone-15-pro-max",
    "priceCurrency": "VND",
    "price": "34990000",
    "priceValidUntil": "2024-12-31",
    "availability": "https://schema.org/InStock",
    "seller": {
      "@type": "Organization",
      "name": "Lifestyle Shop"
    }
  },
  "aggregateRating": {
    "@type": "AggregateRating",
    "ratingValue": "4.8",
    "reviewCount": "352"
  }
};
```

### **2. Restaurant Schema**

```typescript
const restaurantSchema = {
  "@context": "https://schema.org",
  "@type": "Restaurant",
  "name": "Quán Phở Hà Nội",
  "image": "https://example.com/restaurant.jpg",
  "address": {
    "@type": "PostalAddress",
    "streetAddress": "123 Nguyễn Văn Linh",
    "addressLocality": "Quận 7",
    "addressRegion": "Hồ Chí Minh",
    "addressCountry": "VN"
  },
  "geo": {
    "@type": "GeoCoordinates",
    "latitude": 10.7769,
    "longitude": 106.7009
  },
  "telephone": "+84-28-1234-5678",
  "priceRange": "$$",
  "servesCuisine": ["Vietnamese", "Pho"],
  "aggregateRating": {
    "@type": "AggregateRating",
    "ratingValue": "4.6",
    "reviewCount": "128"
  },
  "openingHours": "Mo,Tu,We,Th,Fr,Sa,Su 06:00-22:00"
};
```

### **3. MenuItem Schema (Food Item)**

```typescript
const menuItemSchema = {
  "@context": "https://schema.org",
  "@type": "MenuItem",
  "name": "Phở Bò Đặc Biệt",
  "description": "Phở bò với đầy đủ topping, nước dùng hầm 12 tiếng",
  "image": "https://example.com/pho-bo.jpg",
  "offers": {
    "@type": "Offer",
    "price": "65000",
    "priceCurrency": "VND",
    "availability": "https://schema.org/InStock"
  },
  "nutrition": {
    "@type": "NutritionInformation",
    "calories": "450 calories",
    "fatContent": "15g",
    "proteinContent": "30g"
  },
  "suitableForDiet": "https://schema.org/GlutenFreeDiet"
};
```

### **4. Service Schema (Ride Hailing)**

```typescript
const serviceSchema = {
  "@context": "https://schema.org",
  "@type": "Service",
  "name": "Đặt Xe 4 Chỗ",
  "description": "Dịch vụ đặt xe 4 chỗ thoải mái, có điều hòa",
  "provider": {
    "@type": "Organization",
    "name": "Lifestyle Ride"
  },
  "areaServed": {
    "@type": "Country",
    "name": "Vietnam"
  },
  "offers": {
    "@type": "Offer",
    "price": "12000",
    "priceCurrency": "VND",
    "description": "Giá từ 12,000đ/km"
  }
};
```

---

## 🏷️ Product Fields (Sản phẩm)

### **Essential Fields**

```typescript
interface ProductEssentialFields {
  // Identity
  id: string;
  name: string;
  slug: string;
  sku?: string;                    // Stock Keeping Unit (vật lý)
  
  // Type & Availability
  productType: ProductType;        // PHYSICAL | NON_PHYSICAL
  availability: AvailabilityStatus;
  stockQuantity?: number;          // Chỉ cho vật lý
  
  // Pricing
  price: {
    amount: number;
    currency: string;
    originalAmount?: number;       // For discounts
    discountPercentage?: number;
  };
  
  // Content
  description: string;
  shortDescription?: string;
  images: ProductImage[];
  
  // Categorization
  categoryId: string;
  brandId?: string;
  
  // Engagement
  rating: RatingSummary;
  viewCount: number;
  soldCount: number;
  
  // SEO
  metaTitle?: string;
  metaDescription?: string;
  metaKeywords?: string[];
  structuredData?: ProductStructuredData;
}
```

### **Physical Product Specific**

```typescript
interface PhysicalProductFields {
  // Stock
  stockQuantity: number;
  sku: string;
  
  // Dimensions & Weight
  dimensions: {
    length: number;   // cm
    width: number;    // cm
    height: number;   // cm
  };
  weight: number;     // grams
  
  // Shipping
  shippingInfo: {
    isFreeShipping: boolean;
    shippingFee?: PriceInfo;
    estimatedDeliveryDays: {
      min: number;
      max: number;
    };
    shippingMethods: ShippingMethod[];
  };
}
```

### **Non-Physical Product Specific**

```typescript
interface NonPhysicalProductFields {
  // Digital Info
  digitalInfo: {
    downloadUrl?: string;
    fileSize?: number;              // bytes
    fileFormat?: string;            // PDF, MP4, ZIP, etc.
    licenseType?: 'SINGLE_USER' | 'MULTI_USER' | 'ENTERPRISE';
    validityPeriod?: number;        // days, null = lifetime
    instantDelivery: boolean;
    requiresActivation: boolean;
  };
}
```

---

## 🍔 Food Delivery Fields

### **Restaurant Essential Fields**

```typescript
interface RestaurantFields {
  // Identity
  id: string;
  name: string;
  slug: string;
  
  // Visual
  logo: string;
  coverImage: string;
  
  // Location
  location: {
    lat: number;
    lng: number;
    address: string;
    city: string;
    district: string;
    country: string;
  };
  
  // Classification
  cuisineTypes: string[];          // ['Vietnamese', 'Japanese']
  priceRange: 1 | 2 | 3 | 4;      // $ to $$$$
  
  // Status
  isActive: boolean;
  isOpen: boolean;
  
  // Service
  deliveryTime: {
    min: number;                   // minutes
    max: number;
  };
  deliveryFee: PriceInfo;
  minimumOrder: number;
  
  // Engagement
  rating: RatingSummary;
  
  // SEO
  metaTitle?: string;
  metaDescription?: string;
  metaKeywords?: string[];
  structuredData?: RestaurantStructuredData;
}
```

### **Food Item Essential Fields**

```typescript
interface FoodItemFields {
  // Identity
  id: string;
  restaurantId: string;
  name: string;
  slug: string;
  
  // Content
  description: string;
  images: ProductImage[];
  
  // Classification
  categoryId: string;
  isVegetarian: boolean;
  isVegan: boolean;
  isGlutenFree: boolean;
  spicyLevel?: 0 | 1 | 2 | 3;
  
  // Pricing & Availability
  price: PriceInfo;
  availability: AvailabilityStatus;
  
  // Service
  preparationTime: number;         // minutes
  calories?: number;
  
  // Flags
  isPopular: boolean;
  isFeatured: boolean;
  
  // Type
  productType: ProductType.NON_PHYSICAL;  // Always non-physical
  
  // Engagement
  rating: RatingSummary;
  
  // SEO
  metaTitle?: string;
  metaDescription?: string;
  metaKeywords?: string[];
  structuredData?: FoodItemStructuredData;
}
```

---

## 🚗 Ride Hailing Fields

### **Ride Service Essential Fields**

```typescript
interface RideServiceFields {
  // Identity
  id: string;
  type: VehicleType;               // MOTORBIKE, CAR_4_SEATS, etc.
  name: string;
  description: string;
  icon: string;
  
  // Pricing
  basePrice: PriceInfo;
  pricePerKm: number;
  pricePerMinute: number;
  minimumFare: number;
  
  // Capacity
  maximumCapacity: number;
  
  // Features
  features: string[];              // ['Điều hòa', 'WiFi', etc.]
  
  // Status
  isActive: boolean;
  
  // Service
  estimatedArrivalTime: number;    // minutes
  
  // Type
  productType: ProductType.NON_PHYSICAL;  // Always non-physical
  
  // SEO
  metaTitle?: string;
  metaDescription?: string;
  metaKeywords?: string[];
  structuredData?: RideServiceStructuredData;
}
```

### **Ride Booking Fields**

```typescript
interface RideBookingFields {
  // Identity
  id: string;
  userId: string;
  driverId?: string;
  vehicleId?: string;
  vehicleType: VehicleType;
  
  // Locations
  pickup: Location;
  dropoff: Location;
  
  // Status
  status: RideBookingStatus;
  
  // Pricing & Distance
  price: PriceInfo;
  distance: number;                // km
  duration: number;                // minutes
  
  // Timing
  scheduledAt?: Date;
  startedAt?: Date;
  completedAt?: Date;
  cancelledAt?: Date;
  
  // Feedback
  rating?: number;
  review?: string;
  cancellationReason?: string;
}
```

---

## 🛍️ Shopping Fields

### **Category Essential Fields**

```typescript
interface CategoryFields {
  // Identity
  id: string;
  name: string;
  slug: string;
  
  // Hierarchy
  parentId?: string;
  order: number;
  
  // Visual
  imageUrl?: string;
  icon?: string;
  
  // Content
  description: string;
  
  // Status
  isActive: boolean;
  
  // Stats
  productCount: number;
  
  // SEO
  metaTitle?: string;
  metaDescription?: string;
  metaKeywords?: string[];
}
```

### **Brand Essential Fields**

```typescript
interface BrandFields {
  // Identity
  id: string;
  name: string;
  slug: string;
  
  // Visual
  logo: string;
  
  // Content
  description: string;
  website?: string;
  
  // Status
  isVerified: boolean;
  
  // SEO
  metaTitle?: string;
  metaDescription?: string;
  metaKeywords?: string[];
}
```

---

## ✅ Best Practices

### **1. Meta Title Guidelines**

✅ **DO:**
- Keep 50-60 characters
- Include primary keyword
- Be descriptive and compelling
- Include brand name
- Use separators (| or -)

❌ **DON'T:**
- Exceed 60 characters (will be cut off)
- Keyword stuff
- Use ALL CAPS
- Duplicate across pages
- Be vague

### **2. Meta Description Guidelines**

✅ **DO:**
- Keep 150-160 characters
- Include call-to-action
- Highlight benefits/USP
- Use natural language
- Include secondary keywords

❌ **DON'T:**
- Exceed 160 characters
- Duplicate content from title
- Use generic descriptions
- Ignore mobile users

### **3. Structured Data Guidelines**

✅ **DO:**
- Use appropriate Schema.org types
- Include all required fields
- Test with Google Rich Results Test
- Keep data accurate and up-to-date
- Use multiple types when applicable

❌ **DON'T:**
- Make up fake data
- Use irrelevant schema types
- Skip required properties
- Forget to update when content changes

### **4. Image SEO**

✅ **DO:**
- Use descriptive filenames
- Add alt text to all images
- Optimize file size
- Use appropriate formats (WebP)
- Provide multiple sizes

❌ **DON'T:**
- Use generic names (image1.jpg)
- Skip alt text
- Upload huge files
- Use only one size

### **5. URL Structure (Slug)**

✅ **DO:**
- Use lowercase
- Use hyphens (-) not underscores (_)
- Be descriptive
- Keep short but meaningful
- Include keywords

**Examples:**
```
✅ iphone-15-pro-max-256gb
✅ pho-bo-ha-noi
✅ xe-4-cho-dieu-hoa
❌ product123
❌ San_Pham_iPhone
❌ san-pham-dien-thoai-iphone-15-pro-max-256gb-mau-den-chinh-hang
```

---

## 🎯 Priority Fields Checklist

### **Critical Fields** (Bắt buộc)
- [ ] `id` - Unique identifier
- [ ] `name` - Display name
- [ ] `slug` - URL-friendly identifier
- [ ] `description` - Full description
- [ ] `price` - Pricing information
- [ ] `availability` - Stock status
- [ ] `productType` - PHYSICAL/NON_PHYSICAL
- [ ] `images` - At least 1 image with alt text

### **Important Fields** (Nên có)
- [ ] `metaTitle` - SEO title
- [ ] `metaDescription` - SEO description
- [ ] `metaKeywords` - Keywords array
- [ ] `rating` - User ratings
- [ ] `categoryId` - Category classification

### **Nice to Have** (Tùy chọn)
- [ ] `structuredData` - Schema.org JSON-LD
- [ ] `shortDescription` - Brief summary
- [ ] `features` - Key features list
- [ ] `specifications` - Technical specs
- [ ] `relatedProducts` - Recommendations

---

## 📚 Resources

### **Testing Tools**
- [Google Rich Results Test](https://search.google.com/test/rich-results)
- [Schema.org Validator](https://validator.schema.org/)
- [Yoast SEO Checker](https://yoast.com/wordpress/plugins/seo/)

### **Documentation**
- [Schema.org Documentation](https://schema.org/)
- [Google Search Central](https://developers.google.com/search)
- [Open Graph Protocol](https://ogp.me/)

---

**Last Updated**: 2026-02-14
