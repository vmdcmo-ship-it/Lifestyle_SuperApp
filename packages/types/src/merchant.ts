/**
 * Merchant App System
 * Hệ thống quản lý cho đối tác bán hàng (Nhà hàng, Quán ăn, Siêu thị, Cửa hàng)
 */

// ==================== ENUMS ====================

export enum MerchantType {
  RESTAURANT = 'RESTAURANT', // Nhà hàng
  CAFE = 'CAFE', // Quán cafe
  FOOD_STALL = 'FOOD_STALL', // Quán ăn
  SUPERMARKET = 'SUPERMARKET', // Siêu thị
  CONVENIENCE_STORE = 'CONVENIENCE_STORE', // Cửa hàng tiện lợi
  GROCERY = 'GROCERY', // Tạp hóa
  BAKERY = 'BAKERY', // Tiệm bánh
  PHARMACY = 'PHARMACY', // Nhà thuốc
  FASHION = 'FASHION', // Thời trang
  ELECTRONICS = 'ELECTRONICS', // Điện tử
  BEAUTY = 'BEAUTY', // Mỹ phẩm
  HOME_GARDEN = 'HOME_GARDEN', // Nhà cửa & Vườn
  BOOKS = 'BOOKS', // Sách
  TOYS = 'TOYS', // Đồ chơi
  SPORTS = 'SPORTS', // Thể thao
  OTHER = 'OTHER', // Khác
}

export enum MerchantStatus {
  PENDING = 'PENDING', // Chờ duyệt
  ACTIVE = 'ACTIVE', // Hoạt động
  INACTIVE = 'INACTIVE', // Ngừng hoạt động
  SUSPENDED = 'SUSPENDED', // Bị tạm ngưng
  REJECTED = 'REJECTED', // Bị từ chối
}

export enum ProductStatus {
  DRAFT = 'DRAFT', // Nháp
  ACTIVE = 'ACTIVE', // Đang bán
  OUT_OF_STOCK = 'OUT_OF_STOCK', // Hết hàng
  HIDDEN = 'HIDDEN', // Ẩn
  DELETED = 'DELETED', // Đã xóa
}

export enum OrderStatus {
  PENDING = 'PENDING', // Chờ xác nhận
  CONFIRMED = 'CONFIRMED', // Đã xác nhận
  PREPARING = 'PREPARING', // Đang chuẩn bị
  READY = 'READY', // Sẵn sàng lấy hàng
  PICKED_UP = 'PICKED_UP', // Đã lấy hàng
  COMPLETED = 'COMPLETED', // Hoàn thành
  CANCELLED = 'CANCELLED', // Đã hủy
  RETURNED = 'RETURNED', // Hoàn trả
  REFUNDED = 'REFUNDED', // Hoàn tiền
}

export enum ReviewStatus {
  PENDING = 'PENDING', // Chờ phản hồi
  REPLIED = 'REPLIED', // Đã phản hồi
  HIDDEN = 'HIDDEN', // Bị ẩn
  REPORTED = 'REPORTED', // Bị báo cáo
}

export enum PromotionType {
  DISCOUNT_CODE = 'DISCOUNT_CODE', // Mã giảm giá
  FREE_GIFT = 'FREE_GIFT', // Quà tặng kèm
  BUY_X_GET_Y = 'BUY_X_GET_Y', // Mua X tặng Y
  FLASH_SALE = 'FLASH_SALE', // Flash sale
  COMBO_DEAL = 'COMBO_DEAL', // Combo deal
  FREE_SHIPPING = 'FREE_SHIPPING', // Miễn phí vận chuyển
}

export enum PromotionStatus {
  DRAFT = 'DRAFT',
  SCHEDULED = 'SCHEDULED',
  ACTIVE = 'ACTIVE',
  ENDED = 'ENDED',
  CANCELLED = 'CANCELLED',
}

