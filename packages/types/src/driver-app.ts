/**
 * Driver App Types
 * For mobile-driver and driver-web applications
 */

import { DriverProfile, DriverStatus, VehicleType } from './driver';

// ==================== ENUMS ====================

export enum OrderStatus {
  AVAILABLE = 'AVAILABLE', // Đơn có sẵn trong marketplace
  ASSIGNED = 'ASSIGNED', // Đã assign cho driver
  ACCEPTED = 'ACCEPTED', // Driver đã chấp nhận
  GOING_TO_PICKUP = 'GOING_TO_PICKUP', // Đang đến điểm lấy hàng
  ARRIVED_PICKUP = 'ARRIVED_PICKUP', // Đã đến điểm lấy hàng
  PICKED_UP = 'PICKED_UP', // Đã lấy hàng
  DELIVERING = 'DELIVERING', // Đang giao
  ARRIVED_DROPOFF = 'ARRIVED_DROPOFF', // Đã đến điểm giao
  COMPLETED = 'COMPLETED', // Đã hoàn thành
  CANCELLED = 'CANCELLED', // Đã hủy
}

export enum ServiceType {
  FOOD_DELIVERY = 'FOOD_DELIVERY', // Giao đồ ăn
  RIDE_BIKE = 'RIDE_BIKE', // Đặt xe máy
  RIDE_CAR_4 = 'RIDE_CAR_4', // Đặt xe 4 chỗ
  RIDE_CAR_7 = 'RIDE_CAR_7', // Đặt xe 7 chỗ
  SHOPPING_DELIVERY = 'SHOPPING_DELIVERY', // Giao hàng mua sắm
  PARCEL_DELIVERY = 'PARCEL_DELIVERY', // Giao hàng
  DOCUMENT_DELIVERY = 'DOCUMENT_DELIVERY', // Giao tài liệu
}

export enum PaymentMethod {
  CASH = 'CASH', // Tiền mặt
  LIFESTYLE_BALANCE = 'LIFESTYLE_BALANCE', // Ví Lifestyle
  CREDIT_CARD = 'CREDIT_CARD', // Thẻ tín dụng
  MOMO = 'MOMO',
  ZALOPAY = 'ZALOPAY',
}

export enum ChallengeType {
  DAILY = 'DAILY', // Hàng ngày
  WEEKLY = 'WEEKLY', // Hàng tuần
  MONTHLY = 'MONTHLY', // Hàng tháng
  SPECIAL = 'SPECIAL', // Sự kiện đặc biệt
}

export enum ChallengeStatus {
  ACTIVE = 'ACTIVE', // Đang diễn ra
  COMPLETED = 'COMPLETED', // Đã hoàn thành
  EXPIRED = 'EXPIRED', // Hết hạn
  CLAIMED = 'CLAIMED', // Đã nhận thưởng
}

export enum MembershipTier {
  BRONZE = 'BRONZE', // 0-50 đơn/tháng
  SILVER = 'SILVER', // 51-100 đơn/tháng
  GOLD = 'GOLD', // 101-200 đơn/tháng
  PLATINUM = 'PLATINUM', // 201-300 đơn/tháng
  DIAMOND = 'DIAMOND', // 300+ đơn/tháng
}

export enum TransactionType {
  EARNINGS = 'EARNINGS', // Thu nhập từ đơn
  BONUS = 'BONUS', // Thưởng
  WITHDRAWAL = 'WITHDRAWAL', // Rút tiền
  TOP_UP = 'TOP_UP', // Nạp tiền
  PENALTY = 'PENALTY', // Phạt
  DEPOSIT = 'DEPOSIT', // Ký quỹ
  REFUND = 'REFUND', // Hoàn tiền
}

// ==================== MARKETPLACE ====================

/**
 * Available Order - Đơn hàng có sẵn trong marketplace
 */
export interface AvailableOrder {
  orderId: string;
  serviceType: ServiceType;
  
