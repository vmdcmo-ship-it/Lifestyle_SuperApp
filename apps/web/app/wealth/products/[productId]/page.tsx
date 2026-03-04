import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';
const API_PREFIX = '/api/v1';

const TYPE_LABELS: Record<string, string> = {
  HEALTH: 'Sức khỏe',
  LIFE: 'Nhân thọ',
  VEHICLE: 'Xe cộ',
  TRAVEL: 'Du lịch',
  HOME: 'Nhà cửa',
  ACCIDENT: 'Tai nạn',
  SOCIAL: 'Xã hội',
};

async function fetchProduct(id: string) {
  try {
    const res = await fetch(
      `${API_BASE.replace(/\/$/, '')}${API_PREFIX}/insurance/products/${id}`,
      { next: { revalidate: 60 } }
    );
    if (!res.ok) return null;
    return res.json();
  } catch {
    return null;
  }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ productId: string }>;
}): Promise<Metadata> {
  const { productId } = await params;
  const p = await fetchProduct(productId);
  if (!p) return { title: 'Sản phẩm | KODO Wealth' };
  return { title: p.name, description: p.description || p.name };
}

export default async function WealthProductDetailPage({
  params,
}: {
  params: Promise<{ productId: string }>;
}) {
  const { productId } = await params;
  const p = await fetchProduct(productId);
  if (!p) notFound();

  const premiumY = Number(p.premiumYearly || 0);
  const premiumM = Number(p.premiumMonthly || 0);
  const coverage = Number(p.coverageAmount || 0);
  const termYears = Math.round((p.termMonths || 0) / 12);

  return (
    <div className="container mx-auto max-w-2xl px-4 py-12">
      <nav className="mb-8 text-sm text-muted-foreground">
        <Link href="/wealth">KODO Wealth</Link>
        <span className="mx-2">/</span>
        <Link href="/wealth/products">Sản phẩm</Link>
        <span className="mx-2">/</span>
        <span className="text-foreground">{p.name}</span>
      </nav>

      <div className="rounded-2xl border border-amber-200/60 bg-white p-8">
        <span className="mb-2 block text-sm font-medium text-[#D4AF37]">
          {TYPE_LABELS[p.type] || p.type} · {p.provider}
        </span>
        <h1 className="font-heading mb-4 text-2xl font-bold text-[#0D1B2A]">{p.name}</h1>
        {p.description && <p className="mb-6 text-muted-foreground">{p.description}</p>}
        <div className="mb-8 grid gap-4 sm:grid-cols-3">
          <div className="rounded-xl bg-amber-50 p-4">
            <p className="text-xs text-muted-foreground">Phí/năm</p>
            <p className="font-semibold">{premiumY.toLocaleString('vi-VN')} VND</p>
          </div>
          <div className="rounded-xl bg-amber-50 p-4">
            <p className="text-xs text-muted-foreground">Phí/tháng</p>
            <p className="font-semibold">{premiumM.toLocaleString('vi-VN')} VND</p>
          </div>
          <div className="rounded-xl bg-amber-50 p-4">
            <p className="text-xs text-muted-foreground">Mức bảo hiểm</p>
            <p className="font-semibold">{coverage.toLocaleString('vi-VN')} VND</p>
          </div>
        </div>
        {termYears > 0 && <p className="mb-6 text-sm text-muted-foreground">Thời hạn: {termYears} năm</p>}
        <Link
          href="/login?redirect=/wealth/products"
          className="inline-flex items-center gap-2 rounded-lg bg-[#D4AF37] px-6 py-3 font-semibold text-[#0D1B2A] hover:bg-amber-500"
        >
          Mua Online
          <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
          </svg>
        </Link>
      </div>

      <div className="mt-8 flex gap-4">
        <Link href="/wealth/products" className="rounded-lg border border-[#D4AF37] px-4 py-2 text-sm font-medium text-[#D4AF37] hover:bg-amber-50">
          Sản phẩm khác
        </Link>
        <Link href="/wealth/consulting" className="rounded-lg bg-[#D4AF37] px-4 py-2 text-sm font-medium text-[#0D1B2A] hover:bg-amber-500">
          Tư vấn 1-1
        </Link>
      </div>
    </div>
  );
}
