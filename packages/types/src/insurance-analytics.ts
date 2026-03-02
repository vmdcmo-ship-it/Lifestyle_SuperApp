/**
 * Insurance Analytics & AI Engine Type Definitions
 * "Bộ Não Vận Hành Bảo Hiểm"
 * 
 * Covers 3 Insurance Categories:
 * 1. BHTNDS (Trách nhiệm Dân sự - Vehicle)
 * 2. BHPNT (Phi nhân thọ - Non-life: Social Insurance)
 * 3. BHNT (Nhân thọ - Life Insurance: Cathay Life)
 */

// ============================================================================
// Enums
// ============================================================================

/**
 * Insurance category
 */
export enum InsuranceCategory {
  VEHICLE = 'VEHICLE', // BHTNDS + Vật chất xe
  NON_LIFE = 'NON_LIFE', // BHXH tự nguyện
  LIFE = 'LIFE', // Cathay Life partnership
}

/**
 * Metric type
 */
export enum MetricType {
  // Awareness
  IMPRESSIONS = 'IMPRESSIONS', // Lượt hiển thị
  VIEWS = 'VIEWS', // Lượt xem (page view)
  
  // Engagement
  CLICKS = 'CLICKS', // Lượt click
  TIME_ON_PAGE = 'TIME_ON_PAGE', // Thời gian xem (seconds)
  VIDEO_VIEWS = 'VIDEO_VIEWS', // Lượt xem video
  VIDEO_COMPLETION = 'VIDEO_COMPLETION', // % xem hết video
  WIKI_READS = 'WIKI_READS', // Đọc Wiki
  
  // Intent
  CALCULATOR_USES = 'CALCULATOR_USES', // Dùng calculator
  CHAT_MESSAGES = 'CHAT_MESSAGES', // Tin nhắn chat
  CONSULTATION_REQUESTS = 'CONSULTATION_REQUESTS', // Yêu cầu tư vấn
  SAVES = 'SAVES', // Lưu sản phẩm
  
  // Conversion
  APPLICATION_STARTS = 'APPLICATION_STARTS', // Bắt đầu đơn
  APPLICATION_COMPLETES = 'APPLICATION_COMPLETES', // Hoàn thành đơn
  APPLICATIONS_SUBMITTED = 'APPLICATIONS_SUBMITTED', // Gửi đơn
  POLICIES_ISSUED = 'POLICIES_ISSUED', // Hợp đồng phát hành
  
  // Revenue
  PREMIUM_COLLECTED = 'PREMIUM_COLLECTED', // Phí thu được
  COMMISSION_EARNED = 'COMMISSION_EARNED', // Hoa hồng
}

/**
 * Conversion funnel stage
 */
export enum ConversionStage {
  AWARENESS = 'AWARENESS', // Biết đến
  INTEREST = 'INTEREST', // Quan tâm
  CONSIDERATION = 'CONSIDERATION', // Cân nhắc
  INTENT = 'INTENT', // Có ý định
  APPLICATION = 'APPLICATION', // Đăng ký
  ISSUED = 'ISSUED', // Thành công
}

/**
 * Customer segment
 */
export enum CustomerSegment {
  // Demographic
  YOUNG_SINGLE = 'YOUNG_SINGLE', // 18-30, độc thân
  NEWLYWED = 'NEWLYWED', // 25-35, mới cưới
  YOUNG_PARENTS = 'YOUNG_PARENTS', // 30-40, con nhỏ
  ESTABLISHED = 'ESTABLISHED', // 40-50, con lớn
  PRE_RETIREMENT = 'PRE_RETIREMENT', // 50-60
  
  // Behavioral
  RESEARCHERS = 'RESEARCHERS', // Đọc nhiều, chưa mua
  CALCULATOR_USERS = 'CALCULATOR_USERS', // Dùng calculator nhiều lần
  COMPARISON_SHOPPERS = 'COMPARISON_SHOPPERS', // So sánh sản phẩm
  CHAT_ENGAGERS = 'CHAT_ENGAGERS', // Chat nhiều
  QUICK_BUYERS = 'QUICK_BUYERS', // Mua nhanh, ít research
  