  // Location
  pickupLocation: Location;
  dropoffLocation: Location;
  distance: number; // km
  estimatedDuration: number; // minutes
  
  // Payment
  paymentAmount: number; // VND
  paymentMethod: PaymentMethod;
  
  // Bonus & Incentives
  bonusAmount?: number; // Thưởng thêm
  isPriority: boolean; // Đơn VIP
  isHighValue: boolean; // Đơn giá trị cao
  
  // Customer info
  customerId: string;
  customerName?: string;
  customerRating?: number;
  isRepeatCustomer: boolean;
  
  // Items (for food/shopping)
  items?: OrderItem[];
  itemsCount?: number;
  
  // Special requirements
  notes?: string;
  requiresCOD: boolean;
  requiresContactless: boolean;
  
  // Timing
  createdAt: Date;
  expiresAt: Date; // Đơn hết hạn
  scheduledPickupTime?: Date;
  
  // Metadata
  estimatedEarnings: number; // Ước tính thu nhập (after commission)
  distanceFromDriver: number; // km from driver's current location
}

export interface Location {
  address: string;
  latitude: number;
  longitude: number;
  landmark?: string;
  contactName?: string;
  contactPhone?: string;
}

export interface OrderItem {
  name: string;
  quantity: number;
  price?: number;
  notes?: string;
}

/**
 * Marketplace Filters
 */
export interface MarketplaceFilters {
  serviceTypes?: ServiceType[];
  maxDistance?: number; // km
  minAmount?: number; // VND
  maxAmount?: number; // VND
  showPriorityOnly?: boolean;
  showBonusOnly?: boolean;
}

// ==================== ORDERS ====================

/**
 * Active Order - Đơn đang thực hiện
 */
export interface ActiveOrder extends AvailableOrder {
  driverId: string;
  status: OrderStatus;
  
  // Timeline
  acceptedAt: Date;
  pickedUpAt?: Date;
  deliveredAt?: Date;
  
  // Navigation
  currentLatitude?: number;
  currentLongitude?: number;
  remainingDistance?: number; // km
  remainingTime?: number; // minutes
  
  // Communication
  customerPhone: string;
  supportPhone: string;
  
  // Issues
  hasIssue: boolean;
  issueDescription?: string;
  
  // Proof of delivery
  deliveryProof?: DeliveryProof;
}

export interface DeliveryProof {
  signature?: string; // Base64 image
  photo?: string; // Base64 image
  recipientName?: string;
  notes?: string;
  timestamp: Date;
}

/**
 * Order History
 */
export interface OrderHistory {
  orderId: string;
  serviceType: ServiceType;
  status: OrderStatus;
  
  pickupAddress: string;
  dropoffAddress: string;
  distance: number;
  
  earnings: number; // Thu nhập thực tế
  bonus?: number;
  commission: number; // % platform fee
  
  customerRating?: number;
  customerFeedback?: string;
  
  completedAt: Date;
  duration: number; // minutes
  
  // Cancellation info (if cancelled)
  cancelledBy?: 'DRIVER' | 'CUSTOMER' | 'SYSTEM';
  cancellationReason?: string;
}

/**
 * Order Statistics
 */
export interface OrderStatistics {
  period: 'TODAY' | 'WEEK' | 'MONTH' | 'ALL_TIME';
  
  totalOrders: number;
  completedOrders: number;
  cancelledOrders: number;
  
  totalEarnings: number; // VND
  totalBonus: number;
  averageEarningsPerOrder: number;
  
  acceptanceRate: number; // %
  completionRate: number; // %
  cancellationRate: number; // %
  averageRating: number; // 1-5
  onTimeRate: number; // %
  
  // By service type
  ordersByService: Record<ServiceType, number>;
  earningsByService: Record<ServiceType, number>;
}

// ==================== EARNINGS & WALLET ====================

