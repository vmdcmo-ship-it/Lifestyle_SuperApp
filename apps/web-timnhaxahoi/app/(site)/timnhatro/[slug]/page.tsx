import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { fetchRentalBySlug, formatVnd, metaDescriptionForListing } from '@/lib/rental-public';
import { mergeArticleMetadata } from '@/lib/site-metadata';

type Props = { params: { slug: string } };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  try {
    const item = await fetchRentalBySlug(params.slug);
    const description = metaDescriptionForListing(item);
    const path = `/timnhatro/${params.slug}`;
    return {
      title: item.title,
      description,
      ...mergeArticleMetadata(path, item.title, description),
    };
  } catch {
    return {
      title: 'Không tìm thấy tin',
      description: 'Tin cho thuê không tồn tại hoặc đã gỡ trên timnhaxahoi.com.',
    };
  }
}

export default async function TimNhatroDetailPage({ params }: Props): Promise<JSX.Element> {
  let item: Awaited<ReturnType<typeof fetchRentalBySlug>>;
  try {
    item = await fetchRentalBySlug(params.slug);
  } catch (e) {
    if ((e as Error).message === 'NOT_FOUND') {
      notFound();
    }
    throw e;
  }

  const showPhone = item.contactPhone != null && item.contactPhone.length > 0;
  const areaLabel = item.areaM2 != null ? `${item.areaM2} m²` : '—';

  return (
    <article className="mx-auto max-w-3xl px-4 py-10">
      <nav className="mb-6 text-sm text-slate-500">
        <Link href="/timnhatro" className="hover:text-[#1e3a8a]">
          ← Danh sách
        </Link>
      </nav>

      <header className="border-b border-slate-200 pb-6">
        <h1 className="text-2xl font-semibold text-slate-900 md:text-3xl">{item.title}</h1>
        <p className="mt-2 text-slate-600">
          {[item.addressLine, item.district, item.province].filter(Boolean).join(' · ') || '—'}
        </p>
        <p className="mt-4 text-2xl font-bold text-[#1e3a8a]">{formatVnd(item.priceMonthly)}</p>
        <p className="mt-1 text-sm text-slate-500">Diện tích: {areaLabel}</p>
        {item.listingStatus === 'expired_grace' && (
          <p className="mt-3 rounded-lg bg-amber-50 px-3 py-2 text-sm text-amber-900">
            Tin đã hết hạn sẽ ẩn số liên hệ; bạn vẫn có thể xem nội dung trong thời gian lưu tin theo quy định hiển thị.
          </p>
        )}
      </header>

      {item.description ? (
        <div className="prose prose-slate mt-8 max-w-none whitespace-pre-wrap text-slate-700">
          {item.description}
        </div>
      ) : null}

      <section className="mt-10 rounded-xl border border-slate-200 bg-slate-50/80 p-6">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-500">Liên hệ</h2>
        {showPhone ? (
          <p className="mt-2 text-lg font-medium text-slate-900">
            <a href={`tel:${item.contactPhone!.replace(/\s/g, '')}`} className="text-[#1e3a8a] hover:underline">
              {item.contactPhone}
            </a>
          </p>
        ) : (
          <p className="mt-2 text-slate-600">
            Số điện thoại không hiển thị (tin hết hạn hoặc đã ẩn theo chính sách).
          </p>
        )}
      </section>

      <section className="mt-8 rounded-lg border border-dashed border-slate-200 bg-white p-4 text-sm text-slate-500">
        <strong className="text-slate-700">Bản đồ:</strong> Đang được bổ sung khi đủ dữ liệu vị trí chính xác.
      </section>

      <p className="mt-8 text-xs text-slate-500">
        Nền tảng không thu tiền đặt cọc hay giữ chỗ. Mọi thỏa thuận thuê nhà giữa hai bên; vui lòng tự xác minh
        trước khi giao dịch.
      </p>
    </article>
  );
}
