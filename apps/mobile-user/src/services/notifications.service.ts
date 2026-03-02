import { api } from './api';

export const notificationsService = {
  list: (params?: { page?: number; limit?: number; type?: string; unreadOnly?: boolean }) =>
    api.get('/notifications', params),
  async getUnreadCount(): Promise<{ count: number }> {
    const res = await api.get<{ unreadCount?: number }>('/notifications/unread-count');
    return { count: res?.unreadCount ?? 0 };
  },
  markAsRead: (id: string) => api.patch(`/notifications/${id}/read`),
  markAllAsRead: () => api.patch('/notifications/read-all'),
  remove: (id: string) => api.del(`/notifications/${id}`),
};
