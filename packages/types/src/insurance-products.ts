/**
 * Insurance Products Type Definitions
 * Bảo hiểm phi nhân thọ (TNDS & Vật chất xe)
 */

// ============================================================================
// Enums
// ============================================================================

/**
 * Loại bảo hiểm
 */
export enum InsuranceProductType {
  TNDS_MANDATORY = 'TNDS_MANDATORY', // TNDS bắt buộc
  VEHICLE_PHYSICAL = 'VEHICLE_PHYSICAL', // Vật chất xe (thân vỏ)
  PASSENGER_ACCIDENT = 'PASSENGER_ACCIDENT', // Tai nạn người ngồi trên xe
  TNDS_VOLUNTARY = 'TNDS_VOLUNTARY', // TNDS tự nguyện (tăng hạn mức)
}

/**
 * Nhóm xe
 */
export enum VehicleCategory {
  MOTORCYCLE = 'MOTORCYCLE', // Xe máy
  CAR_NON_COMMERCIAL = 'CAR_NON_COMMERCIAL', // Ô tô không kinh doanh
  CAR_COMMERCIAL = 'CAR_COMMERCIAL', // Ô tô kinh doanh vận tải
  TAXI = 'TAXI', // Taxi
  TRUCK = 'TRUCK', // Xe tải
}

/**
 * Loại xe máy
 */
export enum MotorcycleType {
  UNDER_50CC = 'UNDER_50CC', // Dưới 50cc, xe điện
  OVER_50CC = 'OVER_50CC', // Trên 50cc
  THREE_WHEEL = 'THREE_WHEEL', // Mô tô 3 bánh
}

/**
 * Loại ô tô (theo số chỗ ngồi)
 */
export enum CarType {
  UNDER_6_SEATS = 'UNDER_6_SEATS', // Dưới 6 chỗ
  FROM_6_TO_11_SEATS = 'FROM_6_TO_11_SEATS', // 6-11 chỗ
  FROM_12_TO_24_SEATS = 'FROM_12_TO_24_SEATS', // 12-24 chỗ
  PICKUP = 'PICKUP', // Bán tải
  SEVEN_SEATS = 'SEVEN_SEATS', // 7 chỗ (kinh doanh)
  NINE_SEATS = 'NINE_SEATS', // 9 chỗ (kinh doanh)
  SIXTEEN_SEATS = 'SIXTEEN_SEATS', // 16 chỗ (kinh doanh)
}

/**
 * Loại xe tải (theo trọng tải)
 */
export enum TruckType {
  UNDER_3_TON = 'UNDER_3_TON', // Dưới 3 tấn
  FROM_3_TO_8_TON = 'FROM_3_TO_8_TON', // 3-8 tấn
  FROM_8_TO_15_TON = 'FROM_8_TO_15_TON', // 8-15 tấn
  OVER_15_TON = 'OVER_15_TON', // Trên 15 tấn
}

/**
 * Mức khấu trừ (cho bảo hiểm vật chất)
 */
export enum DeductibleAmount {
  DEDUCTIBLE_500K = 500000, // 500,000 VND/vụ
  DEDUCTIBLE_1M = 1000000, // 1,000,000 VND/vụ
  DEDUCTIBLE_2M = 2000000, // 2,000,000 VND/vụ
}

/**
 * Điều khoản bổ sung (cho bảo hiểm vật chất)
 */
export enum AdditionalCoverage {
  FLOOD_DAMAGE = 'FLOOD_DAMAGE', // Ngập nước (thủy kích)
  PARTS_THEFT = 'PARTS_THEFT', // Mất cắp bộ phận
  OFFICIAL_GARAGE = 'OFFICIAL_GARAGE', // Sửa chữa tại garage chính hãng
  TOTAL_LOSS = 'TOTAL_LOSS', // Mất cắp toàn bộ xe
}

/**
 * Trạng thái đơn hàng bảo hiểm
 */
