/**
 * Shopping/E-commerce types and interfaces
 */

import type {
  BaseEntity,
  Category,
  PriceInfo,
  ProductImage,
  RatingSummary,
  AvailabilityStatus,
  ProductType,
} from './common';

/**
 * Product entity - Có thể là vật lý hoặc phi vật lý
 */
export interface Product extends BaseEntity {
  sellerId: string;
  name: string;
  slug: string;
  description: string;
  shortDescription?: string;
  images: ProductImage[];
  categoryId: string;
  category?: Category;
  brandId?: string;
  brand?: Brand;
  price: PriceInfo;
  productType: ProductType; // Phân loại vật lý/phi vật lý
  availability: AvailabilityStatus;
  stockQuantity?: number; // Chỉ cho sản phẩm vật lý
  sku?: string; // Stock Keeping Unit - cho sản phẩm vật lý
  // Shipping info (chỉ cho sản phẩm vật lý)
  shippingInfo?: ShippingInfo;
  // Dimensions (cho sản phẩm vật lý)
  dimensions?: ProductDimensions;
  weight?: number; // grams - cho sản phẩm vật lý
  // Digital product info (cho sản phẩm phi vật lý)
  digitalInfo?: DigitalProductInfo;
  // Variants (size, color, etc.)
  variants?: ProductVariant[];
  // Attributes
  attributes: ProductAttribute[];
  // Engagement
  rating: RatingSummary;
  viewCount: number;
  soldCount: number;
  isFeatured: boolean;
  isPopular: boolean;
  isBestseller: boolean;
  // SEO fields
  metaTitle?: string;
  metaDescription?: string;
  metaKeywords?: string[];
  structuredData?: ProductStructuredData;
}

/**
 * Shipping Information (cho sản phẩm vật lý)
 */
export interface ShippingInfo {
  isFreeShipping: boolean;
  shippingFee?: PriceInfo;
  estimatedDeliveryDays: {
    min: number;
    max: number;
  };
  shippingMethods: ShippingMethod[];
}

/**
 * Shipping Method
 */
export interface ShippingMethod {
  id: string;
  name: string;
  description: string;
  price: PriceInfo;
  estimatedDays: number;
}

/**
 * Product Dimensions (cho sản phẩm vật lý)
 */
export interface ProductDimensions {
  length: number; // cm
  width: number; // cm
  height: number; // cm
}

/**
 * Digital Product Info (cho sản phẩm phi vật lý)
 */
export interface DigitalProductInfo {
  downloadUrl?: string;
  fileSize?: number; // bytes
  fileFormat?: string;
  licenseType?: 'SINGLE_USER' | 'MULTI_USER' | 'ENTERPRISE';
  validityPeriod?: number; // days, null = lifetime
  instantDelivery: boolean;
  requiresActivation: boolean;
}

/**
 * Product Variant (size, color, etc.)
 */
export interface ProductVariant {
  id: string;
  name: string;
  sku: string;
  price: PriceInfo;
  stockQuantity: number;
  attributes: Record<string, string>; // e.g., { size: 'M', color: 'Red' }
  imageUrl?: string;
  isAvailable: boolean;
}

/**
 * Product Attribute (specifications)
 */
export interface ProductAttribute {
  name: string;
  value: string;
  group?: string; // e.g., 'Technical Specs', 'Features'
}

/**
 * Brand entity
 */
export interface Brand extends BaseEntity {
  name: string;
  slug: string;
  description: string;
  logo: string;
  website?: string;
  isVerified: boolean;
  // SEO fields
  metaTitle?: string;
  metaDescription?: string;
  metaKeywords?: string[];
}

/**
 * Seller/Merchant entity
 */
export interface Seller extends BaseEntity {
  userId: string;
  businessName: string;
  slug: string;
  description: string;
  logo?: string;
  coverImage?: string;
  rating: RatingSummary;
  totalProducts: number;
  totalSales: number;
  isVerified: boolean;
  isActive: boolean;
  // SEO fields
  metaTitle?: string;
  metaDescription?: string;
}

/**
 * Shopping Category
 */
export interface ShoppingCategory extends Category {
  productCount: number;
  subCategories?: ShoppingCategory[];
}

/**
 * Product Structured Data for SEO
 */
export interface ProductStructuredData {
  '@context': 'https://schema.org';
  '@type': 'Product';
  name: string;
  description: string;
  image: string[];
  brand?: {
    '@type': 'Brand';
    name: string;
  };
  offers: {
    '@type': 'Offer';
    price: number;
    priceCurrency: string;
    availability: string;
    priceValidUntil?: string;
    url: string;
    seller: {
      '@type': 'Organization';
      name: string;
    };
  };
  aggregateRating?: {
    '@type': 'AggregateRating';
    ratingValue: number;
    reviewCount: number;
  };
  sku?: string;
  mpn?: string; // Manufacturer Part Number
  gtin?: string; // Global Trade Item Number
}

/**
 * Product Filter Options
 */
export interface ProductFilters {
  categoryId?: string;
  brandId?: string;
  productType?: ProductType;
  minPrice?: number;
  maxPrice?: number;
  availability?: AvailabilityStatus;
  rating?: number;
  sortBy?: ProductSortBy;
  search?: string;
}

/**
 * Product Sort Options
 */
export enum ProductSortBy {
  NEWEST = 'NEWEST',
  PRICE_LOW_TO_HIGH = 'PRICE_LOW_TO_HIGH',
  PRICE_HIGH_TO_LOW = 'PRICE_HIGH_TO_LOW',
  MOST_POPULAR = 'MOST_POPULAR',
  BEST_RATING = 'BEST_RATING',
  BEST_SELLING = 'BEST_SELLING',
}
