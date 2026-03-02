'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { franchiseService } from '@/lib/franchise.service';
import { toast } from '@/lib/toast';
import type { FranchiseStatus } from '@/lib/franchise.service';

const STATUS_OPTIONS: Array<{ value: FranchiseStatus; label: string }> = [
  { value: 'PENDING', label: 'Chờ duyệt' },
  { value: 'ACTIVE', label: 'Đang hoạt động' },
  { value: 'INACTIVE', label: 'Dừng' },
];

export default function NewFranchisePage(): JSX.Element {
  const router = useRouter();
  const [code, setCode] = useState('');
  const [name, setName] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [contactPhone, setContactPhone] = useState('');
  const [status, setStatus] = useState<FranchiseStatus>('PENDING');
  const [contractSignedAt, setContractSignedAt] = useState('');
  const [contractExpiresAt, setContractExpiresAt] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    franchiseService
      .createPartner({
        code: code.trim(),
        name: name.trim(),
        contactEmail: contactEmail.trim() || undefined,
        contactPhone: contactPhone.trim() || undefined,
        status,
        contractSignedAt: contractSignedAt || undefined,
        contractExpiresAt: contractExpiresAt || undefined,
      })
      .then(() => {
        toast.success('Đã tạo đối tác nhượng quyền');
        router.push('/franchise');
      })
      .catch((err) => {
        const msg = (err as Error).message || 'Không thể tạo đối tác';
        setError(msg);
        toast.error(msg);
        setSubmitting(false);
      });
  };

  return (
    <div>
      <h1 className="mb-4 text-2xl font-bold">Thêm đối tác nhượng quyền</h1>

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
            placeholder="VD: FP001"
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
            placeholder="VD: Đối tác A"
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
            {submitting ? 'Đang tạo...' : 'Tạo đối tác'}
          </button>
          <Link
            href="/franchise"
            className="rounded-lg border border-input px-4 py-2 text-sm hover:bg-muted"
          >
            Hủy
          </Link>
        </div>
      </form>
    </div>
  );
}
