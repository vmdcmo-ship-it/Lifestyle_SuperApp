'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { usersService } from '@/lib/users.service';

function formatDate(iso: string): string {
  try {
    return new Date(iso).toLocaleDateString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  } catch {
    return iso;
  }
}

export default function UserDetailPage(): JSX.Element {
  const params = useParams();
  const id = params?.id as string;
  const [user, setUser] = useState<Record<string, unknown> | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!id) return;
    usersService
      .getById(id)
      .then(setUser)
      .catch((err) => setError((err as Error).message))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12 text-muted-foreground">
        Đang tải...
      </div>
    );
  }

  if (error || !user) {
    return (
      <div>
        <Link href="/users" className="mb-4 inline-block text-sm text-primary hover:underline">
          ← Quay lại
        </Link>
        <div className="rounded-lg bg-destructive/10 px-4 py-3 text-sm text-destructive">
          {error || 'Không tìm thấy người dùng'}
        </div>
      </div>
    );
  }

  const displayName =
    (user.displayName as string)?.trim() ||
    [user.firstName, user.lastName].filter(Boolean).join(' ').trim() ||
    (user.email as string) ||
    '—';

  return (
    <div>
      <Link href="/users" className="mb-4 inline-block text-sm text-primary hover:underline">
        ← Quay lại danh sách
      </Link>
      <h1 className="mb-6 text-2xl font-bold">{displayName}</h1>

      <section className="rounded-lg border bg-background p-4">
        <h2 className="mb-3 font-semibold">Thông tin tài khoản</h2>
        <dl className="grid gap-2 text-sm sm:grid-cols-2">
          <dt className="text-muted-foreground">ID</dt>
          <dd className="font-mono text-xs">{user.id}</dd>
          <dt className="text-muted-foreground">Email</dt>
          <dd>{user.email ?? '—'}</dd>
          <dt className="text-muted-foreground">Số điện thoại</dt>
          <dd>{user.phoneNumber ?? '—'}</dd>
          <dt className="text-muted-foreground">Họ tên</dt>
          <dd>{[user.firstName, user.lastName].filter(Boolean).join(' ') || '—'}</dd>
          <dt className="text-muted-foreground">Vai trò</dt>
          <dd>{user.role ?? '—'}</dd>
          <dt className="text-muted-foreground">Trạng thái</dt>
          <dd>
            <span
              className={`inline-flex rounded-full px-2 py-0.5 text-xs ${
                user.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-700'
              }`}
            >
              {user.isActive ? 'Hoạt động' : 'Tắt'}
            </span>
          </dd>
          <dt className="text-muted-foreground">Số dư Xu</dt>
          <dd>{user.xuBalance != null ? Number(user.xuBalance).toLocaleString() : '—'}</dd>
          <dt className="text-muted-foreground">Ngày tạo</dt>
          <dd>{user.createdAt ? formatDate(user.createdAt as string) : '—'}</dd>
          <dt className="text-muted-foreground">Đăng nhập lần cuối</dt>
          <dd>{user.lastLoginAt ? formatDate(user.lastLoginAt as string) : '—'}</dd>
        </dl>
      </section>
    </div>
  );
}
