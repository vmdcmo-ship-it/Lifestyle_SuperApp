/**
 * Revenue Management & Financial Configuration
 * Quản lý nguồn thu, phí, commission, thu hộ/chi hộ
 */

// ==================== ENUMS ====================

export enum RevenueStreamType {
  PLATFORM_FEE = 'PLATFORM_FEE', // Phí sử dụng nền tảng
  DRIVER_COMMISSION = 'DRIVER_COMMISSION', // Chiết khấu từ tài xế
  MERCHANT_COMMISSION = 'MERCHANT_COMMISSION', // Chiết khấu từ merchant
  SUBSCRIPTION_FEE = 'SUBSCRIPTION_FEE', // Phí đăng ký
  ADVERTISING_FEE = 'ADVERTISING_FEE', // Phí quảng cáo
  VOUCHER_MARKUP = 'VOUCHER_MARKUP', // Chênh lệch voucher/tour
  INSURANCE_COMMISSION = 'INSURANCE_COMMISSION', // Hoa hồng bảo hiểm
  PAYMENT_GATEWAY_FEE = 'PAYMENT_GATEWAY_FEE', // Phí thanh toán
}

export enum FeeType {
  FIXED = 'FIXED', // Cố định (VND)
  PERCENTAGE = 'PERCENTAGE', // Phần trăm (%)
  TIERED = 'TIERED', // Bậc thang
  HYBRID = 'HYBRID', // Kết hợp (fixed + percentage)
}

export enum ServiceType {
  RIDE_HAILING = 'RIDE_HAILING',
  FOOD_DELIVERY = 'FOOD_DELIVERY',
  SHOPPING = 'SHOPPING',
  TRAVEL = 'TRAVEL',
  INSURANCE = 'INSURANCE',
  VOUCHER = 'VOUCHER',
  UTILITY = 'UTILITY',
}

export enum SubscriptionPeriod {
  MONTHLY = 'MONTHLY',
  QUARTERLY = 'QUARTERLY',
  YEARLY = 'YEARLY',
}

export enum CollectionType {
  PLATFORM_REVENUE = 'PLATFORM_REVENUE', // Doanh thu của platform
  MERCHANT_COLLECTION = 'MERCHANT_COLLECTION', // Thu hộ merchant
  DRIVER_COLLECTION = 'DRIVER_COLLECTION', // Thu hộ driver
  TAX_WITHHOLDING = 'TAX_WITHHOLDING', // Thuế khấu trừ
}

export enum TaxType {
  VAT = 'VAT', // Thuế GTGT (8%, 10%)
  CIT = 'CIT', // Thuế TNDN (Corporate Income Tax)
  PIT = 'PIT', // Thuế TNCN (Personal Income Tax)
  WITHHOLDING = 'WITHHOLDING', // Thuế khấu trừ
}

export enum DisbursementMethod {
  BANK_TRANSFER = 'BANK_TRANSFER', // Chuyển khoản ngân hàng
  WALLET_BALANCE = 'WALLET_BALANCE', // Số dư ví
  MANUAL_WITHDRAWAL = 'MANUAL_WITHDRAWAL', // Rút tiền thủ công
  AUTO_TRANSFER = 'AUTO_TRANSFER', // Tự động chuyển khoản
}

export enum RevenueConfigStatus {
  DRAFT = 'DRAFT',
  SCHEDULED = 'SCHEDULED',
  ACTIVE = 'ACTIVE',
  EXPIRED = 'EXPIRED',
  SUPERSEDED = 'SUPERSEDED', // Bị thay thế bởi config mới
}

// ==================== REVENUE CONFIGURATION ====================

/**
 * Platform Fee Configuration
 * Phí sử dụng nền tảng: 2,000 VND/giao dịch
 */
export interface PlatformFeeConfig {
  id: string;
  name: string; // "Platform Transaction Fee"
  description: string;
  
  // Fee structure
  feeType: FeeType.FIXED; // Cố định
  amount: number; // 2000 VND
  
  // Applicability
  serviceTypes: ServiceType[]; // Áp dụng cho dịch vụ nào
  
  // Effective period
  effectiveFrom: Date;
  effectiveTo?: Date;
  
  // Status
  status: RevenueConfigStatus;
  isActive: boolean;
  
  // Audit
  createdAt: Date;
  createdBy: string;
  updatedAt: Date;
  updatedBy: string;
  version: number;
}

/**
 * Driver Commission Configuration
 * Chiết khấu nền tảng: 15% cước phí của tài xế
 */
