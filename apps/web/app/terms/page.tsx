import type { Metadata } from 'next';
import Link from 'next/link';

const API_BASE =
  process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';
const API_PREFIX = '/api/v1';

async function fetchContent(slug: string, locale = 'vi') {
  const url = `${API_BASE.replace(/\/$/, '')}${API_PREFIX}/content/${slug}?locale=${locale}`;
  const res = await fetch(url, { next: { revalidate: 60 } });
  if (!res.ok) return null;
  return res.json();
}

export const metadata: Metadata = {
  title: 'Điều khoản dịch vụ & Quyền sử dụng - Lifestyle Super App',
  description:
    'Điều khoản và điều kiện sử dụng dịch vụ, chính sách quyền sử dụng tài khoản Đối tác tài xế và hành khách trên Lifestyle Super App.',
  openGraph: {
    title: 'Điều khoản dịch vụ & Quyền sử dụng - Lifestyle Super App',
    type: 'website',
    url: '/terms',
  },
  alternates: { canonical: '/terms' },
};

export default async function TermsPage(): Promise<JSX.Element> {
  const data = await fetchContent('terms-of-service', 'vi');

  if (!data) {
    return (
      <div className="container mx-auto max-w-3xl px-4 py-16">
        <h1 className="mb-4 text-2xl font-bold">Điều khoản dịch vụ</h1>
        <p className="mb-6 text-muted-foreground">
          Nội dung đang được cập nhật. Vui lòng quay lại sau.
        </p>
        <Link href="/" className="text-primary hover:underline">
          ← Về trang chủ
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto max-w-3xl px-4 py-12">
      <Link href="/" className="mb-6 inline-block text-sm text-muted-foreground hover:text-foreground">
        ← Về trang chủ
      </Link>

      <h1 className="mb-2 text-3xl font-bold">{data.title}</h1>
      <p className="mb-8 text-sm text-muted-foreground">
        Phiên bản {data.version} • Cập nhật {new Date(data.effectiveFrom).toLocaleDateString('vi-VN')}
      </p>

      <div
        className="prose prose-neutral dark:prose-invert max-w-none"
        dangerouslySetInnerHTML={{ __html: data.content }}
      />

      <div className="mt-12 border-t pt-6">
        <Link href="/" className="text-primary hover:underline">
          ← Về trang chủ
        </Link>
      </div>
    </div>
  );
}