  // Value
  HIGH_VALUE = 'HIGH_VALUE', // Premium cao
  MEDIUM_VALUE = 'MEDIUM_VALUE',
  LOW_VALUE = 'LOW_VALUE',
  
  // Risk
  HIGH_RISK = 'HIGH_RISK', // Health issues, high-risk occupation
  STANDARD_RISK = 'STANDARD_RISK',
}

/**
 * Interaction type
 */
export enum InteractionType {
  VIEW = 'VIEW', // Xem trang
  CLICK = 'CLICK', // Click vào element
  SCROLL = 'SCROLL', // Scroll (depth tracking)
  HOVER = 'HOVER', // Di chuột qua
  VIDEO_PLAY = 'VIDEO_PLAY',
  VIDEO_PAUSE = 'VIDEO_PAUSE',
  VIDEO_COMPLETE = 'VIDEO_COMPLETE',
  CALCULATOR_INPUT = 'CALCULATOR_INPUT',
  CALCULATOR_SUBMIT = 'CALCULATOR_SUBMIT',
  FORM_START = 'FORM_START',
  FORM_ABANDON = 'FORM_ABANDON',
  FORM_COMPLETE = 'FORM_COMPLETE',
  CHAT_OPEN = 'CHAT_OPEN',
  CHAT_MESSAGE = 'CHAT_MESSAGE',
  DOWNLOAD = 'DOWNLOAD',
  SHARE = 'SHARE',
}

/**
 * Recommendation type
 */
export enum RecommendationType {
  PRODUCT = 'PRODUCT', // Gợi ý sản phẩm
  CONTENT = 'CONTENT', // Gợi ý nội dung (Wiki, Video)
  ACTION = 'ACTION', // Gợi ý hành động (Chat, Call)
  UPSELL = 'UPSELL', // Nâng cấp gói
  CROSS_SELL = 'CROSS_SELL', // Mua thêm sản phẩm khác
}

/**
 * Sales scenario
 */
export enum SalesScenario {
  // By lifecycle
  NEW_PARENT = 'NEW_PARENT', // Vừa có con → Education insurance
  NEW_DRIVER = 'NEW_DRIVER', // Vừa lái xe → TNDS + Life term
  NEW_MERCHANT = 'NEW_MERCHANT', // Vừa mở shop → Business insurance
  PRE_RETIREMENT = 'PRE_RETIREMENT', // Sắp nghỉ hưu → Retirement plan
  
  // By behavior
  CALCULATOR_DROPOUT = 'CALCULATOR_DROPOUT', // Dùng calc nhưng không apply
  APPLICATION_DROPOUT = 'APPLICATION_DROPOUT', // Bỏ dở đơn
  POLICY_EXPIRING = 'POLICY_EXPIRING', // Hợp đồng sắp hết hạn
  PAYMENT_OVERDUE = 'PAYMENT_OVERDUE', // Quá hạn đóng phí
  
  // By intent
  COMPARING_PRODUCTS = 'COMPARING_PRODUCTS', // Đang so sánh
  SEEKING_CONSULTATION = 'SEEKING_CONSULTATION', // Cần tư vấn
  READY_TO_BUY = 'READY_TO_BUY', // Sẵn sàng mua
}

/**
 * Report type
 */
export enum ReportType {
  OVERVIEW = 'OVERVIEW', // Tổng quan
  CONVERSION = 'CONVERSION', // Chuyển đổi
  REVENUE = 'REVENUE', // Doanh thu
  AGENT_PERFORMANCE = 'AGENT_PERFORMANCE', // Hiệu quả agent
  CUSTOMER_CARE = 'CUSTOMER_CARE', // Chăm sóc khách hàng
  PRODUCT_PERFORMANCE = 'PRODUCT_PERFORMANCE', // Hiệu quả sản phẩm
  CONTENT_PERFORMANCE = 'CONTENT_PERFORMANCE', // Hiệu quả nội dung
  COHORT_ANALYSIS = 'COHORT_ANALYSIS', // Phân tích cohort
}

// ============================================================================
// Interfaces
// ============================================================================

