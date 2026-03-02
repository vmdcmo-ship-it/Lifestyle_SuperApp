/**
 * Life Insurance Type Definitions
 * Partnership with Cathay Life (White-label distribution)
 * 
 * 3 Product Naming Strategies (Vibes):
 * 1. "Kế hoạch Cuộc đời" (Lifestyle-focused)
 * 2. "Lá chắn & Đòn bẩy" (Finance-focused)
 * 3. "Của Để Dành" (Trust & Familiarity-focused)
 */

// ============================================================================
// Enums
// ============================================================================

/**
 * Product naming vibe (Strategy)
 */
export enum ProductNamingVibe {
  LIFESTYLE = 'LIFESTYLE', // "Kế hoạch Cuộc đời"
  FINANCE = 'FINANCE', // "Lá chắn & Đòn bẩy"
  TRUST = 'TRUST', // "Của Để Dành"
}

/**
 * Life insurance product categories
 */
export enum LifeInsuranceCategory {
  TERM = 'TERM', // Tử kỳ (Vi mô)
  WHOLE_LIFE = 'WHOLE_LIFE', // Sinh kỳ (Trọn đời)
  ENDOWMENT = 'ENDOWMENT', // Hỗn hợp (Tiết kiệm)
  INVESTMENT_LINKED = 'INVESTMENT_LINKED', // Liên kết đầu tư (UL, VUL)
  EDUCATION = 'EDUCATION', // Giáo dục con
  RETIREMENT = 'RETIREMENT', // Hưu trí
}

/**
 * Customer lifecycle stage (For personalized product recommendation)
 */
export enum CustomerLifecycleStage {
  YOUNG_SINGLE = 'YOUNG_SINGLE', // 18-30, độc thân
  NEWLYWED = 'NEWLYWED', // 25-35, mới cưới
  YOUNG_PARENTS = 'YOUNG_PARENTS', // 30-40, con nhỏ
  ESTABLISHED = 'ESTABLISHED', // 40-50, con lớn
  PRE_RETIREMENT = 'PRE_RETIREMENT', // 50-60, chuẩn bị nghỉ hưu
  RETIRED = 'RETIRED', // 60+, đã nghỉ hưu
}

/**
 * Policy status
 */
export enum PolicyStatus {
  DRAFT = 'DRAFT', // Đang soạn (chưa submit)
  PENDING = 'PENDING', // Chờ xét duyệt
  UNDERWRITING = 'UNDERWRITING', // Đang thẩm định
  APPROVED = 'APPROVED', // Đã phê duyệt
  ACTIVE = 'ACTIVE', // Đang có hiệu lực
  LAPSED = 'LAPSED', // Tạm dừng (quá hạn đóng phí)
  PAID_UP = 'PAID_UP', // Đã đóng đủ (không cần đóng nữa)
  SURRENDERED = 'SURRENDERED', // Đã rút
  MATURED = 'MATURED', // Đáo hạn
  CLAIMED = 'CLAIMED', // Đã chi trả bảo hiểm
}

/**
 * Premium payment frequency
 */
export enum PaymentFrequency {
  MONTHLY = 'MONTHLY', // Hàng tháng
  QUARTERLY = 'QUARTERLY', // Hàng quý
  SEMI_ANNUAL = 'SEMI_ANNUAL', // 6 tháng
  ANNUAL = 'ANNUAL', // Hàng năm
  SINGLE = 'SINGLE', // Đóng 1 lần
}

/**
 * Claim type
 */
export enum ClaimType {
  DEATH = 'DEATH', // Tử vong
  CRITICAL_ILLNESS = 'CRITICAL_ILLNESS', // Bệnh hiểm nghèo
  DISABILITY = 'DISABILITY', // Thương tật toàn bộ
  HOSPITALIZATION = 'HOSPITALIZATION', // Nằm viện
  MATURITY = 'MATURITY', // Đáo hạn (nhận tiền khi hợp đồng đáo hạn)
  SURRENDER = 'SURRENDER', // Rút trước hạn
  LOAN = 'LOAN', // Vay từ giá trị hoàn lại
}

/**
 * Beneficiary relationship
 */
export enum BeneficiaryRelationship {
  SPOUSE = 'SPOUSE', // Vợ/Chồng
  CHILD = 'CHILD', // Con
  PARENT = 'PARENT', // Bố/Mẹ
  SIBLING = 'SIBLING', // Anh/Chị/Em
  OTHER = 'OTHER', // Khác
}

