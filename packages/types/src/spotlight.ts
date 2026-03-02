/**
 * Lifestyle Spotlight - Review & Redcomment System
 * "Trải nghiệm thực – Giá trị thực – Phong cách thực"
 * 
 * Features:
 * - TikTok-style vertical video reels (Redcomments)
 * - Community reviews & ratings
 * - KOC/Affiliate program
 * - SEO-optimized web content
 * - Content moderation & payout management
 */

// ============================================================================
// Enums
// ============================================================================

/**
 * Content type
 */
export enum SpotlightContentType {
  REDCOMMENT = 'REDCOMMENT', // Video/Content từ KOC (chuyên sâu)
  REVIEW = 'REVIEW', // Đánh giá từ user (nhanh)
}

/**
 * Redcomment format
 */
export enum RedcommentFormat {
  VIDEO_REEL = 'VIDEO_REEL', // Vertical video (TikTok style)
  ARTICLE = 'ARTICLE', // Bài viết phân tích
  PHOTO_ESSAY = 'PHOTO_ESSAY', // Bộ ảnh Aesthetic
  COMPARISON = 'COMPARISON', // So sánh sản phẩm/dịch vụ
}

/**
 * Target entity type (What is being reviewed)
 */
export enum SpotlightTargetType {
  // Products
  PRODUCT = 'PRODUCT', // Sản phẩm vật lý (túi, quần áo, etc.)
  
  // Services
  RESTAURANT = 'RESTAURANT', // Nhà hàng, quán ăn
  CAFE = 'CAFE', // Quán cà phê
  HOTEL = 'HOTEL', // Khách sạn
  TRAVEL = 'TRAVEL', // Tour du lịch
  INSURANCE = 'INSURANCE', // Bảo hiểm (BHXH, BHNT)
  
  // Lifestyle
  EVENT = 'EVENT', // Sự kiện
  EXPERIENCE = 'EXPERIENCE', // Trải nghiệm (spa, massage, etc.)
}

/**
 * Content status
 */
export enum ContentStatus {
  DRAFT = 'DRAFT', // Nháp (chưa submit)
  PENDING_REVIEW = 'PENDING_REVIEW', // Chờ duyệt
  APPROVED = 'APPROVED', // Đã duyệt, hiển thị
  REJECTED = 'REJECTED', // Từ chối
  HIDDEN = 'HIDDEN', // Ẩn (vi phạm sau khi publish)
}

/**
 * Rejection reason
 */
export enum RejectionReason {
  INAPPROPRIATE_CONTENT = 'INAPPROPRIATE_CONTENT', // Nội dung không phù hợp
  FALSE_INFORMATION = 'FALSE_INFORMATION', // Thông tin sai sự thật
  POOR_QUALITY = 'POOR_QUALITY', // Chất lượng kém
  COPYRIGHT_VIOLATION = 'COPYRIGHT_VIOLATION', // Vi phạm bản quyền
  SPAM = 'SPAM', // Spam
  OFFENSIVE_LANGUAGE = 'OFFENSIVE_LANGUAGE', // Ngôn từ xúc phạm
}

/**
 * Creator tier (KOC level)
 */
export enum CreatorTier {
  NEWCOMER = 'NEWCOMER', // < 1K followers
  RISING = 'RISING', // 1K-10K
  ESTABLISHED = 'ESTABLISHED', // 10K-100K
  INFLUENCER = 'INFLUENCER', // 100K-1M
  CELEBRITY = 'CELEBRITY', // > 1M
}

/**
 * Earning type
 */
export enum EarningType {
  CONTENT_FEE = 'CONTENT_FEE', // Nhuận bút nội dung
  AFFILIATE_COMMISSION = 'AFFILIATE_COMMISSION', // Hoa hồng Affiliate
  BONUS = 'BONUS', // Thưởng (performance, campaign)
  TIP = 'TIP', // Tiền tip từ viewer
}

/**
 * Payout status
 */
