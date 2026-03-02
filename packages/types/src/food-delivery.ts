/**
 * Food Delivery types and interfaces
 */

import type {
  BaseEntity,
  Category,
  Location,
  PriceInfo,
  ProductImage,
  RatingSummary,
  AvailabilityStatus,
  ProductType,
} from './common';

/**
 * Restaurant entity
 */
export interface Restaurant extends BaseEntity {
  name: string;
  slug: string;
  description: string;
  logo: string;
  coverImage: string;
  location: Location;
  cuisineTypes: string[];
  rating: RatingSummary;
  priceRange: 1 | 2 | 3 | 4; // $ to $$$$
  isActive: boolean;
  isOpen: boolean;
  deliveryTime: {
    min: number; // minutes
    max: number;
  };
  deliveryFee: PriceInfo;
  minimumOrder: number;
  // SEO fields
  metaTitle?: string;
  metaDescription?: string;
  metaKeywords?: string[];
  structuredData?: RestaurantStructuredData;
}

/**
 * Food Item (Món ăn) - Sản phẩm phi vật lý
 */
export interface FoodItem extends BaseEntity {
  restaurantId: string;
  name: string;
  slug: string;
  description: string;
  images: ProductImage[];
  categoryId: string;
  category?: Category;
  price: PriceInfo;
  availability: AvailabilityStatus;
  isPopular: boolean;
  isFeatured: boolean;
  isVegetarian: boolean;
  isVegan: boolean;
  isGlutenFree: boolean;
  spicyLevel?: 0 | 1 | 2 | 3; // 0 = not spicy, 3 = very spicy
  calories?: number;
  preparationTime: number; // minutes
  rating: RatingSummary;
  productType: ProductType.NON_PHYSICAL; // Món ăn là sản phẩm phi vật lý
  // SEO fields
  metaTitle?: string;
  metaDescription?: string;
  metaKeywords?: string[];
  structuredData?: FoodItemStructuredData;
}

/**
 * Restaurant Structured Data for SEO (Schema.org)
 */
export interface RestaurantStructuredData {
  '@context': 'https://schema.org';
  '@type': 'Restaurant';
  name: string;
  image: string;
  address: {
    '@type': 'PostalAddress';
    streetAddress: string;
    addressLocality: string;
    addressRegion: string;
    addressCountry: string;
  };
  geo: {
    '@type': 'GeoCoordinates';
    latitude: number;
    longitude: number;
  };
  priceRange: string;
  servesCuisine: string[];
  aggregateRating?: {
    '@type': 'AggregateRating';
    ratingValue: number;
    reviewCount: number;
  };
}

/**
 * Food Item Structured Data for SEO
 */
export interface FoodItemStructuredData {
  '@context': 'https://schema.org';
  '@type': 'MenuItem';
  name: string;
  description: string;
  image: string;
  offers: {
    '@type': 'Offer';
    price: number;
    priceCurrency: string;
    availability: string;
  };
  nutrition?: {
    '@type': 'NutritionInformation';
    calories: string;
  };
}

/**
 * Food category
 */
export interface FoodCategory extends Category {
  restaurantId?: string; // Optional: for restaurant-specific categories
  itemCount: number;
}