/**
 * Underwriting status
 */
export enum UnderwritingStatus {
  NOT_STARTED = 'NOT_STARTED',
  COLLECTING_INFO = 'COLLECTING_INFO', // Đang thu thập thông tin
  MEDICAL_EXAM = 'MEDICAL_EXAM', // Khám sức khỏe
  REVIEWING = 'REVIEWING', // Đang xem xét
  APPROVED = 'APPROVED', // Chấp nhận
  DECLINED = 'DECLINED', // Từ chối
  RATED = 'RATED', // Tăng phí (do sức khỏe)
}

// ============================================================================
// Product Naming Constants
// ============================================================================

/**
 * Product names by vibe & category
 */
export const PRODUCT_NAMES = {
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // Vibe 1: LIFESTYLE - "Kế hoạch Cuộc đời"
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  LIFESTYLE: {
    CATEGORY_NAME: 'Bản Thiết Kế Tương Lai',
    PRODUCTS: {
      [LifeInsuranceCategory.TERM]: {
        name: 'Gói An Tâm 24/7',
        tagline: 'Bảo vệ trọn vẹn mỗi khoảnh khắc',
        icon: '🛡️',
      },
      [LifeInsuranceCategory.EDUCATION]: {
        name: 'Quỹ Chắp Cánh Tài Năng',
        tagline: 'Kiến tạo tương lai cho con yêu',
        icon: '🎓',
      },
      [LifeInsuranceCategory.INVESTMENT_LINKED]: {
        name: 'Gói Tăng Trưởng Tài Sản',
        tagline: 'Bảo vệ + Tăng trưởng vượt trội',
        icon: '📈',
      },
      [LifeInsuranceCategory.RETIREMENT]: {
        name: 'Đặc Quyền Tuổi Vàng',
        tagline: 'Hưởng thụ cuộc sống như ý muốn',
        icon: '🌟',
      },
      [LifeInsuranceCategory.WHOLE_LIFE]: {
        name: 'Kế Hoạch Trọn Đời',
        tagline: 'Bảo vệ suốt cuộc đời',
        icon: '🏆',
      },
      [LifeInsuranceCategory.ENDOWMENT]: {
        name: 'Quỹ Tích Lũy Thông Minh',
        tagline: 'Tiết kiệm an toàn, lợi nhuận hấp dẫn',
        icon: '💎',
      },
    },
  },

  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // Vibe 2: FINANCE - "Lá chắn & Đòn bẩy"
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  FINANCE: {
    CATEGORY_NAME: 'Lá Chắn Tài Chính Lifestyle',
    PRODUCTS: {
      [LifeInsuranceCategory.TERM]: {
        name: 'Lớp Bảo Vệ Cơ Bản',
        tagline: 'Chi phí thấp, bảo vệ tối đa',
        icon: '🛡️',
      },
      [LifeInsuranceCategory.WHOLE_LIFE]: {
        name: 'Khoản Tích Lũy Bền Vững',
        tagline: 'Tài sản vững chắc cho gia đình',
        icon: '🏛️',
      },
      [LifeInsuranceCategory.INVESTMENT_LINKED]: {
        name: 'Đòn Bẩy Tài Chính 4.0',
        tagline: 'Tối ưu lợi nhuận, an toàn rủi ro',
        icon: '📊',
      },
      [LifeInsuranceCategory.RETIREMENT]: {
        name: 'Quỹ Lương Hưu Thượng Lưu',
        tagline: 'Thu nhập thụ động, sống sang trọng',
        icon: '💰',
      },
      [LifeInsuranceCategory.EDUCATION]: {
        name: 'Quỹ Học Vấn Đỉnh Cao',
        tagline: 'Đầu tư tương lai, thu hoạch thành công',
        icon: '🎯',
      },
      [LifeInsuranceCategory.ENDOWMENT]: {
        name: 'Khoản Tích Sản Ổn Định',
        tagline: 'Lãi suất đảm bảo, an toàn tuyệt đối',
        icon: '🔐',
      },
    },
  },

  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // Vibe 3: TRUST - "Của Để Dành"
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  TRUST: {
    CATEGORY_NAME: 'Quỹ Dự Phòng Hạnh Phúc',
    PRODUCTS: {
      [LifeInsuranceCategory.TERM]: {
        name: 'Tích Tiểu Thành Đại',
        tagline: 'Mỗi ngày một chút, bảo vệ trọn đời',
        icon: '🌱',
      },
      [LifeInsuranceCategory.EDUCATION]: {
        name: 'Của Để Dành Cho Con',
        tagline: 'Tương lai con, trách nhiệm bố mẹ',
        icon: '👨‍👩‍👧',
      },
      [LifeInsuranceCategory.INVESTMENT_LINKED]: {
        name: 'Tài Sản Sinh Sôi',
        tagline: 'Tiền đẻ ra tiền, an toàn vững chắc',
        icon: '🌳',
      },
      [LifeInsuranceCategory.RETIREMENT]: {
        name: 'Hưu Trí An Nhàn',
        tagline: 'Tuổi già yên vui, con cháu hạnh phúc',
        icon: '🏡',
      },
      [LifeInsuranceCategory.WHOLE_LIFE]: {
        name: 'Tài Sản Để Lại',
        tagline: 'Gia tài cho thế hệ mai sau',
        icon: '🎁',
      },
      [LifeInsuranceCategory.ENDOWMENT]: {
        name: 'Quỹ Tích Góp Gia Đình',
        tagline: 'Mỗi tháng tích góp, tương lai rạng rỡ',
        icon: '🏠',
      },
    },
  },
} as const;

