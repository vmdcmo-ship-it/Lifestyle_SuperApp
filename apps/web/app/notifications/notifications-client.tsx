'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/contexts/auth-context';
import { notificationsService } from '@/lib/services/notifications.service';

interface NotificationItem {
  id: string;
  type: string;
  title: string;
  body: string;
  imageUrl?: string | null;
  data?: { url?: string; redcommentId?: string } | null;
  isRead: boolean;
  createdAt: string;
}

function getNotificationHref(item: NotificationItem): string {
  const url = item.data?.url;
  if (url?.startsWith('/')) return url;
  if (item.data?.redcommentId) return `/spotlight/${item.data.redcommentId}`;
  return '#';
}

export function NotificationsPageClient(): JSX.Element {
  const router = useRouter();
  const { isAuthenticated, isLoading } = useAuth();
  const [items, setItems] = useState<NotificationItem[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.replace('/login?redirect=/notifications');
      return;
    }
    if (!isAuthenticated) return;

    const fetchData = async () => {
      try {
        const res = (await notificationsService.list({
          limit: 50,
          unreadOnly: false,
        })) as { data?: NotificationItem[]; unreadCount?: number };
        setItems(res.data || []);
        setUnreadCount(res.unreadCount ?? 0);
      } catch {
        setItems([]);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [isAuthenticated, isLoading, router]);

  const handleMarkAsRead = async (item: NotificationItem, e: React.MouseEvent) => {
    e.preventDefault();
    if (item.isRead) return;
    try {
      await notificationsService.markAsRead(item.id);
      setItems((prev) =>
        prev.map((n) => (n.id === item.id ? { ...n, isRead: true } : n))
      );
      setUnreadCount((c) => Math.max(0, c - 1));
    } catch {
      // ignore
    }
  };

  const handleMarkAllRead = async () => {
    try {
      await notificationsService.markAllAsRead();
      setItems((prev) => prev.map((n) => ({ ...n, isRead: true })));
      setUnreadCount(0);
    } catch {
      // ignore
    }
  };

  if (isLoading || !isAuthenticated) {
    return (
      <div className="flex justify-center py-20">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-purple-600 border-t-transparent" />
      </div>
    );
  }

  return (
    <>
      <div className="mb-6 flex items-center justify-between">
        <Link
          href="/"
          className="text-sm text-muted-foreground hover:text-foreground"
        >
          ← Về trang chủ
        </Link>
        {unreadCount > 0 && (
          <button
            type="button"
            onClick={handleMarkAllRead}
            className="text-sm text-primary hover:underline"
          >
            Đánh dấu tất cả đã đọc
          </button>
        )}
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-purple-600 border-t-transparent" />
        </div>
      ) : items.length === 0 ? (
        <div className="rounded-xl border bg-card py-16 text-center">
          <p className="text-muted-foreground">Chưa có thông báo nào</p>
          <Link
            href="/spotlight"
            className="mt-4 inline-block text-sm text-primary hover:underline"
          >
            Khám phá Spotlight →
          </Link>
        </div>
      ) : (
        <div className="space-y-2">
          {items.map((item) => (
            <Link
              key={item.id}
              href={getNotificationHref(item)}
              onClick={(e) => handleMarkAsRead(item, e)}
              className={`block rounded-xl border p-4 transition-colors hover:bg-muted/50 ${
                !item.isRead ? 'border-l-4 border-l-purple-600 bg-muted/30' : ''
              }`}
            >
              <p className="font-medium">{item.title}</p>
              <p className="line-clamp-2 mt-1 text-sm text-muted-foreground">
                {item.body}
              </p>
              <p className="mt-2 text-xs text-muted-foreground">
                {new Date(item.createdAt).toLocaleDateString('vi-VN', {
                  day: 'numeric',
                  month: 'short',
                  year: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </p>
            </Link>
          ))}
        </div>
      )}
    </>
  );
}
