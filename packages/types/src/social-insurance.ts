/**
 * Social Insurance (BHXH Tự nguyện) Type Definitions
 * "Quỹ An Sinh Lifestyle" - Lead Generation Model
 */

// ============================================================================
// Enums
// ============================================================================

/**
 * Source app (User/Driver/Merchant)
 */
export enum InsuranceSourceApp {
  USER = 'USER', // App người dùng
  DRIVER = 'DRIVER', // App tài xế
  MERCHANT = 'MERCHANT', // App merchant/chủ cửa hàng
}

/**
 * Lead status (Funnel stages)
 */
export enum InsuranceLeadStatus {
  DRAFT = 'DRAFT', // Mới bắt đầu điền form (chưa submit)
  PENDING = 'PENDING', // Đã submit, chờ assign agent
  CONSULTING = 'CONSULTING', // Đang được tư vấn
  VERIFIED = 'VERIFIED', // Đã xác minh hồ sơ
  SUBMITTED = 'SUBMITTED', // Đã nộp hồ sơ vào BHXH VN
  APPROVED = 'APPROVED', // Đã được BHXH VN phê duyệt
  ACTIVE = 'ACTIVE', // Đang đóng BHXH (active subscriber)
  REJECTED = 'REJECTED', // Bị từ chối
  CANCELLED = 'CANCELLED', // Khách hàng hủy
}

/**
 * Giới tính
 */
export enum Gender {
  MALE = 'MALE',
  FEMALE = 'FEMALE',
}

/**
 * Contribution level (Mức đóng BHXH theo % mức lương tối thiểu vùng)
 */
export enum ContributionLevel {
  LEVEL_1 = 'LEVEL_1', // 22% của 1x mức lương tối thiểu vùng
  LEVEL_2 = 'LEVEL_2', // 22% của 1.5x mức lương tối thiểu vùng
  LEVEL_3 = 'LEVEL_3', // 22% của 2x mức lương tối thiểu vùng
  LEVEL_4 = 'LEVEL_4', // 22% của 3x mức lương tối thiểu vùng
  LEVEL_5 = 'LEVEL_5', // 22% của 5x mức lương tối thiểu vùng
  LEVEL_6 = 'LEVEL_6', // 22% của 10x mức lương tối thiểu vùng
  LEVEL_7 = 'LEVEL_7', // 22% của 20x mức lương tối thiểu vùng (Max)
}

/**
 * Reminder frequency (Tần suất nhắc nhở đóng phí)
 */
export enum ReminderFrequency {
  MONTHLY = 'MONTHLY', // Hàng tháng
  QUARTERLY = 'QUARTERLY', // Hàng quý
  YEARLY = 'YEARLY', // Hàng năm
}

/**
 * Payment status (Trạng thái đóng phí)
 */
export enum PaymentStatus {
  PENDING = 'PENDING', // Chờ đóng
  PAID = 'PAID', // Đã đóng
  OVERDUE = 'OVERDUE', // Quá hạn
  CANCELLED = 'CANCELLED', // Đã hủy
}

/**
 * Agent role
 */
export enum AgentRole {
  TELESALES = 'TELESALES', // Telesales agent
  CONSULTANT = 'CONSULTANT', // Insurance consultant
  MANAGER = 'MANAGER', // Team manager
}

// ============================================================================
// Constants
// ============================================================================

/**
 * Mức lương tối thiểu vùng (2026)
 * Source: Nghị định của Chính phủ
 */
export const MINIMUM_WAGE = {
  REGION_1: 5500000, // Vùng 1: TP.HCM, Hà Nội (5.5 triệu)
  REGION_2: 4900000, // Vùng 2: Các thành phố lớn (4.9 triệu)
  REGION_3: 4300000, // Vùng 3: Tỉnh (4.3 triệu)
  REGION_4: 3800000, // Vùng 4: Miền núi (3.8 triệu)
} as const;

/**
 * Tỷ lệ đóng BHXH tự nguyện
 */
export const CONTRIBUTION_RATE = 0.22; // 22%