// ============================================================================
// Interfaces
// ============================================================================

/**
 * Life insurance product (Catalog item)
 */
export interface LifeInsuranceProduct {
  id: string;
  productCode: string; // CATHAY-TERM-001
  
  // Naming (Dynamic based on vibe)
  vibe: ProductNamingVibe;
  displayName: string; // "Gói An Tâm 24/7" | "Lớp Bảo Vệ Cơ Bản" | "Tích Tiểu Thành Đại"
  tagline: string;
  icon: string;
  
  // Category
  category: LifeInsuranceCategory;
  
  // Partner info (Shown at bottom)
  partnerId: string; // 'cathay-life'
  partnerName: string; // 'Cathay Life'
  partnerDescription: string; // "Tập đoàn tài chính hàng đầu Châu Á..."
  partnerLogo?: string; // URL
  
  // Product description
  shortDescription: string; // 300 chars (Above the fold)
  fullDescription: string; // Full details
  videoUrl?: string; // YouTube/TikTok
  
  // Coverage
  sumAssuredRange: {
    min: number; // 100,000,000 VND
    max: number; // 10,000,000,000 VND
  };
  
  // Premium
  premiumRange: {
    min: number; // Per month/year
    max: number;
  };
  paymentFrequencies: PaymentFrequency[];
  
  // Terms
  minAge: number; // 18
  maxAge: number; // 60
  minTerm: number; // 10 years
  maxTerm: number; // 30 years
  
  // Benefits
  benefits: ProductBenefit[];
  riders: ProductRider[]; // Quyền lợi bổ sung
  
  // Features
  features: string[]; // ["Miễn phí BHYT", "Tăng 10% mỗi năm", "Vay tới 80%"]
  
  // Recommendation
  recommendedFor: CustomerLifecycleStage[];
  
  // Status
  isActive: boolean;
  isFeatured: boolean;
  displayOrder: number;
  
  // Metadata
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Product benefit
 */
export interface ProductBenefit {
  id: string;
  name: string; // "Quyền lợi tử vong"
  description: string;
  coverage: string; // "100% số tiền bảo hiểm"
  icon?: string;
}

/**
 * Product rider (Quyền lợi bổ sung)
 */
export interface ProductRider {
  id: string;
  riderCode: string;
  name: string; // "Bảo hiểm bệnh hiểm nghèo"
  description: string;
  premium: number; // Additional cost
  coverage: string; // "Tới 1 tỷ đồng"
  isOptional: boolean;
}

/**
 * Insurance application (Lead/Quote)
 */
export interface InsuranceApplication {
  id: string;
  applicationNumber: string; // LS-LIFE-240214-001
  
  // Product
  productId: string;
  product: LifeInsuranceProduct;
  
  // User
  userId: string;
  sourceApp: 'USER' | 'DRIVER' | 'MERCHANT';
  
  // Insured person
  insuredPerson: InsuredPerson;
  
  // Coverage details
  sumAssured: number; // Số tiền bảo hiểm
  term: number; // Thời hạn (years)
  paymentFrequency: PaymentFrequency;
  premium: number; // Phí bảo hiểm (per period)
  