/**
 * Driver Wallet
 */
export interface DriverWallet {
  driverId: string;
  
  // Balances
  availableBalance: number; // Số dư có thể rút
  pendingBalance: number; // Chờ xét duyệt
  depositBalance: number; // Ký quỹ (bắt buộc)
  
  // Minimums
  minimumDeposit: number; // Ký quỹ tối thiểu
  minimumWithdrawal: number; // Rút tối thiểu
  
  // Bank account for payouts
  bankAccount?: BankAccount;
  
  // Stats
  totalEarnings: number; // All-time
  totalWithdrawals: number;
  lastWithdrawalAt?: Date;
}

export interface BankAccount {
  accountHolderName: string;
  accountNumber: string;
  bankName: string;
  bankCode: string;
  branchName?: string;
  isVerified: boolean;
}

/**
 * Wallet Transaction
 */
export interface WalletTransaction {
  id: string;
  driverId: string;
  type: TransactionType;
  amount: number; // Positive for credit, negative for debit
  balanceAfter: number;
  
  // Related entities
  orderId?: string; // If from order earnings
  withdrawalId?: string;
  
  description: string;
  notes?: string;
  
  // Status
  status: 'PENDING' | 'COMPLETED' | 'FAILED' | 'CANCELLED';
  
  createdAt: Date;
  completedAt?: Date;
}

/**
 * Withdrawal Request
 */
export interface WithdrawalRequest {
  id: string;
  driverId: string;
  amount: number;
  bankAccount: BankAccount;
  
  status: 'PENDING' | 'PROCESSING' | 'COMPLETED' | 'FAILED' | 'CANCELLED';
  
  requestedAt: Date;
  processedAt?: Date;
  completedAt?: Date;
  
  failureReason?: string;
  transactionId?: string; // Bank transaction ID
}

/**
 * Earnings Report
 */
export interface EarningsReport {
  driverId: string;
  period: {
    startDate: Date;
    endDate: Date;
  };
  
  // Summary
  totalEarnings: number;
  totalOrders: number;
  totalBonus: number;
  totalCommission: number;
  netEarnings: number; // After commission
  
  // Daily breakdown
  dailyEarnings: DailyEarnings[];
  
  // By service type
  earningsByService: Record<ServiceType, number>;
  
  // Charts data
  earningsChart: ChartData;
  ordersChart: ChartData;
}

export interface DailyEarnings {
  date: Date;
  orders: number;
  earnings: number;
  bonus: number;
  commission: number;
}

export interface ChartData {
  labels: string[];
  values: number[];
}

// ==================== CHALLENGES & MISSIONS ====================

/**
 * Challenge
 */
export interface Challenge {
  id: string;
  type: ChallengeType;
  title: string;
  description: string;
  
  // Requirements
  targetValue: number; // VD: 15 đơn
  targetMetric: 'ORDERS' | 'HOURS' | 'EARNINGS' | 'RATING' | 'ON_TIME_RATE';
  
  // Progress
  currentValue: number;
  progressPercentage: number;
  
  // Rewards
  rewardAmount: number; // VND
  rewardXu?: number; // Lifestyle Xu
  rewardBadge?: string;
  
  // Timing
  startDate: Date;
  endDate: Date;
  timeRemaining: string; // "6 giờ", "3 ngày"
  
  // Status
  status: ChallengeStatus;
  completedAt?: Date;
  claimedAt?: Date;
  
  // Conditions
  eligibleServiceTypes?: ServiceType[];
  minRating?: number;
  peakHoursOnly?: boolean;
}

/**
 * Leaderboard Entry
 */
export interface LeaderboardEntry {
  rank: number;
  driverId: string;
  driverName: string;
  driverAvatar?: string;
  
  score: number; // Số đơn hoặc thu nhập
  scoreLabel: string; // "234 đơn" or "12.5M VND"
  
