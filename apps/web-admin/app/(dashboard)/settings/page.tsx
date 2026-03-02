'use client';

import { useState, useEffect } from 'react';
import { authService } from '@/lib/auth.service';
import { changePasswordSchema, mfaDisableSchema } from '@/lib/validations';

type MfaStep = 'idle' | 'setup' | 'verifying' | 'done';

export default function SettingsPage(): JSX.Element {
  const [user, setUser] = useState<{
    email: string;
    displayName: string;
    role: string;
    mfaEnabled?: boolean;
  } | null>(null);
  const [profileLoading, setProfileLoading] = useState(true);

  // MFA state
  const [mfaStep, setMfaStep] = useState<MfaStep>('idle');
  const [mfaQrCode, setMfaQrCode] = useState('');
  const [mfaSecret, setMfaSecret] = useState('');
  const [mfaVerifyCode, setMfaVerifyCode] = useState('');
  const [mfaError, setMfaError] = useState('');

  // Disable MFA
  const [disablePassword, setDisablePassword] = useState('');
  const [disableCode, setDisableCode] = useState('');
  const [disabling, setDisabling] = useState(false);

  // Change password
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [changePwdSubmitting, setChangePwdSubmitting] = useState(false);
  const [changePwdError, setChangePwdError] = useState('');
  const [changePwdSuccess, setChangePwdSuccess] = useState(false);

  useEffect(() => {
    authService
      .getProfile()
      .then((u) => {
        if (u) {
          setUser({
            email: u.email,
            displayName: u.displayName || '',
            role: u.role,
            mfaEnabled: (u as { mfaEnabled?: boolean }).mfaEnabled,
          });
        }
      })
      .finally(() => setProfileLoading(false));
  }, [mfaStep]);

  const handleMfaSetup = async () => {
    setMfaError('');
    setMfaStep('idle');
    try {
      const res = await authService.mfaSetup();
      setMfaQrCode(res.qrCode);
      setMfaSecret(res.secret);
      setMfaStep('setup');
    } catch (err) {
      setMfaError((err as Error).message || 'Không thể thiết lập MFA');
    }
  };

  const handleMfaVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!mfaVerifyCode || mfaVerifyCode.length !== 6) {
      setMfaError('Vui lòng nhập mã OTP 6 chữ số');
      return;
    }
    setMfaError('');
    setMfaStep('verifying');
    try {
      await authService.mfaVerify(mfaVerifyCode);
      setMfaStep('done');
      setUser((prev) => (prev ? { ...prev, mfaEnabled: true } : null));
      setMfaQrCode('');
      setMfaSecret('');
      setMfaVerifyCode('');
      setTimeout(() => setMfaStep('idle'), 2000);
    } catch (err) {
      setMfaError((err as Error).message || 'Mã OTP không đúng');
      setMfaStep('setup');
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setChangePwdError('');
    setChangePwdSuccess(false);
    const result = changePasswordSchema.safeParse({
      currentPassword,
      newPassword,
      confirmPassword,
    });
    if (!result.success) {
      setChangePwdError(result.error.errors[0]?.message ?? 'Dữ liệu không hợp lệ');
      return;
    }
    setChangePwdSubmitting(true);
    try {
      await authService.changePassword(result.data.currentPassword, result.data.newPassword);
      setChangePwdSuccess(true);
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err) {
      setChangePwdError((err as Error).message || 'Đổi mật khẩu thất bại');
    } finally {
      setChangePwdSubmitting(false);
    }
  };

  const handleMfaDisable = async (e: React.FormEvent) => {
    e.preventDefault();
    setMfaError('');
    const result = mfaDisableSchema.safeParse({
      password: disablePassword,
      code: disableCode,
    });
    if (!result.success) {
      setMfaError(result.error.errors[0]?.message ?? 'Dữ liệu không hợp lệ');
      return;
    }
    setDisabling(true);
    try {
      await authService.mfaDisable(result.data.password, result.data.code);
      setUser((prev) => (prev ? { ...prev, mfaEnabled: false } : null));
      setDisablePassword('');
      setDisableCode('');
      authService.getProfile();
    } catch (err) {
      setMfaError((err as Error).message || 'Tắt MFA thất bại');
    } finally {
      setDisabling(false);
    }
  };

  if (profileLoading) {
    return (
      <div className="flex items-center justify-center py-12 text-muted-foreground">
        Đang tải...
      </div>
    );
  }

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold">Cài đặt</h1>

      <div className="space-y-6">
        {/* Thông tin tài khoản */}
        <section className="rounded-lg border bg-background p-6">
          <h2 className="mb-4 text-lg font-semibold">Thông tin tài khoản</h2>
          <dl className="grid gap-3 text-sm sm:grid-cols-2">
            <dt className="text-muted-foreground">Email</dt>
            <dd className="font-medium">{user?.email ?? '—'}</dd>
            <dt className="text-muted-foreground">Tên hiển thị</dt>
            <dd>{user?.displayName || '—'}</dd>
            <dt className="text-muted-foreground">Vai trò</dt>
            <dd>
              <span className="inline-flex rounded bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">
                {user?.role ?? '—'}
              </span>
            </dd>
          </dl>
        </section>

        {/* Đổi mật khẩu */}
        <section className="rounded-lg border bg-background p-6">
          <h2 className="mb-4 text-lg font-semibold">Đổi mật khẩu</h2>
          <p className="mb-4 text-sm text-muted-foreground">
            Mật khẩu mới phải có ít nhất 8 ký tự.
          </p>

          {changePwdError && (
            <div className="mb-4 rounded-lg bg-destructive/10 px-4 py-3 text-sm text-destructive">
              {changePwdError}
            </div>
          )}
          {changePwdSuccess && (
            <div className="mb-4 rounded-lg bg-green-50 px-4 py-3 text-sm text-green-800">
              Đổi mật khẩu thành công.
            </div>
          )}

          <form onSubmit={handleChangePassword} className="flex flex-col gap-4 max-w-md">
            <div>
              <label className="mb-1 block text-sm font-medium">Mật khẩu hiện tại</label>
              <input
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                placeholder="Nhập mật khẩu hiện tại"
                className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary"
                required
                disabled={changePwdSubmitting}
                autoComplete="current-password"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium">Mật khẩu mới</label>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Nhập mật khẩu mới (tối thiểu 8 ký tự)"
                minLength={8}
                className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary"
                required
                disabled={changePwdSubmitting}
                autoComplete="new-password"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium">Xác nhận mật khẩu mới</label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Nhập lại mật khẩu mới"
                minLength={8}
                className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary"
                required
                disabled={changePwdSubmitting}
                autoComplete="new-password"
              />
            </div>
            <button
              type="submit"
              disabled={changePwdSubmitting}
              className="w-fit rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
            >
              {changePwdSubmitting ? 'Đang xử lý...' : 'Cập nhật mật khẩu'}
            </button>
          </form>
        </section>

        {/* MFA (2FA) */}
        <section className="rounded-lg border bg-background p-6">
          <h2 className="mb-2 text-lg font-semibold">Xác thực hai yếu tố (MFA)</h2>
          <p className="mb-4 text-sm text-muted-foreground">
            Bảo mật tài khoản bằng mã OTP từ ứng dụng Authenticator (Google Authenticator, Authy,
            ...).
          </p>

          {mfaError && (
            <div className="mb-4 rounded-lg bg-destructive/10 px-4 py-3 text-sm text-destructive">
              {mfaError}
            </div>
          )}

          {user?.mfaEnabled ? (
            <div className="space-y-4">
              <div className="flex items-center gap-2 rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-800">
                <span>✓</span>
                <span>MFA đã được bật. Đăng nhập sẽ yêu cầu mã OTP.</span>
              </div>
              <form onSubmit={handleMfaDisable} className="flex flex-wrap items-end gap-4">
                <div>
                  <label className="mb-1 block text-xs font-medium">Mật khẩu</label>
                  <input
                    type="password"
                    value={disablePassword}
                    onChange={(e) => setDisablePassword(e.target.value)}
                    placeholder="Mật khẩu hiện tại"
                    className="rounded border border-input px-3 py-2 text-sm"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-xs font-medium">Mã OTP</label>
                  <input
                    type="text"
                    inputMode="numeric"
                    maxLength={6}
                    value={disableCode}
                    onChange={(e) => setDisableCode(e.target.value.replace(/\D/g, ''))}
                    placeholder="000000"
                    className="w-24 rounded border border-input px-3 py-2 text-center font-mono text-sm"
                  />
                </div>
                <button
                  type="submit"
                  disabled={disabling}
                  className="rounded-lg border border-destructive px-4 py-2 text-sm text-destructive hover:bg-destructive/10 disabled:opacity-50"
                >
                  {disabling ? 'Đang xử lý...' : 'Tắt MFA'}
                </button>
              </form>
            </div>
          ) : mfaStep === 'setup' ? (
            <div className="space-y-4">
              <p className="text-sm">{mfaSecret ? 'Quét QR bằng ứng dụng Authenticator:' : ''}</p>
              {mfaQrCode && (
                <div className="flex justify-center">
                  <img src={mfaQrCode} alt="QR Code MFA" className="h-48 w-48 rounded border" />
                </div>
              )}
              {mfaSecret && (
                <p className="text-xs text-muted-foreground">
                  Hoặc nhập thủ công: <code className="rounded bg-muted px-1">{mfaSecret}</code>
                </p>
              )}
              <form onSubmit={handleMfaVerify} className="flex flex-wrap items-end gap-2">
                <div>
                  <label className="mb-1 block text-xs font-medium">
                    Nhập mã 6 chữ số để kích hoạt
                  </label>
                  <input
                    type="text"
                    inputMode="numeric"
                    maxLength={6}
                    value={mfaVerifyCode}
                    onChange={(e) => setMfaVerifyCode(e.target.value.replace(/\D/g, ''))}
                    placeholder="000000"
                    className="w-32 rounded border border-input px-3 py-2 text-center font-mono"
                  />
                </div>
                <button
                  type="submit"
                  disabled={mfaStep === 'verifying'}
                  className="rounded-lg bg-primary px-4 py-2 text-sm text-primary-foreground hover:bg-primary/90"
                >
                  {mfaStep === 'verifying' ? 'Đang xử lý...' : 'Xác nhận'}
                </button>
              </form>
              <button
                type="button"
                onClick={() => {
                  setMfaStep('idle');
                  setMfaQrCode('');
                  setMfaSecret('');
                  setMfaError('');
                }}
                className="text-sm text-muted-foreground hover:text-foreground"
              >
                Hủy
              </button>
            </div>
          ) : mfaStep === 'done' ? (
            <p className="text-sm text-green-600">MFA đã được bật thành công.</p>
          ) : (
            <button
              type="button"
              onClick={handleMfaSetup}
              className="rounded-lg bg-primary px-4 py-2 text-sm text-primary-foreground hover:bg-primary/90"
            >
              Bật MFA
            </button>
          )}
        </section>
      </div>
    </div>
  );
}