export enum PayoutStatus {
  PENDING = 'PENDING', // Chờ xử lý
  PROCESSING = 'PROCESSING', // Đang xử lý
  COMPLETED = 'COMPLETED', // Đã chi trả
  FAILED = 'FAILED', // Thất bại
  CANCELLED = 'CANCELLED', // Hủy
}

/**
 * Affiliate commission model
 */
export enum CommissionModel {
  PERCENTAGE = 'PERCENTAGE', // % doanh thu
  FIXED = 'FIXED', // Số tiền cố định / đơn
  TIERED = 'TIERED', // Bậc thang (càng nhiều, % càng cao)
  HYBRID = 'HYBRID', // Kết hợp
}

// ============================================================================
// Interfaces - Core Content
// ============================================================================

/**
 * Redcomment (Nội dung chuyên sâu từ KOC)
 */
export interface Redcomment {
  id: string;
  redcommentNumber: string; // LS-RDC-240214-001
  
  // Creator
  creatorId: string;
  creatorName: string;
  creatorAvatar: string;
  creatorTier: CreatorTier;
  creatorFollowers: number;
  affiliateId: string; // LS-ID-12345
  
  // Content
  format: RedcommentFormat;
  title: string;
  description: string; // Max 500 chars
  
  // Media
  videoUrl?: string; // For VIDEO_REEL
  videoDuration?: number; // Seconds
  thumbnailUrl?: string;
  photoUrls?: string[]; // For PHOTO_ESSAY
  coverImageUrl: string; // Main image
  
  // Target
  targetType: SpotlightTargetType;
  targetId: string; // Product/Service ID
  targetName: string;
  targetTags: string[]; // Product tags visible on video
  
  // Rating (from creator)
  overallRating: number; // 1-5 stars (0.5 increments)
  categoryRatings?: {
    category: string; // "Chất lượng", "Giá cả", "Dịch vụ"
    rating: number;
  }[];
  
  // SEO
  seoSlug: string; // "review-tui-dior-lady-dep-sang-chanh"
  seoTitle: string; // AI-generated or manual
  seoDescription: string;
  seoKeywords: string[];
  aiTranscript?: string; // AI-generated từ video
  
  // CTA (Call to Action)
  ctaButtons: CTAButton[];
  
  // Engagement
  views: number;
  likes: number;
  shares: number;
  comments: number;
  saves: number;
  
  // Affiliate tracking
  clicks: number; // Total clicks on CTA
  conversions: number; // Total successful orders
  revenue: number; // Total revenue generated (for commission)
  
  // Status
  status: ContentStatus;
  rejectionReason?: RejectionReason;
  rejectionNote?: string;
  
  // Moderation
  moderatorId?: string;
  moderatedAt?: Date;
  
  // Metadata
  isSponsored: boolean;
  sponsorName?: string;
  isFeatured: boolean; // Nổi bật trên homepage
  isPinned: boolean; // Ghim lên đầu category
  
  // Dates
  publishedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * CTA Button (on Redcomment)
 */
export interface CTAButton {
  id: string;
  text: string; // "Thuê ngay", "Nhận tư vấn", "Mua ngay"
  action: 'BOOK' | 'CONSULT' | 'BUY' | 'CALL' | 'EXTERNAL_LINK';
  targetUrl?: string; // Deep link or external URL
  position: 'TOP_RIGHT' | 'BOTTOM_RIGHT' | 'BOTTOM_CENTER';
  
  // Tracking
  clicks: number;
  conversions: number;
}

/**
 * Review (Đánh giá nhanh từ user)
 */
export interface Review {
  id: string;
  reviewNumber: string; // LS-RVW-240214-001
  
  // User
  userId: string;
  userName: string;
  userAvatar: string;
  isVerifiedPurchase: boolean; // Đã mua/sử dụng thật
  
  // Target
  targetType: SpotlightTargetType;
  targetId: string;
  targetName: string;
  
  // Rating
  overallRating: number; // 1-5 stars
  categoryRatings?: {
    category: string;
    rating: number;
  }[];
  
  // Content
  title?: string;
  comment: string; // Max 1000 chars
  pros?: string[]; // Ưu điểm
  cons?: string[]; // Nhược điểm
  
