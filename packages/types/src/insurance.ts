/**
 * Insurance Management System
 * Hệ thống quản lý bảo hiểm cho Driver App
 */

// ==================== ENUMS ====================

export enum InsuranceType {
  TNDS = 'TNDS', // Trách nhiệm Dân sự (Compulsory Civil Liability)
  BHXH = 'BHXH', // Bảo hiểm Xã hội tự nguyện (Voluntary Social Insurance)
  BHYT = 'BHYT', // Bảo hiểm Y tế (Health Insurance)
  LIFE = 'LIFE', // Bảo hiểm Nhân thọ (Life Insurance)
  ACCIDENT = 'ACCIDENT', // Bảo hiểm Tai nạn (Accident Insurance)
  HEALTH = 'HEALTH', // Bảo hiểm Sức khỏe (Health Insurance)
  VEHICLE_DAMAGE = 'VEHICLE_DAMAGE', // Bảo hiểm Vật chất xe (Vehicle Damage)
  PASSENGER = 'PASSENGER', // Bảo hiểm Hành khách (Passenger Insurance)
}

export enum InsuranceStatus {
  ACTIVE = 'ACTIVE', // Còn hiệu lực
  EXPIRING_SOON = 'EXPIRING_SOON', // Sắp hết hạn (< 30 days)
  EXPIRED = 'EXPIRED', // Đã hết hạn
  PENDING = 'PENDING', // Đang chờ xử lý
  CANCELLED = 'CANCELLED', // Đã hủy
}

export enum InsuranceProvider {
  // TNDS Providers
  BIC = 'BIC', // Bảo hiểm Ngân hàng Đầu tư và Phát triển
  PJICO = 'PJICO', // Bảo hiểm Bưu điện
  PVI = 'PVI', // Bảo hiểm PVI
  BSH = 'BSH', // Bảo hiểm Bảo Minh
  AAA = 'AAA', // Bảo hiểm AAA
  MIC = 'MIC', // Bảo hiểm Quân đội
  BLI = 'BLI', // Bảo hiểm Liberty
  
  // Life Insurance Providers
  PRUDENTIAL = 'PRUDENTIAL',
  MANULIFE = 'MANULIFE',
  AIA = 'AIA',
  SUNLIFE = 'SUNLIFE',
  GENERALI = 'GENERALI',
  
  // Social Insurance
  VSS = 'VSS', // Vietnam Social Security (BHXH)
  
  // Other
  OTHER = 'OTHER',
}

export enum ReminderFrequency {
  ONCE = 'ONCE', // Nhắc 1 lần
  DAILY = 'DAILY', // Nhắc hàng ngày
  WEEKLY = 'WEEKLY', // Nhắc hàng tuần
}

export enum NotificationChannel {
  PUSH = 'PUSH', // Push notification
  SMS = 'SMS', // SMS
  EMAIL = 'EMAIL', // Email
  IN_APP = 'IN_APP', // In-app notification
}

// ==================== TNDS INSURANCE ====================

/**
 * TNDS Insurance (Compulsory Civil Liability)
 * Bảo hiểm TNDS bắt buộc cho phương tiện
 */
export interface TNDSInsurance {
  id: string;
  driverId: string;
  vehicleId: string; // Reference to driver's vehicle
  
  // Policy details
  policyNumber: string; // Số hợp đồng
  provider: InsuranceProvider;
  providerName: string;
  
  // Coverage
  coverageAmount: number; // VND (e.g., 100,000,000)
  coverageType: 'BASIC' | 'EXTENDED'; // Cơ bản / Mở rộng
  
  // Dates
  startDate: Date;
  endDate: Date;
  issuedDate: Date;
  
  // Status
  status: InsuranceStatus;
  daysUntilExpiry: number; // Calculated field
  
  // Premium
  premiumAmount: number; // VND
  paymentStatus: 'PAID' | 'PENDING' | 'OVERDUE';
  paymentMethod?: string;
  
  // Documents
  documents: {
    policyDocumentUrl?: string; // PDF/Image of policy
    certificateUrl?: string; // Giấy chứng nhận bảo hiểm
    receiptUrl?: string; // Biên lai thanh toán
  };
  
