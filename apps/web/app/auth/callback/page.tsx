'use client';

import { Suspense, useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { saveTokens } from '@/lib/api/api';

function CallbackHandler() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [status, setStatus] = useState<'processing' | 'error'>('processing');
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    const accessToken = searchParams.get('accessToken');
    const refreshToken = searchParams.get('refreshToken');
    const error = searchParams.get('error');

    if (error) {
      setStatus('error');
      setErrorMsg(error);
      return;
    }

    if (accessToken && refreshToken) {
      saveTokens(accessToken, refreshToken);
      router.replace('/');
    } else {
      setStatus('error');
      setErrorMsg('Không nhận được token từ Google. Vui lòng thử lại.');
    }
  }, [searchParams, router]);

  if (status === 'error') {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="text-center">
          <div className="mb-4 text-6xl">&#x26A0;&#xFE0F;</div>
          <h1 className="mb-2 text-2xl font-bold">Đăng nhập thất bại</h1>
          <p className="mb-6 text-muted-foreground">{errorMsg}</p>
          <a
            href="/login"
            className="rounded-lg bg-purple-600 px-6 py-3 text-white hover:bg-purple-700"
          >
            Quay lại đăng nhập
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-[60vh] items-center justify-center">
      <div className="text-center">
        <div className="mb-4 h-12 w-12 mx-auto animate-spin rounded-full border-4 border-purple-200 border-t-purple-600" />
        <p className="text-lg text-muted-foreground">Đang xử lý đăng nhập...</p>
      </div>
    </div>
  );
}

export default function AuthCallbackPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-[60vh] items-center justify-center">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-purple-200 border-t-purple-600" />
        </div>
      }
    >
      <CallbackHandler />
    </Suspense>
  );
}
