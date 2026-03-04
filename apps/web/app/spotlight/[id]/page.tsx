import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { SpotlightDetailClient } from './spotlight-detail-client';
import { BreadcrumbJsonLd, VideoObjectJsonLd } from '@/lib/seo/json-ld';

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

  const title = (data.title as string) || 'Video';
  const breadcrumbs = [
    { name: 'Trang chủ', url: '/' },
    { name: 'Spotlight', url: '/spotlight' },
    { name: title, url: `/spotlight/${id}` },
  ];

  const videoUrl = data.videoUrl ?? data.video_url;
  const videoSource = data.videoSource ?? data.video_source;
  let embedUrl: string | null = null;
  if (videoUrl && videoSource === 'YOUTUBE') {
    const m1 = String(videoUrl).match(/[?&]v=([^&]+)/);
    const m2 = String(videoUrl).match(/youtu\.be\/([^?]+)/);
    const videoId = m1?.[1] || m2?.[1] || '';
    if (videoId) embedUrl = `https://www.youtube.com/embed/${videoId}?rel=0`;
  } else if (videoUrl && videoSource === 'FACEBOOK') {
    embedUrl = `https://www.facebook.com/plugins/video.php?href=${encodeURIComponent(videoUrl)}&show_text=false`;
  }
  let thumbnailUrl = data.thumbnailUrl ?? data.thumbnail_url ?? data.cover_image_url;
  if (!thumbnailUrl && videoSource === 'YOUTUBE' && videoUrl) {
    const ytId = String(videoUrl).match(/[?&]v=([^&]+)/)?.[1] || String(videoUrl).match(/youtu\.be\/([^?]+)/)?.[1];
    if (ytId) thumbnailUrl = `https://img.youtube.com/vi/${ytId}/maxresdefault.jpg`;
  }

  return (
    <div className="min-h-screen bg-background">
      <BreadcrumbJsonLd items={breadcrumbs} />
      <VideoObjectJsonLd
        name={title}
        description={(data.description as string) || undefined}
        thumbnailUrl={thumbnailUrl}
        uploadDate={data.createdAt}
        contentUrl={videoUrl}
        embedUrl={embedUrl}
        duration={data.videoDuration ?? undefined}
        interactionCount={Number(data.views) || undefined}
        url={`/spotlight/${id}`}
        author={data.creator?.display_name ?? data.creator?.user?.firstName ? `${data.creator.user.firstName || ''} ${data.creator.user.lastName || ''}`.trim() : undefined}
      />
      <div className="container mx-auto max-w-4xl px-4 py-6">
        <nav
          className="mb-6 text-sm text-muted-foreground"
          aria-label="Breadcrumb"
        >
          <Link href="/" className="hover:text-foreground">Trang chủ</Link>
          <span className="mx-2">/</span>
          <Link href="/spotlight" className="hover:text-foreground">Spotlight</Link>
          <span className="mx-2">/</span>
          <span className="line-clamp-1 text-foreground">{title}</span>
        </nav>

        <SpotlightDetailClient data={data} />
      </div>
    </div>
  );
}