  // Renewal
  isAutoRenew: boolean;
  renewalReminderSent: boolean;
  renewalReminderSentAt?: Date;
  
  // Purchase link (if bought through app)
  purchaseLink?: string; // Deep link to insurance purchase flow
  purchasedInApp: boolean;
  
  // Metadata
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * TNDS Insurance Reminder
 * Nhắc nhở mua/gia hạn bảo hiểm TNDS
 */
export interface TNDSReminder {
  id: string;
  insuranceId: string;
  driverId: string;
  
  // Reminder schedule
  reminderDate: Date; // Ngày gửi nhắc nhở
  daysBeforeExpiry: number; // 7, 3, 1, 0 (expiry day)
  
  // Content
  title: string; // "Bảo hiểm TNDS sắp hết hạn"
  message: string;
  actionText: string; // "Mua ngay"
  actionLink: string; // Deep link to purchase
  
  // Delivery
  channels: NotificationChannel[]; // PUSH, SMS, EMAIL
  frequency: ReminderFrequency;
  
  // Status
  sent: boolean;
  sentAt?: Date;
  delivered: boolean;
  deliveredAt?: Date;
  clicked: boolean;
  clickedAt?: Date;
  
  // Metadata
  createdAt: Date;
}

// ==================== OTHER INSURANCES ====================

/**
 * Driver Personal Insurance
 * Bảo hiểm cá nhân của tài xế (BHXH, BHYT, Nhân thọ, etc.)
 */
export interface DriverInsurance {
  id: string;
  driverId: string;
  
  // Type
  type: InsuranceType; // BHXH, BHYT, LIFE, ACCIDENT, HEALTH
  typeName: string; // Display name
  
  // Policy details
  policyNumber?: string;
  provider: InsuranceProvider;
  providerName: string;
  
  // Coverage
  coverageAmount?: number; // VND (for Life, Accident)
  coverageDescription?: string;
  
  // Dates
  startDate: Date;
  endDate?: Date; // Some insurances don't have end date (e.g., Life)
  issuedDate: Date;
  
  // Status
  status: InsuranceStatus;
  daysUntilExpiry?: number; // Null if no end date
  
  // Premium
  premiumAmount?: number; // VND
  premiumFrequency?: 'MONTHLY' | 'QUARTERLY' | 'YEARLY' | 'ONE_TIME';
  nextPaymentDate?: Date;
  paymentStatus: 'PAID' | 'PENDING' | 'OVERDUE';
  
  // Beneficiaries (for Life insurance)
  beneficiaries?: {
    name: string;
    relationship: string;
    percentage: number; // % of benefit
  }[];
  
  // Documents
  documents: {
    policyDocumentUrl?: string;
    certificateUrl?: string;
    cardUrl?: string; // Thẻ BHYT
  };
  
  // Metadata
  notes?: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// ==================== INSURANCE PACKAGE (FOR PURCHASE) ====================

/**
 * Insurance Package
 * Gói bảo hiểm có sẵn để mua trên app
 */
export interface InsurancePackage {
  id: string;
  
  // Basic info
  type: InsuranceType;
  name: string;
  provider: InsuranceProvider;
  providerName: string;
  
  // Coverage
  coverageAmount: number; // VND
  coverageDescription: string;
  features: string[]; // List of covered items
  exclusions?: string[]; // What's not covered
  
  // Pricing
  premiumAmount: number; // VND
  duration: number; // Months (e.g., 12 for 1 year)
  
  // Discounts
  discountPercentage?: number; // % discount for platform users
  originalPrice?: number; // Before discount
  
  // Requirements (for TNDS)
  vehicleTypes?: string[]; // Xe máy, Xe ô tô, etc.
  minAge?: number;
  maxAge?: number;
  
  // Benefits
  benefits: string[]; // Additional benefits
  
  // Popular/Featured
  isPopular: boolean;
  isFeatured: boolean;
  displayOrder: number;
  
  // Purchase
  purchaseUrl: string; // Link to purchase flow
  termsUrl: string; // Link to terms & conditions
  
