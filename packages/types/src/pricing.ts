/**
 * AI Pricing Engine & Admin Ops Platform
 * Smart pricing with ML, external APIs, and goal-oriented management
 */

// ==================== ENUMS ====================

export enum ServiceType {
  FOOD_DELIVERY = 'FOOD_DELIVERY',
  RIDE_HAILING = 'RIDE_HAILING',
  PACKAGE_DELIVERY = 'PACKAGE_DELIVERY',
  SHOPPING = 'SHOPPING',
  EXPRESS = 'EXPRESS',
}

export enum VehicleType {
  BIKE = 'BIKE', // Xe máy
  CAR_4_SEAT = 'CAR_4_SEAT', // Xe 4 chỗ
  CAR_7_SEAT = 'CAR_7_SEAT', // Xe 7 chỗ
  TRUCK = 'TRUCK', // Xe tải nhỏ
}

export enum WeatherCondition {
  CLEAR = 'CLEAR', // Nắng
  CLOUDY = 'CLOUDY', // Mây
  RAIN_LIGHT = 'RAIN_LIGHT', // Mưa nhẹ
  RAIN_HEAVY = 'RAIN_HEAVY', // Mưa to
  STORM = 'STORM', // Bão
}

export enum TrafficLevel {
  FREE_FLOW = 'FREE_FLOW', // Thông thoáng
  LIGHT = 'LIGHT', // Nhẹ
  MODERATE = 'MODERATE', // Vừa phải
  HEAVY = 'HEAVY', // Đông
  CONGESTED = 'CONGESTED', // Tắc nghẽn
}

export enum DemandLevel {
  VERY_LOW = 'VERY_LOW',
  LOW = 'LOW',
  NORMAL = 'NORMAL',
  HIGH = 'HIGH',
  VERY_HIGH = 'VERY_HIGH',
  SURGE = 'SURGE', // Đột biến (Tết, events)
}

export enum PricingStrategy {
  COST_BASED = 'COST_BASED', // Dựa trên chi phí
  COMPETITIVE = 'COMPETITIVE', // Cạnh tranh với competitor
  VALUE_BASED = 'VALUE_BASED', // Dựa trên giá trị
  DYNAMIC = 'DYNAMIC', // Động (thời gian thực)
  PROMOTIONAL = 'PROMOTIONAL', // Khuyến mãi
}

export enum PromotionType {
  PERCENTAGE_DISCOUNT = 'PERCENTAGE_DISCOUNT', // Giảm %
  FIXED_DISCOUNT = 'FIXED_DISCOUNT', // Giảm cố định
  FREE_DELIVERY = 'FREE_DELIVERY', // Miễn phí vận chuyển
  CASHBACK = 'CASHBACK', // Hoàn tiền
  XU_BONUS = 'XU_BONUS', // Thưởng Xu
  BUNDLE = 'BUNDLE', // Mua kèm
  FIRST_ORDER = 'FIRST_ORDER', // Đơn đầu tiên
}

export enum PromotionStatus {
  DRAFT = 'DRAFT',
  SCHEDULED = 'SCHEDULED',
  ACTIVE = 'ACTIVE',
  PAUSED = 'PAUSED',
  ENDED = 'ENDED',
  CANCELLED = 'CANCELLED',
}

export enum TargetingCriteria {
  ALL_USERS = 'ALL_USERS',
  NEW_USERS = 'NEW_USERS',
  ACTIVE_USERS = 'ACTIVE_USERS',
  INACTIVE_USERS = 'INACTIVE_USERS', // Re-engagement
  VIP_USERS = 'VIP_USERS',
  LOCATION_BASED = 'LOCATION_BASED',
  SERVICE_BASED = 'SERVICE_BASED',
  BEHAVIORAL = 'BEHAVIORAL', // Based on user behavior
}

// ==================== PRICING PARAMETERS ====================

/**
 * Base Pricing Parameters
 * Tham số cơ bản để tính giá
 */
export interface BasePricingParams {
  serviceType: ServiceType;
  vehicleType?: VehicleType;
  
  // Distance-based
  baseDistance: number; // km (miễn phí)
  baseFare: number; // VND (giá cơ bản)
  pricePerKm: number; // VND/km
  
  // Time-based
  baseTime: number; // minutes (miễn phí)
  pricePerMinute: number; // VND/minute
  