/**
 * Analytics metric (Time series data point)
 */
export interface AnalyticsMetric {
  id: string;
  
  // Dimensions
  category: InsuranceCategory; // VEHICLE, NON_LIFE, LIFE
  productId?: string; // Specific product
  appSource?: 'USER' | 'DRIVER' | 'MERCHANT'; // Which app
  
  // Metric
  metricType: MetricType;
  value: number;
  
  // Time
  timestamp: Date;
  dateKey: string; // '2026-02-14' (for grouping)
  hourKey?: string; // '2026-02-14-15' (for hourly)
  
  // User
  userId?: string;
  sessionId?: string;
  
  // Context
  metadata?: Record<string, any>; // Additional context
  
  // Aggregation (for pre-computed metrics)
  aggregationPeriod?: 'HOUR' | 'DAY' | 'WEEK' | 'MONTH';
  
  createdAt: Date;
}

/**
 * Conversion funnel (Category-specific)
 */
export interface ConversionFunnel {
  id: string;
  
  // Dimensions
  category: InsuranceCategory;
  productId?: string;
  appSource?: 'USER' | 'DRIVER' | 'MERCHANT';
  customerSegment?: CustomerSegment;
  
  // Period
  startDate: Date;
  endDate: Date;
  
  // Stages
  stages: FunnelStage[];
  
  // Overall metrics
  topOfFunnel: number; // Total at awareness stage
  bottomOfFunnel: number; // Total converted (issued)
  overallConversionRate: number; // Bottom / Top (%)
  
  // Drop-off analysis
  biggestDropOff: {
    fromStage: ConversionStage;
    toStage: ConversionStage;
    dropOffRate: number; // %
    count: number;
  };
  
  // Time metrics
  avgTimeToConvert: number; // Days from awareness to issued
  medianTimeToConvert: number;
  
  createdAt: Date;
}

/**
 * Funnel stage
 */
export interface FunnelStage {
  stage: ConversionStage;
  count: number; // Number of users at this stage
  conversionRate: number; // % of previous stage
  dropOffRate: number; // % who left at this stage
  avgTimeToNextStage?: number; // Days
}

/**
 * Customer interaction (Event tracking)
 */
export interface CustomerInteraction {
  id: string;
  
  // User
  userId: string;
  sessionId: string;
  
  // Interaction
  type: InteractionType;
  
  // Context
  category: InsuranceCategory;
  productId?: string;
  pageUrl: string;
  elementId?: string; // Which element was clicked/hovered
  
  // Data
  value?: any; // e.g., calculator input, form data
  
  // Device
  deviceType: 'MOBILE' | 'TABLET' | 'DESKTOP';
  appSource: 'USER' | 'DRIVER' | 'MERCHANT';
  
  // Time
  timestamp: Date;
  duration?: number; // For video views, time on page (seconds)
  
  // Geo
  city?: string;
  region?: string;
  
  createdAt: Date;
}

/**
 * Customer journey (Aggregated interactions)
 */
export interface CustomerJourney {
  id: string;
  userId: string;
  
  // Journey info
  category: InsuranceCategory; // Which insurance they're interested in
  startDate: Date;
  endDate?: Date; // If converted or dropped off
  
  // Status
  currentStage: ConversionStage;
  isConverted: boolean;
  isDroppedOff: boolean;
  
  // Touchpoints
  touchpoints: JourneyTouchpoint[];
  totalTouchpoints: number;
  
  // Engagement
  totalViews: number;
  totalClicks: number;
  totalTimeSpent: number; // Seconds
  calculatorUses: number;
  chatMessages: number;
  consultationRequests: number;
  
  // Products viewed
  productsViewed: string[]; // Product IDs
  productsCompared: string[][]; // Arrays of product IDs compared together
  
  // Content consumed
  wikiArticlesRead: string[]; // Article IDs
  videosWatched: string[]; // Video IDs
  
  // Conversion
  applicationId?: string;
  policyId?: string;
  convertedAt?: Date;
  conversionValue?: number; // Premium or commission
  
  // Segmentation
  segment?: CustomerSegment;
  
