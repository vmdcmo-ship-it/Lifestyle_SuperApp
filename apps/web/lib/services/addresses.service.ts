import { api } from '../api/api';
import { API_ENDPOINTS } from '../config/api';

export const addressesService = {
  list: () => api.get<any>(API_ENDPOINTS.ADDRESSES.LIST),

  create: (data: {
    label?: string; street: string; ward?: string; district?: string;
    city: string; postalCode?: string; latitude?: number; longitude?: number;
    fullAddress: string; isDefault?: boolean;
  }) => api.post<any>(API_ENDPOINTS.ADDRESSES.CREATE, data),

  getById: (id: string) => api.get<any>(API_ENDPOINTS.ADDRESSES.BY_ID(id)),
  update: (id: string, data: any) => api.put<any>(API_ENDPOINTS.ADDRESSES.BY_ID(id), data),
  remove: (id: string) => api.del<any>(API_ENDPOINTS.ADDRESSES.BY_ID(id)),
  setDefault: (id: string) => api.patch<any>(API_ENDPOINTS.ADDRESSES.SET_DEFAULT(id)),
};
