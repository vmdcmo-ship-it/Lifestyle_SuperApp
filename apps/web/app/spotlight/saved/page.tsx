import type { Metadata } from 'next';
import Link from 'next/link';
import { SpotlightSavedContent } from './spotlight-saved-content';

export const metadata: Metadata = {
  title: 'Video đã lưu - Spotlight',
  description: 'Danh sách video bạn đã lưu trên Spotlight',
};

export default function SpotlightSavedPage(): JSX.Element {
  return (
    <div className="min-h-screen bg-background">
      <div className="border-b bg-card">
        <div className="container mx-auto px-4 py-6">
          <Link
            href="/spotlight"
            className="mb-4 inline-flex text-sm text-muted-foreground hover:text-foreground"
          >
            ← Quay lại Spotlight
          </Link>
          <h1 className="font-heading text-2xl font-bold md:text-3xl">
            Video đã lưu
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Các video bạn đã lưu để xem lại
          </p>
        </div>
      </div>
      <div className="container mx-auto px-4 py-8">
        <SpotlightSavedContent />
      </div>
    </div>
  );
}