  // AI predictions
  conversionProbability?: number; // 0-1
  recommendedActions?: string[]; // Next best actions
  
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Journey touchpoint
 */
export interface JourneyTouchpoint {
  timestamp: Date;
  stage: ConversionStage;
  type: InteractionType;
  pageUrl: string;
  productId?: string;
  duration?: number; // Seconds
  outcome?: string; // e.g., "Started application", "Watched video 80%"
}

/**
 * Customer profile (Enhanced with insurance data)
 */
export interface CustomerProfile {
  userId: string;
  
  // Demographics
  age?: number;
  gender?: 'MALE' | 'FEMALE';
  hasChildren?: boolean;
  numberOfChildren?: number;
  childrenAges?: number[];
  
  // Occupation
  occupation?: string;
  isBusinessOwner?: boolean;
  isDriver?: boolean;
  isMerchant?: boolean;
  
  // Financial
  monthlyIncome?: number;
  incomeRange?: 'LOW' | 'MEDIUM' | 'HIGH' | 'VERY_HIGH';
  
  // Lifecycle stage
  lifecycleStage?: CustomerSegment;
  
  // Behavioral
  behavioralSegment?: CustomerSegment;
  
  // Insurance history
  existingPolicies: {
    category: InsuranceCategory;
    policyId: string;
    status: 'ACTIVE' | 'LAPSED' | 'MATURED';
    premium: number;
  }[];
  totalActivePolicies: number;
  totalPremiumPaying: number; // Monthly
  
  // Engagement scores
  engagementScore: number; // 0-100
  conversionProbability: number; // 0-1 (AI prediction)
  customerValue: number; // LTV prediction
  riskScore: number; // 0-100 (underwriting risk)
  
  // Preferences
  preferredVibe?: 'LIFESTYLE' | 'FINANCE' | 'TRUST'; // For life insurance
  preferredChannel?: 'CHAT' | 'CALL' | 'SELF_SERVE';
  
  // Journey data
  journeys: CustomerJourney[];
  lastInteraction?: Date;
  
  createdAt: Date;
  updatedAt: Date;
}

/**
 * AI Recommendation
 */
export interface AIRecommendation {
  id: string;
  
  // Target
  userId: string;
  segment: CustomerSegment;
  
  // Recommendation
  type: RecommendationType;
  priority: 'HIGH' | 'MEDIUM' | 'LOW';
  confidence: number; // 0-1 (AI confidence score)
  
  // Content
  title: string; // "Gợi ý: Quỹ Chắp Cánh Tài Năng"
  description: string; // Explanation
  reason: string; // "Bạn vừa có con, nên cân nhắc bảo hiểm giáo dục"
  
  // Action
  productId?: string; // If product recommendation
  contentId?: string; // If content recommendation (Wiki, Video)
  action?: string; // "CHAT_WITH_AGENT" | "USE_CALCULATOR" | "APPLY_NOW"
  deepLink?: string;
  
  // Scenario
  scenario: SalesScenario;
  
  // Performance (A/B test)
  impressions: number;
  clicks: number;
  conversions: number;
  ctr: number; // Click-through rate
  conversionRate: number;
  
  // Validity
  validFrom: Date;
  validUntil: Date;
  isActive: boolean;
  
  // Metadata
  modelVersion?: string; // AI model version
  features?: Record<string, any>; // Features used for prediction
  
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Sales scenario (Playbook)
 */
export interface SalesScenarioPlaybook {
  id: string;
  scenario: SalesScenario;
  
  // Definition
  name: string;
  description: string;
  
  // Trigger conditions
  triggers: ScenarioTrigger[];
  
  // Target segment
  targetSegments: CustomerSegment[];
  
  // Recommended actions
  actions: ScenarioAction[];
  
  // Messaging
  messaging: {
    headline: string;
    description: string;
    cta: string;
    urgency?: string; // "Còn 3 ngày!", "Ưu đãi đặc biệt"
  };
  
  // Products to recommend
  recommendedProducts: {
    category: InsuranceCategory;
    productId: string;
    priority: number; // 1 = highest
    reason: string;
  }[];
  
