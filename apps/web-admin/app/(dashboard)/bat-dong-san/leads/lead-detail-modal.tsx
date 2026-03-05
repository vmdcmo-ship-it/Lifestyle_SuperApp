'use client';

import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
  batDongSanService,
  type BdsFindRequest,
  type BdsLeadStatus,
} from '@/lib/bat-dong-san.service';
import { toast } from '@/lib/toast';

const STATUS_LABELS: Record<BdsLeadStatus, string> = {
  PENDING: 'Chờ xử lý',
  CONTACTED: 'Đã liên hệ',
  DONE: 'Hoàn thành',
};

const TYPE_LABELS: Record<string, string> = {
  mua: 'Mua',
  thue: 'Thuê',
  'ca-hai': 'Cả hai',
};

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

interface Props {
  leadId: string | null;
  open: boolean;
  onClose: () => void;
  onStatusChange?: () => void;
}

export function BdsLeadDetailModal({
  leadId,
  open,
  onClose,
  onStatusChange,
}: Props): JSX.Element {
  const [lead, setLead] = useState<BdsFindRequest | null>(null);
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
    batDongSanService
      .getFindRequestById(leadId)
      .then((res) => {
        const data = (res as { data?: BdsFindRequest })?.data ?? res;
        setLead(data as BdsFindRequest);
      })
      .catch((err) => setError((err as Error).message || 'Không tải được chi tiết'))
      .finally(() => setLoading(false));
  }, [open, leadId]);

  const handleStatusChange = async (newStatus: BdsLeadStatus) => {
    if (!leadId || !lead) return;
    setUpdating(true);
    try {
      await batDongSanService.updateFindRequestStatus(leadId, newStatus);
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
          <DialogTitle>Chi tiết yêu cầu tìm BDS</DialogTitle>
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
              <p>{lead.phone}</p>
            </div>
            {lead.email && (
              <div className="grid gap-2">
                <label className="text-xs font-medium text-muted-foreground">Email</label>
                <p>{lead.email}</p>
              </div>
            )}
            <div className="grid gap-2">
              <label className="text-xs font-medium text-muted-foreground">Nhu cầu</label>
              <p>{TYPE_LABELS[lead.type] ?? lead.type}</p>
            </div>
            {lead.location && (
              <div className="grid gap-2">
                <label className="text-xs font-medium text-muted-foreground">Khu vực</label>
                <p>{lead.location}</p>
              </div>
            )}
            {lead.note && (
              <div className="grid gap-2">
                <label className="text-xs font-medium text-muted-foreground">Ghi chú</label>
                <p className="whitespace-pre-wrap">{lead.note}</p>
              </div>
            )}
            <div className="grid gap-2">
              <label className="text-xs font-medium text-muted-foreground">Ngày tạo</label>
              <p>{formatDate(lead.createdAt)}</p>
            </div>
            <div className="grid gap-2">
              <label className="text-xs font-medium text-muted-foreground">Trạng thái</label>
              <Select
                value={lead.status ?? 'PENDING'}
                onValueChange={(v) => handleStatusChange(v as BdsLeadStatus)}
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
          </div>
        ) : null}
      </DialogContent>
    </Dialog>
  );
}