  // Riders
  selectedRiders: ProductRider[];
  totalPremium: number; // Premium + Riders
  
  // Beneficiaries
  beneficiaries: Beneficiary[];
  
  // Medical/Underwriting
  healthDeclaration: HealthDeclaration;
  underwritingStatus: UnderwritingStatus;
  underwritingNotes?: string;
  
  // Status
  status: PolicyStatus;
  
  // Consultation (if needed)
  needsConsultation: boolean;
  assignedAgentId?: string;
  consultationNotes?: string;
  
  // Metadata
  createdAt: Date;
  updatedAt: Date;
  submittedAt?: Date;
  approvedAt?: Date;
}

/**
 * Insured person
 */
export interface InsuredPerson {
  fullName: string;
  dateOfBirth: Date;
  age: number;
  gender: 'MALE' | 'FEMALE';
  idNumber: string; // CMND/CCCD
  phone: string;
  email: string;
  address: string;
  
  // Occupation
  occupation: string;
  monthlyIncome: number;
  
  // Lifestyle
  isSmoker: boolean;
  
  // Existing insurance
  hasExistingInsurance: boolean;
  existingCoverage?: number;
}

/**
 * Beneficiary (Người thụ hưởng)
 */
export interface Beneficiary {
  id: string;
  fullName: string;
  dateOfBirth: Date;
  relationship: BeneficiaryRelationship;
  idNumber: string;
  phone: string;
  percentage: number; // % of sum assured (Total = 100%)
  isPrimary: boolean; // Thụ hưởng chính hay phụ
}

/**
 * Health declaration
 */
export interface HealthDeclaration {
  // Medical history
  hasChronicDisease: boolean;
  chronicDiseases?: string[]; // ["Tiểu đường", "Cao huyết áp"]
  
  hasHospitalization: boolean; // Nằm viện trong 5 năm qua
  hospitalizationDetails?: string;
  
  isTakingMedication: boolean;
  medicationDetails?: string;
  
  hasFamilyHistory: boolean; // Bệnh gia đình (cancer, heart disease)
  familyHistoryDetails?: string;
  
  // Lifestyle
  height: number; // cm
  weight: number; // kg
  bmi: number; // Auto-calculated
  
  isSmoker: boolean;
  alcoholConsumption: 'NONE' | 'OCCASIONAL' | 'REGULAR' | 'HEAVY';
  
  // Consent
  consentForMedicalExam: boolean;
  declarationDate: Date;
  signature?: string; // Digital signature or image
}

/**
 * Active policy (Hợp đồng đang có hiệu lực)
 */
export interface ActivePolicy {
  id: string;
  policyNumber: string; // Số hợp đồng từ Cathay Life
  applicationId: string;
  
  // Product
  product: LifeInsuranceProduct;
  
  // Coverage
  sumAssured: number;
  term: number;
  paymentFrequency: PaymentFrequency;
  premium: number;
  
  // Dates
  startDate: Date; // Ngày hiệu lực
  endDate: Date; // Ngày đáo hạn
  nextPremiumDue: Date; // Ngày đóng phí kế tiếp
  
  // Payment history
  paidPremiums: number; // Tổng phí đã đóng
  totalPayments: number; // Số kỳ đã đóng
  remainingPayments: number; // Số kỳ còn lại
  
  // Cash value (Giá trị hoàn lại)
  cashValue: number; // Current cash value
  surrenderValue: number; // Giá trị rút (after fees)
  loanValue: number; // Giá trị có thể vay (80% of cash value)
  
  // Investment account (For UL/VUL)
  investmentAccount?: InvestmentAccount;
  
  // Beneficiaries
  beneficiaries: Beneficiary[];
  
  // Status
  status: PolicyStatus;
  isPremiumCurrent: boolean; // Đã đóng phí đúng hạn
  gracePeriodEnd?: Date; // Ngày hết thời gian gia hạn (nếu quá hạn)
  
  // Metadata
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Investment account (For investment-linked products)
 */
export interface InvestmentAccount {
  accountNumber: string;
  currentValue: number; // Giá trị hiện tại
  contributedAmount: number; // Số tiền đã đóng
  investmentReturn: number; // Lợi nhuận (%)
  returnAmount: number; // Lợi nhuận (VND)
  
  // Fund allocation
  funds: FundAllocation[];
  
  // Performance
  ytdReturn: number; // Year-to-date return (%)
  inceptionReturn: number; // Lợi nhuận từ đầu (%)
  