export enum InsuranceOrderStatus {
  DRAFT = 'DRAFT', // Nháp (chưa hoàn thành thông tin)
  PENDING_PAYMENT = 'PENDING_PAYMENT', // Chờ thanh toán
  PAYMENT_CONFIRMED = 'PAYMENT_CONFIRMED', // Đã xác nhận thanh toán
  PENDING_SUBMISSION = 'PENDING_SUBMISSION', // Chờ khai báo lên hệ thống BH
  SUBMITTED = 'SUBMITTED', // Đã khai báo lên hệ thống BH
  ACTIVE = 'ACTIVE', // Đang hiệu lực
  EXPIRED = 'EXPIRED', // Hết hạn
  CANCELLED = 'CANCELLED', // Đã hủy
  REJECTED = 'REJECTED', // Bị từ chối (bởi công ty BH)
}

/**
 * Loại người mua
 */
export enum BuyerType {
  DRIVER = 'DRIVER', // Tài xế
  MERCHANT = 'MERCHANT', // Đối tác/Merchant
  CUSTOMER = 'CUSTOMER', // Khách hàng
}

/**
 * Phương thức thanh toán
 */
export enum PaymentMethod {
  BANK_TRANSFER = 'BANK_TRANSFER', // Chuyển khoản ngân hàng
  MOMO = 'MOMO', // Ví MoMo
  ZALOPAY = 'ZALOPAY', // ZaloPay
  VNPAY = 'VNPAY', // VNPay
  WALLET = 'WALLET', // Ví Lifestyle
}

// ============================================================================
// Insurance Tariff (Biểu phí TNDS bắt buộc - Nghị định 67/2023/NĐ-CP)
// ============================================================================

/**
 * Biểu phí TNDS bắt buộc (Đã bao gồm 10% VAT)
 */
export const TNDS_TARIFF = {
  // Xe máy
  MOTORCYCLE: {
    [MotorcycleType.UNDER_50CC]: 60500, // 60,500 VND
    [MotorcycleType.OVER_50CC]: 66000, // 66,000 VND
    [MotorcycleType.THREE_WHEEL]: 319000, // 319,000 VND
  },
  
  // Ô tô không kinh doanh
  CAR_NON_COMMERCIAL: {
    [CarType.UNDER_6_SEATS]: 480700, // 480,700 VND
    [CarType.FROM_6_TO_11_SEATS]: 873400, // 873,400 VND
    [CarType.FROM_12_TO_24_SEATS]: 1397000, // 1,397,000 VND
    [CarType.PICKUP]: 480700, // 480,700 VND
  },
  
  // Ô tô kinh doanh vận tải
  CAR_COMMERCIAL: {
    [CarType.UNDER_6_SEATS]: 831600, // 831,600 VND
    [CarType.SEVEN_SEATS]: 1188000, // 1,188,000 VND
    [CarType.NINE_SEATS]: 1544400, // 1,544,400 VND
    [CarType.SIXTEEN_SEATS]: 2224200, // 2,224,200 VND
  },
  
  // Taxi (170% phí xe kinh doanh cùng số chỗ)
  TAXI_SURCHARGE_RATE: 1.7,
  
  // Xe tải
  TRUCK: {
    [TruckType.UNDER_3_TON]: 938300, // 938,300 VND
    [TruckType.FROM_3_TO_8_TON]: 1826000, // 1,826,000 VND
    [TruckType.FROM_8_TO_15_TON]: 3020600, // 3,020,600 VND
    [TruckType.OVER_15_TON]: 3520000, // 3,520,000 VND
  },
} as const;

/**
 * Tỷ lệ phí bảo hiểm vật chất (theo % giá trị xe)
 */
export const VEHICLE_PHYSICAL_RATE = {
  MIN: 0.011, // 1.1% (xe mới, khấu trừ cao)
  STANDARD: 0.015, // 1.5% (trung bình)
  MAX: 0.018, // 1.8% (xe cũ, khấu trừ thấp, nhiều điều khoản)
} as const;

/**
 * Phí bảo hiểm tai nạn người ngồi trên xe
 */
export const PASSENGER_ACCIDENT_FEE = {
  MIN: 20000, // 20,000 VND/người/năm (mức đền bù 10 triệu)
  STANDARD: 35000, // 35,000 VND/người/năm (mức đền bù 30 triệu)
  MAX: 50000, // 50,000 VND/người/năm (mức đền bù 50 triệu)
} as const;

// ============================================================================
// Interfaces
// ============================================================================

/**
 * Sản phẩm bảo hiểm
 */
export interface InsuranceProduct {
  id: string;
  type: InsuranceProductType;
  name: string;
  shortDescription: string; // 300 ký tự - để tạo niềm tin
  fullDescription: string;
  
