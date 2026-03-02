import { api } from './api';

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
  }) => api.post('/orders', data),

  getMyOrders: (params?: { page?: number; limit?: number; status?: string; type?: string }) =>
    api.get('/orders/my', params),
  getById: (id: string) => api.get(`/orders/${id}`),
  updateStatus: (id: string, status: string) => api.patch(`/orders/${id}/status`, { status }),
  cancel: (id: string) => api.patch(`/orders/${id}/cancel`),
  rate: (id: string, rating: number, comment?: string) => api.patch(`/orders/${id}/rate`, { rating, comment }),
};
