'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { authService } from '@/lib/auth.service';
import { loginSchema, mfaCodeSchema } from '@/lib/validations';

type Step = 'password' | 'mfa';

export function LoginForm(): JSX.Element {
  const router = useRouter();
  const [step, setStep] = useState<Step>('password');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [mfaToken, setMfaToken] = useState('');
  const [mfaCode, setMfaCode] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    const result = loginSchema.safeParse({ email: email.trim(), password });
    if (!result.success) {
      setError(result.error.errors[0]?.message ?? 'Dữ liệu không hợp lệ');
      return;
    }
    setLoading(true);
    try {
      const data = await authService.login(result.data.email, result.data.password);
      const mfaData = data as { requiresMfa?: boolean; mfaToken?: string; user?: { role: string } };
      if (mfaData.requiresMfa && mfaData.mfaToken) {
        setMfaToken(mfaData.mfaToken);
        setStep('mfa');
      } else {
        const okData = data as { user?: { role: string } };
        const { canAccessWebAdmin } = await import('@/lib/rbac');
        if (!canAccessWebAdmin(okData.user?.role)) {
          const { clearAdminTokens } = await import('@/lib/api/api');
          clearAdminTokens();
          router.push('/unauthorized');
          router.refresh();
          return;
        }
        router.push('/');
        router.refresh();
      }
    } catch (err) {
      const msg = (err as Error).message || '';
      if (msg.includes('Failed to fetch') || msg.includes('fetch')) {
        setError(
          'Không thể kết nối tới API. Vui lòng kiểm tra main-api đã chạy chưa (http://localhost:3000).'
        );
      } else {
        setError(msg || 'Đăng nhập thất bại');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleMfaSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    const result = mfaCodeSchema.safeParse({ code: mfaCode });
    if (!result.success) {
      setError(result.error.errors[0]?.message ?? 'Mã OTP không hợp lệ');
      return;
    }
    setLoading(true);
    try {
      const data = await authService.mfaCompleteLogin(mfaToken, mfaCode);
      const { canAccessWebAdmin } = await import('@/lib/rbac');
      if (!canAccessWebAdmin(data?.user?.role)) {
        const { clearAdminTokens } = await import('@/lib/api/api');
        clearAdminTokens();
        router.push('/unauthorized');
        router.refresh();
        return;
      }
      router.push('/');
      router.refresh();
    } catch (err) {
      setError((err as Error).message || 'Mã OTP không đúng');
    } finally {
      setLoading(false);
    }
  };

  const handleBackToPassword = () => {
    setStep('password');
    setMfaCode('');
    setError('');
  };

  return (
    <div className="w-full max-w-md rounded-xl border bg-background p-8 shadow-lg">
      <div className="mb-8 text-center">
        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-xl bg-primary">
          <span className="text-2xl font-bold text-primary-foreground">L</span>
        </div>
        <h1 className="text-2xl font-bold">Web Admin</h1>
        <p className="mt-1 text-sm text-muted-foreground">Lifestyle Super App - Quản trị</p>
      </div>

      {step === 'password' ? (
        <form onSubmit={handlePasswordSubmit} className="space-y-4">
          <div>
            <label htmlFor="email" className="mb-1 block text-sm font-medium">
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@example.com"
              className="w-full rounded-lg border border-input bg-background px-4 py-2.5 text-sm outline-none transition-colors focus:ring-2 focus:ring-primary focus:ring-offset-2"
              autoComplete="email"
              disabled={loading}
            />
          </div>

          <div>
            <label htmlFor="password" className="mb-1 block text-sm font-medium">
              Mật khẩu
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full rounded-lg border border-input bg-background px-4 py-2.5 text-sm outline-none transition-colors focus:ring-2 focus:ring-primary focus:ring-offset-2"
              autoComplete="current-password"
              disabled={loading}
            />
          </div>

          {error && (
            <div className="rounded-lg bg-destructive/10 px-4 py-3 text-sm text-destructive">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-primary px-4 py-3 font-medium text-primary-foreground transition-colors hover:bg-primary/90 disabled:opacity-50"
          >
            {loading ? 'Đang xử lý...' : 'Đăng nhập'}
          </button>
        </form>
      ) : (
        <form onSubmit={handleMfaSubmit} className="space-y-4">
          <div className="rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
            Nhập mã 6 chữ số từ ứng dụng Authenticator (Google Authenticator, Authy, ...)
          </div>

          <div>
            <label htmlFor="mfaCode" className="mb-1 block text-sm font-medium">
              Mã OTP
            </label>
            <input
              id="mfaCode"
              type="text"
              inputMode="numeric"
              pattern="[0-9]*"
              maxLength={6}
              value={mfaCode}
              onChange={(e) => setMfaCode(e.target.value.replace(/\D/g, ''))}
              placeholder="000000"
              className="w-full rounded-lg border border-input bg-background px-4 py-2.5 text-center text-lg font-mono tracking-widest outline-none focus:ring-2 focus:ring-primary"
              autoComplete="one-time-code"
              autoFocus
              disabled={loading}
            />
          </div>

          {error && (
            <div className="rounded-lg bg-destructive/10 px-4 py-3 text-sm text-destructive">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading || mfaCode.length !== 6}
            className="w-full rounded-lg bg-primary px-4 py-3 font-medium text-primary-foreground transition-colors hover:bg-primary/90 disabled:opacity-50"
          >
            {loading ? 'Đang xử lý...' : 'Xác nhận'}
          </button>

          <button
            type="button"
            onClick={handleBackToPassword}
            className="w-full text-sm text-muted-foreground hover:text-foreground"
          >
            ← Quay lại nhập mật khẩu
          </button>
        </form>
      )}
    </div>
  );
}