/**
 * Hỗ trợ của chính phủ (nếu có)
 * Theo chính sách, chính phủ có thể hỗ trợ 30-50% mức đóng cho một số đối tượng
 */
export const GOVERNMENT_SUPPORT = {
  NONE: 0, // Không hỗ trợ
  PARTIAL: 0.3, // Hỗ trợ 30%
  FULL: 0.5, // Hỗ trợ 50% (cho hộ nghèo, cận nghèo)
} as const;

/**
 * Tuổi nghỉ hưu (theo quy định hiện hành + lộ trình tăng)
 */
export const RETIREMENT_AGE = {
  MALE: {
    2026: 61,
    2027: 61.25,
    2028: 61.5,
    2029: 61.75,
    2030: 62, // Tuổi nghỉ hưu cuối cùng
  },
  FEMALE: {
    2026: 59,
    2027: 59.25,
    2028: 59.5,
    2029: 59.75,
    2030: 60, // Tuổi nghỉ hưu cuối cùng
  },
} as const;

/**
 * Thời gian đóng tối thiểu để nhận lương hưu
 */
export const MIN_CONTRIBUTION_YEARS = 20; // Tối thiểu 20 năm

// ============================================================================
// Interfaces
// ============================================================================

/**
 * Insurance Lead (Khách hàng tiềm năng)
 */
export interface InsuranceLead {
  id: string;
  leadNumber: string; // LS-BHXH-240214-001
  
  // Source
  userId?: string; // ID người dùng (nếu đã có tài khoản)
  sourceApp: InsuranceSourceApp;
  
  // Basic info (Step 1: Pre-check)
  fullName: string;
  gender: Gender;
  dateOfBirth: Date;
  age: number; // Tính tự động
  idNumber: string; // CMND/CCCD
  phone: string;
  email?: string;
  address?: string;
  
  // Preferences
  desiredMonthlyPension?: number; // Mức lương hưu mong muốn (VND/tháng)
  desiredContributionLevel?: ContributionLevel; // Mức đóng mong muốn
  
  // Calculation results (Step 2: Calculator output)
  calculationResults?: CalculationResults;
  
  // Status & Assignment
  status: InsuranceLeadStatus;
  assignedAgentId?: string; // ID agent được assign
  assignedAt?: Date;
  
  // Verification
  verifiedAt?: Date;
  verifiedBy?: string; // Agent ID
  
  // Submission to BHXH VN
  submittedAt?: Date;
  bhxhApplicationNumber?: string; // Số hồ sơ BHXH VN
  
  // Approval
  approvedAt?: Date;
  bhxhMemberNumber?: string; // Số sổ BHXH
  
  // Active subscription (if approved)
  activeSubscription?: ActiveSubscription;
  
  // Notes & Communication
  notes?: string[]; // Ghi chú nội bộ
  communicationLogs?: CommunicationLog[]; // Lịch sử liên hệ
  
  // Metadata
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Calculation results (Output của calculator)
 */
export interface CalculationResults {
  // Input
  contributionLevel: ContributionLevel;
  monthlyContribution: number; // Số tiền đóng hàng tháng (VND)
  governmentSupport: number; // Hỗ trợ chính phủ (%)
  
  // Output
  retirementAge: number; // Tuổi nghỉ hưu dự kiến
  yearsToRetirement: number; // Số năm còn lại đến nghỉ hưu
  totalContributionYears: number; // Tổng số năm đóng (dự kiến)
  
  // Pension calculation
  estimatedMonthlyPension: number; // Lương hưu ước tính (VND/tháng)
  pensionReplacementRate: number; // Tỷ lệ thay thế (% của mức đóng)
  
  // Health insurance benefits
  healthInsuranceValue: number; // Giá trị BHYT (VND/năm)
  
  // Totals
  totalContributionAmount: number; // Tổng số tiền đóng đến nghỉ hưu
  netContributionAfterSupport: number; // Sau khi trừ hỗ trợ chính phủ
  
