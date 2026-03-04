'use client';

import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { wealthService, type WealthLead, type LeadStatus } from '@/lib/wealth.service';
import { toast } from '@/lib/toast';

function formatDate(iso: string | null | undefined): string {
  if (!iso) return '—';
  try {
    return new Date(iso).toLocaleString('vi-VN', {
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

const STATUS_LABELS: Record<LeadStatus, string> = {
  PENDING: 'Chờ xử lý',
  CONTACTED: 'Đã liên hệ',
  DONE: 'Hoàn thành',
};

interface LeadDetailModalProps {
  leadId: string | null;
  open: boolean;
  onClose: () => void;
  onStatusChange?: () => void;
}

export function LeadDetailModal({
  leadId,
  open,
  onClose,
  onStatusChange,
}: LeadDetailModalProps): JSX.Element {
  const [lead, setLead] = useState<WealthLead | null>(null);
  const [loading, setLoading] = useState(false);
  const [updating, setUpdating] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!open || !leadId) {
      setLead(null);
      setError('');
      return;
    }
    setLoading(true);
    setError('');
    wealthService
      .getById(leadId)
      .then(setLead)
      .catch((err) => setError((err as Error).message || 'Không tải được chi tiết'))
      .finally(() => setLoading(false));
  }, [open, leadId]);

  const handleStatusChange = async (newStatus: LeadStatus) => {
    if (!leadId || !lead) return;
    setUpdating(true);
    try {
      await wealthService.updateStatus(leadId, newStatus);
      setLead((prev) => (prev ? { ...prev, status: newStatus } : null));
      toast.success('Đã cập nhật trạng thái');
      onStatusChange?.();
    } catch (err) {
      toast.error((err as Error).message || 'Cập nhật thất bại');
    } finally {
      setUpdating(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Chi tiết lead</DialogTitle>
        </DialogHeader>
        {loading ? (
          <div className="py-8 text-center text-muted-foreground">Đang tải...</div>
        ) : error ? (
          <div className="py-4 text-sm text-destructive">{error}</div>
        ) : lead ? (
          <div className="space-y-4">
            <div className="grid gap-2">
              <label className="text-xs font-medium text-muted-foreground">Họ tên</label>
              <p className="font-medium">{lead.fullName}</p>
            </div>
            <div className="grid gap-2">
              <label className="text-xs font-medium text-muted-foreground">Số điện thoại</label>
              <p>
                <a
                  href={`tel:${lead.phone}`}
                  className="text-primary hover:underline"
                >
                  {lead.phone}
                </a>
              </p>
            </div>
            <div className="grid gap-2">
              <label className="text-xs font-medium text-muted-foreground">Email</label>
              <p>
                <a
                  href={`mailto:${lead.email}`}
                  className="text-primary hover:underline"
                >
                  {lead.email}
                </a>
              </p>
            </div>
            <div className="grid gap-2">
              <label className="text-xs font-medium text-muted-foreground">Ghi chú</label>
              <p className="text-sm text-muted-foreground">{lead.note || '—'}</p>
            </div>
            <div className="grid gap-2">
              <label className="text-xs font-medium text-muted-foreground">Trạng thái</label>
              <Select
                value={lead.status}
                onValueChange={(v) => handleStatusChange(v as LeadStatus)}
                disabled={updating}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {(['PENDING', 'CONTACTED', 'DONE'] as const).map((s) => (
                    <SelectItem key={s} value={s}>
                      {STATUS_LABELS[s]}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2 border-t pt-4">
              <p className="text-xs text-muted-foreground">
                Nguồn: <span className="font-medium text-foreground">{lead.source}</span> •{' '}
                Tạo lúc: {formatDate(lead.createdAt)}
              </p>
            </div>
          </div>
        ) : null}
      </DialogContent>
    </Dialog>
  );
}
