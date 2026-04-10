'use client';

import Link from 'next/link';
import { useCallback, useState } from 'react';
import {
  type BudgetMatchResponse,
  type BudgetMatchSegment,
  postBudgetMatch,
} from '@/lib/api';

function formatVnd(n: number): string {
  return `${n.toLocaleString('vi-VN')} VNĐ`;
}

function triệuToVnd(triệu: string): number | null {
  const t = triệu.replace(/\s/g, '').replace(',', '.');
  const v = parseFloat(t);
  if (!Number.isFinite(v) || v <= 0) {
    return null;
  }
  return Math.round(v * 1_000_000);
}

type Props = {
  /** Khi false: ẩn heading intro (vd trang /bang-tinh đã có H1) */
  showIntro?: boolean;
  /** ID cho landmark / aria-labelledby (mặc định gắn với H2 intro) */
  headingId?: string;
};

export function BudgetCompareWidget({ showIntro = true, headingId = 'budget-compare-heading' }: Props) {
  const [segment, setSegment] = useState<BudgetMatchSegment>('noxh');
  const [maxTriệu, setMaxTriệu] = useState('2500');
  const [province, setProvince] = useState('');
  const [district, setDistrict] = useState('');
  const [ownTriệu, setOwnTriệu] = useState('');
  const [monthlyTriệu, setMonthlyTriệu] = useState('');
  const [advancedOpen, setAdvancedOpen] = useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<BudgetMatchResponse | null>(null);

  const runMatch = useCallback(async () => {
    setError(null);
    const maxVnd = triệuToVnd(maxTriệu);
    if (maxVnd == null) {
      setError('Nhập ngân sách tối đa hợp lệ (triệu VNĐ, phải lớn hơn 0).');
      return;
    }
    const ownVnd = ownTriệu.trim() === '' ? undefined : triệuToVnd(ownTriệu);
    if (ownTriệu.trim() !== '' && ownVnd == null) {
      setError('Vốn tự có không hợp lệ (để trống nếu không dùng).');
      return;
    }
    const monthlyVnd =
      monthlyTriệu.trim() === '' ? undefined : triệuToVnd(monthlyTriệu);
    if (monthlyTriệu.trim() !== '' && monthlyVnd == null) {
      setError('Trần trả tháng không hợp lệ (để trống nếu không dùng).');
      return;
    }

    setLoading(true);
    setResult(null);
    try {
      const data = await postBudgetMatch(segment, {
        maxTotalPriceVnd: maxVnd,
        province: province.trim() || undefined,
        district: district.trim() || undefined,
        limit: 24,
        ownCapitalVnd: ownVnd ?? undefined,
        maxMonthlyPaymentVnd: monthlyVnd ?? undefined,
      });
      setResult(data);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Lỗi kết nối máy chủ.');
    } finally {
      setLoading(false);
    }
  }, [segment, maxTriệu, province, district, ownTriệu, monthlyTriệu]);

  return (
    <div className="space-y-6">
      {showIntro ? (
        <div>
          <p className="text-xs font-medium uppercase tracking-wide text-slate-500">Ước tính nhanh</p>
          <h2 id={headingId} className="mt-2 text-xl font-bold text-slate-900 md:text-2xl">
            Thử bảng tính so sánh
          </h2>
          <p className="mt-2 max-w-2xl text-sm text-slate-600">
            So khung giá căn điển hình (giá/m² × diện tích mẫu trong catalog). Không thay cho báo giá hay hợp đồng;
            tư vấn viên sẽ xác nhận thực tế.
          </p>
        </div>
      ) : null}

      <div
        role="tablist"
        aria-label="Phân khúc dự án"
        className="flex flex-wrap gap-2 rounded-xl border border-slate-200 bg-white/70 p-1"
      >
        <button
          type="button"
          role="tab"
          aria-selected={segment === 'noxh'}
          className={`rounded-lg px-4 py-2 text-sm font-semibold transition ${
            segment === 'noxh'
              ? 'bg-brand-navy text-white shadow'
              : 'text-slate-600 hover:bg-slate-50'
          }`}
          onClick={() => setSegment('noxh')}
        >
          Nhà ở xã hội (NOXH)
        </button>
        <button
          type="button"
          role="tab"
          aria-selected={segment === 'affordable_commercial'}
          className={`rounded-lg px-4 py-2 text-sm font-semibold transition ${
            segment === 'affordable_commercial'
              ? 'bg-brand-navy text-white shadow'
              : 'text-slate-600 hover:bg-slate-50'
          }`}
          onClick={() => setSegment('affordable_commercial')}
        >
          Nhà TM giá rẻ
        </button>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block sm:col-span-2">
          <span className="text-sm font-medium text-slate-700">Ngân sách tối đa (triệu VNĐ)</span>
          <input
            type="text"
            inputMode="decimal"
            value={maxTriệu}
            onChange={(e) => setMaxTriệu(e.target.value)}
            className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-slate-900 shadow-sm outline-none ring-brand-navy/30 focus:ring-2"
            placeholder="Ví dụ 2500"
            autoComplete="off"
          />
        </label>
        <label className="block">
          <span className="text-sm font-medium text-slate-700">Tỉnh / TP (tuỳ chọn)</span>
          <input
            type="text"
            value={province}
            onChange={(e) => setProvince(e.target.value)}
            className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-slate-900 shadow-sm outline-none ring-brand-navy/30 focus:ring-2"
            placeholder="Ví dụ Khánh Hòa"
            autoComplete="address-level1"
          />
        </label>
        <label className="block">
          <span className="text-sm font-medium text-slate-700">Quận / huyện (tuỳ chọn)</span>
          <input
            type="text"
            value={district}
            onChange={(e) => setDistrict(e.target.value)}
            className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-slate-900 shadow-sm outline-none ring-brand-navy/30 focus:ring-2"
            placeholder="Ví dụ Nha Trang"
            autoComplete="address-level2"
          />
        </label>
      </div>

      <div>
        <button
          type="button"
          onClick={() => setAdvancedOpen(!advancedOpen)}
          className="text-sm font-medium text-brand-navy hover:underline"
          aria-expanded={advancedOpen}
        >
          {advancedOpen ? 'Ẩn' : 'Mở rộng'} — vốn tự có và trả hàng tháng
        </button>
        {advancedOpen ? (
          <div className="mt-3 grid gap-4 sm:grid-cols-2 rounded-xl border border-dashed border-slate-200 bg-slate-50/80 p-4">
            <label className="block">
              <span className="text-sm font-medium text-slate-700">Vốn tự có (triệu)</span>
              <input
                type="text"
                inputMode="decimal"
                value={ownTriệu}
                onChange={(e) => setOwnTriệu(e.target.value)}
                className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-slate-900 shadow-sm outline-none ring-brand-navy/30 focus:ring-2"
                placeholder="Để trống = không tính vay minh họa"
              />
            </label>
            <label className="block">
              <span className="text-sm font-medium text-slate-700">Trần trả góp / tháng (triệu)</span>
              <input
                type="text"
                inputMode="decimal"
                value={monthlyTriệu}
                onChange={(e) => setMonthlyTriệu(e.target.value)}
                className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-slate-900 shadow-sm outline-none ring-brand-navy/30 focus:ring-2"
                placeholder="Lọc dự án theo ước tính annuity minh họa"
              />
            </label>
            <p className="sm:col-span-2 text-xs text-slate-500">
              Ước tính vay dùng kỳ cố định và lãi minh họa do hệ thống đặt — chỉ để so sánh sơ bộ; lãi suất thực tế
              khác.
            </p>
          </div>
        ) : null}
      </div>

      <button
        type="button"
        onClick={() => void runMatch()}
        disabled={loading}
        className="inline-flex w-full items-center justify-center rounded-xl bg-brand-gradient px-6 py-3.5 text-base font-semibold text-white shadow-glow transition hover:opacity-95 disabled:opacity-60 sm:w-auto"
      >
        {loading ? 'Đang tính…' : 'Gợi ý dự án'}
      </button>

      {error ? (
        <div
          role="alert"
          className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800"
        >
          {error}
        </div>
      ) : null}

      {loading ? <BudgetMatchSkeleton /> : null}

      {!loading && result ? (
        <BudgetMatchResults
          result={result}
          segment={segment}
          segmentLabel={segment === 'noxh' ? 'NOXH' : 'TM giá rẻ'}
        />
      ) : null}
    </div>
  );
}