export interface DriverCommissionConfig {
  id: string;
  name: string; // "Driver Service Commission"
  description: string;
  
  // Commission structure
  feeType: FeeType; // PERCENTAGE or TIERED
  percentage?: number; // 15% (0.15)
  tiers?: CommissionTier[]; // Bậc thang theo doanh thu
  
  // Minimum/Maximum
  minCommission?: number; // VND (minimum commission per order)
  maxCommission?: number; // VND (maximum commission per order)
  
  // Applicability
  serviceTypes: ServiceType[]; // RIDE_HAILING, FOOD_DELIVERY, SHOPPING
  vehicleTypes?: string[]; // Specific vehicle types
  zones?: string[]; // Specific geographic zones
  
  // Effective period
  effectiveFrom: Date;
  effectiveTo?: Date;
  
  // Status
  status: RevenueConfigStatus;
  isActive: boolean;
  
  // Audit
  createdAt: Date;
  createdBy: string;
  updatedAt: Date;
  updatedBy: string;
  version: number;
}

/**
 * Commission Tier (for tiered commission structure)
 */
export interface CommissionTier {
  minRevenue: number; // VND (monthly revenue threshold)
  maxRevenue?: number; // VND
  percentage: number; // 0-1 (e.g., 0.15 = 15%)
  description: string; // "< 10M/month: 15%"
}

/**
 * Merchant Commission Configuration
 * Chiết khấu dịch vụ: 15% doanh thu đơn hàng (quán ăn, cửa hàng)
 */
export interface MerchantCommissionConfig {
  id: string;
  name: string; // "Merchant Service Commission"
  description: string;
  
  // Commission structure
  feeType: FeeType; // PERCENTAGE or TIERED
  percentage?: number; // 15% (0.15)
  tiers?: CommissionTier[];
  
  // Minimum/Maximum
  minCommission?: number; // VND
  maxCommission?: number; // VND
  
  // Applicability
  serviceTypes: ServiceType[]; // FOOD_DELIVERY, SHOPPING
  merchantCategories?: string[]; // Restaurant, Store, etc.
  zones?: string[];
  
  // Effective period
  effectiveFrom: Date;
  effectiveTo?: Date;
  
  // Status
  status: RevenueConfigStatus;
  isActive: boolean;
  
  // Audit
  createdAt: Date;
  createdBy: string;
  updatedAt: Date;
  updatedBy: string;
  version: number;
}

/**
 * Subscription Fee Configuration
 * Phí đăng ký dịch vụ: Số tiền cụ thể/tháng/năm
 */
export interface SubscriptionFeeConfig {
  id: string;
  name: string; // "Premium Membership"
  description: string;
  
  // Fee structure
  period: SubscriptionPeriod; // MONTHLY, QUARTERLY, YEARLY
  amount: number; // VND
  
  // Benefits
  benefits: string[]; // List of benefits
  
  // Discounts
  annualDiscount?: number; // % discount if paid yearly
  
  // Applicability
  targetUserType: 'CUSTOMER' | 'DRIVER' | 'MERCHANT';
  serviceTypes?: ServiceType[]; // What services included
  
  // Effective period
  effectiveFrom: Date;
  effectiveTo?: Date;
  
  // Status
  status: RevenueConfigStatus;
  isActive: boolean;
  
  // Audit
  createdAt: Date;
  createdBy: string;
  updatedAt: Date;
  updatedBy: string;
  version: number;
}

/**
 * Advertising Fee Configuration
 * Phí quảng cáo: % doanh thu bán hàng (cho merchant)
 */
export interface AdvertisingFeeConfig {
  id: string;
  name: string; // "Sponsored Listing Fee"
  description: string;
  
  // Fee structure
  feeType: FeeType; // PERCENTAGE or FIXED
  percentage?: number; // % of sales revenue
  fixedAmount?: number; // VND (for fixed placement)
  
  // Ad placement
  placementType: 'BANNER' | 'SPONSORED_LISTING' | 'FEATURED' | 'POPUP';
  duration?: number; // Days (for fixed placement)
  
  // Performance tracking
  impressions?: number; // Guaranteed impressions
  clicks?: number; // Guaranteed clicks
  
  // Applicability
  serviceTypes: ServiceType[];
  merchantCategories?: string[];
  
  // Effective period
  effectiveFrom: Date;
  effectiveTo?: Date;
  
  // Status
  status: RevenueConfigStatus;
  isActive: boolean;
  
