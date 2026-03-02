import type { Metadata } from 'next';
import Link from 'next/link';
import { SpotlightCreateForm } from './spotlight-create-form';

const API_BASE =
  process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';
const API_PREFIX = '/api/v1';

async function fetchCategories() {
  const url = `${API_BASE.replace(/\/$/, '')}${API_PREFIX}/spotlight/categories`;
  const res = await fetch(url, { next: { revalidate: 300 } });
  if (!res.ok) return { data: [] };
  return res.json();
}

async function fetchLocations() {
  const url = `${API_BASE.replace(/\/$/, '')}${API_PREFIX}/spotlight/locations?level=PROVINCE`;
  const res = await fetch(url, { next: { revalidate: 300 } });
  if (!res.ok) return { data: [] };
  return res.json();
}

export const metadata: Metadata = {
  title: 'Đăng video - Spotlight',
  description: 'Đăng video từ YouTube hoặc Facebook lên Spotlight',
};

export default async function SpotlightCreatePage(): Promise<JSX.Element> {
  // Server-side: redirect if not authenticated (getToken is client-only, so we'll handle in client)
  // For SSR we cannot easily check localStorage - the form will redirect on submit if not logged in
  const [categoriesRes, locationsRes] = await Promise.all([
    fetchCategories(),
    fetchLocations(),
  ]);

  const categories = categoriesRes?.data || [];
  const locations = locationsRes?.data || [];

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto max-w-2xl px-4 py-8">
        <Link
          href="/spotlight"
          className="mb-6 inline-flex items-center text-sm text-muted-foreground hover:text-foreground"
        >
          ← Quay lại Spotlight
        </Link>

        <h1 className="font-heading text-2xl font-bold md:text-3xl">
          Đăng video Spotlight
        </h1>
        <p className="mt-2 text-muted-foreground">
          Dán link video từ YouTube hoặc Facebook để chia sẻ với cộng đồng
        </p>

        <SpotlightCreateForm categories={categories} locations={locations} />
      </div>
    </div>
  );
}