function BudgetMatchSkeleton() {
  return (
    <div className="space-y-4" aria-busy="true" aria-label="Đang tải kết quả">
      <div className="h-16 animate-pulse rounded-xl bg-slate-200/80" />
      <div className="grid gap-3 sm:grid-cols-2">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="h-32 animate-pulse rounded-xl bg-slate-200/80" />
        ))}
      </div>
    </div>
  );
}

function BudgetMatchResults({
  result,
  segment,
  segmentLabel,
}: {
  result: BudgetMatchResponse;
  segment: BudgetMatchSegment;
  segmentLabel: string;
}) {
  const { catalogRange, loanAssumptions, items } = result;
  const emptyCatalog = catalogRange == null;

  return (
    <div className="space-y-6">
      {catalogRange ? (
        <div className="rounded-xl border border-slate-200 bg-white/90 px-4 py-3 text-sm text-slate-700">
          <strong className="text-slate-900">Trong danh mục {segmentLabel} đã lọc:</strong> ước tính căn điển hình từ{' '}
          <strong>{formatVnd(catalogRange.minEstimatedTotalVnd)}</strong> đến{' '}
          <strong>{formatVnd(catalogRange.maxEstimatedTotalVnd)}</strong>.
        </div>
      ) : (
        <div className="rounded-xl border border-slate-200 bg-slate-50/90 px-4 py-4 text-sm text-slate-700">
          {segment === 'affordable_commercial' ? (
            <>
              <p className="font-medium text-slate-900">Chưa có dự án nhà thương mại giá rẻ trong catalog (sau lọc địa lý).</p>
              <p className="mt-2">
                Danh mục TM phụ thuộc dữ liệu admin — có thể đang ít hơn NOXH. Bạn có thể chuyển tab{' '}
                <strong>NOXH</strong>, xem{' '}
                <Link href="/du-an?kind=AFFORDABLE_COMMERCIAL" className="font-semibold text-brand-navy hover:underline">
                  toàn bộ dự án TM
                </Link>
                , hoặc bỏ lọc tỉnh/huyện rồi chạy lại.
              </p>
            </>
          ) : (
            <>
              <p className="font-medium text-slate-900">Chưa có dự án NOXH trong catalog (sau lọc địa lý).</p>
              <p className="mt-2">
                Kiểm tra API / dữ liệu mẫu trên môi trường dev, hoặc bỏ lọc địa lý. Tham khảo{' '}
                <Link href="/du-an?kind=NOXH" className="font-semibold text-brand-navy hover:underline">
                  danh sách dự án NOXH
                </Link>
                .
              </p>
            </>
          )}
        </div>
      )}

      {loanAssumptions ? (
        <p className="text-xs text-slate-500">
          Minh họa vay: kỳ <strong>{loanAssumptions.termMonths}</strong> tháng, lãi năm minh họa{' '}
          <strong>{loanAssumptions.annualRatePercent}%</strong>.
        </p>
      ) : null}

      {items.length === 0 && !emptyCatalog ? (
        <div className="rounded-xl border border-amber-200 bg-amber-50/80 px-4 py-4 text-sm text-amber-950">
          Không có dự án phù hợp ngân sách
          {loanAssumptions ? ' và điều kiện trả tháng minh họa' : ''}. Thử tăng ngân sách, bỏ lọc tỉnh/huyện, hoặc chọn
          phân khúc khác.
          <div className="mt-3">
            <Link href="/quiz" className="font-semibold text-brand-navy hover:underline">
              Làm trắc nghiệm điều kiện NOXH
            </Link>
            <span className="text-slate-600"> — gợi ý hồ sơ và tư vấn sâu hơn.</span>
          </div>
        </div>
      ) : null}

      {items.length > 0 ? (
        <ul className="grid gap-4 sm:grid-cols-2">
          {items.map((p) => (
            <li key={p.id} className="glass-panel rounded-xl p-5 transition hover:shadow-md">
              <Link
                href={`/du-an/${encodeURIComponent(p.slug)}`}
                className="text-lg font-semibold text-brand-navy hover:underline"
              >
                {p.name}
              </Link>
              <p className="mt-1 text-sm text-slate-500">
                {[p.district, p.province].filter(Boolean).join(', ') || '—'}
              </p>
              <p className="mt-3 text-xs text-slate-600">
                Ước tính ~{formatVnd(p.estimatedTotalVnd)} · {p.typicalAreaM2}m² · giá/m²{' '}
                {p.pricePerM2.toLocaleString('vi-VN')}
              </p>
              {p.loanNeededVnd != null && p.estimatedMonthlyPaymentVnd != null ? (
                <p className="mt-2 text-xs text-slate-600">
                  Vay minh họa ~{formatVnd(p.loanNeededVnd)} · trả ~{formatVnd(p.estimatedMonthlyPaymentVnd)}/tháng
                </p>
              ) : null}
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}
