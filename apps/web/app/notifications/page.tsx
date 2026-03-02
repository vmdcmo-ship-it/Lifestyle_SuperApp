import type { Metadata } from 'next';
import { NotificationsPageClient } from './notifications-client';

export const metadata: Metadata = {
  title: 'Thông báo',
  description: 'Xem tất cả thông báo của bạn',
};

export default function NotificationsPage(): JSX.Element {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto max-w-2xl px-4 py-8">
        <h1 className="mb-6 font-heading text-2xl font-bold">Thông báo</h1>
        <NotificationsPageClient />
      </div>
    </div>
  );
}