  // Audit
  createdAt: Date;
  createdBy: string;
  updatedAt: Date;
  updatedBy: string;
  version: number;
}

/**
 * Voucher Markup Configuration
 * Voucher/Tour: Giá bán = giá nhà cung cấp + markup
 */
export interface VoucherMarkupConfig {
  id: string;
  name: string; // "Travel Package Markup"
  description: string;
  
  // Markup structure
  feeType: FeeType; // PERCENTAGE or FIXED
  percentage?: number; // % markup on supplier price
  fixedAmount?: number; // VND fixed markup
  
  // Minimum/Maximum markup
  minMarkup?: number; // VND
  maxMarkup?: number; // VND
  
  // Applicability
  voucherCategories: string[]; // TRAVEL, HOTEL, RESTAURANT, ENTERTAINMENT, etc.
  supplierIds?: string[]; // Specific suppliers
  
  // Effective period
  effectiveFrom: Date;
  effectiveTo?: Date;
  
  // Status
  status: RevenueConfigStatus;
  isActive: boolean;
  
  // Audit
  createdAt: Date;
  createdBy: string;
  updatedAt: Date;
  updatedBy: string;
  version: number;
}

// ==================== TAX CONFIGURATION ====================

/**
 * Tax Configuration
 * Cấu hình thuế: VAT, TNCN, TNDN
 */
export interface TaxConfig {
  id: string;
  taxType: TaxType;
  name: string;
  description: string;
  
  // Tax rate
  rate: number; // % (e.g., 0.08 = 8%, 0.10 = 10%)
  
  // Applicability
  appliesTo: 'PLATFORM' | 'DRIVER' | 'MERCHANT' | 'CUSTOMER';
  serviceTypes?: ServiceType[];
  
  // Thresholds (for progressive tax)
  thresholds?: TaxThreshold[];
  
  // Collection method
  isWithheld: boolean; // Platform withholds tax?
  collectionType: CollectionType;
  
  // Effective period
  effectiveFrom: Date;
  effectiveTo?: Date;
  
  // Status
  status: RevenueConfigStatus;
  isActive: boolean;
  
  // Audit
  createdAt: Date;
  createdBy: string;
  updatedAt: Date;
  updatedBy: string;
}

/**
 * Tax Threshold (for progressive tax)
 */
export interface TaxThreshold {
  minIncome: number; // VND
  maxIncome?: number; // VND
  rate: number; // %
  description: string; // "< 10M: 0%, 10M-20M: 5%"
}

/**
 * Driver Tax Withholding
 * Thu hộ/chi hộ thuế của tài xế (VAT, TNCN)
 */
export interface DriverTaxWithholding {
  driverId: string;
  period: string; // "2024-02" (YYYY-MM)
  
  // Income
  grossIncome: number; // Tổng thu nhập gộp
  platformCommission: number; // Platform commission
  netIncome: number; // Thu nhập sau trừ commission
  
  // VAT (if driver is registered)
  vatRate: number; // 0.08 or 0.10
  vatAmount: number; // VAT withheld
  isVATRegistered: boolean;
  
  // PIT (Personal Income Tax - TNCN)
  pitRate: number; // Progressive rate
  pitAmount: number; // PIT withheld
  taxableIncome: number; // After deductions
  
  // Deductions
  deductions: {
    type: string; // "Personal exemption", "Dependent", etc.
    amount: number;
  }[];
  
  // Final amount
  totalTaxWithheld: number; // VAT + PIT
  netPayment: number; // Amount paid to driver after tax
  
  // Status
  isPaid: boolean;
  paidAt?: Date;
  
  createdAt: Date;
}

// ==================== REVENUE BREAKDOWN ====================

/**
 * Transaction Revenue Breakdown
 * Phân tích doanh thu từng giao dịch
 */
export interface TransactionRevenue {
  transactionId: string;
  orderId: string;
  orderType: ServiceType;
  
  // Total amount
  totalAmount: number; // Tổng tiền khách thanh toán
  
  // Platform revenue
  platformFee: number; // 2,000 VND (fixed fee)
  commission: number; // Driver or merchant commission (15%)
  advertisingFee?: number; // If merchant has ads
  
  // Collection for others (Thu hộ)
  merchantCollection?: number; // Merchant's share (doanh thu hàng hóa)
  driverCollection?: number; // Driver's share (cước phí sau commission)
  
  // Taxes
  vatWithheld?: number; // VAT withheld from driver
  pitWithheld?: number; // PIT withheld from driver
  
