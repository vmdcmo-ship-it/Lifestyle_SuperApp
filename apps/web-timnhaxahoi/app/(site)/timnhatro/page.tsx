import type { Metadata } from 'next';
import Link from 'next/link';
import { fetchRentalList, formatVnd } from '@/lib/rental-public';
import { pageMetadata } from '@/lib/site-metadata';

const listDesc =
  'Tìm phòng trọ, nhà cho thuê trên timnhaxahoi.com — tin do chủ đăng; không đặt cọc qua website, liên hệ trực tiếp.';

export const metadata: Metadata = pageMetadata({
  path: '/timnhatro',
  title: 'Tìm nhà trọ',
  description: listDesc,
});

export default async function TimNhatroListPage(): Promise<JSX.Element> {
  let data: Awaited<ReturnType<typeof fetchRentalList>>;
  try {
    data = await fetchRentalList({ page: 1, limit: 24 });
  } catch {
    return (
      <div className="mx-auto max-w-5xl px-4 py-12">
        <h1 className="text-2xl font-semibold text-slate-900">Tìm nhà trọ</h1>
        <p className="mt-4 text-slate-600">
          Hiện không tải được danh sách tin. Vui lòng thử lại sau hoặc kiểm tra kết nối mạng.
        </p>
      </div>
    );
  }

  const { items, total } = data;

  return (
    <div className="mx-auto max-w-5xl px-4 py-10">
      <header className="mb-8">
        <h1 className="text-2xl font-semibold text-slate-900 md:text-3xl">Tìm nhà trọ</h1>
        <p className="mt-2 max-w-2xl text-sm text-slate-600">
          Tin đăng do chủ trọ cung cấp. Số điện thoại chỉ hiển thị khi tin còn trong thời hạn đăng. Không đặt cọc trên nền
          tảng; mọi giao dịch do hai bên tự thỏa thuận.
        </p>
        </header>

      {items.length === 0 ? (
        <p className="rounded-xl border border-dashed border-slate-200 bg-slate-50/80 px-6 py-12 text-center text-slate-600">
          Chưa có tin nào. Quay lại sau.
        </p>
      ) : (
        <>
          <p className="mb-4 text-sm text-slate-500">{total} tin</p>
          <ul className="grid gap-4 sm:grid-cols-2">
            {items.map((item) => (
              <li key={item.id}>
                <Link
                  href={`/timnhatro/${item.slug}`}
                  className="block rounded-xl border border-slate-200/80 bg-white p-4 shadow-sm transition hover:border-[#1e3a8a]/30 hover:shadow-md"
                >
                  <h2 className="font-semibold text-slate-900 line-clamp-2">{item.title}</h2>
                  <p className="mt-1 text-sm text-slate-600">
                    {[item.district, item.province].filter(Boolean).join(', ') || '—'}
                  </p>
                  <p className="mt-2 text-lg font-semibold text-[#1e3a8a]">{formatVnd(item.priceMonthly)}</p>
                  <span className="mt-3 inline-block text-sm font-medium text-[#1e3a8a]">
                    Xem chi tiết →
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
}