  // Weight/Size-based (for delivery)
  maxWeight?: number; // kg
  pricePerKg?: number; // VND/kg
  
  // Minimum fare
  minFare: number; // VND
  
  // Maximum fare (safety)
  maxFare?: number; // VND
}

/**
 * Dynamic Pricing Multipliers
 * Hệ số điều chỉnh động
 */
export interface DynamicMultipliers {
  // Time-based multipliers
  peakHourMultiplier: number; // 1.2 = +20%
  nightShiftMultiplier: number; // After 10PM
  weekendMultiplier: number;
  holidayMultiplier: number;
  
  // Weather multipliers
  rainLightMultiplier: number; // 1.1 = +10%
  rainHeavyMultiplier: number; // 1.3 = +30%
  stormMultiplier: number; // 1.5 = +50%
  
  // Traffic multipliers
  trafficLightMultiplier: number; // 1.0 = no change
  trafficModerateMultiplier: number; // 1.1
  trafficHeavyMultiplier: number; // 1.2
  trafficCongestedMultiplier: number; // 1.4
  
  // Demand multipliers (surge pricing)
  demandHighMultiplier: number; // 1.2
  demandVeryHighMultiplier: number; // 1.5
  demandSurgeMultiplier: number; // 2.0
  
  // Supply multipliers
  lowSupplyMultiplier: number; // Ít driver available
  
  // Special events
  specialEventMultiplier?: number; // Concert, football match, etc.
}

/**
 * Geographic Pricing Zone
 * Giá theo khu vực
 */
export interface PricingZone {
  id: string;
  name: string; // "TP.HCM", "Hà Nội", "Đà Nẵng"
  
  // Geographic boundaries
  city: string;
  districts?: string[]; // Specific districts
  coordinates?: {
    // Polygon for map
    latitude: number;
    longitude: number;
  }[];
  
  // Base parameters for this zone
  basePricing: BasePricingParams;
  
  // Dynamic multipliers (can override global)
  dynamicMultipliers?: Partial<DynamicMultipliers>;
  
  // Competitor pricing (for reference)
  competitorPricing?: {
    grab?: number;
    gojek?: number;
    be?: number;
    shoppee?: number;
  };
  
  // Active
  isActive: boolean;
  effectiveFrom: Date;
  effectiveTo?: Date;
}

/**
 * Time-based Pricing Rule
 * Giá theo khung giờ
 */
export interface TimePricingRule {
  id: string;
  name: string; // "Giờ cao điểm sáng", "Giờ tan tầm"
  
  // Time range
  daysOfWeek: number[]; // 0=Sunday, 1=Monday, ..., 6=Saturday
  startTime: string; // "07:00"
  endTime: string; // "09:00"
  
  // Multiplier
  multiplier: number; // 1.3 = +30%
  
  // Priority (if multiple rules overlap)
  priority: number;
  
  isActive: boolean;
}

/**
 * Pricing Configuration
 * Cấu hình tổng thể cho một service
 */
export interface PricingConfig {
  id: string;
  serviceType: ServiceType;
  version: number; // For versioning
  
  // Base pricing
  basePricing: BasePricingParams;
  
  // Dynamic multipliers (global defaults)
  dynamicMultipliers: DynamicMultipliers;
  
  // Geographic zones
  zones: PricingZone[];
  
  // Time-based rules
  timeRules: TimePricingRule[];
  
  // Strategy
  strategy: PricingStrategy;
  
  // AI/ML settings
  enableAIPricing: boolean;
  aiModelVersion?: string;
  
  // Safety limits
  maxSurgeMultiplier: number; // 3.0 = max 3x surge
  minDriverEarning: number; // VND (ensure driver gets fair pay)
  
  // Commission
  platformCommission: number; // % (15% = 0.15)
  
  // Created/Updated
  createdAt: Date;
  updatedAt: Date;
  createdBy: string;
  updatedBy: string;
  
  // Status
  isActive: boolean;
  effectiveFrom: Date;
  effectiveTo?: Date;
}

// ==================== EXTERNAL DATA ====================

/**
 * Traffic Data (from external API)
 */
export interface TrafficData {
  sourceAPI: 'GOOGLE_MAPS' | 'HERE' | 'TOMTOM' | 'INTERNAL';
  timestamp: Date;
  
