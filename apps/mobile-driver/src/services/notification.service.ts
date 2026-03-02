import { api } from './api';

export const notificationService = {
  getAll: (params?: { page?: number; limit?: number }) =>
    api.get<any>('/notifications', params),
  getUnreadCount: () => api.get<any>('/notifications/unread-count'),
  markRead: (id: string) => api.patch<any>(`/notifications/${id}/read`),
  markAllRead: () => api.patch<any>('/notifications/read-all'),
};
