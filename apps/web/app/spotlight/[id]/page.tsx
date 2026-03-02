import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { SpotlightDetailClient } from './spotlight-detail-client';

const API_BASE =
  process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';
const API_PREFIX = '/api/v1';

async function fetchSpotlight(id: string) {
  const url = `${API_BASE.replace(/\/$/, '')}${API_PREFIX}/spotlight/${id}`;
  const res = await fetch(url, { next: { revalidate: 60 } });
  if (!res.ok) return null;
  return res.json();
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const data = await fetchSpotlight(id);
  if (!data) return { title: 'Video - Spotlight' };
  return {
    title: `${data.title} - Spotlight | Lifestyle`,
    description:
      (data.description as string)?.slice(0, 160) ||
      `Xem video ${data.title} trên Lifestyle Spotlight`,
  };
}

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function SpotlightDetailPage({
  params,
}: PageProps): Promise<JSX.Element> {
  const { id } = await params;
  const data = await fetchSpotlight(id);

  if (!data) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto max-w-4xl px-4 py-6">
        <Link
          href="/spotlight"
          className="mb-6 inline-flex items-center text-sm text-muted-foreground hover:text-foreground"
        >
          ← Quay lại Spotlight
        </Link>

        <SpotlightDetailClient data={data} />
      </div>
    </div>
  );
}