  // History
  transactions: InvestmentTransaction[];
}

/**
 * Fund allocation
 */
export interface FundAllocation {
  fundId: string;
  fundName: string; // "Quỹ Cổ phiếu Việt Nam", "Quỹ Trái phiếu"
  fundType: 'EQUITY' | 'BOND' | 'BALANCED' | 'MONEY_MARKET';
  allocation: number; // % (Total = 100%)
  currentValue: number;
  return: number; // % YTD
}

/**
 * Investment transaction
 */
export interface InvestmentTransaction {
  id: string;
  date: Date;
  type: 'BUY' | 'SELL' | 'SWITCH' | 'REBALANCE';
  fundName: string;
  units: number; // Số đơn vị quỹ
  pricePerUnit: number;
  amount: number;
}

/**
 * Premium payment
 */
export interface PremiumPayment {
  id: string;
  policyId: string;
  
  // Period
  period: string; // '2026-Q1', '2026-02'
  dueDate: Date;
  paidDate?: Date;
  
  // Amount
  amount: number;
  status: 'PENDING' | 'PAID' | 'OVERDUE' | 'WAIVED';
  
  // Payment method
  paymentMethod?: 'BANK_TRANSFER' | 'CREDIT_CARD' | 'WALLET' | 'AUTO_DEBIT';
  transactionId?: string;
  
  // Receipt
  receiptNumber?: string;
  receiptUrl?: string;
  
  // Metadata
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Insurance claim
 */
export interface InsuranceClaim {
  id: string;
  claimNumber: string; // LS-CLAIM-240214-001
  policyId: string;
  
  // Type
  claimType: ClaimType;
  
  // Claim details
  claimAmount: number; // Số tiền yêu cầu chi trả
  incidentDate: Date; // Ngày xảy ra sự kiện
  description: string;
  
  // Documents
  documents: ClaimDocument[];
  
  // Status
  status: 'DRAFT' | 'SUBMITTED' | 'REVIEWING' | 'APPROVED' | 'DECLINED' | 'PAID';
  reviewedBy?: string; // Agent/Ops ID
  reviewNotes?: string;
  
  // Approval
  approvedAmount?: number;
  approvedDate?: Date;
  
  // Payment
  paidDate?: Date;
  paymentMethod?: string;
  
  // Metadata
  createdAt: Date;
  updatedAt: Date;
  submittedAt?: Date;
}

/**
 * Claim document
 */
export interface ClaimDocument {
  id: string;
  type: 'DEATH_CERTIFICATE' | 'MEDICAL_REPORT' | 'HOSPITAL_BILL' | 'POLICE_REPORT' | 'ID_CARD' | 'OTHER';
  name: string;
  url: string;
  uploadedAt: Date;
}

/**
 * Policy loan (Vay từ giá trị hoàn lại)
 */
export interface PolicyLoan {
  id: string;
  loanNumber: string;
  policyId: string;
  
  // Loan details
  loanAmount: number; // Số tiền vay
  maxLoanAmount: number; // Tối đa có thể vay (80% cash value)
  interestRate: number; // % per year
  
  // Repayment
  outstandingBalance: number; // Số dư nợ
  monthlyPayment?: number;
  nextPaymentDue?: Date;
  
  // Status
  status: 'PENDING' | 'APPROVED' | 'DISBURSED' | 'REPAYING' | 'PAID_OFF';
  
  // Dates
  approvedDate?: Date;
  disbursedDate?: Date;
  paidOffDate?: Date;
  
  // Repayment history
  repayments: LoanRepayment[];
  
  // Metadata
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Loan repayment
 */
export interface LoanRepayment {
  id: string;
  loanId: string;
  
  period: string; // '2026-02'
  dueDate: Date;
  paidDate?: Date;
  
  principal: number; // Gốc
  interest: number; // Lãi
  totalAmount: number;
  
  status: 'PENDING' | 'PAID' | 'OVERDUE';
  
  createdAt: Date;
}

// ============================================================================
// Dashboard Types ("Bảo hiểm của tôi" - Timeline design)
// ============================================================================

/**
 * Insurance dashboard summary
 */
export interface InsuranceDashboard {
  userId: string;
  
  // Total protection value (Header)
  totalProtectionValue: number; // Tổng giá trị bảo vệ (sum of all sum assured)
  
