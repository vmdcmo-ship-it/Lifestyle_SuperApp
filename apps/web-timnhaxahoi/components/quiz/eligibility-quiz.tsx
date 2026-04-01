'use client';

import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import { WorkAddressField } from '@/components/maps/work-address-field';
import { fetchProjects, submitEligibility, type HousingProject } from '@/lib/api';
import { saveDashboardToken } from '@/lib/dashboard-token';
import { segmentLabelVi } from '@/lib/segment-label';

const DRAFT_KEY = 'timnhaxahoi-quiz-draft-v4';
const DRAFT_VERSION = 4;

function Spinner({ className }: { className?: string }) {
  return (
    <svg className={`animate-spin ${className ?? 'h-4 w-4'}`} viewBox="0 0 24 24" aria-hidden>
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
      />
    </svg>
  );
}

const steps = ['Liên hệ', 'Bối cảnh của bạn', 'Dự án ưu tiên', 'Tài chính & mong muốn tư vấn'] as const;

const defaultForm = {
  priorityGroup: 2,
  residenceStatus: 1,
  incomeBracket: 1,
  housingStatus: 1,
  priorityProjectIds: [] as string[],
  ownCapitalMillion: 150,
  borrowedCapitalMillion: 0,
  loanPreference: 2,
  maxMonthlyPaymentMillion: 7,
  consultationFocus: 1,
  salutation: '' as '' | 'anh' | 'chi',
  fullName: '',
  phone: '',
  email: '',
  workAddress: '',
  workPlaceId: undefined as string | undefined,
  workLat: undefined as number | undefined,
  workLng: undefined as number | undefined,
};