export enum AdCampaignStatus {
  DRAFT = 'DRAFT',
  PENDING_APPROVAL = 'PENDING_APPROVAL',
  ACTIVE = 'ACTIVE',
  PAUSED = 'PAUSED',
  ENDED = 'ENDED',
  REJECTED = 'REJECTED',
}

// ==================== MERCHANT PROFILE ====================

/**
 * Merchant Store Profile
 * Hồ sơ cửa hàng/quán
 */
export interface MerchantProfile {
  id: string;
  
  // Basic Info
  name: string; // Tên cửa hàng
  slug: string; // URL-friendly name (for SEO)
  type: MerchantType;
  description: string; // Mô tả (max 500 chars)
  
  // Branding
  logo: string; // Logo URL
  coverBanner: string[]; // Top banner images (max 3 for slideshow)
  brandColor?: string; // Màu thương hiệu
  
  // Contact
  phone: string;
  email: string;
  address: {
    street: string;
    ward: string;
    district: string;
    city: string;
    coordinates: {
      lat: number;
      lng: number;
    };
  };
  
  // Business hours
  businessHours: {
    [key: string]: { // "monday", "tuesday", etc.
      isOpen: boolean;
      openTime: string; // "08:00"
      closeTime: string; // "22:00"
    };
  };
  
  // Ratings & Stats
  rating: {
    overall: number; // 0-5
    productQuality: number; // 0-5
    fulfillmentSpeed: number; // 0-5
    service: number; // 0-5
    totalReviews: number;
    negativeRate: number; // % negative reviews
  };
  
  // Followers
  followerCount: number;
  
  // Status
  status: MerchantStatus;
  isVerified: boolean;
  isPremium: boolean;
  
  // SEO
  seoTitle?: string;
  seoDescription?: string;
  seoKeywords?: string[];
  
  // Metadata
  createdAt: Date;
  updatedAt: Date;
  lastActiveAt: Date;
}

/**
 * Merchant Owner/Manager
 */
export interface MerchantOwner {
  id: string;
  merchantId: string;
  
  // Personal Info
  fullName: string;
  phone: string;
  email: string;
  idNumber: string; // CCCD/CMND
  
  // Business License
  businessLicense?: {
    number: string;
    type: string; // Giấy phép ĐKKD, ATTP, etc.
    issueDate: Date;
    expiryDate?: Date;
    documentUrl: string;
  };
  
  // Role
  role: 'OWNER' | 'MANAGER' | 'STAFF';
  permissions: string[];
  
  // Status
  isActive: boolean;
  createdAt: Date;
}

// ==================== PRODUCT MANAGEMENT ====================

/**
 * Product Category
 * Danh mục sản phẩm
 */
export interface ProductCategory {
  id: string;
  merchantId: string;
  
  // Basic Info
  name: string;
  slug: string; // SEO-friendly
  description?: string;
  icon?: string; // Icon URL
  image?: string; // Category image
  
  // Hierarchy
  parentCategoryId?: string;
  level: number; // 1 = main, 2 = sub, 3 = sub-sub
  
  // Display
  displayOrder: number;
  isActive: boolean;
  
  // SEO
  seoTitle?: string;
  seoDescription?: string;
  
  // Metadata
  productCount: number;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Product
 * Sản phẩm
 */
export interface Product {
  id: string;
  merchantId: string;
  categoryId: string;
  
  // Basic Info
  name: string; // AI-suggested SEO-friendly name
  slug: string; // URL-friendly
  sku?: string; // Mã SKU
  
  // Description
  shortDescription: string; // Max 100 chars (for listing)
  description: string; // Max 300 chars (with rich text support)
  descriptionImages?: string[]; // Images in description
  
  // Media
  mainImage: string; // Main product image (required)
  images: string[]; // Additional images (max 9)
  video?: {
    platform: 'YOUTUBE' | 'FACEBOOK' | 'TIKTOK';
    url: string;
    embedUrl?: string;
  };
  