  // Active policies (Timeline)
  activePolicies: PolicyTimelineItem[];
  
  // Quick stats
  stats: {
    totalPolicies: number;
    totalPremiumPaid: number; // Tổng phí đã đóng
    totalCashValue: number; // Tổng giá trị hoàn lại
    nextPaymentDue: Date | null; // Ngày đóng phí gần nhất
    nextPaymentAmount: number;
  };
  
  // Quick actions
  quickActions: QuickAction[];
  
  // Recommendations
  recommendations: ProductRecommendation[];
}

/**
 * Policy timeline item (For "Bảo hiểm của tôi" timeline display)
 */
export interface PolicyTimelineItem {
  policy: ActivePolicy;
  
  // Display info (Product name based on vibe)
  displayName: string; // "Gói An Tâm 24/7" | "Quỹ Chắp Cánh Tài Năng"
  icon: string;
  
  // Progress
  progressText: string; // "Bạn đã đóng 5/20 năm - Đang hưởng BHYT miễn phí"
  progressPercentage: number; // 25% (5/20)
  
  // Highlight (For investment-linked)
  highlightText?: string; // "Giá trị tài khoản hiện tại: 150M - Đang sinh lời 7.5%"
  
  // Status badge
  statusBadge: {
    text: string; // "Đang có hiệu lực" | "Quá hạn đóng phí"
    color: 'success' | 'warning' | 'error';
  };
  
  // Quick actions for this policy
  actions: PolicyAction[];
}

/**
 * Quick action
 */
export interface QuickAction {
  id: string;
  type: 'CHANGE_BENEFICIARY' | 'REQUEST_LOAN' | 'FILE_CLAIM' | 'VIEW_POLICY' | 'PAY_PREMIUM';
  label: string;
  icon: string;
  deepLink: string; // Deep link to action
}

/**
 * Policy action
 */
export interface PolicyAction {
  type: 'PAY' | 'LOAN' | 'CLAIM' | 'VIEW' | 'CHANGE_BENEFICIARY';
  label: string;
  icon: string;
  enabled: boolean;
  reason?: string; // If disabled: "Hợp đồng chưa đủ 2 năm"
}

/**
 * Product recommendation (AI-powered)
 */
export interface ProductRecommendation {
  product: LifeInsuranceProduct;
  reason: string; // "Bạn có con nhỏ, nên cân nhắc Quỹ Chắp Cánh Tài Năng"
  priority: 'HIGH' | 'MEDIUM' | 'LOW';
}

// ============================================================================
// Calculator Types
// ============================================================================

/**
 * Premium calculator input
 */
export interface PremiumCalculatorInput {
  // Product
  productId: string;
  
  // Coverage
  sumAssured: number;
  term: number;
  paymentFrequency: PaymentFrequency;
  
  // Insured person
  age: number;
  gender: 'MALE' | 'FEMALE';
  isSmoker: boolean;
  occupation: string; // For risk assessment
  
  // Riders
  selectedRiderIds: string[];
}

/**
 * Premium calculator output
 */
export interface PremiumCalculatorOutput {
  // Input summary
  input: PremiumCalculatorInput;
  
  // Premium breakdown
  basePremium: number; // Phí cơ bản
  riderPremiums: { riderId: string; name: string; premium: number }[];
  totalPremium: number; // Per period
  
  // Annual equivalent (for comparison)
  annualPremium: number;
  
  // Total cost
  totalCost: number; // Total premium over term
  
  // Benefits summary
  totalProtection: number; // Sum assured + riders
  cashValueAtMaturity?: number; // For endowment/whole life
  estimatedReturn?: number; // For investment-linked (%)
  
  // Comparison với tiết kiệm
  comparison: {
    savingDeposit: {
      totalDeposit: number; // If save the same amount
      interestRate: number; // 6% assumed
      finalValue: number;
    };
    insurance: {
      totalPremium: number;
      protection: number;
      cashValue: number;
    };
    advantage: string; // "Bảo hiểm cho bạn bảo vệ 10x giá trị"
  };
  
  // Calculated at
  calculatedAt: Date;
}

// ============================================================================
// Educational Content ("Wiki Bảo Hiểm Lifestyle")
// ============================================================================

/**
 * Wiki article
 */
export interface WikiArticle {
  id: string;
  slug: string; // 'bao-hiem-dau-tu-vs-gui-ngan-hang'
  
