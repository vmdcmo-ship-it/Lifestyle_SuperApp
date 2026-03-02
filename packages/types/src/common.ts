/**
 * Common types and interfaces
 * Shared across all services and apps
 */

/**
 * Base entity with common fields
 */
export interface BaseEntity {
  id: string;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Pagination metadata
 */
export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNext: boolean;
  hasPrevious: boolean;
}

/**
 * Paginated response wrapper
 */
export interface PaginatedResponse<T> {
  data: T[];
  meta: PaginationMeta;
}

/**
 * API Response wrapper
 */
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: ApiError;
  message?: string;
}

/**
 * API Error structure
 */
export interface ApiError {
  code: string;
  message: string;
  details?: Record<string, unknown>;
  statusCode: number;
}

/**
 * Product Type Enum - Phân loại sản phẩm
 */
export enum ProductType {
  /** Sản phẩm vật lý - cần vận chuyển */
  PHYSICAL = 'PHYSICAL',
  /** Sản phẩm phi vật lý - digital, dịch vụ */
  NON_PHYSICAL = 'NON_PHYSICAL',
}

/**
 * Category with SEO metadata
 */
export interface Category extends BaseEntity {
  name: string;
  slug: string;
  description: string;
  parentId?: string;
  imageUrl?: string;
  icon?: string;
  order: number;
  isActive: boolean;
  // SEO fields
  metaTitle?: string;
  metaDescription?: string;
  metaKeywords?: string[];
}

/**
 * Image with optimization info
 */
export interface ProductImage {
  id: string;
  url: string;
  thumbnailUrl: string;
  alt: string;
  width: number;
  height: number;
  order: number;
}

/**
 * Location/Address structure
 */
export interface Location {
  lat: number;
  lng: number;
  address: string;
  city: string;
  district: string;
  ward?: string;
  country: string;
}

/**
 * Rating and Review summary
 */
export interface RatingSummary {
  average: number;
  count: number;
  distribution: {
    1: number;
    2: number;
    3: number;
    4: number;
    5: number;
  };
}

/**
 * Price information
 */
export interface PriceInfo {
  amount: number;
  currency: string;
  originalAmount?: number; // For discounts
  discountPercentage?: number;
}

/**
 * Availability status
 */
export enum AvailabilityStatus {
  AVAILABLE = 'AVAILABLE',
  OUT_OF_STOCK = 'OUT_OF_STOCK',
  COMING_SOON = 'COMING_SOON',
  DISCONTINUED = 'DISCONTINUED',
}