  // Performance
  timesTriggered: number;
  conversions: number;
  conversionRate: number;
  avgConversionValue: number;
  
  // Status
  isActive: boolean;
  
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Scenario trigger
 */
export interface ScenarioTrigger {
  type: 'EVENT' | 'CONDITION' | 'TIME';
  
  // Event-based
  event?: InteractionType;
  eventCount?: number; // Trigger after N events
  
  // Condition-based
  condition?: string; // JavaScript expression, e.g., "user.age < 30 && user.hasChildren"
  
  // Time-based
  timeSince?: {
    event: string;
    duration: number; // Days
  };
  
  // Combination
  operator?: 'AND' | 'OR';
}

/**
 * Scenario action
 */
export interface ScenarioAction {
  type: 'NOTIFICATION' | 'EMAIL' | 'SMS' | 'IN_APP_MESSAGE' | 'AGENT_TASK';
  priority: number; // 1 = highest
  
  // Notification
  title?: string;
  message?: string;
  deepLink?: string;
  
  // Email/SMS
  template?: string;
  
  // Agent task
  assignToAgent?: boolean;
  taskDescription?: string;
  
  // Timing
  delay?: number; // Minutes after trigger
  expiresAfter?: number; // Hours
}

/**
 * Product performance (Aggregated metrics)
 */
export interface ProductPerformance {
  id: string;
  
  // Product
  category: InsuranceCategory;
  productId: string;
  productName: string;
  
  // Period
  startDate: Date;
  endDate: Date;
  
  // Awareness
  impressions: number;
  views: number;
  uniqueVisitors: number;
  
  // Engagement
  avgTimeOnPage: number; // Seconds
  clickThroughRate: number; // %
  calculatorUses: number;
  calculatorConversionRate: number; // % who use calculator → apply
  
  // Content
  videoViews: number;
  videoCompletionRate: number; // %
  wikiArticleViews: number;
  
  // Intent
  saves: number; // Users who saved/bookmarked
  chatInitiations: number;
  consultationRequests: number;
  
  // Conversion
  applicationStarts: number;
  applicationCompletions: number;
  applicationsSubmitted: number;
  policiesIssued: number;
  
  // Funnel
  viewToApplicationRate: number; // %
  applicationToIssuedRate: number; // %
  overallConversionRate: number; // View → Issued (%)
  
  // Revenue
  totalPremium: number;
  totalCommission: number;
  avgPremiumPerPolicy: number;
  
  // Time
  avgTimeToConvert: number; // Days from first view to issued
  
  // Comparison
  rank: number; // Rank among products in same category
  performanceVsAvg: number; // % above/below category average
  
  createdAt: Date;
}

/**
 * Content performance (Wiki, Video, etc.)
 */
export interface ContentPerformance {
  id: string;
  
  // Content
  contentType: 'WIKI' | 'VIDEO' | 'INFOGRAPHIC' | 'CALCULATOR';
  contentId: string;
  contentTitle: string;
  category: InsuranceCategory;
  
  // Period
  startDate: Date;
  endDate: Date;
  
  // Metrics
  views: number;
  uniqueVisitors: number;
  avgTimeSpent: number; // Seconds
  completionRate: number; // % (for video/long articles)
  
  // Engagement
  likes: number;
  shares: number;
  comments: number;
  
  // Conversion impact
  viewsLeadingToApplication: number;
  conversionRate: number; // %
  conversionValue: number; // Total premium from conversions
  
  // SEO
  organicViews: number;
  organicConversions: number;
  
  // Performance
  rank: number; // Among content in same category
  trend: 'UP' | 'DOWN' | 'STABLE';
  
  createdAt: Date;
}

/**
 * Agent performance
 */
export interface AgentPerformance {
  id: string;
  agentId: string;
  agentName: string;
  
  // Period
  startDate: Date;
  endDate: Date;
  
  // Workload
  leadsAssigned: number;
  leadsHandled: number;
  currentActiveLeads: number;
  
  // Response time
  avgFirstResponseTime: number; // Minutes
  avgResponseTime: number; // Minutes (for all messages)
  
