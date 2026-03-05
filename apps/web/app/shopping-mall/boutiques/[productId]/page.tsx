import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getProductById, getAllProductIds } from '../../_lib/products';

interface ProductDetailPageProps {
  params: Promise<{ productId: string }>;
}

export async function generateStaticParams() {
  return getAllProductIds().map((productId) => ({ productId }));
}

export async function generateMetadata({
  params,
}: ProductDetailPageProps): Promise<Metadata> {
  const { productId } = await params;
  const product = getProductById(productId);
  if (!product) return { title: 'Sản phẩm | Shopping Mall' };
  return {
    title: `${product.name} | Shopping Mall`,
    description: product.description || product.name,
    openGraph: {
      title: `${product.name} - ${product.brand || ''} | Shopping Mall`,
      description: product.description,
      images: [product.imageUrl],
    },
  };
}

export default async function ProductDetailPage({
  params,
}: ProductDetailPageProps): Promise<JSX.Element> {
  const { productId } = await params;
  const product = getProductById(productId);

  if (!product) notFound();

  const displayPrice =
    product.showPrice !== false && product.price != null
      ? new Intl.NumberFormat('vi-VN', {
          style: 'currency',
          currency: 'VND',
          maximumFractionDigits: 0,
        }).format(product.price)
      : null;

  return (
    <>
      <nav className="mb-6">
        <Link
          href="/shopping-mall/boutiques"
          className="text-sm text-slate-400 hover:text-amber-400"
        >
          ← Boutiques
        </Link>
      </nav>

      <div className="grid gap-8 md:grid-cols-2">
        <div className="relative aspect-square overflow-hidden rounded-xl bg-slate-800">
          <Image
            src={product.imageUrl}
            alt={product.name}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 50vw"
            priority
          />
          {product.brand && (
            <span className="absolute left-4 top-4 rounded bg-black/60 px-3 py-1 font-heading text-sm text-amber-200">
              {product.brand}
            </span>
          )}
        </div>

        <div>
          <h1 className="font-heading text-2xl font-light text-amber-100 md:text-3xl">
            {product.name}
          </h1>
          {displayPrice ? (
            <p className="mt-4 font-heading text-lg text-amber-400">{displayPrice}</p>
          ) : (
            <p className="mt-4 font-heading text-sm italic text-slate-500">
              Liên hệ để biết giá
            </p>
          )}
          {product.description && (
            <p className="mt-6 text-slate-400">{product.description}</p>
          )}
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href="/contact?subject=product-inquiry"
              className="inline-flex items-center justify-center rounded-lg bg-amber-600 px-6 py-3 font-medium text-white transition-colors hover:bg-amber-500"
            >
              Liên hệ đặt hàng
            </Link>
            <Link
              href="/shopping-mall/gifting-concierge"
              className="inline-flex items-center justify-center rounded-lg border border-amber-500/50 px-6 py-3 font-medium text-amber-400 transition-colors hover:bg-amber-500/10"
            >
              Đặt làm quà tặng
            </Link>
          </div>
        </div>
      </div>

      <section className="mt-12 rounded-xl border border-slate-200 bg-slate-50 p-6">
        <h2 className="mb-4 font-heading text-lg font-medium text-slate-200">
          Thông tin giao hàng
        </h2>
        <p className="text-sm text-slate-400">
          Kodo Mall tập trung trải nghiệm mua hàng nội tỉnh, thành. Chúng tôi không áp dụng
          giao hàng thương mại điện tử qua đơn vị thứ ba — quà tặng và sản phẩm cao cấp cần
          giao hàng cẩn trọng để đảm bảo an toàn.
        </p>
        <p className="mt-2 text-sm text-slate-400">
          Hỗ trợ gói quà, chọn loại hộp quà, viết thiệp tặng kèm. Giao chuẩn (phí cố định) hoặc
          giao hỏa tốc (tính cước theo khoảng cách). Nếu địa chỉ ngoài khu vực phục vụ, vui
          lòng liên hệ để được tư vấn.
        </p>
      </section>
    </>
  );
}
