'use client';

import { useRouter } from 'next/navigation';
import { type FormEvent, useState } from 'react';

type MainTab = 'tro' | 'noxh';

export function DualTabsPoi(): JSX.Element {
  const router = useRouter();
  const [tab, setTab] = useState<MainTab>('tro');
  const [locationHint, setLocationHint] = useState('');

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    const q = locationHint.trim();
    if (tab === 'tro') {
      if (q) {
        router.push(`/timnhatro?q=${encodeURIComponent(q)}`);
      } else {
        router.push('/timnhatro');
      }
      return;
    }
    const params = new URLSearchParams();
    params.set('kind', 'NOXH');
    if (q) {
      params.set('district', q);
    }
    router.push(`/du-an?${params.toString()}`);
  };

  return (
    <div className="glass-panel rounded-2xl p-4 shadow-md md:p-6">
      <p className="text-center text-xs font-medium uppercase tracking-wide text-slate-500">Bắt đầu tìm kiếm</p>
      <div className="mt-3 flex overflow-hidden rounded-xl border border-slate-200/90 shadow-sm" role="tablist">
        <button
          type="button"
          role="tab"
          aria-selected={tab === 'tro'}
          onClick={() => setTab('tro')}
          className={`min-h-[48px] flex-1 px-3 py-3 text-center text-sm font-semibold transition md:text-base ${
            tab === 'tro' ? 'bg-brand-navy text-white' : 'bg-slate-100 text-brand-navy hover:bg-slate-200/80'
          }`}
        >
          Tìm nhà trọ
        </button>
        <button
          type="button"
          role="tab"
          aria-selected={tab === 'noxh'}
          onClick={() => setTab('noxh')}
          className={`min-h-[48px] flex-1 px-3 py-3 text-center text-sm font-semibold transition md:text-base ${
            tab === 'noxh'
              ? 'bg-white text-brand-navy ring-2 ring-inset ring-brand-navy'
              : 'bg-white text-brand-navy hover:bg-slate-50'
          }`}
        >
          Tìm nhà ở xã hội
        </button>
      </div>
      <form onSubmit={onSubmit} className="mt-4 space-y-3">
        <label className="block text-sm font-medium text-slate-700" htmlFor="poi-search">
          Vị trí của bạn
        </label>
        <input
          id="poi-search"
          type="text"
          value={locationHint}
          onChange={(e) => setLocationHint(e.target.value)}
          placeholder="Ví dụ: Đường 2/9 Nha Trang, gần tòa Viettel…"
          className="w-full rounded-xl border border-slate-200 bg-white/90 px-4 py-3 text-slate-900 shadow-sm placeholder:text-slate-400 focus:border-brand-navy focus:outline-none focus:ring-1 focus:ring-brand-navy"
          autoComplete="off"
        />
        <p className="text-xs text-slate-500">
          {tab === 'tro'
            ? 'Gợi ý địa điểm; lọc theo POI chi tiết sẽ bổ sung sau. Hiện dẫn tới danh sách tin trọ.'
            : 'Tìm dự án NOXH theo quận/huyện hoặc khu vực (từ khóa đơn giản).'}
        </p>
        <button
          type="submit"
          className="w-full rounded-xl bg-brand-gold py-3 text-sm font-semibold text-white shadow transition hover:bg-amber-600 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:ring-offset-2"
        >
          Tìm kiếm
        </button>
      </form>
    </div>
  );
}
