import { api } from './api';

export const addressesService = {
  list: () => api.get('/addresses'),
  create: (data: {
    label?: string; street: string; ward?: string; district?: string;
    city: string; postalCode?: string; latitude?: number; longitude?: number;
    fullAddress: string; isDefault?: boolean;
  }) => api.post('/addresses', data),
  getById: (id: string) => api.get(`/addresses/${id}`),
  update: (id: string, data: any) => api.put(`/addresses/${id}`, data),
  remove: (id: string) => api.del(`/addresses/${id}`),
  setDefault: (id: string) => api.patch(`/addresses/${id}/default`),
};