  // Pricing
  price: number; // VND
  originalPrice?: number; // VND (for discount display)
  costPrice?: number; // Giá vốn (for merchant only)
  
  // Variants (if applicable)
  hasVariants: boolean;
  variants?: ProductVariant[];
  
  // Stock
  stockQuantity: number;
  lowStockThreshold: number;
  
  // Specifications
  specifications: {
    key: string; // "Weight", "Size", "Color", etc.
    value: string;
  }[];
  
  // Attributes (for filtering/search)
  attributes: {
    brand?: string;
    material?: string;
    origin?: string; // Xuất xứ
    weight?: number; // grams
    dimensions?: {
      length: number;
      width: number;
      height: number;
      unit: 'cm' | 'mm';
    };
    expiryDate?: Date; // For food items
    tags: string[];
  };
  
  // Status
  status: ProductStatus;
  isAvailable: boolean; // Can be ordered now
  isFeatured: boolean; // Sản phẩm nổi bật
  
  // Stats
  viewCount: number;
  orderCount: number;
  rating: {
    average: number; // 0-5
    count: number;
  };
  
  // SEO
  seoTitle?: string;
  seoDescription?: string;
  seoKeywords?: string[];
  
  // Metadata
  createdAt: Date;
  updatedAt: Date;
  publishedAt?: Date;
}

/**
 * Product Variant
 * Phân loại sản phẩm (Size, Color, etc.)
 */
export interface ProductVariant {
  id: string;
  productId: string;
  
  // Variant Info
  name: string; // "Size M - Red"
  sku?: string;
  
  // Options
  options: {
    type: string; // "Size", "Color"
    value: string; // "M", "Red"
  }[];
  
  // Pricing
  price: number;
  originalPrice?: number;
  
  // Stock
  stockQuantity: number;
  
  // Media
  image?: string; // Variant-specific image
  
  // Status
  isActive: boolean;
  
  createdAt: Date;
  updatedAt: Date;
}

/**
 * AI Product Name Suggestion
 * Gợi ý tên sản phẩm chuẩn SEO bởi AI
 */
export interface ProductNameSuggestion {
  original: string;
  suggestions: {
    name: string;
    score: number; // 0-100 (SEO score)
    reasoning: string;
    keywords: string[];
  }[];
}

// ==================== REVIEWS & RATINGS ====================

/**
 * Product Review
 * Đánh giá sản phẩm từ khách hàng
 */
export interface ProductReview {
  id: string;
  productId: string;
  merchantId: string;
  customerId: string;
  orderId: string;
  
  // Rating
  rating: number; // 1-5 stars
  
  // Content
  comment: string; // Text review
  images?: string[]; // Review images (uploaded by customer)
  
  // Customer info (anonymized)
  customerName: string;
  customerAvatar?: string;
  isVerifiedPurchase: boolean;
  
  // Merchant Reply
  reply?: {
    text: string;
    repliedAt: Date;
    repliedBy: string;
    canEdit: false; // Merchant reply cannot be edited
  };
  
  // Status
  status: ReviewStatus;
  isPinned: boolean; // Merchant can pin positive reviews
  isHelpful: number; // Helpful count from other users
  
  // Moderation
  isEdited: boolean; // Customer can edit review
  editedAt?: Date;
  reportCount: number;
  
  // Metadata
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Store Review
 * Đánh giá tổng thể cửa hàng
 */
export interface StoreReview {
  id: string;
  merchantId: string;
  customerId: string;
  orderId: string;
  
  // Ratings (chi tiết)
  ratings: {
    productQuality: number; // 1-5
    fulfillmentSpeed: number; // 1-5
    packaging: number; // 1-5
    service: number; // 1-5
    overall: number; // Average of above
  };
  
  // Content
  comment: string;
  images?: string[];
  
  // Customer info
  customerName: string;
  customerAvatar?: string;
  