  // Route-specific
  origin: { latitude: number; longitude: number };
  destination: { latitude: number; longitude: number };
  
  // Traffic info
  currentTrafficLevel: TrafficLevel;
  speedKmh: number; // Average speed
  delayMinutes: number; // Delay compared to free-flow
  
  // Forecast (next hour)
  forecastTrafficLevel?: TrafficLevel;
  forecastSpeedKmh?: number;
  
  // Incidents
  incidents?: {
    type: 'ACCIDENT' | 'CONSTRUCTION' | 'EVENT' | 'CLOSURE';
    location: string;
    impact: 'LOW' | 'MEDIUM' | 'HIGH';
  }[];
}

/**
 * Weather Data (from external API)
 */
export interface WeatherData {
  sourceAPI: 'OPENWEATHER' | 'WEATHERAPI' | 'ACCUWEATHER';
  timestamp: Date;
  
  // Location
  city: string;
  latitude: number;
  longitude: number;
  
  // Current weather
  condition: WeatherCondition;
  temperature: number; // Celsius
  humidity: number; // %
  windSpeedKmh: number;
  precipitationMm: number; // Lượng mưa
  
  // Forecast (next 3 hours)
  forecast?: {
    time: Date;
    condition: WeatherCondition;
    precipitationProbability: number; // 0-1
    precipitationMm: number;
  }[];
  
  // Alerts
  alerts?: {
    type: 'RAIN' | 'STORM' | 'FLOOD' | 'TYPHOON';
    severity: 'MINOR' | 'MODERATE' | 'SEVERE' | 'EXTREME';
    description: string;
    startTime: Date;
    endTime: Date;
  }[];
}

/**
 * Demand/Supply Data (internal)
 */
export interface DemandSupplyData {
  timestamp: Date;
  serviceType: ServiceType;
  zone: string;
  
  // Demand
  activeOrders: number;
  pendingOrders: number;
  demandLevel: DemandLevel;
  
  // Supply
  availableDrivers: number;
  onlineDrivers: number;
  busyDrivers: number;
  
  // Ratio
  demandSupplyRatio: number; // > 1 = more demand than supply
  
  // Forecast (next 30 minutes)
  forecastDemandLevel?: DemandLevel;
  forecastDemandSupplyRatio?: number;
}

// ==================== PRICE CALCULATION ====================

/**
 * Price Calculation Request
 */
export interface PriceCalculationRequest {
  serviceType: ServiceType;
  vehicleType?: VehicleType;
  
  // Route
  origin: { latitude: number; longitude: number; address: string };
  destination: { latitude: number; longitude: number; address: string };
  distance: number; // km
  estimatedDuration: number; // minutes
  
  // Time
  scheduledTime?: Date; // If not now
  
  // Cargo (for delivery)
  weight?: number; // kg
  size?: 'SMALL' | 'MEDIUM' | 'LARGE';
  
  // Context
  userId?: string;
  isNewUser?: boolean;
  membershipTier?: 'BRONZE' | 'SILVER' | 'GOLD' | 'PLATINUM' | 'DIAMOND';
  
  // Promo code
  promoCode?: string;
}

/**
 * Price Calculation Result
 */
export interface PriceCalculationResult {
  // Final price
  totalPrice: number; // VND
  
  // Breakdown
  breakdown: {
    baseFare: number;
    distanceFee: number; // distance * pricePerKm
    timeFee: number; // duration * pricePerMinute
    weightFee?: number;
    
    // Multipliers applied
    peakHourSurcharge?: number;
    weatherSurcharge?: number;
    trafficSurcharge?: number;
    demandSurcharge?: number;
    
    // Subtotal before discount
    subtotal: number;
    
    // Discounts
    promoDiscount?: number;
    membershipDiscount?: number;
    
    // Final
    total: number;
  };
  
  // Applied multipliers
  appliedMultipliers: {
    name: string;
    multiplier: number;
    reason: string;
  }[];
  
  // Driver earning (after commission)
  driverEarning: number;
  platformFee: number;
  
  // Validity
  validUntil: Date; // Price valid for X minutes
  
  // Transparency
  explanation: string; // Human-readable explanation
  
  // Metadata
  calculatedAt: Date;
  pricingConfigVersion: number;
  zone: string;
}

// ==================== AI ASSISTANT (CEO TOOLS) ====================