  // Status
  isActive: boolean;
  availableFrom?: Date;
  availableTo?: Date;
  
  // Metadata
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Insurance Purchase
 * Giao dịch mua bảo hiểm trên app
 */
export interface InsurancePurchase {
  id: string;
  driverId: string;
  packageId: string;
  
  // Policy details (filled after purchase)
  policyNumber?: string;
  insuranceId?: string; // Reference to TNDSInsurance or DriverInsurance
  
  // Amount
  amount: number; // VND
  discountAmount: number;
  finalAmount: number;
  
  // Payment
  paymentMethod: string;
  paymentStatus: 'PENDING' | 'PROCESSING' | 'SUCCESS' | 'FAILED';
  paymentId?: string;
  paidAt?: Date;
  
  // Coverage period
  startDate: Date;
  endDate: Date;
  
  // Documents (generated after successful purchase)
  documents?: {
    policyDocumentUrl?: string;
    certificateUrl?: string;
    receiptUrl?: string;
  };
  
  // Status
  status: 'PENDING' | 'PROCESSING' | 'ACTIVE' | 'CANCELLED' | 'EXPIRED';
  
  // Metadata
  createdAt: Date;
  updatedAt: Date;
  completedAt?: Date;
}

// ==================== INSURANCE CLAIM ====================

/**
 * Insurance Claim
 * Yêu cầu bồi thường bảo hiểm
 */
export interface InsuranceClaim {
  id: string;
  driverId: string;
  insuranceId: string; // TNDS or Driver insurance
  insuranceType: InsuranceType;
  
  // Incident details
  incidentDate: Date;
  incidentLocation: string;
  incidentDescription: string;
  
  // Claim amount
  claimedAmount: number; // VND
  approvedAmount?: number; // VND (after review)
  
  // Documents
  documents: {
    photos: string[]; // Photos of damage/incident
    policeReport?: string; // Biên bản cảnh sát (if applicable)
    medicalReport?: string; // Giấy khám bệnh (for health claims)
    invoices: string[]; // Hóa đơn sửa chữa, y tế, etc.
    other?: string[];
  };
  
  // Status
  status: 'SUBMITTED' | 'UNDER_REVIEW' | 'APPROVED' | 'REJECTED' | 'PAID';
  reviewedBy?: string;
  reviewedAt?: Date;
  rejectionReason?: string;
  
  // Payment
  paymentMethod?: string; // Bank transfer, etc.
  paidAt?: Date;
  
  // Metadata
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

// ==================== DRIVER INSURANCE PROFILE ====================

/**
 * Driver Insurance Profile
 * Tổng quan bảo hiểm của tài xế
 */
export interface DriverInsuranceProfile {
  driverId: string;
  
  // TNDS (Required)
  tndsInsurance?: TNDSInsurance;
  tndsStatus: 'ACTIVE' | 'EXPIRING_SOON' | 'EXPIRED' | 'NONE';
  tndsExpiryDate?: Date;
  
  // Other insurances (Optional)
  otherInsurances: DriverInsurance[];
  
  // Summary
  totalInsurances: number;
  activeInsurances: number;
  expiringInsurances: number; // < 30 days
  expiredInsurances: number;
  
  // Reminders
  pendingReminders: number;
  lastReminderSent?: Date;
  
  // Claims history
  totalClaims: number;
  approvedClaims: number;
  totalClaimedAmount: number;
  totalApprovedAmount: number;
  
  // Metadata
  lastUpdated: Date;
}

// ==================== ADMIN OPS ====================

/**
 * Insurance Dashboard (Admin Ops)
 * Dashboard quản lý bảo hiểm cho Admin
 */
export interface InsuranceDashboard {
  period: {
    startDate: Date;
    endDate: Date;
  };
  
  // TNDS Overview
  tnds: {
    totalDrivers: number; // Total drivers
    withTNDS: number; // Drivers with active TNDS
    withoutTNDS: number; // Drivers without TNDS
    expiringSoon: number; // TNDS expiring < 30 days
    expired: number; // TNDS expired
    complianceRate: number; // % drivers with active TNDS
  };
  
