'use client';

import { useState } from 'react';
import { driversService } from '@/lib/drivers.service';
import { toast } from '@/lib/toast';

interface VerifyModalProps {
  driverId: string;
  driverName: string;
  action: 'approve' | 'reject';
  onClose: () => void;
  onSuccess: () => void;
}

export function VerifyModal({
  driverId,
  driverName,
  action,
  onClose,
  onSuccess,
}: VerifyModalProps): JSX.Element {
  const [rejectionReason, setRejectionReason] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (action === 'reject' && !rejectionReason.trim()) {
      setError('Vui lòng nhập lý do từ chối');
      return;
    }
    setLoading(true);
    setError('');
    try {
      await driversService.verify(
        driverId,
        action === 'approve' ? 'APPROVED' : 'REJECTED',
        action === 'reject' ? rejectionReason.trim() : undefined,
      );
      toast.success(action === 'approve' ? 'Đã duyệt hồ sơ tài xế' : 'Đã từ chối hồ sơ tài xế');
      onSuccess();
    } catch (err) {
      const msg = (err as Error).message || 'Thao tác thất bại';
      setError(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-md rounded-xl bg-background p-6 shadow-lg">
        <h2 className="mb-4 text-lg font-semibold">
          {action === 'approve' ? 'Duyệt hồ sơ tài xế' : 'Từ chối hồ sơ'}
        </h2>
        <p className="mb-4 text-sm text-muted-foreground">
          {action === 'approve'
            ? `Xác nhận duyệt hồ sơ của "${driverName}"?`
            : `Nhập lý do từ chối hồ sơ của "${driverName}"`}
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          {action === 'reject' && (
            <div>
              <label htmlFor="reason" className="mb-1 block text-sm font-medium">
                Lý do từ chối <span className="text-destructive">*</span>
              </label>
              <textarea
                id="reason"
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                rows={3}
                className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary"
                placeholder="Ví dụ: Giấy tờ không rõ, ảnh CCCD mờ..."
                required={action === 'reject'}
                disabled={loading}
              />
            </div>
          )}

          {error && (
            <div className="rounded-lg bg-destructive/10 px-3 py-2 text-sm text-destructive">
              {error}
            </div>
          )}

          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="rounded-lg border px-4 py-2 text-sm disabled:opacity-50"
            >
              Hủy
            </button>
            <button
              type="submit"
              disabled={loading}
              className={`rounded-lg px-4 py-2 text-sm font-medium text-white disabled:opacity-50 ${
                action === 'approve'
                  ? 'bg-green-600 hover:bg-green-700'
                  : 'bg-red-600 hover:bg-red-700'
              }`}
            >
              {loading ? 'Đang xử lý...' : action === 'approve' ? 'Duyệt' : 'Từ chối'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
