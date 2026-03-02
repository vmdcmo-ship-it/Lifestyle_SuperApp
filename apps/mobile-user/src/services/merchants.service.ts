import { api } from './api';

export const merchantsService = {
  async list(params?: { page?: number; limit?: number; type?: string; city?: string }) {
    return api.get<{ data: any[] }>('/merchants', params);
  },
  async getById(id: string) {
    return api.get<any>(`/merchants/${id}`);
  },
  async getProducts(merchantId: string) {
    return api.get<any>(`/merchants/${merchantId}/products`);
  },
};