  // Content
  title: string; // "Nên mua bảo hiểm đầu tư hay gửi ngân hàng?"
  summary: string; // 300 chars
  content: string; // Full HTML/Markdown
  
  // Category
  category: 'BASICS' | 'COMPARISON' | 'GUIDE' | 'GLOSSARY' | 'FAQ';
  tags: string[];
  
  // Media
  featuredImage?: string;
  videoUrl?: string;
  
  // SEO
  metaTitle: string;
  metaDescription: string;
  
  // Stats
  viewCount: number;
  likeCount: number;
  shareCount: number;
  
  // Related
  relatedArticles: string[]; // Article IDs
  relatedProducts: string[]; // Product IDs
  
  // Status
  isPublished: boolean;
  publishedAt?: Date;
  
  // Metadata
  author: string;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Glossary term (Thuật ngữ)
 */
export interface GlossaryTerm {
  id: string;
  term: string; // "Số tiền bảo hiểm"
  definition: string; // Định nghĩa ngắn gọn
  example?: string; // Ví dụ thực tế
  relatedTerms: string[]; // Term IDs
}

// ============================================================================
// API Types
// ============================================================================

/**
 * Request: Get products (With vibe filter)
 */
export interface GetProductsRequest {
  vibe?: ProductNamingVibe; // Filter by vibe
  category?: LifeInsuranceCategory;
  lifecycleStage?: CustomerLifecycleStage;
  isFeatured?: boolean;
  limit?: number;
}

export interface GetProductsResponse {
  products: LifeInsuranceProduct[];
  categoryName: string; // "Bản Thiết Kế Tương Lai" | "Lá Chắn Tài Chính Lifestyle" | etc.
  total: number;
}

/**
 * Request: Calculate premium
 */
export interface CalculatePremiumRequest {
  input: PremiumCalculatorInput;
}

export interface CalculatePremiumResponse {
  output: PremiumCalculatorOutput;
}

/**
 * Request: Create application
 */
export interface CreateApplicationRequest {
  productId: string;
  insuredPerson: InsuredPerson;
  sumAssured: number;
  term: number;
  paymentFrequency: PaymentFrequency;
  selectedRiderIds: string[];
  beneficiaries: Beneficiary[];
  healthDeclaration: HealthDeclaration;
  needsConsultation?: boolean;
}

export interface CreateApplicationResponse {
  application: InsuranceApplication;
}

/**
 * Request: Get my dashboard
 */
export interface GetMyDashboardRequest {
  userId: string;
  vibe: ProductNamingVibe; // For display names
}

export interface GetMyDashboardResponse {
  dashboard: InsuranceDashboard;
}

/**
 * Request: File a claim
 */
export interface FileClaimRequest {
  policyId: string;
  claimType: ClaimType;
  claimAmount: number;
  incidentDate: Date;
  description: string;
  documents: { type: string; url: string }[];
}

export interface FileClaimResponse {
  claim: InsuranceClaim;
}

/**
 * Request: Request policy loan
 */
export interface RequestPolicyLoanRequest {
  policyId: string;
  loanAmount: number;
  purpose?: string;
}

export interface RequestPolicyLoanResponse {
  loan: PolicyLoan;
  maxLoanAmount: number;
  interestRate: number;
}

/**
 * Request: Get wiki articles
 */
export interface GetWikiArticlesRequest {
  category?: string;
  tag?: string;
  search?: string;
  limit?: number;
}

export interface GetWikiArticlesResponse {
  articles: WikiArticle[];
  total: number;
}

// ============================================================================
// UI Component Props
// ============================================================================

/**
 * Props for product card
 */
export interface ProductCardProps {
  product: LifeInsuranceProduct;
  vibe: ProductNamingVibe; // For display name
  onSelect: (product: LifeInsuranceProduct) => void;
}

/**
 * Props for premium calculator widget
 */
export interface PremiumCalculatorProps {
  productId: string;
  onCalculate: (input: PremiumCalculatorInput) => void;
  result?: PremiumCalculatorOutput;
  loading?: boolean;
}

/**
 * Props for dashboard timeline
 */
export interface DashboardTimelineProps {
  dashboard: InsuranceDashboard;
  vibe: ProductNamingVibe;
  onActionClick: (action: QuickAction) => void;
}

/**
 * Props for partner block (Bottom of product page)
 */
export interface PartnerBlockProps {
  partner: {
    name: string;
    description: string;
    logo: string;
    yearsOfExperience: number;
  };
}
