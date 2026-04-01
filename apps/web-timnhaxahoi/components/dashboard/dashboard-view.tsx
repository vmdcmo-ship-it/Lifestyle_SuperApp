'use client';

import Link from 'next/link';
import { useCallback, useEffect, useState } from 'react';
import {
  convertLead,
  fetchDashboard,
  type DashboardPayload,
} from '@/lib/api';
import { clearDashboardToken, readDashboardToken } from '@/lib/dashboard-token';
import { segmentLabelVi } from '@/lib/segment-label';

function Spinner({ className }: { className?: string }) {
  return (
    <svg className={`animate-spin ${className ?? 'h-5 w-5'}`} viewBox="0 0 24 24" aria-hidden>
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
      />
    </svg>
  );
}

export function DashboardView() {
  const [token, setToken] = useState<string | null>(null);
  const [data, setData] = useState<DashboardPayload | null>(null);
  const [loadErr, setLoadErr] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [note, setNote] = useState('');
  const [convertOk, setConvertOk] = useState<string | null>(null);
  const [convertErr, setConvertErr] = useState<string | null>(null);
  const [converting, setConverting] = useState(false);

  const load = useCallback(async (t: string) => {
    setLoading(true);
    setLoadErr(null);
    try {
      const d = await fetchDashboard(t);
      setData(d);
    } catch (e) {
      const msg = e instanceof Error ? e.message : 'Lỗi tải';
      setLoadErr(msg);
      setData(null);
      if (msg.includes('hết hạn') || msg.includes('Phiên đã')) {
        clearDashboardToken();
        setToken(null);
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const t = readDashboardToken();
    setToken(t);
    if (t) {
      void load(t);
    } else {
      setLoading(false);
    }
  }, [load]);

  async function onConvert() {
    if (!token) return;
    setConverting(true);
    setConvertErr(null);
    setConvertOk(null);
    try {
      const r = await convertLead(token, { note: note.trim() || undefined });
      setConvertOk(
        r.larkRecorded
          ? 'Đã ghi nhận yêu cầu. Đội ngũ sẽ liên hệ qua SĐT/Zalo và email.'
          : 'Đã ghi nhận yêu cầu trên hệ thống.',
      );
      setNote('');
    } catch (e) {
      const msg = e instanceof Error ? e.message : 'Gửi thất bại';
      setConvertErr(msg);
      if (msg.includes('hết hạn')) {
        clearDashboardToken();
        setToken(null);
        setData(null);
      }
    } finally {
      setConverting(false);
    }
  }

  function onSignOut() {
    clearDashboardToken();
    setToken(null);
    setData(null);
    setLoadErr(null);
  }

  if (!token && !loading) {
    return (
      <div className="mx-auto max-w-lg px-4 py-16 text-center">
        <h1 className="text-2xl font-bold text-slate-900">Chưa có phiên làm việc</h1>
        <p className="mt-3 text-slate-600">
          Hoàn thành trắc nghiệm để nhận liên kết kết quả. Dữ liệu được lưu trên trình duyệt của bạn (JWT).
        </p>
        <Link
          href="/quiz"
          className="mt-8 inline-flex rounded-xl bg-brand-gradient px-6 py-3 text-sm font-semibold text-white shadow-glow"
        >
          Làm trắc nghiệm
        </Link>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex min-h-[40vh] flex-col items-center justify-center gap-3 text-slate-600">
        <Spinner className="h-8 w-8 text-brand-navy" />
        <p className="text-sm">Đang tải kết quả…</p>
      </div>
    );
  }

  if (loadErr || !data) {
    return (
      <div className="mx-auto max-w-lg px-4 py-16 text-center">
        <h1 className="text-2xl font-bold text-slate-900">Không tải được dữ liệu</h1>
        <p className="mt-3 text-red-600">{loadErr ?? 'Lỗi không xác định'}</p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Link href="/quiz" className="rounded-xl bg-brand-gradient px-5 py-2.5 text-sm font-semibold text-white">
            Làm lại trắc nghiệm
          </Link>
          <button
            type="button"
            onClick={onSignOut}
            className="rounded-xl border border-slate-200 px-5 py-2.5 text-sm font-medium text-slate-700"
          >
            Xóa phiên cục bộ
          </button>
        </div>
      </div>
    );
  }

  const score = data.user.profileScore ?? data.quiz.calculatedScore;
  const scoreWidth = Math.min(100, Math.max(0, score));

  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <h1 className="text-2xl font-bold text-slate-900">Kết quả &amp; tư vấn</h1>
        <button
          type="button"
          onClick={onSignOut}
          className="self-start text-sm text-slate-500 underline decoration-slate-300 hover:text-slate-800"
        >
          Xóa phiên trên trình duyệt
        </button>
      </div>

      <div className="mt-8 glass-panel rounded-2xl p-6 md:p-8">
        <p className="text-sm font-medium text-slate-500">Điểm tham khảo</p>
        <div className="mt-3 flex items-end gap-2">
          <span className="text-4xl font-bold text-slate-900">{score}</span>
          <span className="pb-1 text-lg text-slate-500">/100</span>
        </div>
        <div className="mt-4 h-3 overflow-hidden rounded-full bg-slate-200">
          <div
            className="h-full rounded-full bg-brand-gradient transition-[width] duration-500 ease-out"
            style={{ width: `${scoreWidth}%` }}
          />
        </div>
        <p className="mt-6 text-sm text-slate-700">
          <span className="font-medium text-slate-900">Tóm tắt: </span>
          {segmentLabelVi(data.user.leadSegment)}
        </p>
        {data.user.fullName && (
          <p className="mt-4 text-sm text-slate-800">
            {data.user.salutation === 'chi' ? 'Chị ' : data.user.salutation === 'anh' ? 'Anh ' : ''}
            <span className="font-medium">{data.user.fullName}</span>
          </p>
        )}
        <p className="mt-2 text-xs text-slate-500">
          Liên hệ: {data.user.phoneNumber} · {data.user.email}
        </p>
      </div>

      {data.recommendedProjects.length > 0 && (
        <section className="mt-10">
          <h2 className="text-lg font-semibold text-slate-900">Dự án gợi ý</h2>
          <ul className="mt-4 space-y-3">
            {data.recommendedProjects.map((p) => (
              <li key={p.id} className="glass-panel rounded-xl p-4">
                <Link href={`/du-an/${p.slug}`} className="font-medium text-brand-navy hover:underline">
                  {p.name}
                </Link>
                <p className="mt-1 text-xs text-slate-500">
                  {[p.district, p.province].filter(Boolean).join(', ')} · {p.kind}
                </p>
              </li>
            ))}
          </ul>
        </section>
      )}

      <section className="mt-10 glass-panel rounded-2xl p-6 md:p-8">
        <h2 className="text-lg font-semibold text-slate-900">Yêu cầu tư vấn sâu</h2>
        <p className="mt-2 text-sm text-slate-600">
          Gửi ghi nhận cho đội ngũ (và Lark Base nếu đã cấu hình trên server).
        </p>
        <textarea
          className="mt-4 w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm text-slate-900"
          rows={3}
          placeholder="Nhu cầu cụ thể (tuỳ chọn)…"
          value={note}
          onChange={(e) => setNote(e.target.value)}
        />
        {convertErr && <p className="mt-2 text-sm text-red-600">{convertErr}</p>}
        {convertOk && <p className="mt-2 text-sm text-emerald-800">{convertOk}</p>}
        <button
          type="button"
          disabled={converting}
          onClick={() => void onConvert()}
          className="mt-4 inline-flex items-center gap-2 rounded-xl bg-brand-gradient px-6 py-3 text-sm font-semibold text-white shadow-glow disabled:opacity-50"
        >
          {converting && <Spinner className="h-4 w-4 text-white" />}
          Gửi yêu cầu
        </button>
      </section>

      <p className="mt-10 text-center text-xs text-slate-500">
        <Link href="/quiz" className="text-brand-navy hover:underline">
          Làm lại trắc nghiệm
        </Link>
        {' · '}
        <Link href="/du-an" className="text-brand-navy hover:underline">
          Danh sách dự án
        </Link>
      </p>
    </div>
  );
}
