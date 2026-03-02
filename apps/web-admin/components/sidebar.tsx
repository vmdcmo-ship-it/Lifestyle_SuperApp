'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { authService } from '@/lib/auth.service';
import { PERMISSIONS, hasPermission, type Permission } from '@/lib/rbac';

/** Menu items với permission (RBAC) */
const MENU_ITEMS: Array<{ href: string; label: string; permission: Permission }> = [
  { href: '/', label: 'Dashboard', permission: PERMISSIONS.DASHBOARD },
  { href: '/users', label: 'Người dùng', permission: PERMISSIONS.USERS },
  { href: '/drivers', label: 'Tài xế', permission: PERMISSIONS.DRIVERS },
  { href: '/content', label: 'Trung tâm thông tin', permission: PERMISSIONS.CONTENT },
  { href: '/training', label: 'Đào tạo', permission: PERMISSIONS.TRAINING },
  { href: '/news', label: 'Tin tức', permission: PERMISSIONS.NEWS },
  { href: '/pricing', label: 'Bảng giá', permission: PERMISSIONS.PRICING },
  { href: '/marketing', label: 'Trung tâm Marketing', permission: PERMISSIONS.MARKETING },
  { href: '/coupons', label: 'Voucher', permission: PERMISSIONS.COUPONS },
  { href: '/lucky-wheel', label: 'Lucky Wheel', permission: PERMISSIONS.LUCKY_WHEEL },
  { href: '/merchants', label: 'Cửa hàng', permission: PERMISSIONS.MERCHANTS },
  { href: '/orders', label: 'Đơn hàng', permission: PERMISSIONS.ORDERS },
  { href: '/regions', label: 'Khu vực địa lý', permission: PERMISSIONS.REGIONS },
  { href: '/franchise', label: 'Nhượng quyền', permission: PERMISSIONS.FRANCHISE },
  { href: '/audit', label: 'Audit Log', permission: PERMISSIONS.AUDIT },
  { href: '/settings', label: 'Cài đặt', permission: PERMISSIONS.SETTINGS },
];

function canAccessMenuItem(userRole: string | undefined, requiredPermission: Permission): boolean {
  return hasPermission(userRole, requiredPermission);
}

export function Sidebar(): JSX.Element {
  const pathname = usePathname();
  const user = authService.getStoredUser();

  return (
    <aside className="flex w-56 flex-col border-r bg-background">
      <div className="flex h-14 items-center gap-2 border-b px-4">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
          <span className="text-sm font-bold text-primary-foreground">L</span>
        </div>
        <span className="font-semibold">Web Admin</span>
      </div>

      <nav className="flex-1 space-y-0.5 p-2">
        {MENU_ITEMS.filter((item) => canAccessMenuItem(user?.role, item.permission)).map((item) => {
          const isActive =
            pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href));
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center justify-between rounded-lg px-3 py-2 text-sm transition-colors ${
                isActive
                  ? 'bg-primary/10 font-medium text-primary'
                  : 'text-muted-foreground hover:bg-muted hover:text-foreground'
              }`}
            >
              {item.label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
