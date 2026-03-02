/**
 * Referral/Affiliate System Types
 * For Member-to-Member referral program (different from Driver-to-Driver)
 */

// ==================== ENUMS ====================

export enum ReferralStatus {
  PENDING = 'PENDING', // Đã mời nhưng chưa đăng ký
  REGISTERED = 'REGISTERED', // Đã đăng ký nhưng chưa hoàn thành điều kiện
  COMPLETED = 'COMPLETED', // Đã hoàn thành và nhận thưởng
  EXPIRED = 'EXPIRED', // Hết hạn
  CANCELLED = 'CANCELLED', // Bị hủy
}

export enum ReferralRewardType {
  LIFESTYLE_XU = 'LIFESTYLE_XU', // Lifestyle Xu points
  LIFESTYLE_BALANCE = 'LIFESTYLE_BALANCE', // Tiền vào ví Lifestyle
  DISCOUNT_VOUCHER = 'DISCOUNT_VOUCHER', // Voucher giảm giá
  SERVICE_VOUCHER = 'SERVICE_VOUCHER', // Voucher dịch vụ (ride, food, etc.)
  MEMBERSHIP_UPGRADE = 'MEMBERSHIP_UPGRADE', // Nâng hạng thành viên
}

export enum ShareChannel {
  SMS = 'SMS',
  EMAIL = 'EMAIL',
  FACEBOOK = 'FACEBOOK',
  MESSENGER = 'MESSENGER',
  ZALO = 'ZALO',
  WHATSAPP = 'WHATSAPP',
  TELEGRAM = 'TELEGRAM',
  COPY_LINK = 'COPY_LINK',
  QR_CODE = 'QR_CODE',
}

// ==================== INTERFACES ====================

/**
 * Referral Code - Mã giới thiệu của user
 */
export interface ReferralCode {
  userId: string;
  code: string; // Mã unique (VD: MBW3EA)
  isCustom: boolean; // User có thể customize không
  createdAt: Date;
  expiresAt?: Date; // Có thể set thời hạn
  isActive: boolean;
  
  // Analytics
  totalInvites: number; // Tổng số người đã mời
  successfulInvites: number; // Số người đã hoàn thành điều kiện
  totalRewardsEarned: number; // Tổng phần thưởng đã nhận (VND)
  lifestyleXuEarned: number; // Tổng Xu đã nhận
}

/**
 * Referral Campaign - Chiến dịch khuyến mãi
 */
export interface ReferralCampaign {
  id: string;
  name: string;
  description: string;
  startDate: Date;
  endDate: Date;
  isActive: boolean;
  
  // Rewards cho người giới thiệu
  referrerRewards: ReferralReward[];
  
  // Rewards cho người được giới thiệu
  refereeRewards: ReferralReward[];
  
  // Conditions
  minTransactionAmount?: number; // Số tiền giao dịch tối thiểu
  minTransactionCount?: number; // Số giao dịch tối thiểu
  validServices?: string[]; // Dịch vụ áp dụng
  maxRewardsPerUser?: number; // Giới hạn rewards cho 1 user
  
  // Display
  bannerImage?: string;
  promoText?: string; // VD: "Nhận không giới hạn COMBO QUÀ 500K"
  terms?: string;
}

/**
 * Referral Reward - Phần thưởng
 */
export interface ReferralReward {
  type: ReferralRewardType;
  amount: number; // Số tiền, số Xu, hoặc value
  voucherId?: string; // Nếu là voucher
  description: string;
  conditions?: string; // Điều kiện nhận thưởng
}

/**
 * Referral Transaction - Giao dịch giới thiệu
 */
export interface ReferralTransaction {
  id: string;
  referralCode: string;
  referrerId: string; // Người giới thiệu
  refereeId: string; // Người được giới thiệu
  refereePhone?: string;
  refereeEmail?: string;
  refereeName?: string;
  
  // Status & Timeline
  status: ReferralStatus;
  invitedAt: Date;
  registeredAt?: Date;
  completedAt?: Date;
  
  // Campaign
  campaignId: string;
  
  // Rewards
  referrerReward?: ReferralReward;
  refereeReward?: ReferralReward;
  
  // Conditions tracking
  transactionCount: number; // Số giao dịch của referee
  transactionAmount: number; // Tổng giá trị giao dịch
  conditionsMet: boolean; // Đã đủ điều kiện nhận thưởng chưa
  
  // Share info
  sharedVia?: ShareChannel;
  
  // Metadata
  notes?: string;
}

/**
 * Referral Stats - Thống kê tổng quan
 */
export interface ReferralStats {
  userId: string;
  
  // Invites
  totalInvitesSent: number;
  pendingInvites: number;
  registeredInvites: number;
  completedInvites: number;
  
  // Rewards
  totalLifestyleXu: number;
  totalLifestyleBalance: number;
  totalVouchers: number;
  
  // Top performers
  thisMonthInvites: number;
  thisMonthRewards: number;
  
  // Leaderboard
  rank?: number; // Xếp hạng so với users khác
  
  // Next tier
  invitesForNextReward?: number;
}

/**
 * Referral History Item
 */
export interface ReferralHistoryItem {
  id: string;
  date: Date;
  refereeName: string;
  status: ReferralStatus;
  rewardReceived?: ReferralReward;
  progressPercentage: number; // % hoàn thành điều kiện
}

/**
 * Share Referral Request
 */
export interface ShareReferralRequest {
  referralCode: string;
  channel: ShareChannel;
  recipientContact?: string; // Phone or Email
  message?: string; // Custom message
}

/**
 * Referral Link
 */
export interface ReferralLink {
  code: string;
  url: string; // Full URL with code
  qrCode?: string; // Base64 QR code image
  shortUrl?: string; // Shortened URL
}

// ==================== API TYPES ====================

/**
 * Get Referral Code Response
 */
export interface GetReferralCodeResponse {
  referralCode: ReferralCode;
  activeCampaign?: ReferralCampaign;
  referralLink: ReferralLink;
}

/**
 * Get Referral Stats Response
 */
export interface GetReferralStatsResponse {
  stats: ReferralStats;
  recentInvites: ReferralHistoryItem[];
  availableRewards: ReferralReward[];
}

/**
 * Apply Referral Code Request
 */
export interface ApplyReferralCodeRequest {
  code: string;
  userId: string;
}

/**
 * Update Referral Code Request
 */
export interface UpdateReferralCodeRequest {
  userId: string;
  newCode?: string; // Customize code (if allowed)
  isActive?: boolean;
}