  badge?: string; // 🥇 🥈 🥉
  tierBadge?: MembershipTier;
  
  isCurrentUser: boolean;
}

/**
 * Leaderboard
 */
export interface Leaderboard {
  period: 'DAILY' | 'WEEKLY' | 'MONTHLY';
  metric: 'ORDERS' | 'EARNINGS' | 'RATING';
  
  topDrivers: LeaderboardEntry[]; // Top 10
  currentUserEntry?: LeaderboardEntry;
  
  prizes: LeaderboardPrize[];
  
  updatedAt: Date;
  nextUpdateAt: Date;
}

export interface LeaderboardPrize {
  rank: number; // 1, 2, 3, or range (4-10)
  reward: string; // "1,000,000đ + Badge VIP"
}

/**
 * Membership Tier Info
 */
export interface MembershipTierInfo {
  currentTier: MembershipTier;
  
  // Requirements
  ordersThisMonth: number;
  ordersRequired: number; // For current tier
  ordersForNextTier?: number; // Null if DIAMOND
  
  // Benefits
  benefits: TierBenefit[];
  
  // Commission & Bonus
  commissionRate: number; // % platform takes
  bonusPercentage: number; // % extra per order
  
  // Progress
  progressPercentage: number;
  nextTier?: MembershipTier;
  
  // Special perks
  hasInsurance: boolean;
  hasPrioritySupport: boolean;
  hasVIPOrders: boolean;
  hasPersonalManager: boolean;
}

export interface TierBenefit {
  icon: string;
  title: string;
  description: string;
  isActive: boolean; // Based on current tier
}

// ==================== DRIVER REFERRAL ====================

/**
 * Driver Referral (Driver-to-Driver)
 * Khác với Member Referral (Member-to-Member)
 */
export interface DriverReferral {
  referrerId: string;
  referralCode: string;
  
  // Rewards
  referrerReward: number; // VND cho người giới thiệu
  refereeReward: number; // VND cho người được giới thiệu
  
  // Conditions
  refereeMinOrders: number; // Số đơn tối thiểu referee phải hoàn thành
  
  // Stats
  totalInvites: number;
  successfulInvites: number;
  totalRewardsEarned: number;
  
  // Campaign
  campaignId?: string;
  campaignEndDate?: Date;
}

export interface DriverReferralHistory {
  id: string;
  refereeDriverId: string;
  refereeDriverName: string;
  invitedAt: Date;
  registeredAt?: Date;
  
  // Progress
  ordersCompleted: number;
  ordersRequired: number;
  progressPercentage: number;
  
  // Status
  status: 'PENDING' | 'REGISTERED' | 'COMPLETED';
  
  // Reward
  rewardReceived?: number;
  rewardReceivedAt?: Date;
}

// ==================== TRAINING & SUPPORT ====================

/**
 * Training Module
 */
export interface TrainingModule {
  id: string;
  title: string;
  description: string;
  category: 'ONBOARDING' | 'SAFETY' | 'SERVICE' | 'PRODUCT' | 'ADVANCED';
  
  // Content
  videoUrl?: string;
  videoDuration?: number; // seconds
  pdfUrl?: string;
  
  // Progress
  isCompleted: boolean;
  completedAt?: Date;
  progress: number; // % (for video watch time)
  
  // Quiz
  hasQuiz: boolean;
  quizScore?: number; // %
  quizPassed?: boolean;
  certificateUrl?: string;
  
  // Requirements
  isRequired: boolean;
  requiredForTier?: MembershipTier;
}

/**
 * FAQ
 */
export interface FAQ {
  id: string;
  category: string; // "Đơn hàng", "Thu nhập", "Tài khoản"
  question: string;
  answer: string;
  isExpanded?: boolean; // UI state
}

/**
 * Support Ticket
 */
export interface SupportTicket {
  id: string;
  driverId: string;
  
