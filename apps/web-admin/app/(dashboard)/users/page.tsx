'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { usersService } from '@/lib/users.service';
import type { UserListItem } from '@/lib/users.service';
import { toast } from '@/lib/toast';
import { ConfirmDialog } from '@/components/confirm-dialog';
import { exportToCsv } from '@/lib/utils/export-csv';

const ROLE_OPTIONS = [
  { value: '', label: 'Tất cả' },
  { value: 'USER', label: 'User' },
  { value: 'ADMIN', label: 'Admin' },
  { value: 'DRIVER', label: 'Tài xế' },
  { value: 'RESTAURANT_OWNER', label: 'Chủ cửa hàng' },
  { value: 'ADMIN_TRANSPORT', label: 'Admin vận tải' },
  { value: 'ADMIN_MARKETING', label: 'Admin marketing' },
];

const STATUS_OPTIONS = [
  { value: '', label: 'Tất cả' },
  { value: 'true', label: 'Đang hoạt động' },
  { value: 'false', label: 'Đã tắt' },
];

const ROLE_LABELS: Record<string, string> = {
  USER: 'User',
  ADMIN: 'Admin',
  DRIVER: 'Tài xế',
  RESTAURANT_OWNER: 'Chủ cửa hàng',
  ADMIN_TRANSPORT: 'Admin vận tải',
  ADMIN_MARKETING: 'Admin marketing',
};

function formatDate(iso: string): string {
  try {
    return new Date(iso).toLocaleDateString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  } catch {
    return iso;
  }
}

function displayName(u: UserListItem): string {
  if (u.displayName?.trim()) return u.displayName;
  const name = [u.firstName, u.lastName].filter(Boolean).join(' ').trim();
  return name || u.email || '—';
}

