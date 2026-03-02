'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/contexts/auth-context';
import { usersService } from '@/lib/services/users.service';
import { ordersService } from '@/lib/services/orders.service';
import { loyaltyService } from '@/lib/services/loyalty.service';

export function ProfileContent(): JSX.Element {
  const router = useRouter();
  const { user, isAuthenticated, isLoading, logout, refreshProfile } = useAuth();
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState('');
  const [gender, setGender] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [ordersCount, setOrdersCount] = useState(0);
  const [xuBalance, setXuBalance] = useState(0);

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.replace('/login');
    }
  }, [isLoading, isAuthenticated, router]);

  useEffect(() => {
    if (user) {
      setFirstName(user.firstName ?? '');
      setLastName(user.lastName ?? '');
      const dob = (user as { dateOfBirth?: Date | string }).dateOfBirth;
      setDateOfBirth(
        dob instanceof Date
          ? dob.toISOString().slice(0, 10)
          : typeof dob === 'string' && dob
            ? dob.slice(0, 10)
            : ''
      );
      setGender((user as { gender?: string }).gender ?? '');
    }
  }, [user]);

  useEffect(() => {
    if (!isAuthenticated || !user) return;
    const fetchStats = async () => {
      try {
        const [ordersRes, xuRes] = await Promise.all([
          ordersService.getMyOrders({ page: 1, limit: 1 }),
          loyaltyService.getXuBalance(),
        ]);
        setOrdersCount(ordersRes?.pagination?.total ?? 0);
        setXuBalance(xuRes?.xuBalance ?? 0);
      } catch {
        // Keep defaults 0
      }
    };
    fetchStats();
  }, [isAuthenticated, user]);

  const handleLogout = async (): Promise<void> => {
    await logout();
    router.replace('/');
  };

  const handleSave = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();
    if (!user) return;
    setIsSaving(true);
    setSaveSuccess(false);
    try {
      await usersService.updateProfile(user.id, {
        firstName: firstName || undefined,
        lastName: lastName || undefined,
        dateOfBirth: dateOfBirth || undefined,
        gender: (gender as 'MALE' | 'FEMALE' | 'OTHER') || undefined,
      });
      await refreshProfile();
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (err: unknown) {
      console.error('Profile update failed:', err);
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto flex min-h-[60vh] items-center justify-center px-4 py-12">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-purple-600 border-t-transparent" />
      </div>
    );
  }

  if (!isAuthenticated || !user) {
    return null;
  }

  const displayName = [user.firstName, user.lastName].filter(Boolean).join(' ') || 'Người dùng';
  const avatarLetter = user.firstName?.[0]?.toUpperCase() || user.email?.[0]?.toUpperCase() || 'U';

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="mx-auto max-w-6xl">
        <h1 className="mb-8 text-4xl font-bold">Tài khoản của tôi</h1>

        <div className="grid gap-6 lg:grid-cols-3">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="rounded-2xl border bg-card p-6">
              {/* User Info */}
              <div className="mb-6 text-center">
                <div className="mx-auto mb-4 flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br from-purple-600 to-pink-600 text-3xl font-bold text-white">
                  {avatarLetter}
                </div>
                <h2 className="text-xl font-bold">{displayName}</h2>
                <p className="text-sm text-muted-foreground">{user.email}</p>
              </div>

              {/* Menu */}
              <nav className="space-y-2">
                <Link
                  href="/profile"
                  className="flex items-center gap-3 rounded-lg bg-accent px-4 py-3 font-medium"
                >
                  <span>👤</span>
                  Thông tin cá nhân
                </Link>
                <Link
                  href="/profile/orders"
                  className="flex items-center gap-3 rounded-lg px-4 py-3 font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
                >
                  <span>📦</span>
                  Đơn hàng
                </Link>
                <Link
                  href="/wallet"
                  className="flex items-center gap-3 rounded-lg px-4 py-3 font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
                >
                  <span>💳</span>
                  Ví Lifestyle
                </Link>
                <Link
                  href="/profile/my-coins"
                  className="flex items-center gap-3 rounded-lg px-4 py-3 font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
                >
                  <span>🪙</span>
                  Lifestyle Xu
                </Link>
                <Link
                  href="/savings-packages/my-subscriptions"
                  className="flex items-center gap-3 rounded-lg px-4 py-3 font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
                >
                  <span>💰</span>
                  Gói Tiết Kiệm
                </Link>
                <Link
                  href="/referral"
                  className="flex items-center gap-3 rounded-lg px-4 py-3 font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
                >
                  <span>👥</span>
                  Giới thiệu & Nhận quà
                </Link>
                <Link
                  href="/profile/addresses"
                  className="flex items-center gap-3 rounded-lg px-4 py-3 font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
                >
                  <span>📍</span>
                  Địa chỉ
                </Link>
                <Link
                  href="/profile/settings"
                  className="flex items-center gap-3 rounded-lg px-4 py-3 font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
                >
                  <span>⚙️</span>
                  Cài đặt
                </Link>
                <button
                  type="button"
                  onClick={handleLogout}
                  className="flex w-full items-center gap-3 rounded-lg px-4 py-3 font-medium text-red-600 transition-colors hover:bg-red-50 dark:hover:bg-red-950"
                >
                  <span>🚪</span>
                  Đăng xuất
                </button>
              </nav>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-2">
            <div className="rounded-2xl border bg-card p-6">
              <h2 className="mb-6 text-2xl font-bold">Thông tin cá nhân</h2>

              <form onSubmit={handleSave} className="space-y-6">
                {/* Full Name */}
                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <label className="mb-2 block text-sm font-medium">Họ</label>
                    <input
                      type="text"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      className="w-full rounded-lg border bg-background px-4 py-2"
                      placeholder="Nguyễn"
                    />
                  </div>
                  <div>
                    <label className="mb-2 block text-sm font-medium">Tên</label>
                    <input
                      type="text"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      className="w-full rounded-lg border bg-background px-4 py-2"
                      placeholder="Văn A"
                    />
                  </div>
                </div>

                {/* Email */}
                <div>
                  <label className="mb-2 block text-sm font-medium">Email</label>
                  <input
                    type="email"
                    value={user.email}
                    className="w-full rounded-lg border bg-background px-4 py-2"
                    placeholder="email@example.com"
                    readOnly
                    aria-readonly
                  />
                </div>

                {/* Date of Birth */}
                <div>
                  <label className="mb-2 block text-sm font-medium">Ngày sinh</label>
                  <input
                    type="date"
                    value={dateOfBirth}
                    onChange={(e) => setDateOfBirth(e.target.value)}
                    className="w-full rounded-lg border bg-background px-4 py-2"
                  />
                </div>

                {/* Gender */}
                <div>
                  <label className="mb-2 block text-sm font-medium">Giới tính</label>
                  <select
                    value={gender}
                    onChange={(e) => setGender(e.target.value)}
                    className="w-full rounded-lg border bg-background px-4 py-2"
                  >
                    <option value="">Chọn giới tính</option>
                    <option value="MALE">Nam</option>
                    <option value="FEMALE">Nữ</option>
                    <option value="OTHER">Khác</option>
                  </select>
                </div>

                {saveSuccess && (
                  <p className="text-sm text-green-600">Đã lưu thay đổi thành công.</p>
                )}

                {/* Save Button */}
                <button
                  type="submit"
                  disabled={isSaving}
                  className="w-full rounded-lg bg-gradient-to-r from-purple-600 to-pink-600 px-6 py-3 font-semibold text-white shadow-lg transition-all hover:shadow-xl hover:scale-[1.02] active:scale-95 disabled:opacity-70"
                >
                  {isSaving ? 'Đang lưu...' : 'Lưu thay đổi'}
                </button>
              </form>

              {/* Quick Stats */}
              <div className="mt-6 grid gap-4 md:grid-cols-3">
                <Link
                  href="/profile/orders"
                  className="rounded-xl border bg-card p-4 text-center transition-colors hover:bg-accent"
                >
                  <div className="text-3xl font-bold text-purple-600">{ordersCount}</div>
                  <div className="text-sm text-muted-foreground">Đơn hàng</div>
                </Link>
                <Link
                  href="/profile/my-coins"
                  className="rounded-xl border bg-card p-4 text-center transition-colors hover:bg-accent"
                >
                  <div className="text-3xl font-bold text-amber-600">{xuBalance.toLocaleString('vi-VN')}</div>
                  <div className="text-sm text-muted-foreground">Lifestyle Xu</div>
                </Link>
                <div className="rounded-xl border bg-card p-4 text-center">
                  <div className="text-3xl font-bold text-green-600">0</div>
                  <div className="text-sm text-muted-foreground">Voucher</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
