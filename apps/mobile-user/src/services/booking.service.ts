import { api } from './api';

export const bookingService = {
  estimate: (data: {
    pickupLat: number; pickupLng: number; pickupAddress: string;
    dropoffLat: number; dropoffLng: number; dropoffAddress: string;
    vehicleType: string;
  }) => api.post('/booking/estimate', data),

  findDrivers: (data: { lat: number; lng: number; vehicleType?: string; radiusKm?: number }) =>
    api.post('/booking/find-drivers', data),

  create: (data: {
    pickupLat: number; pickupLng: number; pickupAddress: string;
    dropoffLat: number; dropoffLng: number; dropoffAddress: string;
    vehicleType: string; note?: string;
  }) => api.post('/booking/create', data),

  getHistory: (params?: { page?: number; limit?: number; status?: string }) =>
    api.get('/booking/history', params),

  getById: (id: string) => api.get(`/booking/${id}`),
  cancel: (id: string, reason?: string) => api.patch(`/booking/${id}/cancel`, { reason }),
  rate: (id: string, rating: number, comment?: string) => api.patch(`/booking/${id}/rate`, { rating, comment }),

  simulateDrivers: (lat: number, lng: number, count?: number) =>
    api.get('/booking/simulate/drivers', { lat, lng, count }),
};