export default function UsersPage(): JSX.Element {
  const [users, setUsers] = useState<UserListItem[]>([]);
  const [stats, setStats] = useState<{
    totalUsers: number;
    activeUsers: number;
    inactiveUsers: number;
    drivers: number;
    merchants: number;
  } | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [searchInput, setSearchInput] = useState('');
  const [role, setRole] = useState('');
  const [isActive, setIsActive] = useState('');
  const [meta, setMeta] = useState({ page: 1, limit: 10, total: 0, totalPages: 1 });
  const [deleteTarget, setDeleteTarget] = useState<UserListItem | null>(null);
  const [deleting, setDeleting] = useState(false);

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const [listRes, statsRes] = await Promise.all([
        usersService.list({
          page,
          limit: 10,
          search: search || undefined,
          role: role || undefined,
          isActive: isActive === 'true' ? true : isActive === 'false' ? false : undefined,
        }),
        usersService.stats(),
      ]);
      setUsers(listRes.data);
      setMeta(listRes.meta);
      setStats(statsRes);
    } catch (err) {
      setError((err as Error).message || 'Không thể tải danh sách');
      setUsers([]);
      toast.error('Không thể tải danh sách người dùng');
    } finally {
      setLoading(false);
    }
  }, [page, search, role, isActive]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setSearch(searchInput.trim());
    setPage(1);
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await usersService.delete(deleteTarget.id);
      toast.success('Đã xóa tài khoản thành công');
      setDeleteTarget(null);
      fetchUsers();
    } catch (err) {
      toast.error((err as Error).message || 'Không thể xóa');
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div>
      <h1 className="mb-4 text-2xl font-bold">Quản lý người dùng</h1>

      {stats && (
        <div className="mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          <div className="rounded-lg border bg-background p-4">
            <p className="text-sm text-muted-foreground">Tổng người dùng</p>
            <p className="text-2xl font-bold">{stats.totalUsers}</p>
          </div>
          <div className="rounded-lg border bg-background p-4">
            <p className="text-sm text-muted-foreground">Đang hoạt động</p>
            <p className="text-2xl font-bold text-green-600">{stats.activeUsers}</p>
          </div>
          <div className="rounded-lg border bg-background p-4">
            <p className="text-sm text-muted-foreground">Đã tắt</p>
            <p className="text-2xl font-bold text-muted-foreground">{stats.inactiveUsers}</p>
          </div>
          <div className="rounded-lg border bg-background p-4">
            <p className="text-sm text-muted-foreground">Tài xế</p>
            <p className="text-2xl font-bold">{stats.drivers}</p>
          </div>
          <div className="rounded-lg border bg-background p-4">
            <p className="text-sm text-muted-foreground">Chủ cửa hàng</p>
            <p className="text-2xl font-bold">{stats.merchants}</p>
          </div>
        </div>
      )}

      <div className="mb-4 flex flex-wrap items-center gap-4">
        <form onSubmit={handleSearch} className="flex gap-2">
          <input
            type="text"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder="Tìm theo tên, email, SĐT..."
            className="rounded-lg border px-3 py-2 text-sm w-56"
          />
          <button
            type="submit"
            className="rounded-lg bg-primary px-3 py-2 text-sm text-primary-foreground hover:bg-primary/90"
          >
            Tìm
          </button>
        </form>
        <label className="flex items-center gap-2 text-sm">
          <span className="text-muted-foreground">Vai trò:</span>
          <select
            value={role}
            onChange={(e) => {
              setRole(e.target.value);
              setPage(1);
            }}
            className="rounded-lg border px-2 py-1.5 text-sm"
          >
            {ROLE_OPTIONS.map((o) => (
              <option key={o.value || 'all'} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
        </label>
        <label className="flex items-center gap-2 text-sm">
          <span className="text-muted-foreground">Trạng thái:</span>
          <select
            value={isActive}
            onChange={(e) => {
              setIsActive(e.target.value);
              setPage(1);
            }}
            className="rounded-lg border px-2 py-1.5 text-sm"
          >
            {STATUS_OPTIONS.map((o) => (
              <option key={o.value || 'all'} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
        </label>
        {!loading && users.length > 0 && (
          <button
            type="button"
            onClick={() =>
              exportToCsv(
                users.map((u) => ({
                  id: u.id,
                  name: displayName(u),
                  email: u.email,
                  phone: u.phoneNumber ?? '',
                  role: ROLE_LABELS[u.role] ?? u.role,
                  isActive: u.isActive ? 'Hoạt động' : 'Tắt',
                  createdAt: formatDate(u.createdAt),
                })),
                'nguoi-dung',
                [
                  { key: 'id', header: 'ID' },
                  { key: 'name', header: 'Tên' },
                  { key: 'email', header: 'Email' },
                  { key: 'phone', header: 'SĐT' },
                  { key: 'role', header: 'Vai trò' },
                  { key: 'isActive', header: 'Trạng thái' },
                  { key: 'createdAt', header: 'Ngày đăng ký' },
                ],
              )
            }
            className="rounded-lg border px-3 py-2 text-sm hover:bg-muted"
          >
            Export CSV
          </button>
        )}
      </div>

      {error && (
        <div className="mb-4 rounded-lg bg-destructive/10 px-4 py-3 text-sm text-destructive">
          {error}
        </div>
      )}

      <div className="overflow-x-auto rounded-lg border">
        {loading ? (
          <div className="flex items-center justify-center py-12 text-muted-foreground">
            Đang tải...
          </div>
        ) : users.length === 0 ? (
          <div className="py-12 text-center text-muted-foreground">
            Không tìm thấy người dùng nào
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead className="border-b bg-muted/50">
              <tr>
                <th className="px-4 py-3 text-left font-medium">Tên</th>
                <th className="px-4 py-3 text-left font-medium">Email</th>
                <th className="px-4 py-3 text-left font-medium">SĐT</th>
                <th className="px-4 py-3 text-left font-medium">Vai trò</th>
                <th className="px-4 py-3 text-center font-medium">Trạng thái</th>
                <th className="px-4 py-3 text-left font-medium">Ngày đăng ký</th>
                <th className="px-4 py-3 text-left font-medium"></th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u.id} className="border-b last:border-0 hover:bg-muted/30">
                  <td className="px-4 py-3 font-medium">{displayName(u)}</td>
                  <td className="px-4 py-3 text-muted-foreground">{u.email}</td>
                  <td className="px-4 py-3">{u.phoneNumber ?? '—'}</td>
                  <td className="px-4 py-3">
                    <span className="rounded bg-muted px-2 py-0.5 text-xs">
                      {ROLE_LABELS[u.role] ?? u.role}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <span
                      className={`inline-flex rounded-full px-2 py-0.5 text-xs ${
                        u.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-700'
                      }`}
                    >
                      {u.isActive ? 'Hoạt động' : 'Tắt'}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">{formatDate(u.createdAt)}</td>
                  <td className="px-4 py-3">
                    <Link href={`/users/${u.id}`} className="mr-2 text-primary hover:underline">
                      Chi tiết
                    </Link>
                    <button
                      type="button"
                      onClick={() => setDeleteTarget(u)}
                      className="text-destructive hover:underline"
                    >
                      Xóa
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {!loading && meta.totalPages > 1 && (
        <div className="mt-4 flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            Trang {meta.page} / {meta.totalPages} • Tổng {meta.total} người dùng
          </p>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page <= 1}
              className="rounded-lg border px-3 py-1.5 text-sm disabled:opacity-50"
            >
              Trước
            </button>
            <button
              type="button"
              onClick={() => setPage((p) => Math.min(meta.totalPages, p + 1))}
              disabled={page >= meta.totalPages}
              className="rounded-lg border px-3 py-1.5 text-sm disabled:opacity-50"
            >
              Sau
            </button>
          </div>
        </div>
      )}

      <ConfirmDialog
        open={!!deleteTarget}
        title="Xác nhận xóa tài khoản"
        message={
          deleteTarget
            ? `Bạn có chắc muốn xóa tài khoản "${displayName(deleteTarget)}" (${deleteTarget.email})? Tài khoản sẽ bị vô hiệu hóa.`
            : ''
        }
        confirmLabel="Xóa"
        cancelLabel="Hủy"
        variant="danger"
        loading={deleting}
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
}
