'use client';

import { useState } from 'react';

export function ForgotPasswordForm(): JSX.Element {
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();
    if (!email.trim()) {
      setError('Vui lòng nhập email');
      return;
    }
    setError('');
    setIsLoading(true);
    try {
      await new Promise((r) => setTimeout(r, 1000));
      setIsSubmitted(true);
    } catch {
      setError('Đã có lỗi xảy ra. Vui lòng thử lại sau.');
    } finally {
      setIsLoading(false);
    }
  };

  if (isSubmitted) {
    return (
      <div className="rounded-lg bg-green-50 p-4 text-center dark:bg-green-950/30">
        <p className="text-green-800 dark:text-green-200">
          Kiểm tra email <strong>{email}</strong> để nhận hướng dẫn khôi phục mật khẩu.
        </p>
        <p className="mt-2 text-sm text-muted-foreground">
          Không nhận được?{' '}
          <button
            type="button"
            onClick={() => setIsSubmitted(false)}
            className="font-semibold text-purple-600 hover:underline"
          >
            Gửi lại
          </button>
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="email" className="mb-2 block text-sm font-medium">
          Email
        </label>
        <input
          type="email"
          id="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full rounded-lg border bg-background px-4 py-3 transition-colors focus:border-purple-600 focus:outline-none focus:ring-2 focus:ring-purple-600/20"
          placeholder="email@example.com"
          required
          disabled={isLoading}
        />
        {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
      </div>

      <button
        type="submit"
        disabled={isLoading}
        className="w-full rounded-lg bg-gradient-to-r from-purple-600 to-pink-600 px-4 py-3 font-semibold text-white shadow-lg transition-all hover:shadow-xl disabled:opacity-70"
      >
        {isLoading ? 'Đang gửi...' : 'Gửi link khôi phục'}
      </button>
    </form>
  );
}