  // Media
  photoUrls?: string[];
  videoUrl?: string;
  
  // Engagement
  likes: number;
  dislikes: number;
  helpfulCount: number; // "X người thấy hữu ích"
  replies: number; // Số reply từ merchant/other users
  
  // Merchant reply
  merchantReply?: {
    content: string;
    repliedAt: Date;
    repliedBy: string; // Merchant user ID
  };
  
  // Status
  status: ContentStatus;
  
  // Dates
  purchaseDate?: Date; // Ngày mua (if verified)
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Comment (on Redcomment or Review)
 */
export interface SpotlightComment {
  id: string;
  
  // Target
  targetType: 'REDCOMMENT' | 'REVIEW';
  targetId: string;
  
  // User
  userId: string;
  userName: string;
  userAvatar: string;
  
  // Content
  content: string; // Max 500 chars
  
  // Reply
  parentCommentId?: string; // If replying to another comment
  
  // Engagement
  likes: number;
  
  // Status
  isHidden: boolean;
  
  // Dates
  createdAt: Date;
  updatedAt: Date;
}

// ============================================================================
// Interfaces - Creator & Affiliate
// ============================================================================

/**
 * Creator (KOC/CTV profile)
 */
export interface Creator {
  id: string;
  affiliateId: string; // LS-ID-12345 (public, shareable)
  
  // Profile
  fullName: string;
  displayName: string;
  avatar: string;
  coverImage?: string;
  bio: string; // Max 300 chars
  
  // Contact
  email: string;
  phone: string;
  
  // Social links
  socialLinks?: {
    tiktok?: string;
    instagram?: string;
    facebook?: string;
    youtube?: string;
  };
  
  // Stats
  tier: CreatorTier;
  followers: number;
  totalRedcomments: number;
  approvedRedcomments: number;
  totalViews: number;
  totalLikes: number;
  avgEngagementRate: number; // %
  
  // Ratings
  averageRating: number; // 1-5 (from users rating creator's content)
  totalRatings: number;
  
  // Specialties
  categories: SpotlightTargetType[]; // Chuyên về category nào
  tags: string[]; // "Food reviewer", "Fashion expert", etc.
  
  // Earnings
  totalEarnings: number;
  lifetimeEarnings: number;
  currentBalance: number; // Chưa rút
  
  // Commission rates (default, có thể override per merchant)
  defaultCommissionRate: number; // % (e.g., 10%)
  
  // Verification
  isVerified: boolean; // Verified creator (blue checkmark)
  verificationLevel: 'NONE' | 'EMAIL' | 'PHONE' | 'IDENTITY' | 'FULL';
  
  // Status
  status: 'ACTIVE' | 'SUSPENDED' | 'BANNED';
  suspensionReason?: string;
  
  // Dates
  joinedAt: Date;
  lastActiveAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Affiliate program (Merchant-specific)
 */
export interface AffiliateProgram {
  id: string;
  
  // Merchant
  merchantId: string;
  merchantName: string;
  merchantCategory: SpotlightTargetType;
  
  // Commission structure
  commissionModel: CommissionModel;
  
  // For PERCENTAGE
  commissionRate?: number; // % (e.g., 15%)
  
  // For FIXED
  commissionPerConversion?: number; // Fixed amount per order
  
  // For TIERED
  tiers?: {
    minConversions: number; // Tối thiểu số đơn
    maxConversions?: number; // Tối đa (undefined = no limit)
    commissionRate: number; // % for this tier
  }[];
  
  // Rules
  cookieDuration: number; // Days (e.g., 30 days tracking)
  minPayout: number; // Minimum balance to withdraw
  payoutFrequency: 'WEEKLY' | 'BIWEEKLY' | 'MONTHLY';
  
  // Eligibility
  minFollowers?: number; // Tối thiểu followers để join
  allowedCreatorTiers?: CreatorTier[];
  requiresApproval: boolean; // Merchant must approve creator
  
  // Terms
  terms: string; // HTML/Markdown
  
  // Status
  isActive: boolean;
  