  // Merchant Reply
  reply?: {
    text: string;
    repliedAt: Date;
  };
  
  // Status
  status: ReviewStatus;
  
  createdAt: Date;
  updatedAt: Date;
}

// ==================== ORDER MANAGEMENT ====================

/**
 * Merchant Order
 * Đơn hàng từ khách
 */
export interface MerchantOrder {
  id: string;
  orderNumber: string;
  merchantId: string;
  customerId: string;
  
  // Items
  items: {
    productId: string;
    productName: string;
    productImage: string;
    variantId?: string;
    variantName?: string;
    quantity: number;
    price: number;
    subtotal: number;
  }[];
  
  // Pricing
  subtotal: number; // Sum of items
  discount: number; // From promotions
  shippingFee: number;
  total: number;
  
  // Customer Info
  customer: {
    name: string;
    phone: string;
    address: string;
  };
  
  // Delivery
  deliveryType: 'PICKUP' | 'DELIVERY';
  deliveryAddress?: string;
  deliveryNote?: string;
  driverId?: string;
  estimatedDeliveryTime?: Date;
  actualDeliveryTime?: Date;
  
  // Payment
  paymentMethod: string;
  paymentStatus: 'PENDING' | 'PAID' | 'REFUNDED';
  paidAt?: Date;
  
  // Status
  status: OrderStatus;
  statusHistory: {
    status: OrderStatus;
    timestamp: Date;
    note?: string;
  }[];
  
  // Cancellation/Return
  cancellationReason?: string;
  returnReason?: string;
  refundAmount?: number;
  refundedAt?: Date;
  
  // Metadata
  createdAt: Date;
  updatedAt: Date;
  completedAt?: Date;
}

// ==================== FINANCIAL ====================

/**
 * Merchant Wallet
 * Ví doanh thu của đối tác
 */
export interface MerchantWallet {
  merchantId: string;
  
  // Balances
  availableBalance: number; // Có thể rút
  pendingBalance: number; // Chờ xử lý (orders chưa hoàn thành)
  frozenBalance: number; // Bị phong tỏa (disputes, refunds)
  totalBalance: number; // Tổng
  
  // Stats
  totalRevenue: number; // Tổng doanh thu (all time)
  thisMonthRevenue: number;
  lastMonthRevenue: number;
  
  // Commission
  platformCommissionRate: number; // % (e.g., 15%)
  totalCommissionPaid: number;
  
  // Withdrawals
  lastWithdrawal?: {
    amount: number;
    date: Date;
    bankAccount: string;
  };
  
  // Bank Account
  bankAccount?: {
    bankName: string;
    accountNumber: string;
    accountName: string;
  };
  
  // Metadata
  updatedAt: Date;
}

/**
 * Transaction
 * Giao dịch tài chính
 */
export interface MerchantTransaction {
  id: string;
  merchantId: string;
  
  // Type
  type: 'ORDER_PAYMENT' | 'WITHDRAWAL' | 'REFUND' | 'COMMISSION' | 'ADJUSTMENT';
  
  // Amount
  amount: number; // VND (positive = credit, negative = debit)
  balance: number; // Balance after transaction
  
  // Reference
  referenceType: 'ORDER' | 'WITHDRAWAL' | 'REFUND';
  referenceId: string;
  
  // Description
  description: string;
  
  // Metadata
  createdAt: Date;
}

// ==================== ANALYTICS ====================

/**
 * Sales Analytics
 * Thống kê hiệu quả bán hàng
 */
export interface SalesAnalytics {
  merchantId: string;
  period: {
    startDate: Date;
    endDate: Date;
    type: 'DAY' | 'WEEK' | 'MONTH' | 'YEAR';
  };
  
  // Revenue
  revenue: {
    total: number; // VND
    average: number; // Average per day/order
    growth: number; // % vs previous period
    byDay: {
      date: string;
      amount: number;
    }[];
  };
  
