'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { franchiseService } from '@/lib/franchise.service';
import type { FranchisePartner, FranchiseStatus } from '@/lib/franchise.service';
import { toast } from '@/lib/toast';

const STATUS_OPTIONS: Array<{ value: FranchiseStatus; label: string }> = [
  { value: 'PENDING', label: 'Chờ duyệt' },
  { value: 'ACTIVE', label: 'Đang hoạt động' },
  { value: 'INACTIVE', label: 'Dừng' },
];

export default function EditFranchisePage(): JSX.Element {
  const params = useParams();
  const router = useRouter();
  const id = params?.id as string;

  const [partner, setPartner] = useState<FranchisePartner | null>(null);
  const [code, setCode] = useState('');
  const [name, setName] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [contactPhone, setContactPhone] = useState('');
  const [status, setStatus] = useState<FranchiseStatus>('PENDING');
  const [contractSignedAt, setContractSignedAt] = useState('');
  const [contractExpiresAt, setContractExpiresAt] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!id) return;
    franchiseService
      .getPartnerById(id)
      .then((p) => {
        setPartner(p);
        setCode(p.code);
        setName(p.name);
        setContactEmail(p.contact_email ?? '');
        setContactPhone(p.contact_phone ?? '');
        setStatus(p.status);
        setContractSignedAt(p.contract_signed_at ? p.contract_signed_at.slice(0, 10) : '');
        setContractExpiresAt(p.contract_expires_at ? p.contract_expires_at.slice(0, 10) : '');
      })
      .catch((err) => setError((err as Error).message))
      .finally(() => setLoading(false));
  }, [id]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!id) return;
    setError('');
    setSubmitting(true);
    franchiseService
      .updatePartner(id, {
        code: code.trim(),
        name: name.trim(),
        contactEmail: contactEmail.trim() || undefined,
        contactPhone: contactPhone.trim() || undefined,
        status,
        contractSignedAt: contractSignedAt || undefined,
        contractExpiresAt: contractExpiresAt || undefined,
      })
      .then(() => {
        toast.success('Đã cập nhật đối tác nhượng quyền');
        router.push(`/franchise/${id}`);
      })
      .catch((err) => {
        const msg = (err as Error).message || 'Không thể cập nhật';
        setError(msg);
        toast.error(msg);
      })
      .finally(() => setSubmitting(false));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12 text-muted-foreground">
        Đang tải...
      </div>
    );
  }

  if (error && !partner) {
    return (
      <div>
        <Link href="/franchise" className="mb-4 inline-block text-sm text-primary hover:underline">
          ← Quay lại
        </Link>
        <div className="rounded-lg bg-destructive/10 px-4 py-3 text-sm text-destructive">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div>
      <Link
        href={`/franchise/${id}`}
        className="mb-4 inline-block text-sm text-primary hover:underline"
      >
        ← Quay lại chi tiết
      </Link>
      <h1 className="mb-6 text-2xl font-bold">Chỉnh sửa đối tác nhượng quyền</h1>

      {error && (
        <div className="mb-4 rounded-lg bg-destructive/10 px-4 py-3 text-sm text-destructive">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="max-w-xl space-y-4">
        <div>
          <label className="mb-1 block text-sm font-medium">Mã đối tác *</label>
          <input
            type="text"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            required
            maxLength={30}
            className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary"
          />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium">Tên *</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            maxLength={200}
            className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary"
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="mb-1 block text-sm font-medium">Email</label>
            <input
              type="email"
              value={contactEmail}
              onChange={(e) => setContactEmail(e.target.value)}
              className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium">Số điện thoại</label>
            <input
              type="text"
              value={contactPhone}
              onChange={(e) => setContactPhone(e.target.value)}
              maxLength={20}
              className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium">Trạng thái</label>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value as FranchiseStatus)}
            className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary"
          >
            {STATUS_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="mb-1 block text-sm font-medium">Ngày ký HĐ</label>
            <input
              type="date"
              value={contractSignedAt}
              onChange={(e) => setContractSignedAt(e.target.value)}
              className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium">Ngày hết HĐ</label>
            <input
              type="date"
              value={contractExpiresAt}
              onChange={(e) => setContractExpiresAt(e.target.value)}
              className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
        </div>
        <div className="flex gap-2">
          <button
            type="submit"
            disabled={submitting}
            className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
          >
            {submitting ? 'Đang lưu...' : 'Lưu thay đổi'}
          </button>
          <Link
            href={`/franchise/${id}`}
            className="rounded-lg border border-input px-4 py-2 text-sm hover:bg-muted"
          >
            Hủy
          </Link>
        </div>
      </form>
    </div>
  );
}
