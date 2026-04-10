import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { mergeArticleMetadata } from '@/lib/site-metadata';

const base = () => process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3020/api/v1';

type Project = {
  id: string;
  name: string;
  slug: string;
  province: string | null;
  district: string | null;
  pricePerM2: number;
  typicalAreaM2: number;
  status: string;
  legalScore: number;
  kind: string;
};

async function getProject(slug: string): Promise<Project | null> {
  const res = await fetch(`${base()}/projects/${encodeURIComponent(slug)}`, {
    next: { revalidate: 120 },
  });
  if (res.status === 404) {
    return null;
  }
  if (!res.ok) {
    return null;
  }
  return res.json() as Promise<Project>;
}

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const { slug } = params;
  const p = await getProject(slug);
  if (!p) {
    return { title: 'Không tìm thấy' };
  }
  const description = `Dự án ${p.name} — ${[p.district, p.province].filter(Boolean).join(', ')} · Ước tính khung giá căn điển hình trên timnhaxahoi.com.`;
  return {
    title: p.name,
    description,
    ...mergeArticleMetadata(`/du-an/${slug}`, p.name, description),
  };
}

export default async function ProjectDetailPage({
  params,
}: {
  params: { slug: string };
}) {
  const { slug } = params;
  const p = await getProject(slug);
  if (!p) {
    notFound();
  }

  const est = Math.round((p.pricePerM2 * p.typicalAreaM2) / 1_000_000);

  return (
    <article className="mx-auto max-w-3xl px-4 py-10">
      <h1 className="text-3xl font-bold text-slate-900">{p.name}</h1>
      <p className="mt-2 text-slate-600">
        {[p.district, p.province].filter(Boolean).join(', ')}
      </p>
      <dl className="glass-panel mt-8 grid gap-4 rounded-xl p-6 text-sm sm:grid-cols-2">
        <div>
          <dt className="text-slate-500">Trạng thái</dt>
          <dd className="font-medium text-slate-900">{p.status}</dd>
        </div>
        <div>
          <dt className="text-slate-500">Loại</dt>
          <dd className="font-medium text-slate-900">{p.kind}</dd>
        </div>
        <div>
          <dt className="text-slate-500">Giá/m² (VNĐ)</dt>
          <dd className="font-medium text-slate-900">{p.pricePerM2.toLocaleString('vi-VN')}</dd>
        </div>
        <div>
          <dt className="text-slate-500">Diện tích tham chiếu (m²)</dt>
          <dd className="font-medium text-slate-900">{p.typicalAreaM2}</dd>
        </div>
        <div>
          <dt className="text-slate-500">Tổng giá ước tính (~triệu)</dt>
          <dd className="font-medium text-slate-900">{est}</dd>
        </div>
        <div>
          <dt className="text-slate-500">Điểm pháp lý (tham chiếu nội bộ)</dt>
          <dd className="font-medium text-slate-900">{p.legalScore}</dd>
        </div>
      </dl>

      <div className="mt-10 flex flex-col gap-3 sm:flex-row">
        <Link
          href="/quiz"
          className="inline-flex justify-center rounded-xl bg-brand-gradient px-6 py-3 text-sm font-semibold text-white shadow-glow"
        >
          Kiểm tra điều kiện với dự án này
        </Link>
        <Link
          href="/phap-ly"
          className="inline-flex justify-center rounded-xl border border-slate-200 px-6 py-3 text-sm font-medium text-slate-800 hover:bg-slate-50"
        >
          Đọc thêm pháp lý
        </Link>
      </div>
    </article>
  );
}
