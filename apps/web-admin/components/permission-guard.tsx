'use client';

import { useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { authService } from '@/lib/auth.service';
import { getRequiredPermissionForPath, hasPermission } from '@/lib/rbac';

/**
 * Chuyển hướng về Dashboard nếu user không có quyền truy cập path hiện tại.
 * Chạy sau SessionGuard (đã xác thực user có role web-admin).
 */
export function PermissionGuard({ children }: { children: React.ReactNode }): JSX.Element {
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    const permission = getRequiredPermissionForPath(pathname);
    if (!permission) return; // Path không có trong map - cho qua (vd: /)

    const user = authService.getStoredUser();
    if (!user?.role) return;

    if (!hasPermission(user.role, permission)) {
      router.replace('/');
    }
  }, [pathname, router]);

  return <>{children}</>;
}
