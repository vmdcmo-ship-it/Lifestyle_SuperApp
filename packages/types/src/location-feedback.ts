/**
 * Location Feedback & PDCA System
 * For GPS accuracy improvement and address validation
 */

// ==================== ENUMS ====================

export enum LocationIssueType {
  GPS_INACCURATE = 'GPS_INACCURATE', // GPS sai vị trí
  ADDRESS_WRONG = 'ADDRESS_WRONG', // Địa chỉ sai hoàn toàn
  ADDRESS_INCOMPLETE = 'ADDRESS_INCOMPLETE', // Địa chỉ thiếu thông tin
  GEOCODING_ERROR = 'GEOCODING_ERROR', // Lỗi chuyển địa chỉ → tọa độ
  BUILDING_ENTRANCE_WRONG = 'BUILDING_ENTRANCE_WRONG', // Sai lối vào building
  APARTMENT_BLOCK_WRONG = 'APARTMENT_BLOCK_WRONG', // Sai block chung cư
  LANDMARK_MISMATCH = 'LANDMARK_MISMATCH', // Landmark không khớp
  STREET_NUMBER_CONFUSION = 'STREET_NUMBER_CONFUSION', // Nhầm số nhà với số đường
}

export enum FeedbackStatus {
  PENDING = 'PENDING', // Chờ xét duyệt
  VERIFIED = 'VERIFIED', // Đã xác minh (bởi nhiều driver)
  APPLIED = 'APPLIED', // Đã áp dụng vào hệ thống
  REJECTED = 'REJECTED', // Bị từ chối (không chính xác)
  DUPLICATE = 'DUPLICATE', // Trùng lặp với feedback khác
}

export enum AddressValidationLevel {
  VALID = 'VALID', // Địa chỉ hợp lệ
  WARNING = 'WARNING', // Cảnh báo (có thể sai)
  ERROR = 'ERROR', // Lỗi (chắc chắn sai)
  NEEDS_CLARIFICATION = 'NEEDS_CLARIFICATION', // Cần làm rõ
}

export enum AddressType {
  APARTMENT = 'APARTMENT', // Chung cư
  HOUSE = 'HOUSE', // Nhà riêng
  OFFICE = 'OFFICE', // Văn phòng
  SHOP = 'SHOP', // Cửa hàng
  HOTEL = 'HOTEL', // Khách sạn
  SCHOOL = 'SCHOOL', // Trường học
  HOSPITAL = 'HOSPITAL', // Bệnh viện
  OTHER = 'OTHER',
}

// ==================== LOCATION FEEDBACK ====================

/**
 * Location Feedback from Driver
 * Driver báo cáo khi GPS/địa chỉ sai
 */
export interface LocationFeedback {
  id: string;
  orderId: string;
  driverId: string;
  customerId: string;
  
  // Issue details
  issueType: LocationIssueType;
  severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  
  // Original location (from customer)
  originalAddress: string;
  originalLocation: {
    latitude: number;
    longitude: number;
    accuracy?: number; // meters
    source: 'GPS' | 'GEOCODING' | 'MANUAL';
  };
  
  // Corrected location (from driver)
  correctedAddress?: string;
  correctedLocation: {
    latitude: number;
    longitude: number;
    accuracy: number;
    source: 'DRIVER_GPS' | 'DRIVER_MANUAL';
  };
  
  // Distance difference
  distanceError: number; // meters (300m+)
  
  // Evidence
  driverNotes?: string; // Driver's explanation
  photos?: string[]; // Photos of actual location
  timestamp: Date;
  
  // Additional context
  landmark?: string; // Địa điểm gần đó
  buildingName?: string;
  floorNumber?: string;
  apartmentNumber?: string;
  blockNumber?: string;
  
  // Verification
  status: FeedbackStatus;
  verifiedBy?: string[]; // Other driver IDs who confirmed
  verificationCount: number;
  appliedAt?: Date;
  
  // ML Training
  usedForTraining: boolean; // Đã dùng để train ML model chưa
  confidence: number; // 0-1, độ tin cậy của correction
}

/**
 * Location Feedback Request (from Driver)
 */
export interface SubmitLocationFeedbackRequest {
  orderId: string;
  issueType: LocationIssueType;
  
  // Corrected location
  correctedLatitude: number;
  correctedLongitude: number;
  correctedAddress?: string;
  
  // Context
  driverNotes?: string;
  photos?: File[]; // Base64 or File objects
  landmark?: string;
  buildingName?: string;
  apartmentDetails?: {
    floor?: string;
    apartment?: string;
    block?: string;
  };
}

/**
 * Location Feedback Statistics
 */
export interface LocationFeedbackStats {
  totalFeedbacks: number;
  pendingFeedbacks: number;
  verifiedFeedbacks: number;
  appliedFeedbacks: number;
  
  // By issue type
  issueTypeBreakdown: Record<LocationIssueType, number>;
  
