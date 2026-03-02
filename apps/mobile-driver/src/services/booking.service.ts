import { api } from './api';

export const bookingService = {
  getAvailableOrders: () => api.get<any>('/booking/driver/available'),

  acceptOrder: (bookingId: string) =>
    api.post<any>(`/booking/${bookingId}/accept`),

  rejectOrder: (bookingId: string, reason?: string) =>
    api.post<any>(`/booking/${bookingId}/reject`, { reason }),

  completeOrder: (bookingId: string) =>
    api.post<any>(`/booking/${bookingId}/complete`),

  cancelOrder: (bookingId: string, reason: string) =>
    api.post<any>(`/booking/${bookingId}/cancel`, { reason }),

  getOrderDetail: (bookingId: string) =>
    api.get<any>(`/booking/${bookingId}`),

  getHistory: (params?: { page?: number; limit?: number; status?: string }) =>
    api.get<any>('/booking/history', params),

  updateLocation: (bookingId: string, lat: number, lng: number) =>
    api.post<any>('/booking/driver/location', { bookingId, latitude: lat, longitude: lng }),

  updateBookingStatus: (bookingId: string, status: 'DRIVER_ARRIVING' | 'PICKED_UP' | 'IN_PROGRESS') =>
    api.patch<any>(`/booking/${bookingId}/status`, {}, { params: { status } }),
};
