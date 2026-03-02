'use client';

import { useEffect, useCallback, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { authService } from '@/lib/auth.service';
import { clearAdminTokens, setRoleCookie, saveAdminTokens } from '@/lib/api/api';
import { API_CONFIG, API_ENDPOINTS } from '@/lib/config/api';
import { ADMIN_STORAGE_KEYS } from '@/lib/storage-keys';

const IDLE_TIMEOUT_MS = 15 * 60 * 1000; // 15 phút không hoạt động
const TOKEN_REFRESH_BEFORE_MS = 5 * 60 * 1000; // Refresh token khi còn < 5 phút

function decodeJwtPayload(token: string): { exp?: number } | null {
  try {
    const payload = token.split('.')[1];
    if (!payload) return null;
    return JSON.parse(atob(payload)) as { exp?: number };
  } catch {
    return null;
  }
}

export function SessionGuard({ children }: { children: React.ReactNode }): JSX.Element {
  const router = useRouter();
  const idleTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [showIdleWarning, setShowIdleWarning] = useState(false);

  const logout = useCallback(() => {
    clearAdminTokens();
    setShowIdleWarning(false);
    router.push('/login');
    router.refresh();
  }, [router]);

  const resetIdleTimer = useCallback(() => {
    if (idleTimerRef.current) {
      clearTimeout(idleTimerRef.current);
      idleTimerRef.current = null;
    }
    idleTimerRef.current = setTimeout(() => {
      setShowIdleWarning(true);
    }, IDLE_TIMEOUT_MS);
  }, []);

  const extendSession = useCallback(() => {
    setShowIdleWarning(false);
    resetIdleTimer();
  }, [resetIdleTimer]);

  const checkAndRefreshToken = useCallback(async () => {
    if (typeof window === 'undefined') return;
    const token = localStorage.getItem(ADMIN_STORAGE_KEYS.ACCESS_TOKEN) ?? null;
    if (!token) return;

    const payload = decodeJwtPayload(token);
    const exp = payload?.exp;
    if (!exp) return;

    const expiresAt = exp * 1000;
    const now = Date.now();
    const msUntilExpiry = expiresAt - now;

    if (msUntilExpiry > TOKEN_REFRESH_BEFORE_MS) return;

    const refreshToken = localStorage.getItem(ADMIN_STORAGE_KEYS.REFRESH_TOKEN) ?? null;
    if (!refreshToken) return;

    try {
      const base = `${API_CONFIG.baseURL}${API_CONFIG.apiPrefix}`;
      const res = await fetch(`${base}${API_ENDPOINTS.AUTH.REFRESH}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ refreshToken }),
      });
      if (res.ok) {
        const data = (await res.json()) as {
          accessToken?: string;
          refreshToken?: string;
          tokens?: { accessToken?: string; refreshToken?: string };
        };
        const accessToken = data.accessToken ?? data.tokens?.accessToken;
        const newRefresh = data.refreshToken ?? data.tokens?.refreshToken;
        if (accessToken) {
          saveAdminTokens(accessToken, newRefresh ?? refreshToken);
        }
      } else {
        logout();
      }
    } catch {
      logout();
    }
  }, [logout]);

  useEffect(() => {
    const verifyAdmin = async () => {
      const profile = await authService.getProfile();
      if (!profile) {
        logout();
        return;
      }
      const { canAccessWebAdmin } = await import('@/lib/rbac');
      if (!canAccessWebAdmin(profile.role)) {
        logout();
        return;
      }
      setRoleCookie();
    };
    verifyAdmin();
  }, [logout]);

  useEffect(() => {
    resetIdleTimer();
    checkAndRefreshToken();
    const refreshInterval = setInterval(checkAndRefreshToken, 60_000);

    const events = ['mousedown', 'keydown', 'scroll', 'touchstart'];
    const handleActivity = () => {
      if (showIdleWarning) return;
      resetIdleTimer();
    };

    events.forEach((e) => window.addEventListener(e, handleActivity));
    return () => {
      events.forEach((e) => window.removeEventListener(e, handleActivity));
      if (idleTimerRef.current) clearTimeout(idleTimerRef.current);
      clearInterval(refreshInterval);
    };
  }, [resetIdleTimer, checkAndRefreshToken, showIdleWarning]);

  return (
    <>
      {children}
      {showIdleWarning && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-md rounded-xl bg-background p-6 shadow-lg">
            <h2 className="mb-2 text-lg font-semibold">Cảnh báo hết hạn phiên</h2>
            <p className="mb-4 text-sm text-muted-foreground">
              Bạn không hoạt động trong 15 phút. Chọn &quot;Tiếp tục phiên&quot; để ở lại hoặc đăng
              nhập lại để bảo mật.
            </p>
            <div className="flex gap-3">
              <button
                type="button"
                onClick={extendSession}
                className="flex-1 rounded-lg border border-primary px-4 py-2 font-medium text-primary hover:bg-primary/10"
              >
                Tiếp tục phiên
              </button>
              <button
                type="button"
                onClick={logout}
                className="flex-1 rounded-lg bg-primary px-4 py-2 font-medium text-primary-foreground hover:bg-primary/90"
              >
                Đăng nhập lại
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