  // ROI & Payback
  estimatedPaybackYears: number; // Số năm nhận lương hưu để hoàn vốn
  estimatedLifetimePension: number; // Tổng lương hưu nhận đến 80 tuổi
  roi: number; // ROI (%)
  
  // Breakdown
  breakdown: CalculationBreakdown;
  
  // Calculated at
  calculatedAt: Date;
}

/**
 * Calculation breakdown (Chi tiết tính toán)
 */
export interface CalculationBreakdown {
  baseWage: number; // Mức lương cơ sở (1x, 1.5x, 2x, etc. of minimum wage)
  contributionRate: number; // Tỷ lệ đóng (22%)
  monthlyContribution: number; // Đóng hàng tháng
  governmentSupportAmount: number; // Hỗ trợ chính phủ (VND/tháng)
  netMonthlyContribution: number; // Đóng sau hỗ trợ
  
  // Accumulation
  yearlyContribution: number; // Đóng hàng năm
  totalYears: number; // Tổng số năm đóng
  totalContribution: number; // Tổng đóng
  
  // Pension calculation formula
  averageWage: number; // Mức lương bình quân
  pensionPercentage: number; // Tỷ lệ hưởng (45% + 2%/năm vượt 15 năm, max 75%)
  monthlyPension: number; // Lương hưu hàng tháng
}

/**
 * Active subscription (Đăng ký đang hoạt động)
 */
export interface ActiveSubscription {
  leadId: string;
  bhxhMemberNumber: string; // Số sổ BHXH
  
  // Contribution details
  contributionLevel: ContributionLevel;
  monthlyContribution: number; // Đóng hàng tháng
  governmentSupport: number; // % hỗ trợ
  
  // Payment schedule
  paymentFrequency: ReminderFrequency;
  nextPaymentDue: Date;
  lastPaymentDate?: Date;
  
  // History
  startDate: Date; // Ngày bắt đầu đóng
  totalMonthsPaid: number; // Tổng số tháng đã đóng
  totalYearsPaid: number; // Tổng số năm đã đóng (tính theo công thức)
  
  // Status
  isActive: boolean;
  isPaused: boolean; // Tạm dừng (nếu có)
  pausedReason?: string;
  
  // Reminders
  reminderEnabled: boolean;
  reminderFrequency: ReminderFrequency;
  lastReminderSent?: Date;
  
  // Payments
  payments: Payment[];
  
  // Metadata
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Payment record (Bản ghi đóng phí)
 */
export interface Payment {
  id: string;
  subscriptionId: string;
  
  // Payment details
  period: string; // '2026-01' (tháng 1/2026)
  dueDate: Date;
  paidDate?: Date;
  amount: number;
  status: PaymentStatus;
  
  // Proof
  receiptNumber?: string; // Số biên lai BHXH
  receiptUrl?: string; // Link ảnh biên lai
  
  // Metadata
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Communication log (Lịch sử liên hệ)
 */
export interface CommunicationLog {
  id: string;
  leadId: string;
  
  // Communication details
  type: 'CALL' | 'SMS' | 'EMAIL' | 'CHAT'; // Loại liên lạc
  direction: 'INBOUND' | 'OUTBOUND'; // Hướng (khách gọi vào hay agent gọi ra)
  
  // Content
  subject?: string; // Tiêu đề (cho email)
  message?: string; // Nội dung
  
  // Participants
  agentId?: string; // Agent thực hiện
  agentName?: string;
  
  // Status
  status: 'PENDING' | 'COMPLETED' | 'FAILED'; // Trạng thái
  
  // Results
  outcome?: string; // Kết quả cuộc gọi (e.g., "Khách quan tâm", "Hẹn gọi lại")
  nextAction?: string; // Hành động tiếp theo
  nextActionDate?: Date; // Ngày hẹn tiếp theo
  
  // Metadata
  createdAt: Date;
  createdBy: string; // User ID hoặc Agent ID
}

/**
 * Agent (Đại lý/Tư vấn viên)
 */
export interface Agent {
  id: string;
  agentCode: string; // LS-AGENT-001
  