  // Final breakdown
  platformRevenue: number; // Platform fee + commission + ads
  collectionAmount: number; // Merchant + driver collection
  taxAmount: number; // Total tax withheld
  
  // Verification
  totalBreakdown: number; // Should equal totalAmount
  isBalanced: boolean; // totalBreakdown === totalAmount
  
  // Metadata
  collectionType: CollectionType;
  createdAt: Date;
}

/**
 * Merchant Revenue Settlement
 * Thanh toán doanh thu cho merchant (thu hộ)
 */
export interface MerchantSettlement {
  id: string;
  merchantId: string;
  period: string; // "2024-02" (YYYY-MM)
  
  // Revenue breakdown
  totalOrders: number;
  totalOrderValue: number; // Tổng giá trị đơn hàng
  
  // Platform commission
  commissionRate: number; // 15% (0.15)
  commissionAmount: number; // Platform commission
  
  // Advertising fees (if any)
  advertisingFees: number;
  
  // Net settlement (Thu hộ - trả lại merchant)
  netSettlement: number; // = totalOrderValue - commission - ads
  
  // Disbursement
  disbursementMethod: DisbursementMethod;
  disbursedAt?: Date;
  bankAccount?: {
    bankName: string;
    accountNumber: string;
    accountName: string;
  };
  
  // Status
  status: 'PENDING' | 'PROCESSING' | 'COMPLETED' | 'FAILED';
  
  // Tax reporting (for merchant)
  vatAmount: number; // VAT trong doanh thu (merchant tự kê khai)
  
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Driver Revenue Settlement
 * Thanh toán thu nhập cho driver
 */
export interface DriverSettlement {
  id: string;
  driverId: string;
  period: string; // "2024-02"
  
  // Revenue breakdown
  totalTrips: number;
  grossRevenue: number; // Tổng cước phí
  
  // Platform commission
  commissionRate: number; // 15% (0.15)
  commissionAmount: number;
  
  // Taxes withheld
  vatWithheld: number;
  pitWithheld: number;
  totalTaxWithheld: number;
  
  // Net payment
  netPayment: number; // = gross - commission - tax
  
  // Disbursement
  disbursementMethod: DisbursementMethod;
  disbursedAt?: Date;
  bankAccount?: {
    bankName: string;
    accountNumber: string;
    accountName: string;
  };
  
  // Status
  status: 'PENDING' | 'PROCESSING' | 'COMPLETED' | 'FAILED';
  
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Voucher Revenue
 * Doanh thu từ voucher/tour (có markup)
 */
export interface VoucherRevenue {
  voucherId: string;
  orderId: string;
  category: string; // TRAVEL, HOTEL, etc.
  
  // Pricing
  supplierPrice: number; // Giá nhà cung cấp
  markupAmount: number; // Chênh lệch (platform revenue)
  sellingPrice: number; // Giá bán cho khách (supplier + markup)
  
  // Actual customer payment
  customerPayment: number; // Tiền khách thanh toán
  
  // Settlement
  supplierSettlement: number; // = supplierPrice (thu hộ supplier)
  platformRevenue: number; // = markupAmount
  
  // Disbursement to supplier
  disbursementMethod: DisbursementMethod;
  disbursedAt?: Date;
  
  // Status
  status: 'PENDING' | 'COMPLETED' | 'REFUNDED';
  
  createdAt: Date;
}

// ==================== ADMIN UI ====================

/**
 * Revenue Config Change Request
 * Request để thay đổi cấu hình nguồn thu
 */
export interface RevenueConfigChangeRequest {
  id: string;
  configType: RevenueStreamType;
  configId: string;
  
  // Changes
  changes: {
    field: string;
    oldValue: any;
    newValue: any;
    reason: string;
  }[];
  
  // Scheduling
  effectiveFrom: Date;
  effectiveTo?: Date;
  
  // Impact analysis
  estimatedImpact?: {
    revenueChange: number; // VND/month
    affectedUsers: number;
    affectedMerchants: number;
    affectedDrivers: number;
  };
  
  // Approval workflow
  requestedBy: string;
  requestedAt: Date;
  approvedBy?: string;
  approvedAt?: Date;
  rejectedBy?: string;
  rejectedAt?: Date;
  rejectionReason?: string;
  
  // Status
  status: 'PENDING' | 'APPROVED' | 'REJECTED' | 'APPLIED';
  