  // Dates
  startDate: Date;
  endDate?: Date;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Creator earnings record
 */
export interface CreatorEarning {
  id: string;
  
  // Creator
  creatorId: string;
  affiliateId: string;
  
  // Type
  type: EarningType;
  
  // Source
  sourceType: 'REDCOMMENT' | 'REVIEW' | 'CAMPAIGN' | 'BONUS';
  sourceId?: string; // Redcomment ID, Campaign ID, etc.
  
  // For CONTENT_FEE
  contentFee?: number;
  contentQualityBonus?: number; // Bonus for high-quality content
  
  // For AFFILIATE_COMMISSION
  orderId?: string;
  orderValue?: number;
  commissionRate?: number; // % at time of order
  commissionAmount?: number;
  merchantId?: string;
  
  // Total
  amount: number;
  currency: string; // VND
  
  // Status
  status: 'PENDING' | 'CONFIRMED' | 'PAID' | 'CANCELLED';
  
  // Dates
  earnedAt: Date;
  confirmedAt?: Date;
  paidAt?: Date;
  createdAt: Date;
}

/**
 * Payout request (Withdrawal)
 */
export interface PayoutRequest {
  id: string;
  payoutNumber: string; // LS-PAYOUT-240214-001
  
  // Creator
  creatorId: string;
  creatorName: string;
  
  // Amount
  requestedAmount: number;
  fee: number; // Transaction fee
  netAmount: number; // After fee
  currency: string; // VND
  
  // Breakdown
  earnings: {
    contentFees: number;
    affiliateCommissions: number;
    bonuses: number;
    tips: number;
  };
  
  // Payment method
  paymentMethod: 'BANK_TRANSFER' | 'WALLET' | 'CASH';
  bankDetails?: {
    bankName: string;
    accountNumber: string;
    accountName: string;
  };
  
  // Status
  status: PayoutStatus;
  rejectionReason?: string;
  
  // Processing
  processedBy?: string; // Admin user ID
  processedAt?: Date;
  
  // Dates
  requestedAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

// ============================================================================
// Interfaces - Admin & Moderation
// ============================================================================

/**
 * Content moderation queue item
 */
export interface ModerationQueueItem {
  id: string;
  
  // Content
  contentType: 'REDCOMMENT' | 'REVIEW' | 'COMMENT';
  contentId: string;
  content: Redcomment | Review | SpotlightComment;
  
  // Creator/User
  creatorId: string;
  creatorName: string;
  creatorTier?: CreatorTier;
  
  // Priority
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
  
  // AI pre-screening
  aiScore?: {
    qualityScore: number; // 0-100
    appropriatenessScore: number; // 0-100
    flags: string[]; // Potential issues detected by AI
    recommendation: 'APPROVE' | 'REVIEW' | 'REJECT';
  };
  
  // Assignment
  assignedTo?: string; // Moderator ID
  assignedAt?: Date;
  
  // Status
  status: 'PENDING' | 'IN_REVIEW' | 'APPROVED' | 'REJECTED';
  
  // Dates
  submittedAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Moderation action (History)
 */
export interface ModerationAction {
  id: string;
  
  // Content
  contentType: 'REDCOMMENT' | 'REVIEW' | 'COMMENT';
  contentId: string;
  
  // Moderator
  moderatorId: string;
  moderatorName: string;
  
  // Action
  action: 'APPROVE' | 'REJECT' | 'HIDE' | 'FLAG';
  reason?: RejectionReason;
  note?: string;
  
  // Dates
  createdAt: Date;
}

/**
 * Merchant affiliate settings
 */
export interface MerchantAffiliateSettings {
  id: string;
  merchantId: string;
  
  // Program
  affiliateProgramId: string;
  
  // Commission override (for specific creators)
  creatorOverrides?: {
    creatorId: string;
    commissionRate: number;
    note?: string;
  }[];
  
  // Auto-approval
  autoApproveCreators: boolean;
  minFollowersForAutoApproval?: number;
  
  // Tracking
  totalClicks: number;
  totalConversions: number;
  totalRevenue: number;
  totalCommissionPaid: number;
  
