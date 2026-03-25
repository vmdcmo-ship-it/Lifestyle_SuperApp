import type { Metadata } from 'next';
import Link from 'next/link';
import { fetchProjects, type ProjectListFilters } from '@/lib/api';

export const metadata: Metadata = {
  title: 'Danh sách dự án',
  description: 'Dự án NOXH và nhà TM giá rẻ — lọc theo khu vực, loại dự án.',
};

function pickParam(v: string | string[] | undefined): string | undefined {
  if (Array.isArray(v)) return v[0];
  return v;
}

export default async function ProjectsPage({
  searchParams,
}: {
  searchParams: Record<string, string | string[] | undefined>;
}) {
  const district = pickParam(searchParams.district);
  const province = pickParam(searchParams.province);
  const kind = pickParam(searchParams.kind);

  const filters: ProjectListFilters = {};
  if (district?.trim()) filters.district = district.trim();
  if (province?.trim()) filters.province = province.trim();
  if (kind?.trim()) filters.kind = kind.trim();

  let list: Awaited<ReturnType<typeof fetchProjects>> = [];
  let err: string | null = null;
  try {
    list = await fetchProjects(Object.keys(filters).length ? filters : undefined);
  } catch (e) {
    err = e instanceof Error ? e.message : 'Lỗi tải dữ liệu';
  }

  const hasFilters = Boolean(district || province || kind);

  return (
    <div className="mx-auto max-w-5xl px-4 py-10">
      <h1 className="text-2xl font-bold text-slate-900">Dự án</h1>
      <p className="mt-2 text-slate-600">Dữ liệu từ API — SSR, làm mới ngắn. Lọc theo tỉnh/thành, quận/huyện, loại.</p>

      <form
        method="get"
        className="mt-8 grid gap-4 rounded-2xl border border-slate-200/80 bg-white/70 p-4 md:grid-cols-4 md:items-end"
      >
        <label className="block text-sm md:col-span-1">
          <span className="mb-1 block font-medium text-slate-700">Quận / huyện</span>
          <input
            type="text"
            name="district"
            defaultValue={district ?? ''}
            placeholder="Thủ Đức, Biên Hòa…"
            className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-slate-900"
          />
        </label>
        <label className="block text-sm md:col-span-1">
          <span className="mb-1 block font-medium text-slate-700">Tỉnh / thành</span>
          <input
            type="text"
            name="province"
            defaultValue={province ?? ''}
            placeholder="Đồng Nai, TP.HCM…"
            className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-slate-900"
          />
        </label>
        <label className="block text-sm md:col-span-1">
          <span className="mb-1 block font-medium text-slate-700">Loại</span>
          <select
            name="kind"
            defaultValue={kind ?? ''}
            className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-slate-900"
          >
            <option value="">Tất cả</option>
            <option value="NOXH">NOXH</option>
            <option value="AFFORDABLE_COMMERCIAL">Nhà TM giá rẻ</option>
          </select>
        </label>
        <div className="flex flex-wrap gap-2 md:col-span-1 md:justify-end">
          <button
            type="submit"
            className="rounded-xl bg-brand-gradient px-5 py-2.5 text-sm font-semibold text-white shadow-glow"
          >
            Áp dụng
          </button>
          {hasFilters && (
            <Link
              href="/du-an"
              className="inline-flex items-center rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-medium text-slate-700"
            >
              Xóa lọc
            </Link>
          )}
        </div>
      </form>

      {err && <p className="mt-6 text-red-600">{err}</p>}
      {!err && list.length === 0 && (
        <p className="mt-10 text-center text-slate-600">
          Không có dự án khớp bộ lọc.{' '}
          <Link href="/du-an" className="text-brand-navy hover:underline">
            Xem toàn bộ
          </Link>
        </p>
      )}
      {!err && list.length > 0 && (
        <ul className="mt-8 space-y-4">
          {list.map((p) => {
            const est = Math.round((p.pricePerM2 * p.typicalAreaM2) / 1_000_000);
            return (
              <li key={p.id} className="glass-panel rounded-xl p-5">
                <Link href={`/du-an/${p.slug}`} className="text-lg font-semibold text-brand-navy hover:underline">
                  {p.name}
                </Link>
                <p className="mt-1 text-sm text-slate-500">
                  {[p.district, p.province].filter(Boolean).join(', ')} · {p.kind} · {p.status}
                </p>
                <p className="mt-2 text-xs text-slate-600">
                  ~{est} triệu (ước tính {p.typicalAreaM2}m²) · {p.pricePerM2.toLocaleString('vi-VN')} VNĐ/m²
                </p>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
