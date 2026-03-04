// API Base URL - use env for different environments
// Local dev: 'http://localhost:3000/api/v1' or 'http://<YOUR_IP>:3000/api/v1' (same WiFi as device)
export const API_BASE = __DEV__
  ? (process.env.EXPO_PUBLIC_API_URL || 'https://api.vmd.asia/api/v1')
  : (process.env.EXPO_PUBLIC_API_URL || 'https://api.vmd.asia/api/v1');

// Web app base URL - dùng cho Shopping Mall, deep links, mở trang web trong WebView
// Production: https://lifestyle-app.com | Local: http://localhost:3001
export const WEB_BASE_URL =
  process.env.EXPO_PUBLIC_WEB_BASE_URL || 'https://lifestyle-app.com';

export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    LOGOUT: '/auth/logout',
    REFRESH: '/auth/refresh',
    PROFILE: '/auth/profile',
  },
  LOYALTY: {
    XU: '/loyalty/xu',
    REFERRAL: '/loyalty/referral',
    REFERRALS: '/loyalty/referrals',
  },
  WALLET: {
    INFO: '/wallet',
    TRANSACTIONS: '/wallet/transactions',
  },
  MERCHANTS: {
    LIST: '/merchants',
    BY_ID: (id: string) => `/merchants/${id}`,
    PRODUCTS: (id: string) => `/merchants/${id}/products`,
  },
} as const;