  // Orders
  orders: {
    total: number;
    completed: number;
    cancelled: number;
    returned: number;
    averageValue: number; // VND
    growth: number; // % vs previous period
  };
  
  // Products
  topProducts: {
    productId: string;
    productName: string;
    productImage: string;
    unitsSold: number;
    revenue: number;
  }[];
  
  // Customers
  customers: {
    total: number;
    new: number;
    returning: number;
    repeatRate: number; // %
  };
  
  // Traffic
  traffic: {
    views: number;
    visitors: number;
    conversionRate: number; // % (orders / visitors)
  };
}

/**
 * Product Performance
 * Hiệu suất từng sản phẩm
 */
export interface ProductPerformance {
  productId: string;
  productName: string;
  
  period: {
    startDate: Date;
    endDate: Date;
  };
  
  // Sales
  sales: {
    quantity: number;
    revenue: number;
    growth: number; // % vs previous period
  };
  
  // Traffic
  traffic: {
    views: number;
    addToCart: number;
    purchases: number;
    conversionRate: number; // %
  };
  
  // Inventory
  inventory: {
    current: number;
    sold: number;
    turnoverRate: number; // times per period
  };
  
  // Reviews
  reviews: {
    average: number; // 0-5
    count: number;
    newReviews: number;
  };
}

// ==================== PROMOTIONS & MARKETING ====================

/**
 * Promotion Campaign
 * Chương trình khuyến mãi
 */
export interface PromotionCampaign {
  id: string;
  merchantId: string;
  
  // Basic Info
  name: string;
  description: string;
  type: PromotionType;
  
  // Discount Code (if applicable)
  code?: string; // "SUMMER2024"
  
  // Discount
  discount: {
    type: 'PERCENTAGE' | 'FIXED_AMOUNT';
    value: number; // % or VND
    maxDiscount?: number; // VND (for percentage type)
  };
  
  // Conditions
  conditions: {
    minOrderValue?: number; // VND
    maxUsagePerCustomer?: number;
    totalUsageLimit?: number;
    applicableProducts?: string[]; // Product IDs
    applicableCategories?: string[]; // Category IDs
    newCustomersOnly?: boolean;
  };
  
  // Free Gift (if applicable)
  freeGift?: {
    productId: string;
    productName: string;
    quantity: number;
  };
  
  // Flash Sale (if applicable)
  flashSale?: {
    timeSlots: {
      startTime: Date;
      endTime: Date;
      stockLimit: number;
    }[];
  };
  
  // Schedule
  startDate: Date;
  endDate: Date;
  
  // Status
  status: PromotionStatus;
  
  // Stats
  usageCount: number;
  totalDiscount: number; // VND given
  
  // Metadata
  createdAt: Date;
  updatedAt: Date;
}

// ==================== ADVERTISING ====================

/**
 * Ad Campaign
 * Chiến dịch quảng cáo trên nền tảng
 */
export interface AdCampaign {
  id: string;
  merchantId: string;
  
  // Basic Info
  name: string;
  objective: 'BRAND_AWARENESS' | 'TRAFFIC' | 'CONVERSIONS';
  
  // Ad Creative
  creative: {
    images: string[]; // Ad images
    headline: string;
    description: string;
    callToAction: string; // "Đặt ngay", "Xem ngay"
  };
  
  // Targeting
  targeting: {
    locations: string[]; // City/District
    ageRange?: { min: number; max: number };
    interests?: string[];
  };
  
  // Budget
  budget: {
    total: number; // VND
    daily: number; // VND per day
    bidAmount: number; // VND per click/impression
  };
  
  // Schedule
  startDate: Date;
  endDate: Date;
  
  // Placement
  placements: ('HOME' | 'SEARCH' | 'CATEGORY' | 'PRODUCT_DETAIL')[];
  
  // Status
  status: AdCampaignStatus;
  
