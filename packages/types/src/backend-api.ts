/**
 * Backend API Types - match the main-api DTOs
 */

// ─── Auth ──────────────────────────────────────────────────────────────────

export interface AuthLoginRequest {
  email: string;
  password: string;
}

export interface AuthRegisterRequest {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phoneNumber?: string;
}

export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  user: UserProfile;
}

export interface UserProfile {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phoneNumber?: string;
  role: 'CUSTOMER' | 'DRIVER' | 'MERCHANT' | 'ADMIN';
  avatar?: string;
  createdAt: string;
}

// ─── Booking ───────────────────────────────────────────────────────────────

export type VehicleType = 'MOTORBIKE' | 'CAR_4' | 'CAR_7' | 'LUXURY';
export type BookingStatus = 'PENDING' | 'ACCEPTED' | 'ARRIVING' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';

export interface BookingEstimateRequest {
  pickupLat: number;
  pickupLng: number;
  pickupAddress: string;
  dropoffLat: number;
  dropoffLng: number;
  dropoffAddress: string;
  vehicleType: VehicleType;
}

export interface BookingEstimateResponse {
  distanceKm: number;
  durationMinutes: number;
  estimatedPrice: number;
  surgeMultiplier: number;
}

export interface Booking {
  id: string;
  userId: string;
  driverId?: string;
  pickupLat: number;
  pickupLng: number;
  pickupAddress: string;
  dropoffLat: number;
  dropoffLng: number;
  dropoffAddress: string;
  vehicleType: VehicleType;
  status: BookingStatus;
  estimatedPrice: number;
  finalPrice?: number;
  rating?: number;
  createdAt: string;
  completedAt?: string;
}

// ─── Merchants ─────────────────────────────────────────────────────────────

export type MerchantType = 'RESTAURANT' | 'SHOP' | 'SERVICE' | 'GROCERY';

export interface MerchantInfo {
  id: string;
  ownerId: string;
  name: string;
  type: MerchantType;
  phone: string;
  email?: string;
  description?: string;
  logoUrl?: string;
  imageUrl?: string;
  street: string;
  ward?: string;
  district: string;
  city: string;
  latitude: number;
  longitude: number;
  fullAddress: string;
  isActive: boolean;
  rating?: number;
  createdAt: string;
}

export interface MerchantCategory {
  id: string;
  merchantId: string;
  name: string;
  slug: string;
  description?: string;
  imageUrl?: string;
  sortOrder: number;
  isActive: boolean;
}

export interface MerchantProduct {
  id: string;
  merchantId: string;
  categoryId?: string;
  name: string;
  slug: string;
  description?: string;
  price: number;
  salePrice?: number;
  images: string[];
  stock: number;
  tags: string[];
  isActive: boolean;
  createdAt: string;
}

// ─── Orders ────────────────────────────────────────────────────────────────

export type OrderType = 'FOOD_DELIVERY' | 'SHOPPING' | 'PICKUP';
export type OrderStatus = 'PENDING' | 'CONFIRMED' | 'PREPARING' | 'READY' | 'DELIVERING' | 'DELIVERED' | 'CANCELLED';

export interface CreateOrderRequest {
  merchantId: string;
  type: OrderType;
  items: OrderItemInput[];
  paymentMethod?: string;
  deliveryAddress?: string;
  deliveryLat?: number;
  deliveryLng?: number;
  deliveryNote?: string;
  couponCode?: string;
  note?: string;
}

export interface OrderItemInput {
  productId: string;
  quantity: number;
  options?: Record<string, any>;
  note?: string;
}

export interface Order {
  id: string;
  userId: string;
  merchantId: string;
  type: OrderType;
  status: OrderStatus;
  items: OrderItem[];
  subtotal: number;
  deliveryFee: number;
  discount: number;
  total: number;
  rating?: number;
  createdAt: string;
}

export interface OrderItem {
  id: string;
  productId: string;
  productName: string;
  unitPrice: number;
  quantity: number;
  subtotal: number;
}

// ─── Wallet ────────────────────────────────────────────────────────────────

export interface WalletInfo {
  id: string;
  userId: string;
  balance: number;
  xu: number;
  currency: string;
}

export interface WalletTransaction {
  id: string;
  walletId: string;
  type: 'TOP_UP' | 'PAYMENT' | 'TRANSFER' | 'REFUND' | 'WITHDRAW';
  amount: number;
  status: 'PENDING' | 'COMPLETED' | 'FAILED';
  description?: string;
  createdAt: string;
}

// ─── Insurance ─────────────────────────────────────────────────────────────

export type InsuranceType = 'HEALTH' | 'VEHICLE' | 'TRAVEL' | 'LIFE' | 'SOCIAL';

export interface InsuranceProductInfo {
  id: string;
  name: string;
  type: InsuranceType;
  description?: string;
  monthlyPremium: number;
  yearlyPremium: number;
  coverageAmount: number;
  isActive: boolean;
}

export interface InsurancePolicy {
  id: string;
  userId: string;
  productId: string;
  startDate: string;
  endDate: string;
  premium: number;
  status: 'ACTIVE' | 'EXPIRED' | 'CANCELLED' | 'PENDING';
}

// ─── Notifications ─────────────────────────────────────────────────────────

export type NotificationType = 'SYSTEM' | 'BOOKING' | 'ORDER' | 'PAYMENT' | 'PROMOTION' | 'SOCIAL';

export interface AppNotification {
  id: string;
  userId: string;
  type: NotificationType;
  title: string;
  body: string;
  data?: Record<string, any>;
  isRead: boolean;
  createdAt: string;
}

// ─── Loyalty ───────────────────────────────────────────────────────────────

export interface CouponInfo {
  id: string;
  code: string;
  discountType: 'PERCENTAGE' | 'FIXED';
  discountValue: number;
  minOrderAmount?: number;
  maxDiscountAmount?: number;
  validFrom: string;
  validTo: string;
  isActive: boolean;
}

export interface ReferralInfo {
  id: string;
  referrerId: string;
  refereeId?: string;
  referralCode: string;
  status: 'PENDING' | 'COMPLETED' | 'EXPIRED';
  rewardAmount?: number;
}

// ─── Search ────────────────────────────────────────────────────────────────

export interface SearchResult {
  merchants: MerchantInfo[];
  products: MerchantProduct[];
  total: number;
}

// ─── Pagination ────────────────────────────────────────────────────────────

export interface PaginatedResult<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

// ─── WebSocket Events ──────────────────────────────────────────────────────

export interface LocationUpdate {
  bookingId: string;
  lat: number;
  lng: number;
  heading?: number;
  speed?: number;
  timestamp: string;
}

export interface ChatMessage {
  bookingId: string;
  senderId: string;
  senderName: string;
  message: string;
  timestamp: string;
}
