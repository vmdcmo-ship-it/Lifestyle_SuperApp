export const ADMIN_STORAGE_KEYS = {
  ACCESS_TOKEN: 'admin_accessToken',
  REFRESH_TOKEN: 'admin_refreshToken',
  USER: 'admin_user',
  /** Cookie name for middleware auth check (must match) */
  AUTH_COOKIE: 'admin_auth',
  /** Role cookie - middleware checks ADMIN */
  ROLE_COOKIE: 'admin_role',
} as const;