  // Consultations
  consultationsConducted: number;
  avgConsultationDuration: number; // Minutes
  phoneCallsMade: number;
  chatMessagesExchanged: number;
  
  // Conversion
  applicationsGenerated: number;
  policiesIssued: number;
  conversionRate: number; // %
  
  // Revenue
  totalPremiumGenerated: number;
  totalCommissionEarned: number;
  avgDealSize: number;
  
  // Quality
  customerSatisfactionScore: number; // 1-5
  customerComplaintRate: number; // %
  policyLapseRate: number; // % of policies that lapsed
  
  // Efficiency
  leadsPerDay: number;
  conversionsPerDay: number;
  revenuePerDay: number;
  
  // Categories
  performanceByCategory: {
    category: InsuranceCategory;
    conversions: number;
    revenue: number;
  }[];
  
  // Comparison
  rank: number; // Among all agents
  performanceVsAvg: number; // % above/below average
  
  createdAt: Date;
}

/**
 * Customer care effectiveness
 */
export interface CustomerCareMetrics {
  id: string;
  
  // Period
  startDate: Date;
  endDate: Date;
  
  // Volume
  totalTickets: number;
  newTickets: number;
  resolvedTickets: number;
  openTickets: number;
  
  // Response time
  avgFirstResponseTime: number; // Hours
  avgResolutionTime: number; // Hours
  
  // Resolution
  firstCallResolutionRate: number; // %
  resolutionRate: number; // %
  escalationRate: number; // %
  
  // Channels
  channelBreakdown: {
    channel: 'CHAT' | 'PHONE' | 'EMAIL' | 'IN_APP';
    tickets: number;
    avgResponseTime: number;
    resolutionRate: number;
  }[];
  
  // Issues
  topIssues: {
    issue: string;
    count: number;
    percentage: number;
  }[];
  
  // Customer satisfaction
  csat: number; // Customer Satisfaction Score (1-5)
  nps: number; // Net Promoter Score (-100 to 100)
  
  // Agent performance
  avgAgentResponseTime: number;
  avgAgentResolutionTime: number;
  topPerformingAgents: {
    agentId: string;
    agentName: string;
    tickets: number;
    csat: number;
  }[];
  
  createdAt: Date;
}

/**
 * Business performance report (Overall)
 */
export interface BusinessPerformanceReport {
  id: string;
  
  // Period
  startDate: Date;
  endDate: Date;
  
  // Overall metrics
  totalViews: number;
  totalApplications: number;
  totalPoliciesIssued: number;
  overallConversionRate: number; // %
  
  // Revenue
  totalPremium: number;
  totalCommission: number;
  avgDealSize: number;
  
  // By category
  byCategory: {
    category: InsuranceCategory;
    views: number;
    applications: number;
    issued: number;
    conversionRate: number;
    premium: number;
    commission: number;
  }[];
  
  // By app source
  byAppSource: {
    appSource: 'USER' | 'DRIVER' | 'MERCHANT';
    views: number;
    applications: number;
    issued: number;
    conversionRate: number;
  }[];
  
  // Top products
  topProducts: {
    productId: string;
    productName: string;
    category: InsuranceCategory;
    issued: number;
    premium: number;
  }[];
  
  // Agent performance summary
  totalAgents: number;
  avgAgentConversionRate: number;
  totalCommissionPaid: number;
  
  // Customer care summary
  totalTickets: number;
  avgResolutionTime: number;
  csat: number;
  
  // Trends
  weekOverWeekGrowth: number; // %
  monthOverMonthGrowth: number; // %
  
  createdAt: Date;
}

/**
 * Cohort analysis
 */
export interface CohortAnalysis {
  id: string;
  
  // Cohort definition
  cohortName: string; // "Feb 2026 New Customers"
  cohortStartDate: Date;
  cohortEndDate: Date;
  
  // Criteria
  category?: InsuranceCategory;
  segment?: CustomerSegment;
  appSource?: 'USER' | 'DRIVER' | 'MERCHANT';
  
  // Size
  cohortSize: number; // Number of users
  
