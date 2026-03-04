/**
 * RBAC - Phân quyền theo vai trò
 * ADMIN = toàn quyền. Các role khác có phạm vi giới hạn theo permissions.
 */

export const PERMISSIONS = {
  DASHBOARD: 'dashboard:view',
  DRIVERS: 'drivers:view',
  CONTENT: 'content:view',
  TRAINING: 'training:view',
  NEWS: 'news:view',
  PRICING: 'pricing:view',
  MARKETING: 'marketing:view',
  COUPONS: 'coupons:view',
  LUCKY_WHEEL: 'lucky_wheel:view',
  MERCHANTS: 'merchants:view',
  ORDERS: 'orders:view',
  REGIONS: 'regions:view',
  FRANCHISE: 'franchise:view',
  AUDIT: 'audit:view',
  SETTINGS: 'settings:view',
  USERS: 'users:view',
  WEALTH_LEADS: 'wealth_leads:view',
  AN_CU_LEADS: 'an_cu_leads:view',
} as const;

export type Permission = (typeof PERMISSIONS)[keyof typeof PERMISSIONS];

/** Role -> danh sách permissions (ADMIN có tất cả) */
export const ROLE_PERMISSIONS: Record<string, Permission[]> = {
  ADMIN: Object.values(PERMISSIONS),
  ADMIN_TRANSPORT: [
    PERMISSIONS.DASHBOARD,
    PERMISSIONS.DRIVERS,
    PERMISSIONS.PRICING,
    PERMISSIONS.REGIONS,
    PERMISSIONS.FRANCHISE,
    PERMISSIONS.ORDERS,
    PERMISSIONS.MERCHANTS,
    PERMISSIONS.TRAINING,
    PERMISSIONS.SETTINGS,
  ],
  ADMIN_MARKETING: [
    PERMISSIONS.DASHBOARD,
    PERMISSIONS.MARKETING,
    PERMISSIONS.COUPONS,
    PERMISSIONS.LUCKY_WHEEL,
    PERMISSIONS.CONTENT,
    PERMISSIONS.TRAINING,
    PERMISSIONS.NEWS,
    PERMISSIONS.WEALTH_LEADS,
    PERMISSIONS.SETTINGS,
  ],
  ADMIN_INSURANCE: [PERMISSIONS.DASHBOARD, PERMISSIONS.WEALTH_LEADS, PERMISSIONS.SETTINGS],
  SUPERVISOR: [
    PERMISSIONS.DASHBOARD,
    PERMISSIONS.DRIVERS,
    PERMISSIONS.ORDERS,
    PERMISSIONS.MERCHANTS,
    PERMISSIONS.SETTINGS,
  ],
  CSKH: [PERMISSIONS.DASHBOARD, PERMISSIONS.ORDERS, PERMISSIONS.MERCHANTS, PERMISSIONS.SETTINGS],
  ACCOUNTANT: [
    PERMISSIONS.DASHBOARD,
    PERMISSIONS.ORDERS,
    PERMISSIONS.MERCHANTS,
    PERMISSIONS.PRICING,
    PERMISSIONS.SETTINGS,
  ],
};

export const ROLE_LABELS: Record<string, string> = {
  ADMIN: 'Quản trị viên',
  ADMIN_TRANSPORT: 'Admin vận tải',
  ADMIN_MARKETING: 'Admin marketing',
  ADMIN_INSURANCE: 'Admin bảo hiểm',
  SUPERVISOR: 'Giám sát',
  CSKH: 'Chăm sóc khách hàng',
  ACCOUNTANT: 'Kế toán',
};

/** Các role được phép đăng nhập web-admin */
export const WEB_ADMIN_ROLES = [
  'ADMIN',
  'ADMIN_TRANSPORT',
  'ADMIN_MARKETING',
  'ADMIN_INSURANCE',
  'SUPERVISOR',
  'CSKH',
  'ACCOUNTANT',
] as const;

export function canAccessWebAdmin(role: string | undefined): boolean {
  return role !== undefined && (WEB_ADMIN_ROLES as readonly string[]).includes(role);
}

export function hasPermission(role: string | undefined, permission: Permission): boolean {
  if (!role) return false;
  const perms = ROLE_PERMISSIONS[role];
  if (!perms) return false;
  return perms.includes(permission);
}

/** Map pathname (segment) -> permission cần có */
export const PATH_PERMISSIONS: Record<string, Permission> = {
  '': PERMISSIONS.DASHBOARD,
  users: PERMISSIONS.USERS,
  drivers: PERMISSIONS.DRIVERS,
  content: PERMISSIONS.CONTENT,
  training: PERMISSIONS.TRAINING,
  news: PERMISSIONS.NEWS,
  pricing: PERMISSIONS.PRICING,
  marketing: PERMISSIONS.MARKETING,
  coupons: PERMISSIONS.COUPONS,
  'lucky-wheel': PERMISSIONS.LUCKY_WHEEL,
  merchants: PERMISSIONS.MERCHANTS,
  orders: PERMISSIONS.ORDERS,
  regions: PERMISSIONS.REGIONS,
  franchise: PERMISSIONS.FRANCHISE,
  audit: PERMISSIONS.AUDIT,
  settings: PERMISSIONS.SETTINGS,
  wealth: PERMISSIONS.WEALTH_LEADS,
  'an-cu-leads': PERMISSIONS.AN_CU_LEADS,
};

export function getRequiredPermissionForPath(pathname: string): Permission | null {
  const segment = pathname.replace(/^\//, '').split('/')[0] || '';
  return PATH_PERMISSIONS[segment] ?? null;
}
