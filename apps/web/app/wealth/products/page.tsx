import type { Metadata } from 'next';
import Link from 'next/link';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';
const API_PREFIX = '/api/v1';

async function fetchProducts(): Promise<
  { data: { id: string; name: string; type: string; provider: string; premiumYearly: string | number; coverageAmount: string | number }[] } | null
> {
  try {
    const url = `${API_BASE.replace(/\/$/, '')}${API_PREFIX}/insurance/products?limit=20`;
    const res = await fetch(url, { next: { revalidate: 60 } });
    if (!res.ok) return null;
    return res.json();
  } catch {
    return null;
  }
}

const TYPE_LABELS: Record<string, string> = {
  HEALTH: 'Sức khỏe',
  LIFE: 'Nhân thọ',
  VEHICLE: 'Xe cộ',
  TRAVEL: 'Du lịch',
  HOME: 'Nhà cửa',
  ACCIDENT: 'Tai nạn',
  SOCIAL: 'Xã hội',
};

export const metadata: Metadata = {
  title: 'Danh mục sản phẩm bảo hiểm',
  description: 'Khám phá các gói bảo hiểm sức khỏe, nhân thọ và tài sản phù hợp với nhu cầu của bạn',
  alternates: { canonical: '/wealth/products' },
};

export default async function WealthProductsPage(): Promise<JSX.Element> {
  const res = await fetchProducts();
  const products = res?.data || [];

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="mb-12">
        <h1 className="font-heading mb-4 text-3xl font-bold text-[#0D1B2A]">
          Danh mục sản phẩm bảo hiểm
        </h1>
        <p className="max-w-2xl text-muted-foreground">
          Các gói bảo hiểm được thiết kế để bảo vệ tài sản và tương lai của bạn
        </p>
      </div>

      {products.length === 0 ? (
        <div className="rounded-2xl border border-amber-200/60 bg-white p-12 text-center">
          <p className="mb-4 text-muted-foreground">
            Đang cập nhật danh mục sản phẩm. Vui lòng quay lại sau hoặc đăng ký tư vấn.
          </p>
          <Link
            href="/wealth/consulting"
            className="inline-flex items-center gap-2 rounded-lg bg-[#D4AF37] px-5 py-2.5 font-medium text-[#0D1B2A] hover:bg-amber-500"
          >
            Đăng ký tư vấn 1-1
          </Link>
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {products.map((p) => {
            const premium = Number(p.premiumYearly || 0);
            const coverage = Number(p.coverageAmount || 0);
            return (
              <Link
                key={p.id}
                href={`/wealth/products/${p.id}`}
                className="group overflow-hidden rounded-2xl border border-amber-200/60 bg-white transition-all hover:shadow-lg"
              >
                <div className="h-2 bg-gradient-to-r from-[#D4AF37] to-amber-400" />
                <div className="p-6">
                  <span className="mb-2 block text-xs font-medium text-[#D4AF37]">
                    {TYPE_LABELS[p.type] || p.type}
                  </span>
                  <h2 className="mb-2 font-semibold text-[#0D1B2A] group-hover:text-[#D4AF37]">
                    {p.name}
                  </h2>
                  <p className="mb-4 text-sm text-muted-foreground">{p.provider}</p>
                  <div className="flex justify-between text-sm">
                    <span>Phí: {premium.toLocaleString('vi-VN')} VND/năm</span>
                    <span>Bảo hiểm: {(coverage / 1_000_000).toFixed(0)}M</span>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      )}

      <div className="mt-8">
        <Link href="/wealth" className="text-sm font-medium text-[#D4AF37] hover:underline">
          Về KODO Wealth
        </Link>
      </div>
    </div>
  );
}