export function EligibilityQuiz() {
  const [step, setStep] = useState(0);
  const [projects, setProjects] = useState<HousingProject[]>([]);
  const [loadErr, setLoadErr] = useState<string | null>(null);
  const [submitErr, setSubmitErr] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState<Awaited<ReturnType<typeof submitEligibility>> | null>(null);
  const [form, setForm] = useState(defaultForm);
  const [draftHydrated, setDraftHydrated] = useState(false);

  useEffect(() => {
    fetchProjects('NOXH')
      .then(setProjects)
      .catch((e: Error) => setLoadErr(e.message));
  }, []);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(DRAFT_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as { v?: number; step?: number; form?: Partial<typeof defaultForm> };
        if (parsed.v === DRAFT_VERSION) {
          const patch = parsed.form;
          if (patch && typeof patch === 'object') {
            setForm((f) => ({
              ...f,
              ...patch,
              priorityProjectIds: patch.priorityProjectIds ?? f.priorityProjectIds,
            }));
          }
          if (typeof parsed.step === 'number' && parsed.step >= 0 && parsed.step < steps.length) {
            setStep(parsed.step);
          }
        }
      }
    } catch {
      /* ignore */
    }
    setDraftHydrated(true);
  }, []);

  useEffect(() => {
    if (!draftHydrated) return;
    const t = setTimeout(() => {
      try {
        localStorage.setItem(DRAFT_KEY, JSON.stringify({ v: DRAFT_VERSION, step, form }));
      } catch {
        /* quota / private mode */
      }
    }, 400);
    return () => clearTimeout(t);
  }, [step, form, draftHydrated]);

  const progress = useMemo(() => ((step + 1) / steps.length) * 100, [step]);

  const contactOk = useMemo(() => {
    const name = form.fullName.trim();
    const phone = form.phone.replace(/\s/g, '');
    const email = form.email.trim();
    return (
      (form.salutation === 'anh' || form.salutation === 'chi') &&
      name.length >= 2 &&
      phone.length >= 9 &&
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
    );
  }, [form.salutation, form.fullName, form.phone, form.email]);

  function toggleProject(id: string) {
    setForm((f) => {
      const set = new Set(f.priorityProjectIds);
      if (set.has(id)) {
        set.delete(id);
      } else if (set.size < 3) {
        set.add(id);
      }
      return { ...f, priorityProjectIds: [...set] };
    });
  }

  async function onSubmit() {
    setSubmitting(true);
    setSubmitErr(null);
    setResult(null);
    try {
      const r = await submitEligibility({
        priorityGroup: form.priorityGroup,
        residenceStatus: form.residenceStatus,
        incomeBracket: form.incomeBracket,
        housingStatus: form.housingStatus,
        priorityProjectIds: form.priorityProjectIds,
        ownCapitalMillion: form.ownCapitalMillion,
        borrowedCapitalMillion: form.borrowedCapitalMillion,
        loanPreference: form.loanPreference,
        maxMonthlyPaymentMillion: form.maxMonthlyPaymentMillion,
        consultationFocus: form.consultationFocus,
        phone: form.phone,
        email: form.email,
        fullName: form.fullName.trim(),
        salutation: form.salutation === 'anh' || form.salutation === 'chi' ? form.salutation : undefined,
      });
      if (r.dashboardToken) {
        saveDashboardToken(r.dashboardToken);
      }
      try {
        localStorage.removeItem(DRAFT_KEY);
      } catch {
        /* ignore */
      }
      setResult(r);
    } catch (e) {
      setSubmitErr(e instanceof Error ? e.message : 'Lỗi không xác định');
    } finally {
      setSubmitting(false);
    }
  }

  const canGoNext =
    step === 0
      ? contactOk
      : true;

  return (
    <div className="glass-panel mx-auto max-w-xl rounded-2xl p-5 md:p-8">
      <div className="mb-6 h-2 overflow-hidden rounded-full bg-slate-200">
        <div
          className="h-full rounded-full bg-brand-gradient transition-[width] duration-300 ease-out"
          style={{ width: `${progress}%` }}
        />
      </div>
      <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
        Bước {step + 1}/{steps.length} — {steps[step]}
      </p>

      <div key={step} className="mt-4 space-y-4">
        {step === 0 && (
          <>
            <p className="text-sm leading-relaxed text-slate-600">
              Cho <strong className="font-semibold text-slate-800">danh xưng, họ tên, SĐT và email</strong> ngay từ đầu — để <strong className="font-semibold text-slate-800">Vũ</strong> xưng hô tự nhiên (vd. Anh Thanh, Chị Thảo) và liên hệ khi bạn cần dừng giữa chừng; đồng thời lưu nháp trên trình duyệt (cùng thiết bị).
            </p>
            <Field label="Danh xưng">
              <div className="flex flex-wrap gap-3">
                <label className="flex cursor-pointer items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm has-[:checked]:border-brand-emerald/50 has-[:checked]:bg-emerald-50/50">
                  <input
                    type="radio"
                    name="salutation"
                    checked={form.salutation === 'anh'}
                    onChange={() => setForm((f) => ({ ...f, salutation: 'anh' }))}
                  />
                  Anh
                </label>
                <label className="flex cursor-pointer items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm has-[:checked]:border-brand-emerald/50 has-[:checked]:bg-emerald-50/50">
                  <input
                    type="radio"
                    name="salutation"
                    checked={form.salutation === 'chi'}
                    onChange={() => setForm((f) => ({ ...f, salutation: 'chi' }))}
                  />
                  Chị
                </label>
              </div>
              <p className="mt-1.5 text-xs text-slate-500">
                Chỉ để xưng hô thân thiện trong tư vấn; bạn vẫn có thể được gọi tên trực tiếp khi phù hợp.
              </p>
            </Field>
            <Field label="Họ và tên">
              <input
                required
                type="text"
                autoComplete="name"
                placeholder="Nguyễn Văn A"
                className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-slate-900"
                value={form.fullName}
                onChange={(e) => setForm((f) => ({ ...f, fullName: e.target.value }))}
              />
            </Field>
            <Field label="Số điện thoại (Zalo nếu có)">
              <input
                required
                type="tel"
                autoComplete="tel"
                placeholder="0912345678"
                className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-slate-900"
                value={form.phone}
                onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))}
              />
            </Field>
            <Field label="Email">
              <input
                required
                type="email"
                autoComplete="email"
                placeholder="ban@email.com"
                className="w-full rounded-xl border border-slate-200 px-3 py-2.5"
                value={form.email}
                onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
              />
            </Field>
            <p className="text-xs leading-relaxed text-slate-500">
              Bạn có thể điền tiếp các bước sau để nhận <strong className="text-slate-600">kết quả sơ bộ</strong>. Thông tin dùng để tư vấn trong khuôn khổ đã công bố; không thay thế quyết định của cơ quan có thẩm quyền.
            </p>
          </>
        )}

        {step === 1 && (
          <>
            <RetentionNoteLegal />
            <Field label="Nhóm đối tượng">
              <select
                className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-slate-900"
                value={form.priorityGroup}
                onChange={(e) => setForm((f) => ({ ...f, priorityGroup: Number(e.target.value) }))}
              >
                <option value={1}>Công nhân / KCN</option>
                <option value={2}>Công chức, VC, lực lượng vũ trang</option>
                <option value={3}>Thu nhập thấp đô thị</option>
                <option value={4}>Khác (ưu tiên đặc thù)</option>
                <option value={5}>Không thuộc diện ưu tiên</option>
              </select>
            </Field>
            <Field label="Tình trạng cư trú">
              <select
                className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5"
                value={form.residenceStatus}
                onChange={(e) => setForm((f) => ({ ...f, residenceStatus: Number(e.target.value) }))}
              >
                <option value={1}>Hộ khẩu thường trú tại tỉnh/TP định mua</option>
                <option value={2}>Tạm trú + BHXH &gt; 1 năm</option>
                <option value={3}>Chưa đủ điều kiện cư trú</option>
              </select>
            </Field>
            <Field label="Mức thu nhập (tham khảo)">
              <select
                className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5"
                value={form.incomeBracket}
                onChange={(e) => setForm((f) => ({ ...f, incomeBracket: Number(e.target.value) }))}
              >
                <option value={1}>Độc thân dưới 15 triệu/tháng</option>
                <option value={2}>Vợ chồng dưới 30 triệu/tháng</option>
                <option value={3}>Cao hơn / đóng thuế TNCN thường xuyên</option>
              </select>
            </Field>
            <Field label="Nhà ở hiện tại (diện tích bình quân/người, tham khảo)">
              <select
                className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5"
                value={form.housingStatus}
                onChange={(e) => setForm((f) => ({ ...f, housingStatus: Number(e.target.value) }))}
              >
                <option value={1}>Chưa có nhà tại tỉnh định mua</option>
                <option value={2}>Có nhà nhưng &lt; 15m²/người</option>
                <option value={3}>Ổn định trên 15m²/người</option>
              </select>
            </Field>
            <Field label="Địa chỉ làm việc (tuỳ chọn — gợi ý Maps nếu đã cấu hình API key)">
              <WorkAddressField
                disabled={submitting}
                value={{
                  workAddress: form.workAddress,
                  workPlaceId: form.workPlaceId,
                  workLat: form.workLat,
                  workLng: form.workLng,
                }}
                onChange={(v) =>
                  setForm((f) => ({
                    ...f,
                    workAddress: v.workAddress,
                    workPlaceId: v.workPlaceId,
                    workLat: v.workLat,
                    workLng: v.workLng,
                  }))
                }
              />
            </Field>
          </>
        )}

        {step === 2 && (
          <>
            <RetentionNoteProjects />
            {loadErr && <p className="text-sm text-red-600">{loadErr}</p>}
            {!loadErr && projects.length === 0 && (
              <p className="flex items-center gap-2 text-sm text-slate-500">
                <Spinner /> Đang tải dự án…
              </p>
            )}
            <p className="text-sm text-slate-600">Chọn tối đa 3 dự án NOXH bạn muốn xem xét trước.</p>
            <ul className="max-h-64 space-y-2 overflow-y-auto pr-1">
              {projects.map((p) => {
                const checked = form.priorityProjectIds.includes(p.id);
                return (
                  <li key={p.id}>
                    <label className="flex cursor-pointer items-start gap-3 rounded-xl border border-slate-200 bg-white/80 p-3 hover:border-brand-emerald/40">
                      <input
                        type="checkbox"
                        checked={checked}
                        onChange={() => toggleProject(p.id)}
                        className="mt-1 h-4 w-4 rounded border-slate-300"
                      />
                      <span>
                        <span className="font-medium text-slate-900">{p.name}</span>
                        <span className="mt-0.5 block text-xs text-slate-500">
                          {[p.district, p.province].filter(Boolean).join(', ')}
                        </span>
                      </span>
                    </label>
                  </li>
                );
              })}
            </ul>
          </>
        )}

        {step === 3 && (
          <>
            <Field label="Vốn tự có (triệu)">
              <input
                type="number"
                min={0}
                className="w-full rounded-xl border border-slate-200 px-3 py-2.5"
                value={form.ownCapitalMillion}
                onChange={(e) => setForm((f) => ({ ...f, ownCapitalMillion: Number(e.target.value) }))}
              />
            </Field>
            <Field label="Vốn huy động / người thân (triệu)">
              <input
                type="number"
                min={0}
                className="w-full rounded-xl border border-slate-200 px-3 py-2.5"
                value={form.borrowedCapitalMillion}
                onChange={(e) => setForm((f) => ({ ...f, borrowedCapitalMillion: Number(e.target.value) }))}
              />
            </Field>
            <Field label="Nhu cầu vay">
              <select
                className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5"
                value={form.loanPreference}
                onChange={(e) => setForm((f) => ({ ...f, loanPreference: Number(e.target.value) }))}
              >
                <option value={1}>Không cần vay</option>
                <option value={2}>Vay ~50%</option>
                <option value={3}>Vay tối đa (70–80%)</option>
              </select>
            </Field>
            <Field label="Khả năng trả tối đa / tháng (triệu)">
              <input
                type="number"
                min={0}
                className="w-full rounded-xl border border-slate-200 px-3 py-2.5"
                value={form.maxMonthlyPaymentMillion}
                onChange={(e) =>
                  setForm((f) => ({
                    ...f,
                    maxMonthlyPaymentMillion: Number(e.target.value),
                  }))
                }
              />
            </Field>
            <Field label="Bạn muốn được đồng hành sâu hơn ở khía cạnh nào?">
              <select
                className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5"
                value={form.consultationFocus}
                onChange={(e) => setForm((f) => ({ ...f, consultationFocus: Number(e.target.value) }))}
              >
                <option value={1}>Pháp lý & hồ sơ</option>
                <option value={2}>Tài chính & vay</option>
                <option value={3}>Thực tế dự án</option>
              </select>
            </Field>
          </>
        )}
      </div>

      {submitErr && (
        <p className="mt-4 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-800">{submitErr}</p>
      )}

      {result && (
        <div className="mt-6 rounded-xl border border-emerald-200 bg-emerald-50/80 p-4 text-sm text-slate-800">
          <p className="font-semibold text-emerald-900">Kết quả sơ bộ</p>
          <p className="mt-2">{result.userMessage}</p>
          <p className="mt-2 text-xs text-slate-600">
            {segmentLabelVi(result.segment)} — Điểm tham khảo: {result.score}/100
          </p>
          <Link
            href="/dashboard"
            className="mt-4 inline-flex rounded-xl bg-brand-gradient px-4 py-2.5 text-xs font-semibold text-white shadow-glow"
          >
            Xem chi tiết &amp; gửi tư vấn sâu
          </Link>
        </div>
      )}

      <div className="mt-8 flex justify-between gap-3">
        <button
          type="button"
          disabled={step === 0}
          onClick={() => setStep((s) => Math.max(0, s - 1))}
          className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-medium text-slate-700 disabled:opacity-40"
        >
          Quay lại
        </button>
        {step < steps.length - 1 ? (
          <button
            type="button"
            disabled={!canGoNext}
            onClick={() => setStep((s) => s + 1)}
            className="rounded-xl bg-brand-gradient px-5 py-2.5 text-sm font-semibold text-white shadow-glow disabled:opacity-50"
          >
            Tiếp tục
          </button>
        ) : (
          <button
            type="button"
            disabled={submitting || !contactOk}
            onClick={() => void onSubmit()}
            className="inline-flex items-center gap-2 rounded-xl bg-brand-gradient px-5 py-2.5 text-sm font-semibold text-white shadow-glow disabled:opacity-50"
          >
            {submitting && <Spinner />}
            Xem kết quả
          </button>
        )}
      </div>
    </div>
  );
}

