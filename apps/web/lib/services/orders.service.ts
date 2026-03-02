import { api } from '../api/api';
import { API_ENDPOINTS } from '../config/api';

export const ordersService = {
  create: (data: {
    merchantId: string;
    type: 'FOOD_DELIVERY' | 'SHOPPING' | 'PICKUP';
    items: Array<{ productId: string; quantity: number; options?: any; note?: string }>;
    paymentMethod?: string;
    deliveryAddress?: string;
    deliveryLat?: number;
    deliveryLng?: number;
    deliveryNote?: string;
    couponCode?: string;
    note?: string;
  }) => api.post<any>(API_ENDPOINTS.ORDERS.CREATE, data),

  getMyOrders: (params?: { page?: number; limit?: number; status?: string; type?: string }) =>
    api.get<any>(API_ENDPOINTS.ORDERS.MY, params),

  getMerchantOrders: (merchantId: string, params?: { page?: number; limit?: number; status?: string }) =>
    api.get<any>(API_ENDPOINTS.ORDERS.MERCHANT(merchantId), params),

  getById: (id: string) => api.get<any>(API_ENDPOINTS.ORDERS.BY_ID(id)),

  updateStatus: (id: string, status: string) =>
    api.patch<any>(API_ENDPOINTS.ORDERS.STATUS(id), { status }),

  cancel: (id: string, reason?: string) =>
    api.patch<any>(API_ENDPOINTS.ORDERS.CANCEL(id), undefined),

  rate: (id: string, rating: number, comment?: string) =>
    api.patch<any>(API_ENDPOINTS.ORDERS.RATE(id), { rating, comment }),
};