  category: 'ORDER' | 'PAYMENT' | 'TECHNICAL' | 'ACCOUNT' | 'OTHER';
  subject: string;
  description: string;
  
  status: 'OPEN' | 'IN_PROGRESS' | 'RESOLVED' | 'CLOSED';
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
  
  // Related entities
  orderId?: string;
  
  // Messages
  messages: SupportMessage[];
  
  createdAt: Date;
  updatedAt: Date;
  resolvedAt?: Date;
}

export interface SupportMessage {
  id: string;
  ticketId: string;
  senderId: string;
  senderType: 'DRIVER' | 'SUPPORT';
  message: string;
  attachments?: string[]; // URLs
  timestamp: Date;
}

// ==================== NOTIFICATIONS ====================

export enum NotificationType {
  NEW_ORDER = 'NEW_ORDER', // Đơn mới
  ORDER_EXPIRING = 'ORDER_EXPIRING', // Đơn sắp hết hạn
  ORDER_UPDATED = 'ORDER_UPDATED', // Khách cập nhật đơn
  ORDER_CANCELLED = 'ORDER_CANCELLED', // Đơn bị hủy
  EARNINGS_CREDITED = 'EARNINGS_CREDITED', // Tiền đã vào tài khoản
  WITHDRAWAL_COMPLETED = 'WITHDRAWAL_COMPLETED', // Rút tiền thành công
  CHALLENGE_COMPLETED = 'CHALLENGE_COMPLETED', // Hoàn thành thử thách
  TIER_UPGRADED = 'TIER_UPGRADED', // Lên hạng
  DOCUMENT_EXPIRING = 'DOCUMENT_EXPIRING', // Giấy tờ sắp hết hạn
  TRAINING_DUE = 'TRAINING_DUE', // Cần hoàn thành đào tạo
  SYSTEM_ANNOUNCEMENT = 'SYSTEM_ANNOUNCEMENT', // Thông báo hệ thống
}

export interface DriverNotification {
  id: string;
  driverId: string;
  type: NotificationType;
  
  title: string;
  message: string;
  icon?: string;
  
  // Action
  actionUrl?: string; // Deep link
  actionLabel?: string; // "Xem đơn", "Nhận ngay"
  
  // Related entities
  orderId?: string;
  challengeId?: string;
  
  // Status
  isRead: boolean;
  readAt?: Date;
  
  // Priority
  priority: 'LOW' | 'NORMAL' | 'HIGH' | 'CRITICAL';
  requiresSound: boolean;
  requiresVibration: boolean;
  
  createdAt: Date;
  expiresAt?: Date;
}

// ==================== SETTINGS ====================

/**
 * Order Receiving Settings (Cài đặt nhận đơn)
 * Tham khảo từ Ahamove
 */
export interface OrderReceivingSettings {
  driverId: string;
  
  // ===== Trạng thái trực tuyến =====
  isOnline: boolean; // Bật trực tuyến
  
  // ===== Tiền mang theo =====
  cashOnHand: number; // Số tiền driver mang theo để ứng COD (VND)
  maxCODAmount: number; // Giới hạn COD tối đa có thể nhận (based on cashOnHand)
  
  // ===== Tối ưu nhận đơn =====
  
  // Tự động nhận đơn
  autoAcceptOrders: boolean; // Hệ thống tự động nhận đơn phù hợp
  autoAcceptCriteria?: {
    maxDistance?: number; // km
    minAmount?: number; // VND
    preferredServiceTypes?: ServiceType[];
    peakHoursOnly?: boolean;
  };
  
  // Điều hướng nhận đơn (Smart routing)
  smartRoutingEnabled: boolean;
  smartRoutingUsageToday: number; // Số lần đã dùng trong ngày
  smartRoutingLimit: number; // Giới hạn số lần/ngày (VD: 2 lần)
  smartRoutingResetsAt: Date; // Reset vào lúc nào (thường là 00:00)
  
