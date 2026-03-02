/**
 * Savings Package Types
 * Gói Tiết Kiệm - Combo deals và subscription packages
 */

import type { BaseEntity, PriceInfo, ProductType } from './common';

/**
 * Savings Package Type
 */
export enum SavingsPackageType {
  COMBO = 'COMBO',                 // Combo nhiều dịch vụ
  SUBSCRIPTION = 'SUBSCRIPTION',   // Gói đăng ký định kỳ
  PREPAID = 'PREPAID',            // Gói trả trước
  BUNDLE = 'BUNDLE',              // Bundle sản phẩm
}

/**
 * Package Status
 */
export enum PackageStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
  COMING_SOON = 'COMING_SOON',
  SOLD_OUT = 'SOLD_OUT',
}

/**
 * Subscription Period
 */
export enum SubscriptionPeriod {
  DAILY = 'DAILY',
  WEEKLY = 'WEEKLY',
  MONTHLY = 'MONTHLY',
  QUARTERLY = 'QUARTERLY',
  YEARLY = 'YEARLY',
}

/**
 * Savings Package
 */
export interface SavingsPackage extends BaseEntity {
  name: string;
  slug: string;
  description: string;
  shortDescription?: string;
  imageUrl: string;
  images?: string[];
  type: SavingsPackageType;
  status: PackageStatus;
  
  // Pricing
  price: PriceInfo;
  originalValue: PriceInfo; // Giá trị gốc nếu mua riêng lẻ
  discountPercentage: number;
  
  // Package Details
  items: PackageItem[];
  totalItems: number;
  
  // Subscription specific
  subscriptionPeriod?: SubscriptionPeriod;
  autoRenewal?: boolean;
  
  // Limits
  maxPurchasePerUser?: number;
  availableStock?: number;
  minPurchaseAge?: number;
  
  // Validity
  validFrom: Date;
  validTo?: Date;
  usageDays?: number; // Số ngày sử dụng sau khi mua
  
  // Features & Benefits
  features: string[];
  benefits: string[];
  terms: string[];
  
  // Popularity
  soldCount: number;
  viewCount: number;
  isPopular: boolean;
  isFeatured: boolean;
  isBestseller: boolean;
  
  // Category
  categoryId?: string;
  tags: string[];
  
  // Product Type
  productType: ProductType.NON_PHYSICAL; // Gói tiết kiệm là phi vật lý
  
  // SEO
  metaTitle?: string;
  metaDescription?: string;
  metaKeywords?: string[];
  structuredData?: PackageStructuredData;
}

/**
 * Package Item (Items included in the package)
 */
export interface PackageItem {
  id: string;
  type: 'FOOD_VOUCHER' | 'RIDE_VOUCHER' | 'SHOPPING_VOUCHER' | 'SERVICE' | 'PRODUCT';
  name: string;
  description: string;
  quantity: number;
  value: PriceInfo;
  imageUrl?: string;
  conditions?: string[];
}

/**
 * User Package Subscription
 */
export interface UserPackageSubscription extends BaseEntity {
  userId: string;
  packageId: string;
  package?: SavingsPackage;
  
  // Status
  status: SubscriptionStatus;
  
  // Dates
  purchasedAt: Date;
  activatedAt?: Date;
  expiresAt: Date;
  cancelledAt?: Date;
  renewedAt?: Date;
  
  // Usage
  usageCount: number;
  remainingItems: PackageItem[];
  
  // Payment
  pricePaid: PriceInfo;
  paymentMethod: string;
  orderId: string;
  
  // Auto renewal
  autoRenewal: boolean;
  nextBillingDate?: Date;
  
  // Benefits
  coinsEarned: number;
}

/**
 * Subscription Status
 */
export enum SubscriptionStatus {
  PENDING = 'PENDING',           // Chờ thanh toán
  ACTIVE = 'ACTIVE',             // Đang hoạt động
  PAUSED = 'PAUSED',             // Tạm dừng
  EXPIRED = 'EXPIRED',           // Hết hạn
  CANCELLED = 'CANCELLED',       // Đã hủy
  COMPLETED = 'COMPLETED',       // Hoàn thành (đã dùng hết)
}

/**
 * Package Usage
 */
export interface PackageUsage extends BaseEntity {
  subscriptionId: string;
  userId: string;
  itemId: string; // Package item used
  itemType: string;
  serviceId: string; // Order ID, Ride ID, etc.
  usedAt: Date;
  value: PriceInfo;
  description: string;
}

/**
 * Package Category
 */
export interface PackageCategory extends BaseEntity {
  name: string;
  slug: string;
  description: string;
  imageUrl?: string;
  icon?: string;
  order: number;
  packageCount: number;
  isActive: boolean;
  
  // SEO
  metaTitle?: string;
  metaDescription?: string;
}

/**
 * Package Structured Data for SEO
 */
export interface PackageStructuredData {
  '@context': 'https://schema.org';
  '@type': 'Product' | 'Service';
  name: string;
  description: string;
  image: string[];
  offers: {
    '@type': 'Offer';
    price: number;
    priceCurrency: string;
    availability: string;
    validFrom: string;
    priceValidUntil?: string;
    url: string;
  };
  aggregateRating?: {
    '@type': 'AggregateRating';
    ratingValue: number;
    reviewCount: number;
  };
}

/**
 * Package Comparison
 */
export interface PackageComparison {
  packageId: string;
  package: SavingsPackage;
  savings: number;
  savingsPercentage: number;
  pricePerDay: number;
  pricePerUse: number;
  bestFor: string[];
}

/**
 * Package Filters
 */
export interface PackageFilters {
  type?: SavingsPackageType;
  categoryId?: string;
  minPrice?: number;
  maxPrice?: number;
  period?: SubscriptionPeriod;
  tags?: string[];
  isPopular?: boolean;
  isFeatured?: boolean;
}

/**
 * Package Sort Options
 */
export enum PackageSortBy {
  NEWEST = 'NEWEST',
  PRICE_LOW_TO_HIGH = 'PRICE_LOW_TO_HIGH',
  PRICE_HIGH_TO_LOW = 'PRICE_HIGH_TO_LOW',
  MOST_POPULAR = 'MOST_POPULAR',
  BEST_SAVINGS = 'BEST_SAVINGS',
}