  // Average distance error
  avgDistanceError: number; // meters
  maxDistanceError: number; // meters
  
  // Top problematic addresses
  topProblematicAreas: ProblematicArea[];
  
  // Improvement metrics
  accuracyImprovement: number; // % improvement after corrections
  reductionInErrors: number; // % reduction in errors
}

export interface ProblematicArea {
  area: string; // District, ward
  errorCount: number;
  avgError: number; // meters
  commonIssue: LocationIssueType;
}

// ==================== ADDRESS VALIDATION ====================

/**
 * Address Validation Result
 * Real-time validation khi user nhập địa chỉ
 */
export interface AddressValidationResult {
  isValid: boolean;
  level: AddressValidationLevel;
  
  // Parsed address components
  components: AddressComponents;
  
  // Issues detected
  issues: AddressIssue[];
  
  // Suggestions
  suggestions: AddressSuggestion[];
  
  // Geocoding result
  geocoding: {
    latitude: number;
    longitude: number;
    accuracy: number; // meters
    confidence: number; // 0-1
    source: 'GOOGLE' | 'OPENSTREETMAP' | 'HERE' | 'INTERNAL';
  };
  
  // Similar addresses (for disambiguation)
  similarAddresses?: SimilarAddress[];
}

/**
 * Address Components
 * Phân tích địa chỉ thành các thành phần
 */
export interface AddressComponents {
  // For apartments/buildings
  apartmentNumber?: string; // A123, 1205, etc.
  floor?: string; // Tầng 12, Floor 5
  block?: string; // Block B, Toà S1
  buildingName?: string; // Vinhomes, The Manor, etc.
  
  // Street address
  streetNumber?: string; // 123, 456
  streetName?: string; // Nguyễn Văn Linh, Lê Lợi
  
  // Administrative divisions
  ward?: string; // Phường, Xã
  district?: string; // Quận, Huyện
  city?: string; // TP.HCM, Hà Nội
  
  // Additional
  landmark?: string; // Gần BigC, Đối diện Lotte
  postalCode?: string;
  
  // Detected type
  addressType: AddressType;
}

/**
 * Address Issue
 * Vấn đề phát hiện trong địa chỉ
 */
export interface AddressIssue {
  type: 'ERROR' | 'WARNING' | 'INFO';
  code: string;
  message: string;
  field?: keyof AddressComponents;
  
  // Explanation
  explanation: string;
  
  // How to fix
  solution?: string;
  
  // Examples
  examples?: string[];
}

/**
 * Address Suggestion
 * Gợi ý sửa địa chỉ
 */
export interface AddressSuggestion {
  type: 'CORRECTION' | 'COMPLETION' | 'ALTERNATIVE';
  suggestedAddress: string;
  components: AddressComponents;
  confidence: number; // 0-1
  reason: string;
}

/**
 * Similar Address
 * Địa chỉ tương tự (để user chọn)
 */
export interface SimilarAddress {
  address: string;
  components: AddressComponents;
  distance: number; // meters from geocoded location
  matchScore: number; // 0-1
}

// ==================== ADDRESS PATTERNS ====================

/**
 * Address Pattern
 * Pattern phổ biến gây lỗi
 */
export interface AddressPattern {
  id: string;
  name: string;
  description: string;
  
  // Pattern detection
  regex: string;
  keywords: string[];
  
  // Issue
  commonIssue: LocationIssueType;
  errorRate: number; // % of addresses matching this pattern that have errors
  
  // Examples
  exampleWrong: string;
  exampleCorrect: string;
  
  // Solution
  validationRule: string;
  correctionHint: string;
}

/**
 * Common Problematic Patterns
 */
export const PROBLEMATIC_PATTERNS: AddressPattern[] = [
  {
    id: 'apartment-street-confusion',
    name: 'Nhầm căn hộ với số đường',
    description: 'User nhập số căn hộ, hệ thống hiểu thành số đường',
    regex: '^[A-Z]?\\d{3,4}\\s+(Block|Toà|Tower)\\s+[A-Z0-9]+\\s+\\d+',
    keywords: ['Block', 'Toà', 'Tower', 'Chung cư', 'Vinhomes', 'Masteri'],
    commonIssue: LocationIssueType.STREET_NUMBER_CONFUSION,
    errorRate: 0.75,
    exampleWrong: 'A123 Block B Vinhomes 123 Nguyễn Văn Linh',
    exampleCorrect: 'Căn A123, Block B, Vinhomes, 123 Nguyễn Văn Linh',
    validationRule: 'If apartment + block + street number → Separate with commas',
    correctionHint: 'Thêm "Căn" trước số căn hộ, dùng dấu phẩy phân cách',
  },
  // More patterns will be added dynamically via ML
];

// ==================== PDCA CYCLE ====================

/**
 * PDCA Cycle Record
 * Theo dõi chu trình cải tiến
 */