  // Dates
  createdAt: Date;
  updatedAt: Date;
}

// ============================================================================
// Interfaces - SEO & Web
// ============================================================================

/**
 * SEO content (AI-generated from video)
 */
export interface SEOContent {
  id: string;
  
  // Source
  redcommentId: string;
  
  // AI-generated
  transcript: string; // Full transcript from video
  summary: string; // 300 chars
  keyPoints: string[]; // Main takeaways
  
  // SEO
  metaTitle: string; // 60 chars
  metaDescription: string; // 160 chars
  keywords: string[];
  headings: {
    h1: string;
    h2: string[];
    h3?: string[];
  };
  
  // Schema.org markup
  structuredData: {
    '@context': 'https://schema.org';
    '@type': 'Review' | 'Product' | 'Service';
    name: string;
    reviewRating: {
      '@type': 'Rating';
      ratingValue: number;
      bestRating: number;
    };
    author: {
      '@type': 'Person';
      name: string;
    };
    // ... more schema fields
  };
  
  // Content
  htmlContent: string; // Full HTML article
  
  // Performance
  impressions: number; // Google Search impressions
  clicks: number; // Clicks from search
  ctr: number; // Click-through rate (%)
  avgPosition: number; // Avg position in search results
  
  // Status
  isPublished: boolean;
  publishedToWeb: boolean;
  
  // Dates
  generatedAt: Date;
  lastIndexedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Web page (for SEO)
 */
export interface SpotlightWebPage {
  id: string;
  
  // URL
  slug: string; // "review-tui-dior-lady"
  fullUrl: string; // "https://lifestyle.vn/spotlight/review-tui-dior-lady"
  
  // Content
  redcommentId: string;
  seoContentId: string;
  
  // SEO
  metaTitle: string;
  metaDescription: string;
  ogImage: string; // Open Graph image
  canonicalUrl: string;
  
  // CTA (to drive app downloads)
  ctaType: 'APP_DOWNLOAD' | 'VIEW_IN_APP';
  ctaText: string;
  qrCodeUrl?: string; // QR code image to open app
  
  // Performance
  pageViews: number;
  avgTimeOnPage: number; // Seconds
  bounceRate: number; // %
  appInstalls: number; // Tracked via QR/link
  
  // Status
  isPublished: boolean;
  
  // Dates
  publishedAt?: Date;
  lastUpdatedAt: Date;
  createdAt: Date;
}

// ============================================================================
// Interfaces - Analytics & Reporting
// ============================================================================

/**
 * Creator dashboard analytics
 */
export interface CreatorDashboard {
  creatorId: string;
  period: 'TODAY' | 'WEEK' | 'MONTH' | 'ALL_TIME';
  
  // Content stats
  totalRedcomments: number;
  pendingRedcomments: number;
  approvedRedcomments: number;
  rejectedRedcomments: number;
  
  // Engagement
  totalViews: number;
  totalLikes: number;
  totalShares: number;
  totalComments: number;
  avgEngagementRate: number; // %
  
  // Affiliate
  totalClicks: number;
  totalConversions: number;
  conversionRate: number; // %
  totalRevenue: number; // From conversions
  
  // Earnings
  contentFees: number;
  affiliateCommissions: number;
  bonuses: number;
  tips: number;
  totalEarnings: number;
  currentBalance: number;
  
  // Top performing content
  topRedcomments: {
    redcommentId: string;
    title: string;
    views: number;
    conversions: number;
    earnings: number;
  }[];
  
  // Dates
  periodStart: Date;
  periodEnd: Date;
  generatedAt: Date;
}

/**
 * Admin analytics (Overall)
 */
export interface SpotlightAdminAnalytics {
  period: 'TODAY' | 'WEEK' | 'MONTH' | 'YEAR';
  
  // Content
  totalRedcomments: number;
  totalReviews: number;
  pendingModeration: number;
  avgModerationTime: number; // Hours
  
  // Creators
  totalCreators: number;
  activeCreators: number; // Created content in period
  newCreators: number;
  