  // Retention (By period)
  retentionByPeriod: {
    period: number; // 0 = initial period, 1 = +1 period, etc.
    retained: number; // Number still active
    retentionRate: number; // %
    churnRate: number; // %
  }[];
  
  // Revenue
  totalRevenueGenerated: number;
  avgRevenuePerUser: number;
  
  // LTV
  avgLTV: number;
  projectedLTV: number;
  
  // Conversion
  conversionRate: number; // % who became customers
  avgTimeToConvert: number; // Days
  
  createdAt: Date;
}

/**
 * A/B Test (For messaging, vibes, CTAs, etc.)
 */
export interface ABTest {
  id: string;
  
  // Test info
  name: string;
  description: string;
  hypothesis: string; // "LIFESTYLE vibe will convert better for young parents"
  
  // Target
  category: InsuranceCategory;
  productId?: string;
  segment?: CustomerSegment;
  
  // Variants
  variants: ABTestVariant[];
  
  // Traffic allocation
  trafficAllocation: Record<string, number>; // variantId → % (must sum to 100)
  
  // Period
  startDate: Date;
  endDate: Date;
  
  // Status
  status: 'DRAFT' | 'RUNNING' | 'PAUSED' | 'COMPLETED' | 'CANCELLED';
  
  // Results
  winner?: string; // Variant ID
  confidenceLevel?: number; // % (95% = statistically significant)
  
  // Metrics
  primaryMetric: MetricType; // Main success metric
  secondaryMetrics: MetricType[];
  
  createdAt: Date;
  updatedAt: Date;
}

/**
 * A/B Test variant
 */
export interface ABTestVariant {
  id: string;
  name: string; // "Control", "Variant A", "LIFESTYLE Vibe", etc.
  description: string;
  
  // Changes
  changes: Record<string, any>; // What's different
  
  // Performance
  impressions: number;
  conversions: number;
  conversionRate: number;
  revenue: number;
  
  // Statistical significance
  isWinner: boolean;
  confidenceLevel: number; // %
  
  // Metadata
  createdAt: Date;
}

// ============================================================================
// Dashboard Types
// ============================================================================

/**
 * Dashboard filter
 */
export interface DashboardFilter {
  // Time range
  startDate: Date;
  endDate: Date;
  granularity: 'HOUR' | 'DAY' | 'WEEK' | 'MONTH';
  
  // Dimensions
  categories?: InsuranceCategory[];
  products?: string[]; // Product IDs
  appSources?: ('USER' | 'DRIVER' | 'MERCHANT')[];
  segments?: CustomerSegment[];
  agents?: string[]; // Agent IDs
  
  // Comparison
  compareWithPreviousPeriod?: boolean;
  compareWithYear?: number; // Year to compare with
}

/**
 * Dashboard widget (Generic)
 */
export interface DashboardWidget {
  id: string;
  type: 'KPI' | 'CHART' | 'TABLE' | 'FUNNEL' | 'HEATMAP' | 'MAP' | 'LIST';
  title: string;
  description?: string;
  
  // Layout
  position: { x: number; y: number };
  size: { width: number; height: number };
  
  // Data
  dataSource: string; // API endpoint or query
  refreshInterval?: number; // Seconds (for auto-refresh)
  
  // Configuration
  config: Record<string, any>; // Widget-specific config
  
  // Visibility
  visibleTo: string[]; // Role IDs (who can see this widget)
}

/**
 * KPI Widget data
 */
export interface KPIWidgetData {
  label: string;
  value: number | string;
  unit?: string; // '%', 'VND', 'policies', etc.
  trend?: 'UP' | 'DOWN' | 'STABLE';
  trendValue?: number; // % change
  comparisonValue?: number; // Previous period value
  icon?: string;
  color?: string; // 'success' | 'warning' | 'error' | 'info'
}

/**
 * Chart Widget data
 */
export interface ChartWidgetData {
  chartType: 'LINE' | 'BAR' | 'PIE' | 'DONUT' | 'AREA' | 'COMBO';
  
  // Data
  series: ChartSeries[];
  
  // Axes
  xAxis?: ChartAxis;
  yAxis?: ChartAxis;
  
