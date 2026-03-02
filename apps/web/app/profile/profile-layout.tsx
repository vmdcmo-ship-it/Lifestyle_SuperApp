'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/lib/contexts/auth-context';

const PROFILE_LINKS = [
  { href: '/profile', label: 'Thông tin cá nhân', icon: '👤' },
  { href: '/profile/orders', label: 'Đơn hàng', icon: '📦' },
  { href: '/wallet', label: 'Ví Lifestyle', icon: '💳' },
  { href: '/profile/my-coins', label: 'Lifestyle Xu', icon: '🪙' },
  { href: '/savings-packages/my-subscriptions', label: 'Gói Tiết Kiệm', icon: '💰' },
  { href: '/referral', label: 'Giới thiệu & Nhận quà', icon: '👥' },
  { href: '/profile/addresses', label: 'Địa chỉ', icon: '📍' },
  { href: '/profile/settings', label: 'Cài đặt', icon: '⚙️' },
];

interface ProfileLayoutProps {
  children: React.ReactNode;
  title: string;
}

export function ProfileLayout({ children, title }: ProfileLayoutProps): JSX.Element {
  const pathname = usePathname();
  const { user } = useAuth();
  const displayName = user ? [user.firstName, user.lastName].filter(Boolean).join(' ') || 'Người dùng' : '';
  const avatarLetter = user?.firstName?.[0]?.toUpperCase() || user?.email?.[0]?.toUpperCase() || 'U';

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="mx-auto max-w-6xl">
        <h1 className="mb-8 text-4xl font-bold">{title}</h1>
        <div className="grid gap-6 lg:grid-cols-3">
          <aside className="lg:col-span-1">
            <div className="rounded-2xl border bg-card p-6 sticky top-24">
              <div className="mb-6 text-center">
                <div className="mx-auto mb-4 flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br from-purple-600 to-pink-600 text-3xl font-bold text-white">
                  {avatarLetter}
                </div>
                <h2 className="text-xl font-bold">{displayName}</h2>
                {user?.email && <p className="text-sm text-muted-foreground">{user.email}</p>}
              </div>
              <nav className="space-y-2">
                {PROFILE_LINKS.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`flex items-center gap-3 rounded-lg px-4 py-3 font-medium transition-colors ${
                      pathname === link.href
                        ? 'bg-accent text-foreground'
                        : 'text-muted-foreground hover:bg-accent hover:text-foreground'
                    }`}
                  >
                    <span>{link.icon}</span>
                    {link.label}
                  </Link>
                ))}
              </nav>
            </div>
          </aside>
          <div className="lg:col-span-2">{children}</div>
        </div>
      </div>
    </div>
  );
}