  // Personal info
  fullName: string;
  email: string;
  phone: string;
  
  // Role & Team
  role: AgentRole;
  teamId?: string;
  managerId?: string; // ID của manager
  
  // Stats
  totalLeads: number; // Tổng số leads
  activeLeads: number; // Số leads đang xử lý
  convertedLeads: number; // Số leads đã chuyển đổi
  conversionRate: number; // Tỷ lệ chuyển đổi (%)
  
  // Status
  isActive: boolean;
  
  // Metadata
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Q&A item (Câu hỏi thường gặp)
 */
export interface QAItem {
  id: string;
  question: string;
  answer: string; // HTML or Markdown
  category: string; // 'BENEFITS' | 'CONTRIBUTIONS' | 'RETIREMENT' | 'HEALTH_INSURANCE' | 'PROCEDURES'
  order: number; // Thứ tự hiển thị
  isPopular: boolean; // Câu hỏi phổ biến
  viewCount: number; // Số lượt xem
}

/**
 * Campaign (Chiến dịch marketing)
 */
export interface Campaign {
  id: string;
  name: string;
  
  // Targeting
  targetApp: InsuranceSourceApp | 'ALL'; // App nào
  targetAudience: string; // Mô tả đối tượng
  
  // Messaging
  headline: string; // "Tích lũy thảnh thơi" / "Của để dành cho nghề tự do" / etc.
  description: string;
  
  // Creative
  bannerUrl?: string;
  videoUrl?: string;
  
  // CTA
  ctaText: string; // "Tính ngay quyền lợi" / "Đăng ký tư vấn" / etc.
  ctaUrl: string; // Deep link
  
  // Period
  startDate: Date;
  endDate: Date;
  
  // Metrics
  impressions: number;
  clicks: number;
  leads: number;
  conversions: number;
  ctr: number; // Click-through rate
  conversionRate: number;
  
  // Status
  isActive: boolean;
  
  // Metadata
  createdAt: Date;
  updatedAt: Date;
}

// ============================================================================
// Calculator Types
// ============================================================================

/**
 * Calculator input
 */
export interface SocialInsuranceCalculatorInput {
  // Personal info
  gender: Gender;
  dateOfBirth: Date; // hoặc age
  
  // Current status
  hasExistingBHXH: boolean; // Đã có sổ BHXH chưa
  existingContributionYears?: number; // Số năm đã đóng (nếu có)
  
  // Desired level
  contributionLevel: ContributionLevel; // Mức đóng mong muốn
  
  // Region (for minimum wage calculation)
  region: 'REGION_1' | 'REGION_2' | 'REGION_3' | 'REGION_4';
  
  // Support
  governmentSupportLevel: keyof typeof GOVERNMENT_SUPPORT; // 'NONE' | 'PARTIAL' | 'FULL'
}

/**
 * Calculator output
 */
export interface SocialInsuranceCalculatorOutput {
  // Input summary
  input: SocialInsuranceCalculatorInput;
  
  // Key results
  monthlyContribution: number; // Đóng hàng tháng
  estimatedMonthlyPension: number; // Lương hưu ước tính
  healthInsuranceValue: number; // Giá trị BHYT
  
  // Detailed results
  results: CalculationResults;
  
  // Recommendations
  recommendations: string[]; // Gợi ý (e.g., "Nên đóng mức cao hơn để có lương hưu tốt hơn")
  
  // Calculated at
  calculatedAt: Date;
}

/**
 * Comparison (So sánh các mức đóng)
 */
export interface ContributionLevelComparison {
  levels: ContributionLevelComparisonItem[];
}

export interface ContributionLevelComparisonItem {
  level: ContributionLevel;
  levelName: string; // "Mức 1", "Mức 2", etc.
  monthlyContribution: number;
  monthlyPension: number;
  roi: number;
  recommended: boolean; // Gợi ý
}

// ============================================================================
// API Types
// ============================================================================

/**
 * Request: Create lead (Step 1)
 */
export interface CreateInsuranceLeadRequest {
  sourceApp: InsuranceSourceApp;
  userId?: string;
  
