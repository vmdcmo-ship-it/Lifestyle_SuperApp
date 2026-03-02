/**
 * Ride Hailing types and interfaces
 */

import type {
  BaseEntity,
  Location,
  PriceInfo,
  RatingSummary,
  ProductType,
} from './common';

/**
 * Vehicle Type Enum
 */
export enum VehicleType {
  MOTORBIKE = 'MOTORBIKE', // Xe máy
  CAR_4_SEATS = 'CAR_4_SEATS', // Xe 4 chỗ
  CAR_7_SEATS = 'CAR_7_SEATS', // Xe 7 chỗ
  LUXURY = 'LUXURY', // Xe sang
}

/**
 * Vehicle entity - Sản phẩm phi vật lý (dịch vụ)
 */
export interface Vehicle extends BaseEntity {
  driverId: string;
  type: VehicleType;
  name: string;
  description: string;
  licensePlate: string;
  brand: string;
  model: string;
  year: number;
  color: string;
  imageUrl: string;
  seats: number;
  features: VehicleFeature[];
  isActive: boolean;
  isAvailable: boolean;
  currentLocation?: Location;
  productType: ProductType.NON_PHYSICAL; // Dịch vụ đặt xe
}

/**
 * Vehicle Features
 */
export interface VehicleFeature {
  id: string;
  name: string;
  icon: string;
}

/**
 * Driver entity
 */
export interface Driver extends BaseEntity {
  userId: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  email: string;
  avatar?: string;
  rating: RatingSummary;
  totalTrips: number;
  isActive: boolean;
  isVerified: boolean;
  licenseNumber: string;
  licenseExpiryDate: Date;
  // SEO fields for driver profile pages
  metaTitle?: string;
  metaDescription?: string;
}

/**
 * Ride Service/Price Estimate - Sản phẩm phi vật lý
 */
export interface RideService extends BaseEntity {
  type: VehicleType;
  name: string;
  description: string;
  icon: string;
  basePrice: PriceInfo;
  pricePerKm: number;
  pricePerMinute: number;
  minimumFare: number;
  maximumCapacity: number;
  features: string[];
  isActive: boolean;
  estimatedArrivalTime: number; // minutes
  productType: ProductType.NON_PHYSICAL; // Dịch vụ
  // SEO fields
  metaTitle?: string;
  metaDescription?: string;
  metaKeywords?: string[];
  structuredData?: RideServiceStructuredData;
}

/**
 * Ride Estimate Request
 */
export interface RideEstimateRequest {
  pickup: Location;
  dropoff: Location;
  vehicleType: VehicleType;
}

/**
 * Ride Estimate Response
 */
export interface RideEstimateResponse {
  distance: number; // km
  duration: number; // minutes
  price: PriceInfo;
  vehicleType: VehicleType;
  availableDrivers: number;
  estimatedArrivalTime: number; // minutes
}

/**
 * Ride Booking
 */
export interface RideBooking extends BaseEntity {
  userId: string;
  driverId?: string;
  vehicleId?: string;
  vehicleType: VehicleType;
  pickup: Location;
  dropoff: Location;
  status: RideBookingStatus;
  price: PriceInfo;
  distance: number;
  duration: number;
  scheduledAt?: Date;
  startedAt?: Date;
  completedAt?: Date;
  cancelledAt?: Date;
  cancellationReason?: string;
  rating?: number;
  review?: string;
}

/**
 * Ride Booking Status
 */
export enum RideBookingStatus {
  PENDING = 'PENDING',
  DRIVER_ASSIGNED = 'DRIVER_ASSIGNED',
  DRIVER_ARRIVING = 'DRIVER_ARRIVING',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED',
}

/**
 * Ride Service Structured Data for SEO
 */
export interface RideServiceStructuredData {
  '@context': 'https://schema.org';
  '@type': 'Service';
  name: string;
  description: string;
  provider: {
    '@type': 'Organization';
    name: string;
  };
  areaServed: {
    '@type': 'Country';
    name: string;
  };
  offers: {
    '@type': 'Offer';
    price: number;
    priceCurrency: string;
  };
}