  // Reminders
  reminders: {
    sent: number; // Total reminders sent
    delivered: number;
    clicked: number;
    converted: number; // Purchased after reminder
    conversionRate: number; // %
  };
  
  // Purchases
  purchases: {
    total: number; // Total purchases
    amount: number; // VND
    avgAmount: number; // VND
    byType: {
      type: InsuranceType;
      count: number;
      amount: number;
    }[];
  };
  
  // Claims
  claims: {
    total: number;
    approved: number;
    rejected: number;
    pending: number;
    totalAmount: number; // VND (claimed)
    approvedAmount: number; // VND (approved)
  };
  
  // Alerts
  alerts: {
    type: 'EXPIRING_SOON' | 'EXPIRED' | 'NO_TNDS' | 'CLAIM_PENDING';
    count: number;
    priority: 'HIGH' | 'MEDIUM' | 'LOW';
  }[];
}

/**
 * Driver Insurance Status (for Admin)
 * Trạng thái bảo hiểm từng driver (Admin view)
 */
export interface DriverInsuranceStatusAdmin {
  driverId: string;
  driverName: string;
  phoneNumber: string;
  vehicleType: string;
  vehiclePlate: string;
  
  // TNDS Status
  tndsStatus: InsuranceStatus;
  tndsExpiryDate?: Date;
  tndsProvider?: InsuranceProvider;
  daysUntilTNDSExpiry?: number;
  
  // Other insurances
  hasHealthInsurance: boolean;
  hasSocialInsurance: boolean;
  hasLifeInsurance: boolean;
  
  // Reminders
  lastReminderSent?: Date;
  remindersSent: number;
  
  // Actions needed
  needsAttention: boolean;
  actionRequired?: 'RENEW_TNDS' | 'UPLOAD_DOCUMENT' | 'VERIFY_POLICY';
  
  // Last activity
  lastActive: Date;
}

// ==================== API TYPES ====================

export interface GetDriverInsuranceProfileRequest {
  driverId: string;
}

export interface GetDriverInsuranceProfileResponse {
  profile: DriverInsuranceProfile;
}

export interface AddInsuranceRequest {
  driverId: string;
  type: InsuranceType;
  policyNumber?: string;
  provider: InsuranceProvider;
  startDate: Date;
  endDate?: Date;
  coverageAmount?: number;
  premiumAmount?: number;
  documents?: any;
}

export interface AddInsuranceResponse {
  insurance: TNDSInsurance | DriverInsurance;
}

export interface UpdateInsuranceRequest {
  insuranceId: string;
  updates: Partial<TNDSInsurance | DriverInsurance>;
}

export interface GetInsurancePackagesRequest {
  type?: InsuranceType;
  vehicleType?: string;
}

export interface GetInsurancePackagesResponse {
  packages: InsurancePackage[];
}

export interface PurchaseInsuranceRequest {
  driverId: string;
  packageId: string;
  vehicleId?: string; // For TNDS
  paymentMethod: string;
}

export interface PurchaseInsuranceResponse {
  purchase: InsurancePurchase;
  paymentUrl?: string; // Payment gateway URL
}

export interface CreateClaimRequest {
  driverId: string;
  insuranceId: string;
  incidentDate: Date;
  incidentLocation: string;
  incidentDescription: string;
  claimedAmount: number;
  documents: any;
}

export interface CreateClaimResponse {
  claim: InsuranceClaim;
}

export interface GetInsuranceDashboardRequest {
  startDate: Date;
  endDate: Date;
}

export interface GetInsuranceDashboardResponse {
  dashboard: InsuranceDashboard;
}

export interface GetDriversInsuranceStatusRequest {
  status?: InsuranceStatus;
  expiringWithinDays?: number; // e.g., 30
  limit?: number;
  offset?: number;
}

export interface GetDriversInsuranceStatusResponse {
  drivers: DriverInsuranceStatusAdmin[];
  total: number;
}

export interface SendInsuranceReminderRequest {
  driverIds: string[]; // Bulk reminder
  daysBeforeExpiry: number; // 7, 3, 1, 0
  channels: NotificationChannel[];
}

export interface SendInsuranceReminderResponse {
  remindersSent: number;
  failed: number;
}
