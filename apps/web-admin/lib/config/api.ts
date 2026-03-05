export const API_CONFIG = {
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000',
  apiPrefix: '/api/v1',
  timeout: 30000,
};

export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: '/auth/login',
    LOGOUT: '/auth/logout',
    REFRESH: '/auth/refresh',
    PROFILE: '/auth/profile',
    CHANGE_PASSWORD: '/auth/change-password',
    MFA_SETUP: '/auth/mfa/setup',
    MFA_VERIFY: '/auth/mfa/verify',
    MFA_DISABLE: '/auth/mfa/disable',
    MFA_COMPLETE_LOGIN: '/auth/mfa/complete-login',
  },
  DRIVERS: {
    LIST: '/drivers/list',
    STATS: '/drivers/stats',
    BY_ID: (id: string) => `/drivers/${id}`,
    VERIFY: (id: string) => `/drivers/${id}/verify`,
  },
  USERS: {
    LIST: '/users',
    STATS: '/users/stats',
    BY_ID: (id: string) => `/users/${id}`,
    DELETE: (id: string) => `/users/${id}`,
  },
  DASHBOARD: {
    QUICK_STATS: '/dashboard/quick-stats',
    CHART_STATS: '/dashboard/chart-stats',
    REGION_STATS: '/dashboard/region-stats',
  },
  CONTENT: {
    LIST: '/content',
    CREATE: '/content',
    BY_ID: (id: string) => `/content/detail/${id}`,
    UPDATE: (id: string) => `/content/${id}`,
    PUBLIC_LINKS: '/content/public/links',
  },
  TRAINING: {
    CATEGORIES: '/training/categories',
    CATEGORY_BY_ID: (id: string) => `/training/categories/${id}`,
    MATERIALS: '/training/materials',
    MATERIAL_BY_ID: (id: string) => `/training/materials/${id}`,
    PUBLIC_LINKS: '/training/public/links',
    PUBLIC_BY_SLUG: (slug: string) => `/training/public/${slug}`,
  },
  NEWS: {
    LIST: '/news',
    CREATE: '/news',
    UPLOAD: '/news/upload',
    BY_ID: (id: string) => `/news/${id}`,
    UPDATE: (id: string) => `/news/${id}`,
    PUBLIC_LINKS: '/news/public/links',
    PUBLIC_BY_SLUG: (slug: string) => `/news/public/${slug}`,
  },
  PRICING: {
    FARE_CONFIG: '/pricing/fare-config',
    FARE_UPDATE: (vt: string) => `/pricing/fare-config/${vt}`,
    TABLES: '/pricing/tables',
    TABLE_BY_ID: (id: string) => `/pricing/tables/${id}`,
    TABLE_PARAMS: (id: string) => `/pricing/tables/${id}/params`,
    TABLE_PARAM: (tId: string, pId: string) => `/pricing/tables/${tId}/params/${pId}`,
    TABLE_PARAM_TOGGLES: (tId: string, pId: string) =>
      `/pricing/tables/${tId}/params/${pId}/toggles`,
    TABLE_DELIVERY_PARAMS: (id: string) => `/pricing/tables/${id}/delivery-params`,
    TABLE_DELIVERY_PARAM: (tId: string, pId: string) =>
      `/pricing/tables/${tId}/delivery-params/${pId}`,
    TABLE_DELIVERY_PARAM_TOGGLES: (tId: string, pId: string) =>
      `/pricing/tables/${tId}/delivery-params/${pId}/toggles`,
  },
  LUCKY_WHEEL: {
    STATS: '/lucky-wheel/stats',
    CAMPAIGNS: '/lucky-wheel/campaigns',
    CAMPAIGN_BY_ID: (id: string) => `/lucky-wheel/campaigns/${id}`,
    CAMPAIGN_STATS: (id: string) => `/lucky-wheel/campaigns/${id}/stats`,
    CAMPAIGN_PRIZES: (id: string) => `/lucky-wheel/campaigns/${id}/prizes`,
    CAMPAIGN_PRIZE: (cId: string, pId: string) => `/lucky-wheel/campaigns/${cId}/prizes/${pId}`,
    SPINS: '/lucky-wheel/spins',
  },
  COUPONS: {
    LIST: '/loyalty/coupons',
    CREATE: '/loyalty/coupons',
    BY_ID: (id: string) => `/loyalty/coupons/detail/${id}`,
    UPDATE: (id: string) => `/loyalty/coupons/${id}`,
    STATS: '/loyalty/coupons/stats',
  },
  AFFILIATE: {
    STATS: '/loyalty/referrals/admin/stats',
    LIST: '/loyalty/referrals/admin',
  },
  LOYALTY_XU: {
    STATS: '/loyalty/xu/admin/stats',
  },
  RUN_TO_EARN: {
    STATS: '/run-to-earn/stats',
    CAMPAIGNS: '/run-to-earn/campaigns',
    CAMPAIGN_BY_ID: (id: string) => `/run-to-earn/campaigns/${id}`,
    CAMPAIGN_PRIZES: (id: string) => `/run-to-earn/campaigns/${id}/prizes`,
  },
  MARKETING: {
    STATS: '/marketing/stats',
    CAMPAIGNS: '/marketing/campaigns',
    CAMPAIGN_BY_ID: (id: string) => `/marketing/campaigns/${id}`,
  },
  MERCHANTS: {
    ADMIN_LIST: '/merchants/admin/list',
    ADMIN_BY_ID: (id: string) => `/merchants/admin/${id}`,
    ADMIN_VERIFY: (id: string) => `/merchants/admin/${id}/verify`,
    SELLER_LEADS: '/merchants/admin/seller-leads',
    SELLER_LEAD_UPDATE: (id: string) => `/merchants/admin/seller-leads/${id}`,
  },
  ORDERS: {
    ADMIN_LIST: '/orders/admin/list',
    ADMIN_BY_ID: (id: string) => `/orders/admin/${id}`,
  },
  AUDIT: {
    LOGS: '/audit/logs',
  },
  REGIONS: {
    LIST: '/regions',
    BY_ID: (id: string) => `/regions/${id}`,
    SERVICES: (id: string) => `/regions/${id}/services`,
    ASSIGN_SERVICE: (id: string) => `/regions/${id}/services`,
  },
  FRANCHISE: {
    PARTNERS: '/franchise/partners',
    PARTNER_BY_ID: (id: string) => `/franchise/partners/${id}`,
    PARTNER_REGIONS: (id: string) => `/franchise/partners/${id}/regions`,
    ASSIGN_REGION: (id: string) => `/franchise/partners/${id}/regions`,
  },
  WEALTH: {
    LEADS: '/wealth/consulting',
    LEAD_BY_ID: (id: string) => `/wealth/consulting/${id}`,
    UPDATE_LEAD: (id: string) => `/wealth/consulting/${id}`,
  },
  AN_CU: {
    LEADS: '/an-cu-lac-nghiep/consulting',
    LEAD_BY_ID: (id: string) => `/an-cu-lac-nghiep/consulting/${id}`,
    UPDATE_LEAD: (id: string) => `/an-cu-lac-nghiep/consulting/${id}`,
  },
  BDS: {
    LEADS: '/bat-dong-san/find-requests',
    LEAD_BY_ID: (id: string) => `/bat-dong-san/find-requests/${id}`,
    UPDATE_LEAD: (id: string) => `/bat-dong-san/find-requests/${id}`,
    ARTICLES: '/bat-dong-san/articles',
    ARTICLE_BY_ID: (id: string) => `/bat-dong-san/articles/${id}`,
    RENTAL_LISTINGS: '/bat-dong-san/rental-listings',
    RENTAL_BY_ID: (id: string) => `/bat-dong-san/rental-listings/${id}`,
  },
} as const;