  // Quyền lợi
  benefits: InsuranceBenefit[];
  benefitsTable: BenefitsTable; // Bảng mô tả quyền lợi
  
  // Điều khoản
  terms: string; // HTML hoặc Markdown
  exclusions: string[]; // Những trường hợp không bồi thường
  
  // Media
  thumbnailUrl: string;
  bannerUrl?: string;
  videoUrl?: string; // Link video tư vấn từ chuyên viên
  brochureUrl?: string; // Link PDF brochure
  
  // Pricing
  isFixedPrice: boolean; // true cho TNDS, false cho vật chất (tính theo %)
  basePrice?: number; // Giá cố định (cho TNDS)
  ratePercent?: number; // Tỷ lệ % (cho vật chất)
  
  // Commission
  commissionRate: number; // Hoa hồng % (do công ty BH chi trả)
  commissionPaymentDays: number; // Số ngày sau khi hoàn thành hợp đồng
  
  // Metadata
  insuranceCompanyId: string; // ID công ty bảo hiểm
  insuranceCompanyName: string;
  
  status: 'ACTIVE' | 'INACTIVE';
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Quyền lợi bảo hiểm
 */
export interface InsuranceBenefit {
  id: string;
  icon: string; // Icon name hoặc emoji
  title: string;
  description: string;
  coverageAmount?: number; // Mức bồi thường (VND)
}

/**
 * Bảng quyền lợi (dạng table)
 */
export interface BenefitsTable {
  headers: string[]; // ['Quyền lợi', 'Mức bồi thường', 'Điều kiện']
  rows: BenefitRow[];
}

export interface BenefitRow {
  benefitName: string;
  coverageAmount: string; // "100 triệu VND" hoặc "Theo giá trị thực tế"
  conditions: string;
}

/**
 * Thông tin xe (cho form khai báo)
 */
export interface VehicleInfo {
  // Thông tin cơ bản
  plateNumber: string; // Biển số xe
  vehicleCategory: VehicleCategory;
  vehicleType: MotorcycleType | CarType | TruckType; // Tùy category
  
  // Thông tin chi tiết
  brand: string; // Hãng xe
  model: string; // Dòng xe
  year: number; // Năm sản xuất
  chassisNumber: string; // Số khung
  engineNumber: string; // Số máy
  
  // Giá trị xe (cho bảo hiểm vật chất)
  currentValue?: number; // Giá trị hiện tại (VND)
  
  // Giấy tờ (upload ảnh)
  registrationFrontUrl: string; // Ảnh giấy đăng ký xe mặt trước
  registrationBackUrl: string; // Ảnh giấy đăng ký xe mặt sau
  
  // Bảo hiểm trước đó
  previousInsuranceExpiry?: Date; // Ngày hết hạn BH cũ (để tính ngày hiệu lực)
  
  // Cho tài xế kinh doanh
  isCommercialVehicle: boolean; // Xe kinh doanh hay không
  businessLicenseUrl?: string; // Giấy phép kinh doanh vận tải
}

/**
 * Thông tin người mua
 */
export interface BuyerInfo {
  buyerType: BuyerType;
  
  // ID trong hệ thống (nếu có)
  userId?: string; // ID user/driver/merchant
  
  // Thông tin cá nhân
  fullName: string;
  idNumber: string; // CMND/CCCD
  idIssuedDate: Date;
  idIssuedPlace: string;
  dateOfBirth: Date;
  gender: 'MALE' | 'FEMALE';
  
  // Liên hệ
  phone: string;
  email: string;
  address: string;
  
  // Giấy tờ (upload ảnh)
  idFrontUrl: string; // Ảnh CMND/CCCD mặt trước
  idBackUrl: string; // Ảnh CMND/CCCD mặt sau
}

/**
 * Cấu hình bảo hiểm vật chất (tùy chọn)
 */
export interface VehiclePhysicalConfig {
  deductibleAmount: DeductibleAmount; // Mức khấu trừ
  additionalCoverages: AdditionalCoverage[]; // Các điều khoản bổ sung
  