/**
 * Business Goal
 * Mục tiêu kinh doanh
 */
export enum BusinessGoal {
  INCREASE_REVENUE = 'INCREASE_REVENUE', // Tăng doanh thu
  INCREASE_ORDERS = 'INCREASE_ORDERS', // Tăng số đơn hàng
  INCREASE_MARKET_SHARE = 'INCREASE_MARKET_SHARE', // Tăng thị phần
  IMPROVE_PROFITABILITY = 'IMPROVE_PROFITABILITY', // Tăng lợi nhuận
  BEAT_COMPETITOR = 'BEAT_COMPETITOR', // Cạnh tranh
  DRIVER_RETENTION = 'DRIVER_RETENTION', // Giữ chân tài xế
  USER_ACQUISITION = 'USER_ACQUISITION', // Thu hút user mới
  USER_RETENTION = 'USER_RETENTION', // Giữ chân user
  INCREASE_FREQUENCY = 'INCREASE_FREQUENCY', // Tăng tần suất sử dụng
}

/**
 * AI Goal Request
 * CEO asks AI: "How to achieve goal X?"
 */
export interface AIGoalRequest {
  goal: BusinessGoal;
  
  // Context
  serviceType?: ServiceType;
  zone?: string; // Specific city/area
  timeframe: 'SHORT_TERM' | 'MEDIUM_TERM' | 'LONG_TERM'; // 1 week, 1 month, 3 months
  
  // Constraints
  maxBudget?: number; // VND for promotions
  maxPriceChange?: number; // % (don't change price > X%)
  minProfitMargin?: number; // % (must maintain profit > X%)
  
  // Target metrics
  targetRevenue?: number; // VND
  targetOrders?: number;
  targetMarketShare?: number; // %
  
  // Competitor context
  competitorPricing?: {
    competitor: 'GRAB' | 'GOJEK' | 'BE' | 'SHOPEE';
    averagePrice: number;
    marketShare: number; // %
  }[];
}

/**
 * AI Goal Recommendation
 */
export interface AIGoalRecommendation {
  goal: BusinessGoal;
  confidence: number; // 0-1
  
  // Recommendations (prioritized)
  recommendations: PricingRecommendation[];
  
  // Forecast
  forecast: {
    expectedRevenue: number; // VND
    expectedOrders: number;
    expectedMarketShare: number; // %
    expectedProfitMargin: number; // %
    
    // Range (min-max)
    revenueRange: { min: number; max: number };
    ordersRange: { min: number; max: number };
    
    // Confidence interval
    confidenceLevel: number; // 0-1 (0.95 = 95% confident)
  };
  
  // Risk assessment
  risks: {
    level: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
    description: string;
    probability: number; // 0-1
    impact: number; // VND (potential loss)
    mitigation: string;
  }[];
  
  // Comparison with current state
  comparison: {
    metric: string;
    current: number;
    projected: number;
    change: number; // %
    isImprovement: boolean;
  }[];
  
  // Explanation
  reasoning: string;
  
  // Generated at
  generatedAt: Date;
  modelVersion: string;
}

/**
 * Pricing Recommendation
 */
export interface PricingRecommendation {
  id: string;
  priority: number; // 1 = highest
  
  // Action type
  action: 'ADJUST_BASE_PRICE' | 'ADJUST_MULTIPLIER' | 'LAUNCH_PROMOTION' | 'CHANGE_COMMISSION' | 'TARGET_ZONE' | 'ADJUST_TIME_RULE';
  
  // Details
  target: string; // What to adjust (e.g., "baseFare", "peakHourMultiplier")
  currentValue: number;
  recommendedValue: number;
  change: number; // % or absolute
  
  // Impact
  estimatedImpact: {
    revenue: number; // VND change
    orders: number; // Order count change
    profit: number; // VND change
    marketShare: number; // % change
  };
  
  // Reasoning
  reason: string;
  
  // Implementation
  implementationSteps: string[];
  estimatedEffort: 'LOW' | 'MEDIUM' | 'HIGH';
  
  // Urgency
  urgency: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  
  // A/B test suggestion
  suggestABTest: boolean;
  abTestConfig?: {
    controlGroup: number; // % (50% = half users)
    testGroup: number; // %
    duration: number; // days
    successMetric: string;
  };
}