  fullName: string;
  gender: Gender;
  dateOfBirth: Date;
  idNumber: string;
  phone: string;
  email?: string;
  
  desiredMonthlyPension?: number;
  desiredContributionLevel?: ContributionLevel;
}

export interface CreateInsuranceLeadResponse {
  lead: InsuranceLead;
}

/**
 * Request: Calculate (Step 2)
 */
export interface CalculateSocialInsuranceRequest {
  input: SocialInsuranceCalculatorInput;
}

export interface CalculateSocialInsuranceResponse {
  output: SocialInsuranceCalculatorOutput;
}

/**
 * Request: Submit lead (Step 3 - Request consultation)
 */
export interface SubmitInsuranceLeadRequest {
  leadId: string;
  calculationResults: CalculationResults; // Kết quả từ calculator
  notes?: string; // Ghi chú từ khách hàng
}

export interface SubmitInsuranceLeadResponse {
  lead: InsuranceLead;
  message: string; // "Cảm ơn! Chúng tôi sẽ liên hệ trong 24h"
  estimatedCallbackTime: Date; // Thời gian dự kiến gọi lại
}

/**
 * Request: Assign lead to agent (For dashboard)
 */
export interface AssignLeadToAgentRequest {
  leadId: string;
  agentId: string;
}

export interface AssignLeadToAgentResponse {
  lead: InsuranceLead;
  agent: Agent;
}

/**
 * Request: Update lead status
 */
export interface UpdateLeadStatusRequest {
  leadId: string;
  status: InsuranceLeadStatus;
  notes?: string;
}

export interface UpdateLeadStatusResponse {
  lead: InsuranceLead;
}

/**
 * Request: Get my subscription (For active subscribers)
 */
export interface GetMySubscriptionRequest {
  userId: string;
}

export interface GetMySubscriptionResponse {
  subscription: ActiveSubscription | null;
  nextPaymentDue?: Date;
  paymentHistory: Payment[];
}

/**
 * Request: Record payment
 */
export interface RecordPaymentRequest {
  subscriptionId: string;
  period: string; // '2026-01'
  paidDate: Date;
  amount: number;
  receiptNumber?: string;
  receiptUrl?: string;
}

export interface RecordPaymentResponse {
  payment: Payment;
  subscription: ActiveSubscription;
}

/**
 * Request: Get Q&A
 */
export interface GetQARequest {
  category?: string;
  limit?: number;
}

export interface GetQAResponse {
  items: QAItem[];
  total: number;
}

/**
 * Request: Get campaigns
 */
export interface GetCampaignsRequest {
  sourceApp?: InsuranceSourceApp;
  isActive?: boolean;
}

export interface GetCampaignsResponse {
  campaigns: Campaign[];
}

// ============================================================================
// UI Component Props
// ============================================================================

/**
 * Props for Hero banner (App-specific)
 */
export interface SocialInsuranceHeroProps {
  sourceApp: InsuranceSourceApp;
  headline: string; // "Tích lũy thảnh thơi" | "Của để dành cho nghề tự do" | "Phúc lợi cho chủ hộ KD"
  description: string;
  onGetStarted: () => void;
}

/**
 * Props for Calculator widget
 */
export interface SocialInsuranceCalculatorProps {
  onCalculate: (input: SocialInsuranceCalculatorInput) => void;
  result?: SocialInsuranceCalculatorOutput;
  loading?: boolean;
}

/**
 * Props for Lead form
 */
export interface InsuranceLeadFormProps {
  sourceApp: InsuranceSourceApp;
  onSubmit: (request: CreateInsuranceLeadRequest) => void;
  loading?: boolean;
}

/**
 * Props for Consultation CTA
 */
export interface ConsultationCTAProps {
  leadId: string;
  calculationResults: CalculationResults;
  onSubmit: (request: SubmitInsuranceLeadRequest) => void;
  loading?: boolean;
}
