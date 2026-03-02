import { api } from '../api/api';
import { API_ENDPOINTS } from '../config/api';

export const notificationsService = {
  list: (params?: { page?: number; limit?: number; type?: string; unreadOnly?: boolean }) =>
    api.get<any>(API_ENDPOINTS.NOTIFICATIONS.LIST, params),

  getUnreadCount: () => api.get<any>(API_ENDPOINTS.NOTIFICATIONS.UNREAD_COUNT),
  markAsRead: (id: string) => api.patch<any>(API_ENDPOINTS.NOTIFICATIONS.READ(id)),
  markAllAsRead: () => api.patch<any>(API_ENDPOINTS.NOTIFICATIONS.READ_ALL),
  remove: (id: string) => api.del<any>(API_ENDPOINTS.NOTIFICATIONS.DELETE(id)),
};