/**
 * Price Optimization Request
 * AI optimizes pricing to achieve specific metric
 */
export interface PriceOptimizationRequest {
  objective: 'MAXIMIZE_REVENUE' | 'MAXIMIZE_ORDERS' | 'MAXIMIZE_PROFIT' | 'BALANCE';
  
  // Constraints
  constraints: {
    minPrice?: number;
    maxPrice?: number;
    minDriverEarning?: number;
    maxCommission?: number; // %
    maintainCompetitiveness?: boolean; // Don't price higher than competitors
  };
  
  // Context
  serviceType: ServiceType;
  zone?: string;
  timeRange?: {
    startTime: string; // "07:00"
    endTime: string; // "09:00"
    daysOfWeek?: number[];
  };
  
  // Historical data range (for ML training)
  historicalDataDays: number; // 30, 60, 90 days
}

/**
 * Price Optimization Result
 */
export interface PriceOptimizationResult {
  objective: string;
  
  // Optimized pricing parameters
  optimizedParams: {
    parameter: string;
    currentValue: number;
    optimizedValue: number;
    change: number; // %
  }[];
  
  // Expected outcome
  expectedOutcome: {
    revenue: number;
    orders: number;
    profit: number;
    driverEarning: number;
    customerSatisfaction: number; // 0-5 stars
  };
  
  // Confidence
  confidence: number; // 0-1
  
  // Model info
  modelType: 'LINEAR_REGRESSION' | 'RANDOM_FOREST' | 'NEURAL_NETWORK' | 'REINFORCEMENT_LEARNING';
  modelAccuracy: number; // %
  trainingDataSize: number;
  
  // Validation
  backtestResults?: {
    period: string;
    actualRevenue: number;
    predictedRevenue: number;
    accuracy: number; // %
  }[];
  
  generatedAt: Date;
}

// ==================== PROMOTION MANAGEMENT ====================

/**
 * Promotion Campaign
 */
export interface PromotionCampaign {
  id: string;
  name: string; // "Khuyến mãi Tết 2024"
  description: string;
  
  // Type & value
  type: PromotionType;
  value: number; // Depends on type (%, VND, or Xu)
  
  // Applicability
  serviceTypes: ServiceType[];
  zones?: string[]; // Specific zones
  
  // Conditions
  minOrderValue?: number; // VND
  maxDiscount?: number; // VND (cap)
  usageLimit?: number; // Per user
  totalBudget?: number; // VND (campaign budget)
  
  // Timing
  startDate: Date;
  endDate: Date;
  
  // Targeting
  targetingCriteria: TargetingCriteria[];
  targetUserSegment?: {
    // Demographic
    ageMin?: number;
    ageMax?: number;
    gender?: 'MALE' | 'FEMALE' | 'OTHER' | 'ALL';
    
    // Behavioral
    orderCountMin?: number; // Min orders in past
    orderCountMax?: number; // Max orders (target low-frequency users)
    lastOrderDaysAgo?: number; // Re-engagement (> 30 days ago)
    averageOrderValue?: { min: number; max: number };
    
    // Location
    cities?: string[];
    districts?: string[];
    
    // Membership
    membershipTiers?: string[];
  };
  
  // Promo codes
  promoCodes?: string[]; // ["TET2024", "WELCOME50"]
  autoApply?: boolean; // Automatically apply (no code needed)
  
  // Status
  status: PromotionStatus;
  
  // Performance
  stats?: {
    impressions: number; // How many users saw it
    clicks: number; // How many clicked/attempted to use
    redemptions: number; // How many actually used
    totalDiscount: number; // VND given
    revenueGenerated: number; // VND from orders with promo
    roi: number; // (revenue - discount) / discount
  };
  
  // Created/Updated
  createdAt: Date;
  updatedAt: Date;
  createdBy: string;
  updatedBy: string;
}

/**
 * Promo Code
 */
export interface PromoCode {
  code: string; // "TET2024"
  campaignId: string;
  
  // Restrictions
  usageLimit: number; // Total uses
  usageLimitPerUser: number;
  usageCount: number; // Current count
  
  // Validity
  validFrom: Date;
  validTo: Date;
  
  isActive: boolean;
}

/**
 * Smart Promotion Suggestion (AI)
 */
export interface PromotionSuggestion {
  id: string;
  confidence: number; // 0-1
  
