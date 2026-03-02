/**
 * Loyalty and Coins System Types
 * Lifestyle Xu - Hệ thống tích điểm và ưu đãi
 */

import type { BaseEntity, PriceInfo } from './common';

/**
 * Lifestyle Xu Transaction Types
 */
export enum CoinTransactionType {
  EARN = 'EARN',           // Tích xu từ giao dịch
  SPEND = 'SPEND',         // Tiêu xu
  BONUS = 'BONUS',         // Thưởng từ khuyến mãi
  REFUND = 'REFUND',       // Hoàn xu
  EXPIRED = 'EXPIRED',     // Xu hết hạn
  ADMIN_ADJUST = 'ADMIN_ADJUST', // Điều chỉnh bởi admin
}

/**
 * Transaction Status
 */
export enum CoinTransactionStatus {
  PENDING = 'PENDING',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED',
  EXPIRED = 'EXPIRED',
}

/**
 * Service Types that earn coins
 */
export enum ServiceType {
  FOOD_DELIVERY = 'FOOD_DELIVERY',
  RIDE_HAILING = 'RIDE_HAILING',
  SHOPPING = 'SHOPPING',
  SAVINGS_PACKAGE = 'SAVINGS_PACKAGE',
  REFERRAL = 'REFERRAL',
}

/**
 * Coin Transaction
 */
export interface CoinTransaction extends BaseEntity {
  userId: string;
  type: CoinTransactionType;
  status: CoinTransactionStatus;
  amount: number; // Số xu (positive for earn, negative for spend)
  balance: number; // Số dư sau giao dịch
  serviceType?: ServiceType;
  serviceId?: string; // Order ID, Ride ID, etc.
  description: string;
  metadata?: Record<string, unknown>;
  expiresAt?: Date; // Xu tích lũy có thời hạn
  processedAt?: Date;
}

/**
 * User Coin Balance
 */
export interface UserCoinBalance extends BaseEntity {
  userId: string;
  totalCoins: number; // Tổng xu hiện có
  lifetimeEarned: number; // Tổng xu đã tích được (all time)
  lifetimeSpent: number; // Tổng xu đã tiêu
  pendingCoins: number; // Xu đang chờ xử lý
  expiringCoins: number; // Xu sắp hết hạn (trong 30 ngày)
  expiringAt?: Date; // Ngày xu sắp hết hạn
  membershipTier: MembershipTier;
  tierExpiresAt?: Date;
}

/**
 * Membership Tiers
 */
export enum MembershipTier {
  BRONZE = 'BRONZE',   // 0-999 xu
  SILVER = 'SILVER',   // 1,000-4,999 xu
  GOLD = 'GOLD',       // 5,000-9,999 xu
  PLATINUM = 'PLATINUM', // 10,000+ xu
  DIAMOND = 'DIAMOND',   // 50,000+ xu
}

/**
 * Membership Tier Benefits
 */
export interface TierBenefits {
  tier: MembershipTier;
  name: string;
  minCoins: number;
  maxCoins?: number;
  benefits: string[];
  earnRate: number; // Tỷ lệ tích xu (1.0 = 100%, 1.2 = 120%)
  discountRate: number; // Giảm giá (0.05 = 5%)
  color: string; // Màu đại diện
  icon: string;
}

/**
 * Coin Earning Rules
 */
export interface CoinEarningRule extends BaseEntity {
  serviceType: ServiceType;
  name: string;
  description: string;
  isActive: boolean;
  rules: {
    minOrderValue?: number; // Giá trị đơn hàng tối thiểu
    coinPerAmount: number; // Xu cho mỗi X VND (vd: 1 xu/10,000 VND)
    maxCoinsPerTransaction?: number; // Xu tối đa mỗi giao dịch
    multiplier?: number; // Nhân đôi xu (1.5x, 2x)
  };
  validFrom: Date;
  validTo?: Date;
}

/**
 * Coin Redemption Item
 */
export interface CoinRedemptionItem extends BaseEntity {
  name: string;
  description: string;
  imageUrl: string;
  category: RedemptionCategory;
  coinCost: number; // Số xu cần đổi
  cashValue?: PriceInfo; // Giá trị quy đổi
  stock: number;
  isActive: boolean;
  isPopular: boolean;
  validFrom: Date;
  validTo?: Date;
  terms?: string[]; // Điều khoản sử dụng
  // SEO fields
  metaTitle?: string;
  metaDescription?: string;
}

/**
 * Redemption Categories
 */
export enum RedemptionCategory {
  VOUCHER = 'VOUCHER',           // Voucher giảm giá
  GIFT_CARD = 'GIFT_CARD',       // Thẻ quà tặng
  CASHBACK = 'CASHBACK',         // Hoàn tiền
  PRODUCT = 'PRODUCT',           // Sản phẩm vật lý
  SERVICE = 'SERVICE',           // Dịch vụ
  EXPERIENCE = 'EXPERIENCE',     // Trải nghiệm (tour, event)
}

/**
 * Coin Redemption Order
 */
export interface CoinRedemption extends BaseEntity {
  userId: string;
  itemId: string;
  item?: CoinRedemptionItem;
  coinCost: number;
  status: RedemptionStatus;
  voucherCode?: string;
  redeemedAt?: Date;
  expiresAt?: Date;
  usedAt?: Date;
}

/**
 * Redemption Status
 */
export enum RedemptionStatus {
  PENDING = 'PENDING',
  ACTIVE = 'ACTIVE',
  USED = 'USED',
  EXPIRED = 'EXPIRED',
  CANCELLED = 'CANCELLED',
}

/**
 * Coin History Summary
 */
export interface CoinHistorySummary {
  period: 'day' | 'week' | 'month' | 'year';
  earned: number;
  spent: number;
  net: number; // earned - spent
  transactions: number;
}

/**
 * Referral Program
 */
export interface ReferralReward extends BaseEntity {
  referrerId: string; // Người giới thiệu
  refereeId: string; // Người được giới thiệu
  referralCode: string;
  status: 'PENDING' | 'COMPLETED' | 'CANCELLED';
  referrerCoins: number; // Xu cho người giới thiệu
  refereeCoins: number; // Xu cho người được giới thiệu
  completedAt?: Date;
  conditions?: {
    minOrderValue?: number;
    minOrders?: number;
    validDays?: number;
  };
}
