import { api } from '../api/api';
import { API_ENDPOINTS } from '../config/api';

export const bookingService = {
  estimate: (data: {
    pickupLat: number; pickupLng: number; pickupAddress: string;
    dropoffLat: number; dropoffLng: number; dropoffAddress: string;
    vehicleType: string;
  }) => api.post<any>(API_ENDPOINTS.BOOKING.ESTIMATE, data),

  findDrivers: (data: { lat: number; lng: number; vehicleType?: string; radiusKm?: number }) =>
    api.post<any>(API_ENDPOINTS.BOOKING.FIND_DRIVERS, data),

  create: (data: {
    pickupLat: number; pickupLng: number; pickupAddress: string;
    dropoffLat: number; dropoffLng: number; dropoffAddress: string;
    vehicleType: string; note?: string;
  }) => api.post<any>(API_ENDPOINTS.BOOKING.CREATE, data),

  getHistory: (params?: { page?: number; limit?: number; status?: string }) =>
    api.get<any>(API_ENDPOINTS.BOOKING.HISTORY, params),

  getById: (id: string) => api.get<any>(API_ENDPOINTS.BOOKING.BY_ID(id)),
  cancel: (id: string, reason?: string) => api.patch<any>(API_ENDPOINTS.BOOKING.CANCEL(id), { reason }),
  rate: (id: string, rating: number, comment?: string) => api.patch<any>(API_ENDPOINTS.BOOKING.RATE(id), { rating, comment }),
  simulateDrivers: (lat: number, lng: number, count?: number) =>
    api.get<any>(API_ENDPOINTS.BOOKING.SIMULATE, { lat, lng, count }),
};