  // Suggested campaign
  suggestedCampaign: {
    name: string;
    type: PromotionType;
    value: number;
    targetSegment: TargetingCriteria;
    duration: number; // days
    estimatedBudget: number; // VND
  };
  
  // Reasoning
  reason: string;
  
  // Expected impact
  expectedImpact: {
    newUsers: number;
    reactivatedUsers: number;
    additionalOrders: number;
    additionalRevenue: number; // VND
    roi: number; // Expected ROI
  };
  
  // Similar campaigns (historical)
  similarCampaigns?: {
    campaignId: string;
    name: string;
    performance: {
      redemptions: number;
      revenue: number;
      roi: number;
    };
  }[];
  
  // Best timing
  recommendedStartDate: Date;
  
  generatedAt: Date;
}

// ==================== ADMIN UI ====================

/**
 * Parameter Definition (for UI rendering)
 */
export interface PricingParameterDefinition {
  key: string; // "baseFare", "peakHourMultiplier"
  label: string; // "Giá cơ bản"
  description: string;
  
  // Data type
  type: 'NUMBER' | 'PERCENTAGE' | 'CURRENCY' | 'MULTIPLIER' | 'TIME' | 'BOOLEAN';
  
  // Validation
  min?: number;
  max?: number;
  step?: number; // Increment (e.g., 1000 VND)
  unit?: string; // "VND", "km", "%"
  
  // UI hints
  placeholder?: string;
  helpText?: string; // Additional guidance
  examples?: string[]; // Example values
  
  // Warnings
  warningThreshold?: {
    low?: number; // Warn if below
    high?: number; // Warn if above
    message: string;
  };
  
  // Impact indicator
  impactOnRevenue: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  impactOnOrders: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  impactOnDrivers: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  
  // Dependencies
  dependsOn?: string[]; // Other parameters that affect this
  affects?: string[]; // Other parameters affected by this
  
  // Category (for grouping in UI)
  category: 'BASE_PRICING' | 'DYNAMIC_MULTIPLIERS' | 'TIME_RULES' | 'ZONES' | 'COMMISSION' | 'SAFETY';
  
  // Access control
  requiredRole: 'ADMIN' | 'MANAGER' | 'CEO' | 'FRANCHISEE';
}

/**
 * Parameter Validation Result
 */
export interface ParameterValidationResult {
  isValid: boolean;
  errors: {
    parameter: string;
    message: string;
    severity: 'ERROR' | 'WARNING' | 'INFO';
  }[];
  warnings: string[];
  
  // Impact simulation
  simulatedImpact?: {
    estimatedRevenueDelta: number; // VND (+ or -)
    estimatedOrdersDelta: number;
    estimatedProfitDelta: number;
    riskLevel: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  };
}

/**
 * Pricing Change Request
 * When admin wants to update pricing
 */
export interface PricingChangeRequest {
  configId: string;
  changes: {
    parameter: string;
    oldValue: number;
    newValue: number;
  }[];
  
  // Justification
  reason: string;
  goal?: BusinessGoal;
  
  // Scheduling
  effectiveFrom: Date;
  effectiveTo?: Date;
  
  // Approval workflow
  requiresApproval: boolean;
  approvedBy?: string;
  approvedAt?: Date;
  
  // A/B testing
  isABTest?: boolean;
  abTestConfig?: {
    testGroupPercent: number; // %
    duration: number; // days
    successMetric: string;
    minimumSampleSize: number;
  };
  
  // Rollback plan
  autoRollbackConditions?: {
    revenueDropPercent?: number; // Rollback if revenue drops > X%
    orderDropPercent?: number;
    customerComplaintThreshold?: number;
  };
  
  createdAt: Date;
  createdBy: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED' | 'ACTIVE' | 'ROLLED_BACK';
}

// ==================== FRANCHISE MANAGEMENT ====================

/**
 * Franchise Partner
 */
export interface FranchisePartner {
  id: string;
  name: string;
  contactPerson: string;
  email: string;
  phone: string;
  
  // Territory
  assignedZones: string[]; // City IDs
  
  // Services
  enabledServices: ServiceType[];
  
  // Permissions
  canAdjustPricing: boolean;
  pricingAdjustmentLimit?: number; // % (can only change price ±X%)
  canCreatePromotions: boolean;
  promotionBudgetLimit?: number; // VND/month
  