  // Tính toán
  baseRate: number; // Tỷ lệ cơ bản (1.1% - 1.8%)
  rateAdjustments: RateAdjustment[]; // Các điều chỉnh tỷ lệ
  finalRate: number; // Tỷ lệ cuối cùng
}

export interface RateAdjustment {
  factor: string; // 'VEHICLE_AGE', 'DEDUCTIBLE', 'FLOOD_COVERAGE', etc.
  adjustment: number; // +0.2% hoặc -0.1%
  description: string;
}

/**
 * Calculator input (cho công cụ ước tính)
 */
export interface InsuranceCalculatorInput {
  // Loại bảo hiểm muốn tính
  productType: InsuranceProductType;
  
  // Thông tin xe (cơ bản)
  vehicleCategory: VehicleCategory;
  vehicleType: MotorcycleType | CarType | TruckType;
  
  // Cho bảo hiểm vật chất
  vehicleValue?: number; // Giá trị xe
  vehicleAge?: number; // Tuổi xe (năm)
  deductible?: DeductibleAmount;
  additionalCoverages?: AdditionalCoverage[];
  
  // Cho bảo hiểm tai nạn
  numberOfPassengers?: number; // Số người
  coverageLevel?: 'MIN' | 'STANDARD' | 'MAX'; // Mức bồi thường
}

/**
 * Calculator output (kết quả ước tính)
 */
export interface InsuranceCalculatorOutput {
  // Phí chính
  basePremium: number; // Phí cơ bản
  additionalFees: AdditionalFee[]; // Các phí bổ sung
  totalPremium: number; // Tổng phí (đã bao gồm VAT)
  
  // Breakdown
  breakdown: PremiumBreakdown;
  
  // Thông tin
  insuranceCompany: string;
  effectiveDate: Date; // Ngày hiệu lực (tự động tính)
  expiryDate: Date; // Ngày hết hạn (1 năm sau)
  
  // Gợi ý
  recommendations?: string[]; // Gợi ý điều chỉnh để giảm phí
}

export interface AdditionalFee {
  name: string;
  amount: number;
  description: string;
}

export interface PremiumBreakdown {
  basePremium: number; // Phí cơ bản
  vat: number; // 10% VAT (nếu chưa bao gồm)
  floodCoverage?: number; // Phí ngập nước
  partsTheft?: number; // Phí mất cắp bộ phận
  officialGarage?: number; // Phí sửa chữa chính hãng
  total: number; // Tổng
}

/**
 * Đơn hàng bảo hiểm
 */
export interface InsuranceOrder {
  id: string;
  orderNumber: string; // Mã đơn hàng (LS-INS-240214-001)
  
  // Sản phẩm
  productId: string;
  productType: InsuranceProductType;
  productName: string;
  
  // Người mua
  buyerInfo: BuyerInfo;
  
  // Thông tin xe
  vehicleInfo: VehicleInfo;
  
  // Cấu hình (cho vật chất)
  physicalConfig?: VehiclePhysicalConfig;
  
  // Pricing
  premium: number; // Phí bảo hiểm
  breakdown: PremiumBreakdown;
  commission: number; // Hoa hồng dự kiến
  
  // Thanh toán
  paymentMethod: PaymentMethod;
  paymentProofUrl?: string; // Ảnh chụp biên lai chuyển khoản
  paidAt?: Date;
  
  // Trạng thái
  status: InsuranceOrderStatus;
  
  // Xử lý
  assignedToUserId?: string; // Nhân viên vận hành được gán
  submittedAt?: Date; // Thời điểm khai báo lên hệ thống BH
  submittedBy?: string; // User ID của nhân viên
  
  // Certificate
  certificateNumber?: string; // Số chứng nhận BH
  certificatePdfUrl?: string; // Link PDF chứng nhận
  effectiveDate?: Date; // Ngày hiệu lực thực tế
  expiryDate?: Date; // Ngày hết hạn thực tế
  
  // Notifications
  emailSent: boolean;
  smsSent: boolean;
  
  // Metadata
  notes?: string; // Ghi chú nội bộ
  rejectionReason?: string; // Lý do từ chối (nếu có)
  
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Lịch sử giao dịch bảo hiểm (cho tài xế/merchant/user)
 */
export interface InsuranceHistory {
  userId: string;
  userType: BuyerType;
  
  // Danh sách đơn hàng
  orders: InsuranceOrder[];
  