export interface PDCACycle {
  id: string;
  cycleNumber: number;
  startDate: Date;
  endDate?: Date;
  status: 'PLANNING' | 'DOING' | 'CHECKING' | 'ACTING' | 'COMPLETED';
  
  // Plan
  plan: {
    goal: string; // "Reduce GPS errors by 30%"
    targetMetrics: PDCAMetrics;
    actions: string[];
  };
  
  // Do
  do: {
    implementedActions: string[];
    feedbacksCollected: number;
    dataPointsGathered: number;
  };
  
  // Check
  check: {
    actualMetrics: PDCAMetrics;
    comparison: MetricComparison;
    successRate: number; // %
    findings: string[];
  };
  
  // Act
  act: {
    decisions: string[];
    standardize?: string[]; // What to standardize
    improve?: string[]; // What to improve further
    nextCycleGoals?: string[];
  };
  
  // Results
  overallImprovement: number; // %
  lessonsLearned: string[];
}

export interface PDCAMetrics {
  avgGPSError: number; // meters
  errorRate: number; // % of orders with GPS errors
  feedbackVolume: number; // Number of driver feedbacks
  customerComplaints: number;
  addressValidationSuccessRate: number; // %
}

export interface MetricComparison {
  metric: keyof PDCAMetrics;
  before: number;
  after: number;
  change: number; // % change
  isImprovement: boolean;
}

// ==================== ML MODEL ====================

/**
 * Address Correction ML Model
 */
export interface AddressCorrectionModel {
  modelId: string;
  version: string;
  trainedAt: Date;
  
  // Training data
  trainingDataSize: number;
  features: string[]; // Input features
  
  // Performance
  accuracy: number; // %
  precision: number; // %
  recall: number; // %
  f1Score: number;
  
  // Predictions
  totalPredictions: number;
  correctPredictions: number;
  
  // Model metadata
  algorithm: 'RANDOM_FOREST' | 'NEURAL_NETWORK' | 'GRADIENT_BOOSTING';
  hyperparameters: Record<string, any>;
}

/**
 * Address Prediction Request
 */
export interface AddressPredictionRequest {
  rawAddress: string;
  userContext?: {
    userId: string;
    previousAddresses?: string[];
    deviceLocation?: {
      latitude: number;
      longitude: number;
    };
  };
}

/**
 * Address Prediction Response
 */
export interface AddressPredictionResponse {
  correctedAddress: string;
  components: AddressComponents;
  confidence: number; // 0-1
  
  // Geocoding
  latitude: number;
  longitude: number;
  accuracy: number;
  
  // Issues detected & fixed
  issuesFixed: string[];
  
  // Alternative interpretations
  alternatives?: AddressPredictionResponse[];
}

// ==================== USER GUIDANCE ====================

/**
 * Address Input Guidelines
 * Hướng dẫn cho user khi nhập địa chỉ
 */
export interface AddressInputGuidelines {
  addressType: AddressType;
  
  // Required fields
  requiredFields: string[];
  
  // Format
  formatExample: string;
  formatTemplate: string;
  
  // Tips
  tips: AddressInputTip[];
  
  // Common mistakes
  commonMistakes: CommonMistake[];
  
  // Interactive helper
  placeholders: Record<string, string>;
}

export interface AddressInputTip {
  icon: string;
  title: string;
  description: string;
  example?: string;
}

export interface CommonMistake {
  mistake: string;
  correction: string;
  explanation: string;
}

// ==================== REPORTING ====================

/**
 * Location Quality Report
 * Báo cáo chất lượng GPS/địa chỉ theo thời gian
 */
export interface LocationQualityReport {
  period: {
    startDate: Date;
    endDate: Date;
  };
  
  // Overall metrics
  totalOrders: number;
  ordersWithLocationIssues: number;
  issueRate: number; // %
  
  // Error distribution
  errorsByType: Record<LocationIssueType, number>;
  errorsByDistrict: Record<string, number>;
  errorsByTimeOfDay: Record<string, number>;
  
  // Driver feedback
  feedbackReceived: number;
  feedbackApplied: number;
  avgResponseTime: number; // hours to verify & apply
  
  // Impact
  distanceSavings: number; // Total meters saved
  costSavings: number; // VND saved
  customerSatisfactionImprovement: number; // %
  
  // ML model performance
  modelAccuracy: number; // %
  modelPredictions: number;
  modelCorrectPredictions: number;
  
  // PDCA cycles completed
  pdcaCyclesCompleted: number;
  overallImprovement: number; // %
}

// ==================== API TYPES ====================

export interface GetLocationFeedbacksResponse {
  feedbacks: LocationFeedback[];
  stats: LocationFeedbackStats;
  totalCount: number;
}

export interface ValidateAddressRequest {
  address: string;
  addressType?: AddressType;
  userLocation?: {
    latitude: number;
    longitude: number;
  };
}

export interface ValidateAddressResponse extends AddressValidationResult {
  guidelines: AddressInputGuidelines;
}
