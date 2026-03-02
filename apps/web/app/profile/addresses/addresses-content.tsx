'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/contexts/auth-context';
import { ProfileLayout } from '../profile-layout';
import { addressesService } from '@/lib/services/addresses.service';

export function AddressesContent(): JSX.Element {
  const router = useRouter();
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const [addresses, setAddresses] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchAddresses = () => {
    addressesService
      .list()
      .then((res) => setAddresses(Array.isArray(res) ? res : res?.data ?? []))
      .catch(() => setAddresses([]))
      .finally(() => setIsLoading(false));
  };

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.replace('/login');
      return;
    }
    if (!isAuthenticated) return;
    setIsLoading(true);
    fetchAddresses();
  }, [isAuthenticated, authLoading, router]);

  const handleSetDefault = async (id: string) => {
    try {
      await addressesService.setDefault(id);
      fetchAddresses();
    } catch {
      // ignore
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Bạn có chắc muốn xóa địa chỉ này?')) return;
    try {
      await addressesService.remove(id);
      setAddresses((prev) => prev.filter((a) => a.id !== id));
    } catch {
      // ignore
    }
  };

  if (authLoading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-purple-600 border-t-transparent" />
      </div>
    );
  }

  return (
    <ProfileLayout title="Địa chỉ của tôi">
      <div className="rounded-2xl border bg-card p-6">
        {isLoading ? (
          <div className="flex min-h-[200px] items-center justify-center">
            <div className="h-10 w-10 animate-spin rounded-full border-4 border-purple-600 border-t-transparent" />
          </div>
        ) : addresses.length === 0 ? (
          <div className="py-16 text-center">
            <div className="mb-4 text-6xl">📍</div>
            <p className="mb-2 text-lg font-medium">Chưa có địa chỉ nào</p>
            <p className="mb-6 text-muted-foreground">Thêm địa chỉ để giao hàng nhanh hơn</p>
            <button
              type="button"
              className="inline-flex items-center justify-center rounded-lg bg-gradient-to-r from-purple-600 to-pink-600 px-6 py-3 font-semibold text-white hover:shadow-lg"
              onClick={() => {}}
            >
              Thêm địa chỉ (sắp có)
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {addresses.map((addr) => (
              <div
                key={addr.id}
                className="flex flex-wrap items-start justify-between gap-4 rounded-xl border p-4"
              >
                <div>
                  {addr.label && (
                    <span className="mr-2 rounded bg-purple-100 px-2 py-0.5 text-sm font-medium text-purple-700 dark:bg-purple-900 dark:text-purple-300">
                      {addr.label}
                    </span>
                  )}
                  {addr.isDefault && (
                    <span className="rounded bg-green-100 px-2 py-0.5 text-sm font-medium text-green-700 dark:bg-green-900 dark:text-green-300">
                      Mặc định
                    </span>
                  )}
                  <p className="mt-2 font-medium">{addr.fullAddress ?? addr.street}</p>
                  {addr.ward && addr.district && addr.city && (
                    <p className="text-sm text-muted-foreground">
                      {[addr.ward, addr.district, addr.city].filter(Boolean).join(', ')}
                    </p>
                  )}
                </div>
                <div className="flex gap-2">
                  {!addr.isDefault && (
                    <button
                      type="button"
                      className="text-sm text-purple-600 hover:underline"
                      onClick={() => handleSetDefault(addr.id)}
                    >
                      Đặt mặc định
                    </button>
                  )}
                  <button
                    type="button"
                    className="text-sm text-red-600 hover:underline"
                    onClick={() => handleDelete(addr.id)}
                  >
                    Xóa
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </ProfileLayout>
  );
}