  // Ghép đơn (Multiple orders)
  batchOrdersEnabled: boolean; // Cho phép nhận nhiều đơn cùng lúc
  maxBatchOrders: number; // Tối đa bao nhiêu đơn (VD: 3-5 đơn)
  
  // Giao hàng công kênh (Hub delivery)
  hubDeliveryEnabled: boolean;
  
  // Cài đặt đơn hàng Đối tác (Partner orders)
  partnerOrdersSettings?: {
    allowPartnerOrders: boolean;
    preferredPartners?: string[]; // Partner IDs
    minPartnerRating?: number;
  };
  
  // ===== Dịch vụ của tôi =====
  // Driver chọn dịch vụ nào họ muốn nhận
  enabledServices: {
    // Standard delivery time slots
    express1h2h: boolean; // 1H - 2H (giao nhanh)
    standard2h4h: boolean; // 2H - 4H (tiêu chuẩn)
    economy4h8h: boolean; // 4H - 8H (tiết kiệm)
    
    // Service types
    foodDelivery: boolean; // Giao đồ ăn
    rideBike: boolean; // Đặt xe máy
    rideCar4: boolean; // Đặt xe 4 chỗ
    rideCar7: boolean; // Đặt xe 7 chỗ
    shopping: boolean; // Mua sắm
    parcel: boolean; // Giao hàng
    document: boolean; // Giao tài liệu
    
    // Hub services
    hubCongKenh: boolean; // HUB Công Kênh
    hubTheoDiem: boolean; // HUB theo điểm
    
    // Special services
    bulkyItems: boolean; // Hàng cồng kềnh
    fragileItems: boolean; // Hàng dễ vỡ
    coldChain: boolean; // Hàng lạnh
  };
  
  // ===== Thông tin bổ sung =====
  updatedAt: Date;
  version: number; // For optimistic locking
}

/**
 * Order Eligibility Check
 * Kiểm tra driver có đủ điều kiện nhận đơn không
 */
export interface OrderEligibilityCheck {
  orderId: string;
  driverId: string;
  
  // Results
  isEligible: boolean;
  reasons: EligibilityReason[];
  
  // Details
  checks: {
    isOnline: boolean;
    hasEnoughCash: boolean; // Nếu đơn COD
    serviceTypeEnabled: boolean;
    withinMaxDistance: boolean;
    meetsMinAmount: boolean;
    vehicleTypeMatch: boolean;
    hasRequiredDocuments: boolean; // GPLX, TNDS còn hạn
    hasCapacity: boolean; // Chưa quá số đơn tối đa
  };
  
  // Suggestions
  suggestions?: string[]; // VD: "Bật dịch vụ 'Giao đồ ăn'", "Nạp thêm 200,000đ tiền mặt"
}

export interface EligibilityReason {
  type: 'ERROR' | 'WARNING' | 'INFO';
  code: string; // 'INSUFFICIENT_CASH', 'SERVICE_DISABLED', 'OUT_OF_RANGE'
  message: string;
  solution?: string; // Gợi ý giải pháp
}

/**
 * Smart Routing Usage
 * Theo dõi việc sử dụng điều hướng thông minh
 */
export interface SmartRoutingUsage {
  driverId: string;
  date: Date; // Ngày sử dụng
  usageCount: number; // Số lần đã dùng
  limit: number; // Giới hạn
  routes: SmartRoute[];
}

export interface SmartRoute {
  id: string;
  startLocation: Location;
  suggestedOrders: AvailableOrder[]; // Đơn được gợi ý trên tuyến
  estimatedEarnings: number; // Ước tính thu nhập trên tuyến này
  estimatedDuration: number; // Thời gian hoàn thành (minutes)
  efficiency: number; // Điểm hiệu quả (0-100)
  createdAt: Date;
  acceptedOrderIds?: string[]; // Đơn driver đã nhận từ suggestion này
}

