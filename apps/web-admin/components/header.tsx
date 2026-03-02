'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { authService } from '@/lib/auth.service';
import { ROLE_LABELS } from '@/lib/rbac';

export function Header(): JSX.Element {
  const router = useRouter();
  const user = authService.getStoredUser();

  const handleLogout = async () => {
    try {
      await authService.logout();
    } catch {
      // Clear local state even if API fails
      const { clearAdminTokens } = await import('@/lib/api/api');
      clearAdminTokens();
    }
    router.push('/login');
    router.refresh();
  };

  return (
    <header className="flex h-14 items-center justify-between border-b bg-background px-6">
      <div className="text-sm text-muted-foreground">Lifestyle Super App · Web Admin</div>

      <div className="flex items-center gap-4">
        {user && (
          <span className="text-sm">
            <span className="text-muted-foreground">{user.email}</span>
            <span
              className="ml-2 rounded bg-primary/10 px-2 py-0.5 text-xs text-primary"
              title={user.role}
            >
              {ROLE_LABELS[user.role] ?? user.role}
            </span>
          </span>
        )}
        <Link href="/settings" className="rounded-lg border px-3 py-1.5 text-sm hover:bg-muted">
          Cài đặt
        </Link>
        <button
          type="button"
          onClick={handleLogout}
          className="rounded-lg border px-3 py-1.5 text-sm hover:bg-muted"
        >
          Đăng xuất
        </button>
      </div>
    </header>
  );
}
