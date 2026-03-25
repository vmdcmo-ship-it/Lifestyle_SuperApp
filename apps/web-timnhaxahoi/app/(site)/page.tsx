import type { Metadata } from 'next';
import Link from 'next/link';
import { fetchProjects } from '@/lib/api';

export const metadata: Metadata = {
  title: 'Trang chủ',
  description:
    'Kiểm tra điều kiện NOXH, xem dự án ưu tiên Miền Nam, video và pháp lý tham khảo — timnhaxahoi.com.',
};

function IconArrow() {
  return (
    <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
      <path d="M5 12h14M12 5l7 7-7 7" />
    </svg>
  );
}

function IconBuilding() {
  return (
    <svg className="h-5 w-5 text-[#10b981]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
      <path d="M3 21h18M5 21V7l8-4v18M19 21V11l-6-4" />
    </svg>
  );
}

function IconClipboard() {
  return (
    <svg className="h-8 w-8 text-[#1e3a8a]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
      <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
    </svg>
  );
}

export default async function HomePage() {
  let featured: Awaited<ReturnType<typeof fetchProjects>> = [];
  try {
    const all = await fetchProjects('NOXH');
    featured = all.slice(0, 4);
  } catch {
    featured = [];
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-10 md:py-16">
      <section className="glass-panel rounded-2xl p-6 md:p-10">
        <p className="text-sm font-medium uppercase tracking-wide text-slate-500">Nhà ở xã hội</p>
        <h1 className="mt-2 text-3xl font-bold leading-tight text-slate-900 md:text-4xl">
          Kiểm tra điều kiện & chọn dự án phù hợp
        </h1>
        <p className="mt-4 max-w-2xl text-slate-600">
          Trắc nghiệm đa bước, kết quả sơ bộ và lưu lead để đội ngũ liên hệ qua Zalo / email. Thêm{' '}
          <code className="rounded bg-slate-100 px-1 text-sm">?mode=app</code> khi nhúng WebView.
        </p>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <Link
            href="/quiz"
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-brand-gradient px-6 py-3.5 text-base font-semibold text-white shadow-glow transition hover:opacity-95"
          >
            Bắt đầu trắc nghiệm
            <IconArrow />
          </Link>
          <Link
            href="/du-an"
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-6 py-3.5 text-base font-medium text-slate-800 hover:bg-slate-50"
          >
            <IconBuilding />
            Xem dự án
          </Link>
        </div>

        <form
          action="/du-an"
          method="get"
          className="mt-8 flex flex-col gap-3 rounded-xl border border-slate-200/80 bg-white/60 p-4 sm:flex-row sm:items-end"
        >
          <label className="block flex-1 text-sm">
            <span className="mb-1 block font-medium text-slate-700">Tìm nhanh theo quận/huyện</span>
            <input
              type="text"
              name="district"
              placeholder="Ví dụ: Thủ Đức"
              className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-slate-900"
            />
          </label>
          <input type="hidden" name="kind" value="NOXH" />
          <button
            type="submit"
            className="rounded-xl bg-slate-900 px-5 py-2.5 text-sm font-semibold text-white hover:bg-slate-800"
          >
            Tìm dự án
          </button>
        </form>
      </section>

      {featured.length > 0 && (
        <section className="mt-12">
          <div className="flex items-end justify-between gap-4">
            <h2 className="text-xl font-bold text-slate-900">Dự án NOXH nổi bật</h2>
            <Link href="/du-an" className="text-sm font-medium text-brand-navy hover:underline">
              Xem tất cả
            </Link>
          </div>
          <ul className="mt-6 grid gap-4 sm:grid-cols-2">
            {featured.map((p) => {
              const est = Math.round((p.pricePerM2 * p.typicalAreaM2) / 1_000_000);
              return (
                <li key={p.id} className="glass-panel rounded-xl p-5">
                  <Link href={`/du-an/${p.slug}`} className="text-lg font-semibold text-brand-navy hover:underline">
                    {p.name}
                  </Link>
                  <p className="mt-1 text-sm text-slate-500">
                    {[p.district, p.province].filter(Boolean).join(', ')}
                  </p>
                  <p className="mt-3 text-xs text-slate-600">
                    Giá/m² từ {p.pricePerM2.toLocaleString('vi-VN')} VNĐ · Ước tính ~{est} triệu (
                    {p.typicalAreaM2}m²)
                  </p>
                </li>
              );
            })}
          </ul>
        </section>
      )}

      <section className="mt-12 grid gap-4 md:grid-cols-2">
        <Link
          href="/phap-ly"
          className="glass-panel block rounded-xl p-6 transition hover:border-brand-emerald/30"
        >
          <h2 className="text-lg font-semibold text-slate-900">Pháp lý &amp; thủ tục</h2>
          <p className="mt-2 text-sm text-slate-600">Điều kiện, hồ sơ và lưu ý thực tiễn (tham khảo).</p>
        </Link>
        <Link
          href="/video"
          className="glass-panel block rounded-xl p-6 transition hover:border-brand-emerald/30"
        >
          <h2 className="text-lg font-semibold text-slate-900">Video</h2>
          <p className="mt-2 text-sm text-slate-600">Hook → thực tế → pháp lý ngắn → CTA (đang mở rộng).</p>
        </Link>
      </section>

      <section className="mt-10 grid gap-4 md:grid-cols-3">
        {[
          {
            title: 'Rule engine',
            text: 'Phân loại sơ bộ theo bảng truth nội bộ; copy UI trung tính với người dùng.',
            icon: <IconClipboard />,
          },
          {
            title: 'Dữ liệu dự án',
            text: 'Danh mục từ API, ưu tiên khu vực Miền Nam theo SPEC.',
            icon: (
              <svg className="h-8 w-8 text-brand-navy" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
                <path d="M3 21h18M5 21V7l8-4v18M19 21V11l-6-4" />
              </svg>
            ),
          },
          {
            title: 'Dashboard sau quiz',
            text: 'Điểm tham khảo, dự án gợi ý và gửi yêu cầu tư vấn sâu.',
            icon: (
              <svg className="h-8 w-8 text-brand-navy" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            ),
          },
        ].map(({ title, text, icon }) => (
          <div key={title} className="glass-panel rounded-xl p-5">
            {icon}
            <h2 className="mt-3 font-semibold text-slate-900">{title}</h2>
            <p className="mt-1 text-sm text-slate-600">{text}</p>
          </div>
        ))}
      </section>
    </div>
  );
}
