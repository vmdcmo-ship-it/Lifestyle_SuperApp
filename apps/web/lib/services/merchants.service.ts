import { api } from '../api/api';
import { API_ENDPOINTS } from '../config/api';

export const merchantsService = {
  create: (data: {
    name: string; type: string; phone: string; street: string;
    district: string; city: string; latitude: number; longitude: number;
    fullAddress: string; description?: string; email?: string; ward?: string;
  }) => api.post<any>(API_ENDPOINTS.MERCHANTS.CREATE, data),

  list: (params?: { page?: number; limit?: number; type?: string; city?: string; search?: string }) =>
    api.get<any>(API_ENDPOINTS.MERCHANTS.LIST, params),

  getMyMerchants: () => api.get<any>(API_ENDPOINTS.MERCHANTS.MY),
  getById: (id: string) => api.get<any>(API_ENDPOINTS.MERCHANTS.BY_ID(id)),

  update: (id: string, data: any) =>
    api.put<any>(API_ENDPOINTS.MERCHANTS.BY_ID(id), data),

  getStats: (id: string) => api.get<any>(API_ENDPOINTS.MERCHANTS.STATS(id)),

  createCategory: (merchantId: string, data: { name: string; description?: string; sortOrder?: number }) =>
    api.post<any>(API_ENDPOINTS.MERCHANTS.CATEGORIES(merchantId), data),

  getCategories: (merchantId: string) =>
    api.get<any>(API_ENDPOINTS.MERCHANTS.CATEGORIES(merchantId)),

  createProduct: (merchantId: string, data: {
    name: string; price: number; categoryId?: string;
    description?: string; images?: string[]; stock?: number; tags?: string[];
  }) => api.post<any>(API_ENDPOINTS.MERCHANTS.PRODUCTS(merchantId), data),

  getProducts: (merchantId: string, params?: { page?: number; limit?: number; categoryId?: string; search?: string; sortBy?: string }) =>
    api.get<any>(API_ENDPOINTS.MERCHANTS.PRODUCTS(merchantId), params),

  getProduct: (productId: string) => api.get<any>(API_ENDPOINTS.MERCHANTS.PRODUCT(productId)),

  updateProduct: (productId: string, data: any) =>
    api.put<any>(API_ENDPOINTS.MERCHANTS.PRODUCT(productId), data),

  deleteProduct: (productId: string) =>
    api.del<any>(API_ENDPOINTS.MERCHANTS.PRODUCT(productId)),
};