/**
 * Cash Management
 * Quản lý tiền mặt của driver
 */
export interface DriverCashManagement {
  driverId: string;
  
  // Current cash
  declaredCash: number; // Tiền đã khai báo
  availableCash: number; // Tiền còn lại (sau khi trừ COD đã nhận)
  pendingCOD: number; // Tổng COD của đơn đang giao
  
  // Limits
  maxCODPerOrder: number; // COD tối đa cho 1 đơn
  maxTotalCOD: number; // Tổng COD tối đa cùng lúc
  
  // History
  lastUpdated: Date;
  cashTransactions: CashTransaction[];
  
  // Alerts
  needsTopUp: boolean; // Cần nạp thêm tiền
  suggestedTopUpAmount?: number;
}

export interface CashTransaction {
  id: string;
  type: 'DECLARE' | 'COD_RECEIVE' | 'COD_PAID' | 'TOP_UP' | 'WITHDRAW';
  amount: number;
  balanceAfter: number;
  orderId?: string;
  timestamp: Date;
  notes?: string;
}

/**
 * Service Availability Matrix
 * Ma trận dịch vụ driver có thể nhận
 */
export interface ServiceAvailabilityMatrix {
  driverId: string;
  vehicleType: VehicleType;
  
  // Supported services based on vehicle
  supportedServices: ServiceType[];
  
  // Currently enabled by driver
  enabledServices: ServiceType[];
  
  // Recommended to enable (để tăng cơ hội nhận đơn)
  recommendedServices: ServiceType[];
  
  // Reasons for recommendations
  recommendations: ServiceRecommendation[];
}

export interface ServiceRecommendation {
  serviceType: ServiceType;
  reason: string; // "High demand in your area", "Earn 20% more"
  potentialExtraEarnings: number; // VND/day
  demandLevel: 'LOW' | 'MEDIUM' | 'HIGH' | 'VERY_HIGH';
}

// ==================== GENERAL SETTINGS ====================

export interface DriverAppSettings {
  driverId: string;
  
  // Notifications
  enablePushNotifications: boolean;
  enableSound: boolean;
  enableVibration: boolean;
  enableEmailNotifications: boolean;
  enableSMSNotifications: boolean;
  
  // GPS & Location
  gpsAccuracy: 'HIGH' | 'MEDIUM' | 'LOW';
  shareLocationAlways: boolean;
  
  // Data & Performance
  dataSaverMode: boolean;
  offlineMode: boolean;
  
  // Language & Display
  language: 'vi' | 'en';
  theme: 'LIGHT' | 'DARK' | 'AUTO';
  
  // Privacy
  showProfileToCustomers: boolean;
  allowCustomerMessages: boolean;
  
  // Safety
  sosContactName?: string;
  sosContactPhone?: string;
}

// ==================== API RESPONSES ====================

export interface GetMarketplaceResponse {
  orders: AvailableOrder[];
  totalCount: number;
  filters: MarketplaceFilters;
  driverLocation: {
    latitude: number;
    longitude: number;
  };
}

export interface GetActiveOrdersResponse {
  inProgress: ActiveOrder[];
  completed: OrderHistory[];
  cancelled: OrderHistory[];
  stats: OrderStatistics;
}

export interface GetEarningsResponse {
  wallet: DriverWallet;
  todayEarnings: number;
  weekEarnings: number;
  monthEarnings: number;
  recentTransactions: WalletTransaction[];
  report: EarningsReport;
}

export interface GetChallengesResponse {
  dailyChallenges: Challenge[];
  weeklyChallenges: Challenge[];
  specialChallenges: Challenge[];
  leaderboard: Leaderboard;
  membershipTier: MembershipTierInfo;
}

export interface GetDriverProfileResponse {
  profile: DriverProfile;
  stats: OrderStatistics;
  membershipTier: MembershipTierInfo;
  referral: DriverReferral;
  settings: DriverAppSettings;
}
