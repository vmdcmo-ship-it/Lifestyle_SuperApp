import { api } from '../api/api';
import { API_ENDPOINTS } from '../config/api';

export const driversService = {
  register: (data: any) => api.post<any>(API_ENDPOINTS.DRIVERS.REGISTER, data),
  getProfile: () => api.get<any>(API_ENDPOINTS.DRIVERS.PROFILE),
  getDashboard: () => api.get<any>(API_ENDPOINTS.DRIVERS.DASHBOARD),
  addVehicle: (data: any) => api.post<any>(API_ENDPOINTS.DRIVERS.VEHICLES, data),
  getVehicles: () => api.get<any>(API_ENDPOINTS.DRIVERS.VEHICLES),
  listDrivers: (params?: { page?: number; limit?: number; status?: string }) =>
    api.get<any>(API_ENDPOINTS.DRIVERS.LIST, params),
  getStats: () => api.get<any>(API_ENDPOINTS.DRIVERS.STATS),
  verify: (id: string, action: 'APPROVED' | 'REJECTED', rejectionReason?: string) =>
    api.patch<any>(API_ENDPOINTS.DRIVERS.VERIFY(id), { action, rejectionReason }),
};