  // Commission split
  franchiseCommission: number; // % (franchisee gets this)
  platformCommission: number; // % (platform gets this)
  
  // Performance
  stats?: {
    totalOrders: number;
    totalRevenue: number; // VND
    activeDrivers: number;
    activeUsers: number;
    avgRating: number;
  };
  
  // Contract
  contractStartDate: Date;
  contractEndDate: Date;
  
  isActive: boolean;
  createdAt: Date;
}

/**
 * Franchise Pricing Override
 * Franchisee can override some parameters (within limits)
 */
export interface FranchisePricingOverride {
  franchiseId: string;
  zone: string;
  serviceType: ServiceType;
  
  // Overrides (partial)
  overrides: Partial<BasePricingParams>;
  
  // Must stay within bounds
  adjustmentPercent: number; // Actual % change from global
  maxAllowedAdjustment: number; // % limit
  
  // Justification
  reason: string;
  
  // Approval
  approvedBy?: string; // Platform admin
  approvedAt?: Date;
  
  effectiveFrom: Date;
  effectiveTo?: Date;
  
  isActive: boolean;
}

// ==================== ANALYTICS & REPORTING ====================

/**
 * Pricing Analytics
 */
export interface PricingAnalytics {
  period: { startDate: Date; endDate: Date };
  serviceType?: ServiceType;
  zone?: string;
  
  // Revenue metrics
  totalRevenue: number; // VND
  avgOrderValue: number; // VND
  revenueGrowth: number; // % vs previous period
  
  // Order metrics
  totalOrders: number;
  ordersGrowth: number; // %
  
  // Pricing metrics
  avgFinalPrice: number; // VND
  avgBaseFare: number;
  avgSurchargePercent: number; // %
  surgePricingFrequency: number; // % of orders with surge
  
  // Multiplier usage
  multiplierBreakdown: {
    multiplier: string;
    timesApplied: number;
    avgIncrease: number; // % or VND
  }[];
  
  // Profitability
  totalProfit: number; // VND
  profitMargin: number; // %
  avgDriverEarning: number; // VND
  avgPlatformFee: number; // VND
  
  // Discounts
  totalDiscounts: number; // VND
  discountRate: number; // % of total revenue
  
  // Competitor comparison
  competitorComparison?: {
    competitor: string;
    ourPrice: number;
    theirPrice: number;
    priceDiff: number; // % (+10% = we're 10% more expensive)
    marketShare: number; // % (our share)
  }[];
  
  // Top zones
  topZonesByRevenue: {
    zone: string;
    revenue: number;
    orders: number;
  }[];
  
  // Time analysis
  peakHours: {
    hour: number; // 0-23
    orders: number;
    revenue: number;
    avgPrice: number;
  }[];
}

// ==================== API TYPES ====================

export interface GetPricingConfigRequest {
  serviceType: ServiceType;
  zone?: string;
  version?: number;
}

export interface GetPricingConfigResponse {
  config: PricingConfig;
}

export interface CalculatePriceRequest extends PriceCalculationRequest {}

export interface CalculatePriceResponse {
  result: PriceCalculationResult;
}

export interface GetAIGoalRecommendationRequest extends AIGoalRequest {}

export interface GetAIGoalRecommendationResponse {
  recommendation: AIGoalRecommendation;
}

export interface OptimizePricingRequest extends PriceOptimizationRequest {}

export interface OptimizePricingResponse {
  result: PriceOptimizationResult;
}

export interface CreatePromotionRequest {
  campaign: Omit<PromotionCampaign, 'id' | 'createdAt' | 'updatedAt' | 'stats'>;
}

export interface CreatePromotionResponse {
  campaign: PromotionCampaign;
}

export interface GetPromotionSuggestionsRequest {
  goal: 'ACQUISITION' | 'RETENTION' | 'REACTIVATION' | 'FREQUENCY';
  budget: number; // VND
  serviceType?: ServiceType;
  zone?: string;
}

export interface GetPromotionSuggestionsResponse {
  suggestions: PromotionSuggestion[];
}

export interface ValidatePricingChangeRequest {
  changes: PricingChangeRequest['changes'];
  currentConfig: PricingConfig;
}

export interface ValidatePricingChangeResponse {
  validation: ParameterValidationResult;
}