  // Legend
  legend?: {
    show: boolean;
    position: 'top' | 'bottom' | 'left' | 'right';
  };
}

/**
 * Chart series
 */
export interface ChartSeries {
  name: string;
  data: ChartDataPoint[];
  color?: string;
  type?: 'LINE' | 'BAR' | 'AREA'; // For combo charts
}

/**
 * Chart data point
 */
export interface ChartDataPoint {
  x: string | number; // Date or category
  y: number;
  label?: string; // For tooltips
}

/**
 * Chart axis
 */
export interface ChartAxis {
  label: string;
  type: 'CATEGORY' | 'VALUE' | 'TIME';
  format?: string; // Number/Date format
  min?: number;
  max?: number;
}

// ============================================================================
// API Types
// ============================================================================

/**
 * Request: Track interaction
 */
export interface TrackInteractionRequest {
  userId: string;
  sessionId: string;
  type: InteractionType;
  category: InsuranceCategory;
  productId?: string;
  pageUrl: string;
  elementId?: string;
  value?: any;
  deviceType: 'MOBILE' | 'TABLET' | 'DESKTOP';
  appSource: 'USER' | 'DRIVER' | 'MERCHANT';
  duration?: number;
}

export interface TrackInteractionResponse {
  interaction: CustomerInteraction;
  journey: CustomerJourney; // Updated journey
}

/**
 * Request: Get recommendations
 */
export interface GetRecommendationsRequest {
  userId: string;
  category?: InsuranceCategory;
  limit?: number;
}

export interface GetRecommendationsResponse {
  recommendations: AIRecommendation[];
}

/**
 * Request: Get dashboard data
 */
export interface GetDashboardDataRequest {
  reportType: ReportType;
  filter: DashboardFilter;
}

export interface GetDashboardDataResponse {
  data: any; // Type depends on reportType
  generatedAt: Date;
}

/**
 * Request: Get conversion funnel
 */
export interface GetConversionFunnelRequest {
  category: InsuranceCategory;
  productId?: string;
  filter: DashboardFilter;
}

export interface GetConversionFunnelResponse {
  funnel: ConversionFunnel;
}

/**
 * Request: Get product performance
 */
export interface GetProductPerformanceRequest {
  category: InsuranceCategory;
  productIds?: string[];
  filter: DashboardFilter;
}

export interface GetProductPerformanceResponse {
  products: ProductPerformance[];
}

/**
 * Request: Get agent performance
 */
export interface GetAgentPerformanceRequest {
  agentIds?: string[];
  filter: DashboardFilter;
}

export interface GetAgentPerformanceResponse {
  agents: AgentPerformance[];
}

/**
 * Request: Get customer journey
 */
export interface GetCustomerJourneyRequest {
  userId: string;
  category?: InsuranceCategory;
}

export interface GetCustomerJourneyResponse {
  journeys: CustomerJourney[];
  profile: CustomerProfile;
}

/**
 * Request: Trigger scenario
 */
export interface TriggerScenarioRequest {
  userId: string;
  scenario: SalesScenario;
  force?: boolean; // Override trigger conditions
}

export interface TriggerScenarioResponse {
  triggered: boolean;
  recommendations: AIRecommendation[];
  actions: ScenarioAction[];
}

/**
 * Request: Create A/B test
 */
export interface CreateABTestRequest {
  name: string;
  description: string;
  hypothesis: string;
  category: InsuranceCategory;
  productId?: string;
  segment?: CustomerSegment;
  variants: {
    name: string;
    description: string;
    changes: Record<string, any>;
  }[];
  trafficAllocation: Record<string, number>;
  startDate: Date;
  endDate: Date;
  primaryMetric: MetricType;
  secondaryMetrics?: MetricType[];
}

export interface CreateABTestResponse {
  test: ABTest;
}

/**
 * Request: Get A/B test results
 */
export interface GetABTestResultsRequest {
  testId: string;
}

export interface GetABTestResultsResponse {
  test: ABTest;
  analysis: {
    winner?: string;
    confidenceLevel: number;
    recommendation: string;
    insights: string[];
  };
}