  // Engagement
  totalViews: number;
  totalInteractions: number; // Likes + shares + comments
  avgEngagementRate: number; // %
  
  // Affiliate
  totalAffiliateClicks: number;
  totalConversions: number;
  totalRevenue: number;
  totalCommissionPaid: number;
  avgCommissionRate: number; // %
  
  // SEO
  totalWebPages: number;
  totalSearchImpressions: number;
  totalSearchClicks: number;
  avgSearchCTR: number; // %
  appInstallsFromWeb: number;
  
  // Financial
  totalPayouts: number;
  pendingPayouts: number;
  
  // Top performers
  topCreators: {
    creatorId: string;
    name: string;
    views: number;
    conversions: number;
    earnings: number;
  }[];
  
  topRedcomments: {
    redcommentId: string;
    title: string;
    views: number;
    conversions: number;
    revenue: number;
  }[];
  
  // Dates
  periodStart: Date;
  periodEnd: Date;
  generatedAt: Date;
}

// ============================================================================
// API Request/Response Types
// ============================================================================

/**
 * Request: Create redcomment
 */
export interface CreateRedcommentRequest {
  format: RedcommentFormat;
  title: string;
  description: string;
  videoUrl?: string;
  photoUrls?: string[];
  coverImageUrl: string;
  targetType: SpotlightTargetType;
  targetId: string;
  overallRating: number;
  categoryRatings?: { category: string; rating: number }[];
  ctaButtons: Omit<CTAButton, 'id' | 'clicks' | 'conversions'>[];
  isSponsored?: boolean;
  sponsorName?: string;
}

export interface CreateRedcommentResponse {
  redcomment: Redcomment;
  message: string;
}

/**
 * Request: Get spotlight feed (TikTok-style)
 */
export interface GetSpotlightFeedRequest {
  // Pagination
  cursor?: string; // For infinite scroll
  limit?: number; // Default 10
  
  // Filters
  targetType?: SpotlightTargetType;
  creatorId?: string;
  isSponsored?: boolean;
  
  // Personalization (based on user)
  userId?: string;
}

export interface GetSpotlightFeedResponse {
  redcomments: Redcomment[];
  nextCursor?: string;
  hasMore: boolean;
}

/**
 * Request: Track CTA click
 */
export interface TrackCTAClickRequest {
  redcommentId: string;
  ctaButtonId: string;
  userId?: string;
  sessionId: string;
}

export interface TrackCTAClickResponse {
  tracked: boolean;
  targetUrl: string;
}

/**
 * Request: Record affiliate conversion
 */
export interface RecordAffiliateConversionRequest {
  orderId: string;
  affiliateId: string; // LS-ID from tracking
  orderValue: number;
  merchantId: string;
}

export interface RecordAffiliateConversionResponse {
  earning: CreatorEarning;
  commissionAmount: number;
}

/**
 * Request: Submit for moderation
 */
export interface SubmitForModerationRequest {
  redcommentId: string;
}

export interface SubmitForModerationResponse {
  queueItem: ModerationQueueItem;
  estimatedReviewTime: number; // Hours
}

/**
 * Request: Moderate content
 */
export interface ModerateContentRequest {
  queueItemId: string;
  action: 'APPROVE' | 'REJECT';
  reason?: RejectionReason;
  note?: string;
}

export interface ModerateContentResponse {
  success: boolean;
  updatedContent: Redcomment | Review;
}

/**
 * Request: Request payout
 */
export interface RequestPayoutRequest {
  amount: number;
  paymentMethod: 'BANK_TRANSFER' | 'WALLET' | 'CASH';
  bankDetails?: {
    bankName: string;
    accountNumber: string;
    accountName: string;
  };
}

export interface RequestPayoutResponse {
  payoutRequest: PayoutRequest;
  estimatedProcessingTime: number; // Days
}

/**
 * Request: Generate SEO content
 */
export interface GenerateSEOContentRequest {
  redcommentId: string;
  videoUrl: string;
  language?: string; // Default 'vi'
}

export interface GenerateSEOContentResponse {
  seoContent: SEOContent;
  webPage: SpotlightWebPage;
}