  // Thống kê
  totalPurchased: number; // Tổng số đơn đã mua
  totalSpent: number; // Tổng chi phí
  activeContracts: number; // Số hợp đồng đang hiệu lực
}

/**
 * Reminder (nhắc nhở gia hạn)
 */
export interface InsuranceReminder {
  id: string;
  orderId: string;
  userId: string;
  
  vehiclePlateNumber: string;
  expiryDate: Date;
  
  // Nhắc nhở
  reminderDate: Date; // Ngày nhắc nhở (7 ngày trước hết hạn)
  reminded: boolean;
  remindedAt?: Date;
  
  // Renewal
  renewalOrderId?: string; // ID đơn hàng gia hạn (nếu đã gia hạn)
}

// ============================================================================
// API Types
// ============================================================================

/**
 * Request: Lấy danh sách sản phẩm bảo hiểm
 */
export interface GetInsuranceProductsRequest {
  type?: InsuranceProductType; // Filter theo loại
  category?: VehicleCategory; // Filter theo nhóm xe
  page?: number;
  limit?: number;
}

export interface GetInsuranceProductsResponse {
  products: InsuranceProduct[];
  total: number;
  page: number;
  limit: number;
}

/**
 * Request: Calculate premium
 */
export interface CalculatePremiumRequest {
  input: InsuranceCalculatorInput;
}

export interface CalculatePremiumResponse {
  output: InsuranceCalculatorOutput;
}

/**
 * Request: Tạo đơn hàng bảo hiểm
 */
export interface CreateInsuranceOrderRequest {
  productId: string;
  buyerInfo: BuyerInfo;
  vehicleInfo: VehicleInfo;
  physicalConfig?: VehiclePhysicalConfig;
  paymentMethod: PaymentMethod;
}

export interface CreateInsuranceOrderResponse {
  order: InsuranceOrder;
  paymentInfo?: {
    bankName: string;
    accountNumber: string;
    accountName: string;
    amount: number;
    transferContent: string; // Nội dung chuyển khoản
    qrCodeUrl?: string; // QR code chuyển khoản
  };
}

/**
 * Request: Upload payment proof
 */
export interface UploadPaymentProofRequest {
  orderId: string;
  paymentProofUrl: string; // URL ảnh biên lai đã upload
}

export interface UploadPaymentProofResponse {
  order: InsuranceOrder;
  message: string; // "Đã xác nhận thanh toán. Chứng nhận BH sẽ được gửi qua email trong 24h."
}

/**
 * Request: Submit to insurance company (cho nhân viên vận hành)
 */
export interface SubmitToInsuranceCompanyRequest {
  orderId: string;
  certificateNumber: string; // Số chứng nhận BH từ hệ thống công ty
  certificatePdfUrl: string; // Link PDF chứng nhận
  effectiveDate: Date;
  expiryDate: Date;
  notes?: string;
}

export interface SubmitToInsuranceCompanyResponse {
  order: InsuranceOrder;
  message: string;
}

/**
 * Request: Get insurance history
 */
export interface GetInsuranceHistoryRequest {
  userId: string;
  userType: BuyerType;
}

export interface GetInsuranceHistoryResponse {
  history: InsuranceHistory;
}

/**
 * Request: Admin - Update tariff (cập nhật biểu phí khi chính sách thay đổi)
 */
export interface UpdateTariffRequest {
  category: VehicleCategory;
  type: string; // MotorcycleType | CarType | TruckType (as string)
  newPrice: number;
  effectiveDate: Date;
  notes: string; // Ghi chú về nghị định/quy định mới
}

export interface UpdateTariffResponse {
  success: boolean;
  message: string;
}

// ============================================================================
// UI Component Props
// ============================================================================

/**
 * Props cho Insurance Product Card
 */
export interface InsuranceProductCardProps {
  product: InsuranceProduct;
  onLearnMore: (productId: string) => void;
  onBuyNow: (productId: string) => void;
}

/**
 * Props cho Premium Calculator Widget
 */
export interface PremiumCalculatorProps {
  onCalculate: (input: InsuranceCalculatorInput) => void;
  result?: InsuranceCalculatorOutput;
  loading?: boolean;
}

/**
 * Props cho Insurance Order Form (multi-step)
 */
export interface InsuranceOrderFormProps {
  productId: string;
  buyerType: BuyerType;
  userId?: string; // Auto-fill info nếu có
  onSubmit: (request: CreateInsuranceOrderRequest) => void;
  loading?: boolean;
}
