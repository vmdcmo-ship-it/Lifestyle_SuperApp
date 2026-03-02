'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { driversService } from '@/lib/drivers.service';
import type { DriverDetail } from '@/lib/drivers.service';
import { VerifyModal } from './verify-modal';

function formatDate(iso: string | undefined): string {
  if (!iso) return '—';
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

const STATUS_LABEL: Record<string, string> = {
  PENDING_VERIFICATION: 'Chờ duyệt',
  ACTIVE: 'Đã duyệt',
  INACTIVE: 'Từ chối',
  SUSPENDED: 'Tạm khóa',
  BANNED: 'Cấm',
};

export default function DriverDetailPage(): JSX.Element {
  const params = useParams();
  const id = params?.id as string;
  const [driver, setDriver] = useState<DriverDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showVerifyModal, setShowVerifyModal] = useState<'approve' | 'reject' | null>(null);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    setError('');
    driversService
      .getById(id)
      .then(setDriver)
      .catch((err) => setError((err as Error).message || 'Không thể tải thông tin'))
      .finally(() => setLoading(false));
  }, [id]);

  const onVerifySuccess = () => {
    setShowVerifyModal(null);
    driversService.getById(id).then(setDriver);
  };

  const displayName = driver
    ? [driver.firstName ?? driver.user?.firstName, driver.lastName ?? driver.user?.lastName]
        .filter(Boolean)
        .join(' ')
        .trim() || driver.driverNumber
    : '—';

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12 text-muted-foreground">
        Đang tải...
      </div>
    );
  }

  if (error || !driver) {
    return (
      <div>
        <Link href="/drivers" className="mb-4 inline-block text-sm text-primary hover:underline">
          ← Quay lại danh sách
        </Link>
        <div className="rounded-lg bg-destructive/10 p-4 text-destructive">
          {error || 'Không tìm thấy tài xế'}
        </div>
      </div>
    );
  }

  const canVerify = driver.status === 'PENDING_VERIFICATION';

  return (
    <div>
      <Link href="/drivers" className="mb-4 inline-block text-sm text-primary hover:underline">
        ← Quay lại danh sách
      </Link>

      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">{displayName}</h1>
          <p className="text-muted-foreground">
            {driver.driverNumber} • {driver.user?.email ?? driver.email ?? '—'}
          </p>
        </div>
        {canVerify && (
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setShowVerifyModal('approve')}
              className="rounded-lg bg-green-600 px-4 py-2 text-sm font-medium text-white hover:bg-green-700"
            >
              Duyệt
            </button>
            <button
              type="button"
              onClick={() => setShowVerifyModal('reject')}
              className="rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700"
            >
              Từ chối
            </button>
          </div>
        )}
      </div>

      <div className="space-y-6">
        <section className="rounded-lg border p-4">
          <h2 className="mb-3 font-semibold">Thông tin cơ bản</h2>
          <dl className="grid grid-cols-1 gap-2 sm:grid-cols-2">
            <div>
              <dt className="text-sm text-muted-foreground">Mã tài xế</dt>
              <dd className="font-mono">{driver.driverNumber}</dd>
            </div>
            <div>
              <dt className="text-sm text-muted-foreground">Trạng thái</dt>
              <dd>
                <span
                  className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${
                    driver.status === 'ACTIVE'
                      ? 'bg-green-100 text-green-800'
                      : driver.status === 'PENDING_VERIFICATION'
                        ? 'bg-amber-100 text-amber-800'
                        : 'bg-gray-100 text-gray-700'
                  }`}
                >
                  {STATUS_LABEL[driver.status] ?? driver.status}
                </span>
              </dd>
            </div>
            <div>
              <dt className="text-sm text-muted-foreground">Email</dt>
              <dd>{driver.user?.email ?? driver.email ?? '—'}</dd>
            </div>
            <div>
              <dt className="text-sm text-muted-foreground">Số điện thoại</dt>
              <dd>{driver.user?.phoneNumber ?? driver.phoneNumber ?? '—'}</dd>
            </div>
            <div>
              <dt className="text-sm text-muted-foreground">Ngày đăng ký</dt>
              <dd>{formatDate(driver.createdAt)}</dd>
            </div>
            {driver.rejectionReason && (
              <div className="sm:col-span-2">
                <dt className="text-sm text-muted-foreground">Lý do từ chối</dt>
                <dd className="text-red-600">{driver.rejectionReason}</dd>
              </div>
            )}
          </dl>
        </section>

        {driver.identity && (
          <section className="rounded-lg border p-4">
            <h2 className="mb-3 font-semibold">Giấy tờ</h2>
            <dl className="grid grid-cols-1 gap-2 sm:grid-cols-2">
              <div>
                <dt className="text-sm text-muted-foreground">CCCD</dt>
                <dd>{driver.identity.citizenId ?? '—'}</dd>
              </div>
              <div>
                <dt className="text-sm text-muted-foreground">Hạng GPLX</dt>
                <dd>{driver.identity.driverLicenseClass ?? '—'}</dd>
              </div>
              <div>
                <dt className="text-sm text-muted-foreground">Hết hạn GPLX</dt>
                <dd>{formatDate(driver.identity.driverLicenseExpiry)}</dd>
              </div>
            </dl>
            <div className="mt-3 flex flex-wrap gap-4">
              {driver.identity.faceImage && (
                <a
                  href={driver.identity.faceImage}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-primary hover:underline"
                >
                  Xem ảnh khuôn mặt
                </a>
              )}
              {driver.identity.citizenIdFrontImage && (
                <a
                  href={driver.identity.citizenIdFrontImage}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-primary hover:underline"
                >
                  CCCD mặt trước
                </a>
              )}
              {driver.identity.driverLicenseImage && (
                <a
                  href={driver.identity.driverLicenseImage}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-primary hover:underline"
                >
                  GPLX
                </a>
              )}
            </div>
          </section>
        )}

        {driver.vehicles && driver.vehicles.length > 0 && (
          <section className="rounded-lg border p-4">
            <h2 className="mb-3 font-semibold">Phương tiện</h2>
            <ul className="space-y-2">
              {driver.vehicles.map((v) => (
                <li key={v.id} className="rounded border p-3">
                  {v.vehicleType} • {v.licensePlate ?? '—'} • {v.brand} {v.model}
                </li>
              ))}
            </ul>
          </section>
        )}
      </div>

      {showVerifyModal && (
        <VerifyModal
          driverId={id}
          driverName={displayName}
          action={showVerifyModal}
          onClose={() => setShowVerifyModal(null)}
          onSuccess={onVerifySuccess}
        />
      )}
    </div>
  );
}
