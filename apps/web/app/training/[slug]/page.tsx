import Link from 'next/link';
import { notFound } from 'next/navigation';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

export default async function TrainingSlugPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ locale?: string }>;
}): Promise<JSX.Element> {
  const { slug } = await params;
  const { locale = 'vi' } = await searchParams;
  const url = `${API_BASE.replace(/\/$/, '')}/api/v1/training/public/${encodeURIComponent(slug)}?locale=${locale}`;
  const res = await fetch(url, { next: { revalidate: 60 } });
  if (!res.ok) notFound();
  const data = await res.json();

  return (
    <div className="container mx-auto max-w-3xl px-4 py-12">
      <Link href="/" className="mb-6 inline-block text-sm text-muted-foreground hover:text-foreground">
        ← Về trang chủ
      </Link>
      {data.category && <p className="mb-2 text-sm text-muted-foreground">{data.category.name}</p>}
      <h1 className="mb-6 text-3xl font-bold">{data.title}</h1>
      <div className="prose prose-neutral dark:prose-invert max-w-none" dangerouslySetInnerHTML={{ __html: data.content }} />
      <div className="mt-12 border-t pt-6">
        <Link href="/" className="text-primary hover:underline">← Về trang chủ</Link>
      </div>
    </div>
  );
}
