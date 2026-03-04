'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
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

export function NotificationDropdown(): JSX.Element | null {
  const { isAuthenticated } = useAuth();
  const [open, setOpen] = useState(false);
  const [items, setItems] = useState<NotificationItem[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isAuthenticated) return;
    const fetchData = async () => {
      try {
        const res = await notificationsService.list({ limit: 10, unreadOnly: false });
        const data = res as { data?: NotificationItem[]; unreadCount?: number };
        setItems(data.data || []);
        setUnreadCount(data.unreadCount ?? 0);
      } catch {
        // ignore
      }
    };
    fetchData();
    const interval = setInterval(fetchData, 60000);
    return () => clearInterval(interval);
  }, [isAuthenticated]);

  useEffect(() => {
    if (!open || !isAuthenticated) return;
    setLoading(true);
    notificationsService
      .list({ limit: 10 })
      .then((res: any) => {
        setItems(res.data || []);
        setUnreadCount(res.unreadCount ?? 0);
      })
      .finally(() => setLoading(false));
  }, [open, isAuthenticated]);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    if (open) {
      document.addEventListener('click', handleClickOutside);
      return () => document.removeEventListener('click', handleClickOutside);
    }
  }, [open]);

  const getNotificationHref = (item: NotificationItem) => {
    const url = item.data?.url;
    if (url?.startsWith('/')) return url;
    if (item.data?.redcommentId) return `/spotlight/${item.data.redcommentId}`;
    return '/notifications';
  };

  const handleItemClick = async (item: NotificationItem) => {
    if (!item.isRead) {
      try {
        await notificationsService.markAsRead(item.id);
        setItems((prev) => prev.map((n) => (n.id === item.id ? { ...n, isRead: true } : n)));
        setUnreadCount((c) => Math.max(0, c - 1));
      } catch {
        // ignore
      }
    }
    setOpen(false);
  };

  if (!isAuthenticated) return null;

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="brand-text relative flex h-9 w-9 items-center justify-center rounded-lg transition-colors hover:opacity-80"
        aria-label="Thông báo"
      >
        <svg
          className="h-5 w-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m-4 0h10"
          />
        </svg>
        {unreadCount > 0 && (
          <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-bold text-white">
            {unreadCount > 99 ? '99+' : unreadCount}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 top-full z-50 mt-1 w-80 overflow-hidden rounded-xl border bg-background shadow-lg">
          <div className="flex items-center justify-between border-b px-4 py-3">
            <h3 className="font-semibold">Thông báo</h3>
            <Link
              href="/notifications"
              className="text-sm text-primary hover:underline"
              onClick={() => setOpen(false)}
            >
              Xem tất cả
            </Link>
          </div>
          <div className="max-h-80 overflow-y-auto">
            {loading ? (
              <div className="flex justify-center py-8">
                <div className="h-6 w-6 animate-spin rounded-full border-2 border-purple-600 border-t-transparent" />
              </div>
            ) : items.length === 0 ? (
              <p className="px-4 py-8 text-center text-sm text-muted-foreground">
                Chưa có thông báo
              </p>
            ) : (
              items.map((item) => (
                <Link
                  key={item.id}
                  href={getNotificationHref(item)}
                  onClick={() => handleItemClick(item)}
                  className={`block border-b px-4 py-3 transition-colors last:border-b-0 hover:bg-muted/50 ${
                    !item.isRead ? 'bg-muted/30' : ''
                  }`}
                >
                  <p className="font-medium">{item.title}</p>
                  <p className="line-clamp-2 text-sm text-muted-foreground">{item.body}</p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    {new Date(item.createdAt).toLocaleDateString('vi-VN', {
                      day: 'numeric',
                      month: 'short',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </p>
                </Link>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