  // Audit trail
  comments: {
    userId: string;
    comment: string;
    timestamp: Date;
  }[];
}

/**
 * Revenue Analytics
 * Phân tích doanh thu theo nguồn
 */
export interface RevenueAnalytics {
  period: {
    startDate: Date;
    endDate: Date;
  };
  
  // By revenue stream
  byStream: {
    stream: RevenueStreamType;
    amount: number;
    percentage: number; // % of total revenue
    transactionCount: number;
    avgPerTransaction: number;
  }[];
  
  // Total platform revenue (not including collections)
  totalPlatformRevenue: number;
  
  // Collections (thu hộ - not platform revenue)
  totalMerchantCollection: number;
  totalDriverCollection: number;
  
  // Tax collected
  totalTaxCollected: number;
  
  // Growth
  revenueGrowth: number; // % vs previous period
  
  // By service type
  byServiceType: {
    serviceType: ServiceType;
    revenue: number;
    percentage: number;
  }[];
  
  // Top revenue sources
  topDrivers: { driverId: string; revenue: number }[];
  topMerchants: { merchantId: string; revenue: number }[];
}

/**
 * Financial Report
 * Báo cáo tài chính (P&L format)
 */
export interface FinancialReport {
  period: string; // "2024-02"
  
  // Revenue (Doanh thu)
  revenue: {
    platformFees: number; // Phí nền tảng
    driverCommissions: number; // Chiết khấu tài xế
    merchantCommissions: number; // Chiết khấu merchant
    subscriptionFees: number; // Phí đăng ký
    advertisingFees: number; // Phí quảng cáo
    voucherMarkups: number; // Chênh lệch voucher
    other: number;
    totalRevenue: number;
  };
  
  // Cost of Revenue (Giá vốn)
  costOfRevenue: {
    paymentGatewayFees: number; // Phí cổng thanh toán
    smsEmailCosts: number; // Chi phí SMS/Email
    mapApiCosts: number; // Google Maps API
    cloudInfrastructure: number; // AWS/GCP
    other: number;
    totalCost: number;
  };
  
  // Gross Profit (Lợi nhuận gộp)
  grossProfit: number;
  grossMargin: number; // %
  
  // Operating Expenses (Chi phí hoạt động)
  operatingExpenses: {
    salaries: number;
    marketing: number;
    technology: number;
    officeRent: number;
    other: number;
    totalOpex: number;
  };
  
  // EBITDA
  ebitda: number;
  
  // Net Profit (Lợi nhuận ròng)
  netProfit: number;
  netMargin: number; // %
  
  // Collections (THU HỘ - NOT counted as revenue)
  collections: {
    merchantCollections: number; // Thu hộ merchant
    driverCollections: number; // Thu hộ driver (after commission)
    taxCollections: number; // Thuế thu hộ
    totalCollections: number;
  };
  
  // Note
  note: string; // "Collections are held in trust and not recognized as platform revenue"
}

// ==================== API TYPES ====================

export interface GetRevenueConfigRequest {
  configType: RevenueStreamType;
  effectiveDate?: Date;
}

export interface GetRevenueConfigResponse {
  config: 
    | PlatformFeeConfig 
    | DriverCommissionConfig 
    | MerchantCommissionConfig 
    | SubscriptionFeeConfig 
    | AdvertisingFeeConfig 
    | VoucherMarkupConfig;
}

export interface CreateRevenueConfigRequest {
  configType: RevenueStreamType;
  config: any; // Specific config object
  effectiveFrom: Date;
  effectiveTo?: Date;
}

export interface UpdateRevenueConfigRequest {
  configId: string;
  changes: Record<string, any>;
  reason: string;
  effectiveFrom: Date;
}

export interface CalculateTransactionRevenueRequest {
  orderId: string;
  orderType: ServiceType;
  totalAmount: number;
  merchantId?: string;
  driverId?: string;
}

export interface CalculateTransactionRevenueResponse {
  breakdown: TransactionRevenue;
}

export interface GetRevenueAnalyticsRequest {
  startDate: Date;
  endDate: Date;
  groupBy?: 'STREAM' | 'SERVICE' | 'DAY' | 'WEEK' | 'MONTH';
}

export interface GetRevenueAnalyticsResponse {
  analytics: RevenueAnalytics;
}

export interface GetFinancialReportRequest {
  period: string; // "2024-02"
  format?: 'JSON' | 'PDF' | 'EXCEL';
}

export interface GetFinancialReportResponse {
  report: FinancialReport;
  downloadUrl?: string; // If PDF or Excel
}