  // Performance
  performance: {
    impressions: number;
    clicks: number;
    conversions: number;
    spend: number; // VND
    ctr: number; // %
    conversionRate: number; // %
    roas: number; // Return on ad spend
  };
  
  // Metadata
  createdAt: Date;
  updatedAt: Date;
}

// ==================== SUPPORT & CHAT ====================

/**
 * Support Ticket
 * Ticket hỗ trợ
 */
export interface SupportTicket {
  id: string;
  merchantId: string;
  
  // Type
  type: 'TECHNICAL' | 'ORDER' | 'PAYMENT' | 'PRODUCT' | 'OTHER';
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
  
  // Content
  subject: string;
  description: string;
  attachments?: string[];
  
  // Status
  status: 'OPEN' | 'IN_PROGRESS' | 'RESOLVED' | 'CLOSED';
  
  // Assignment
  assignedTo?: string; // Support agent ID
  
  // Messages
  messages: {
    from: 'MERCHANT' | 'AGENT' | 'SYSTEM';
    text: string;
    timestamp: Date;
  }[];
  
  // Metadata
  createdAt: Date;
  updatedAt: Date;
  resolvedAt?: Date;
}

/**
 * Chat Conversation
 * Cuộc hội thoại chat
 */
export interface ChatConversation {
  id: string;
  
  // Participants
  participants: {
    type: 'MERCHANT' | 'CUSTOMER' | 'DRIVER';
    id: string;
    name: string;
    avatar?: string;
  }[];
  
  // Context
  context?: {
    type: 'ORDER' | 'PRODUCT';
    referenceId: string;
  };
  
  // Last Message
  lastMessage: {
    text: string;
    from: string;
    timestamp: Date;
  };
  
  // Status
  unreadCount: number;
  isActive: boolean;
  
  // Metadata
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Chat Message
 */
export interface ChatMessage {
  id: string;
  conversationId: string;
  
  // Sender
  from: {
    type: 'MERCHANT' | 'CUSTOMER' | 'DRIVER' | 'SYSTEM';
    id: string;
    name: string;
  };
  
  // Content
  text: string;
  attachments?: {
    type: 'IMAGE' | 'FILE';
    url: string;
  }[];
  
  // Status
  isRead: boolean;
  readAt?: Date;
  
  // Metadata
  createdAt: Date;
}

// ==================== API TYPES ====================

export interface GetMerchantProfileRequest {
  merchantId: string;
}

export interface UpdateMerchantProfileRequest {
  merchantId: string;
  updates: Partial<MerchantProfile>;
}

export interface CreateProductRequest {
  merchantId: string;
  product: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>;
}

export interface UpdateProductRequest {
  productId: string;
  updates: Partial<Product>;
}

export interface GetOrdersRequest {
  merchantId: string;
  status?: OrderStatus;
  startDate?: Date;
  endDate?: Date;
  limit?: number;
  offset?: number;
}

export interface UpdateOrderStatusRequest {
  orderId: string;
  status: OrderStatus;
  note?: string;
}

export interface ReplyToReviewRequest {
  reviewId: string;
  reply: string;
}

export interface CreatePromotionRequest {
  merchantId: string;
  promotion: Omit<PromotionCampaign, 'id' | 'createdAt' | 'updatedAt'>;
}

export interface CreateAdCampaignRequest {
  merchantId: string;
  campaign: Omit<AdCampaign, 'id' | 'createdAt' | 'updatedAt'>;
}

export interface GetSalesAnalyticsRequest {
  merchantId: string;
  startDate: Date;
  endDate: Date;
  type: 'DAY' | 'WEEK' | 'MONTH';
}

export interface SendChatMessageRequest {
  conversationId: string;
  from: {
    type: 'MERCHANT' | 'CUSTOMER' | 'DRIVER';
    id: string;
  };
  text: string;
  attachments?: any[];
}
