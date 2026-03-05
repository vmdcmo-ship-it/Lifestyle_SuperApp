export const API_CONFIG = {
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000',
  apiPrefix: '/api/v1',
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
};

export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    LOGOUT: '/auth/logout',
    REFRESH: '/auth/refresh',
    PROFILE: '/auth/profile',
  },

  USERS: {
    LIST: '/users',
    STATS: '/users/stats',
    BY_ID: (id: string) => `/users/${id}`,
  },

  BOOKING: {
    ESTIMATE: '/booking/estimate',
    FIND_DRIVERS: '/booking/find-drivers',
    CREATE: '/booking/create',
    HISTORY: '/booking/history',
    BY_ID: (id: string) => `/booking/${id}`,
    CANCEL: (id: string) => `/booking/${id}/cancel`,
    ACCEPT: (id: string) => `/booking/${id}/accept`,
    STATUS: (id: string) => `/booking/${id}/status`,
    COMPLETE: (id: string) => `/booking/${id}/complete`,
    RATE: (id: string) => `/booking/${id}/rate`,
    DRIVER_LOCATION: '/booking/driver/location',
    DRIVER_STATUS: '/booking/driver/status',
    SIMULATE: '/booking/simulate/drivers',
  },

  DRIVERS: {
    REGISTER: '/drivers/register',
    PROFILE: '/drivers/profile',
    DASHBOARD: '/drivers/dashboard',
    VEHICLES: '/drivers/vehicles',
    LIST: '/drivers/list',
    STATS: '/drivers/stats',
    VERIFY: (id: string) => `/drivers/${id}/verify`,
  },

  MERCHANTS: {
    CREATE: '/merchants',
    LIST: '/merchants',
    MY: '/merchants/my',
    BY_ID: (id: string) => `/merchants/${id}`,
    STATS: (id: string) => `/merchants/${id}/stats`,
    CATEGORIES: (id: string) => `/merchants/${id}/categories`,
    PRODUCTS: (id: string) => `/merchants/${id}/products`,
    PRODUCT: (productId: string) => `/merchants/products/${productId}`,
  },

  ORDERS: {
    CREATE: '/orders',
    MY: '/orders/my',
    MERCHANT: (merchantId: string) => `/orders/merchant/${merchantId}`,
    BY_ID: (id: string) => `/orders/${id}`,
    STATUS: (id: string) => `/orders/${id}/status`,
    CANCEL: (id: string) => `/orders/${id}/cancel`,
    RATE: (id: string) => `/orders/${id}/rate`,
  },

  WALLET: {
    INFO: '/wallet',
    TOP_UP: '/wallet/top-up',
    PAY: '/wallet/pay',
    TRANSFER: '/wallet/transfer',
    WITHDRAW: '/wallet/withdraw',
    TRANSACTIONS: '/wallet/transactions',
    TRANSACTION: (id: string) => `/wallet/transactions/${id}`,
  },

  INSURANCE: {
    PRODUCTS: '/insurance/products',
    PRODUCT: (id: string) => `/insurance/products/${id}`,
    POLICIES: '/insurance/policies',
    POLICY: (id: string) => `/insurance/policies/${id}`,
    CLAIMS: '/insurance/claims',
  },

  LOYALTY: {
    XU: '/loyalty/xu',
    XU_HISTORY: '/loyalty/xu/history',
    XU_REDEEM: '/loyalty/xu/redeem',
    REWARDS: '/loyalty/rewards',
    COUPONS: '/loyalty/coupons',
    COUPON_APPLY: '/loyalty/coupons/apply',
    COUPON_CREATE: '/loyalty/coupons',
    REFERRAL: '/loyalty/referral',
    REFERRALS: '/loyalty/referrals',
  },

  ADDRESSES: {
    LIST: '/addresses',
    CREATE: '/addresses',
    BY_ID: (id: string) => `/addresses/${id}`,
    SET_DEFAULT: (id: string) => `/addresses/${id}/default`,
  },

  NOTIFICATIONS: {
    LIST: '/notifications',
    UNREAD_COUNT: '/notifications/unread-count',
    READ: (id: string) => `/notifications/${id}/read`,
    READ_ALL: '/notifications/read-all',
    DELETE: (id: string) => `/notifications/${id}`,
    SEND: '/notifications/send',
    SEND_BULK: '/notifications/send-bulk',
  },

  SPOTLIGHT: {
    FEED: '/spotlight/feed',
    FEED_FOLLOWING: '/spotlight/feed/following',
    REELS: '/spotlight/reels',
    CATEGORIES: '/spotlight/categories',
    LOCATIONS: '/spotlight/locations',
    SAVED: '/spotlight/saved',
    BY_ID: (id: string) => `/spotlight/${id}`,
    CREATOR: (id: string) => `/spotlight/creator/${id}`,
    CREATOR_FOLLOW: (id: string) => `/spotlight/creator/${id}/follow`,
    CREATOR_FOLLOWED: (id: string) => `/spotlight/creator/${id}/followed`,
    SAVE: (id: string) => `/spotlight/${id}/save`,
    SAVED_STATUS: (id: string) => `/spotlight/${id}/saved-status`,
    RELATED: (id: string) => `/spotlight/${id}/related`,
    CREATE: '/spotlight/redcomments',
    CREATE_POST: '/spotlight',
    MY: '/spotlight/my/redcomments',
    LIKE: (id: string) => `/spotlight/${id}/like`,
    COMMENT: (id: string) => `/spotlight/${id}/comments`,
    LINK_CLICK: (id: string) => `/spotlight/${id}/link-click`,
    REVIEWS: '/spotlight/reviews',
  },

  SEARCH: {
    QUERY: '/search',
    NEARBY: '/search/nearby',
  },

  CONTENT: {
    BY_SLUG: (slug: string) => `/content/${slug}`,
  },

  /** Bất động sản */
  BAT_DONG_SAN: {
    ARTICLES: '/bat-dong-san/articles',
    ARTICLE: (slug: string) => `/bat-dong-san/articles/${slug}`,
    RENTAL_LISTINGS: '/bat-dong-san/rental-listings',
    FIND_REQUESTS: '/bat-dong-san/find-requests',
  },

  HEALTH: '/health',
} as const;