function RetentionNoteLegal() {
  return (
    <aside
      className="rounded-xl border border-sky-200/80 bg-sky-50/90 px-3 py-3 text-sm leading-relaxed text-slate-700"
      role="note"
    >
      <p className="font-medium text-sky-950">Lo chưa đủ điều kiện NOXH hoặc thu nhập “lệch” so với quy định?</p>
      <p className="mt-1.5 text-slate-600">
        Vẫn nên điền tiếp: kết quả chỉ là <strong className="font-medium text-slate-700">tham khảo</strong>. Đội ngũ có thể gợi ý
        hướng cải thiện hồ sơ, lộ trình phù hợp hoặc lựa chọn khác — tránh bỏ lỡ cơ hội được đồng hành đúng ngữ cảnh.
      </p>
    </aside>
  );
}

function RetentionNoteProjects() {
  return (
    <aside
      className="rounded-xl border border-amber-200/80 bg-amber-50/90 px-3 py-3 text-sm leading-relaxed text-slate-700"
      role="note"
    >
      <p className="font-medium text-amber-950">Không thấy dự án đúng “trung tâm” như mong muốn?</p>
      <p className="mt-1.5 text-slate-600">
        Nhà ở xã hội thường theo <strong className="font-medium text-slate-700">quy hoạch đất và giá</strong>, không phải lúc nào
        cũng nằm ngay lõi đô thị. Bạn vẫn chọn dự án gần nhất trong danh sách để nhận <strong className="font-medium text-slate-700">gợi ý &amp; giải thích</strong>; tư vấn viên có thể trao đổi thêm về kỳ vọng vị trí và phương án thực tế.
      </p>
    </aside>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-sm font-medium text-slate-700">{label}</span>
      {children}
    </label>
  );
}
