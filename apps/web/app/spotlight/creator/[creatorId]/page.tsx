import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { SpotlightCreatorClient } from './spotlight-creator-client';

const API_BASE =
  process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';
const API_PREFIX = '/api/v1';

async function fetchCreatorProfile(creatorId: string, page = 1, limit = 20) {
  const url = `${API_BASE.replace(/\/$/, '')}${API_PREFIX}/spotlight/creator/${creatorId}?page=${page}&limit=${limit}`;
  const res = await fetch(url, { next: { revalidate: 60 } });
  if (!res.ok) return null;
  return res.json();
}

export async function generateMetadata({
  params,
  searchParams,
}: {
  params: Promise<{ creatorId: string }>;
  searchParams: Promise<{ page?: string }>;
}): Promise<Metadata> {
  const { creatorId } = await params;
  const data = await fetchCreatorProfile(creatorId, 1, 1);
  if (!data?.creator) return { title: 'Creator - Spotlight' };
  const name =
    data.creator.display_name ||
    (data.creator.user
      ? `${data.creator.user.firstName || ''} ${data.creator.user.lastName || ''}`.trim()
      : 'Creator') ||
    'Creator';
  return {
    title: `${name} - Spotlight | Lifestyle`,
    description: data.creator.bio
      ? `${data.creator.bio.slice(0, 160)}...`
      : `Xem video từ ${name} trên Lifestyle Spotlight`,
  };
}

interface PageProps {
  params: Promise<{ creatorId: string }>;
  searchParams: Promise<{ page?: string }>;
}

export default async function SpotlightCreatorPage({
  params,
  searchParams,
}: PageProps): Promise<JSX.Element> {
  const { creatorId } = await params;
  const { page: pageParam } = await searchParams;
  const page = Math.max(1, parseInt(String(pageParam || '1'), 10) || 1);

  const data = await fetchCreatorProfile(creatorId, page, 20);

  if (!data?.creator) {
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

        <SpotlightCreatorClient
          creator={data.creator}
          videos={data.videos ?? []}
          pagination={
            data.pagination ?? {
              page: 1,
              limit: 20,
              total: 0,
              totalPages: 0,
            }
          }
        />
      </div>
    </div>
  );
}
