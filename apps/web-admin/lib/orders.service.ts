import { api } from './api/api';
import { API_ENDPOINTS } from './config/api';

export interface OrderListItem {
  id: string;
  orderNumber: string;
  type: string;
  status: string;
  totalAmount: number;
  currency: string;
  items: Array<{ name: string; quantity: number; totalPrice: number }>;
  merchant?: { id: string; name: string };
  timestamps: { created: string };
}

export interface OrdersListResponse {
  data: OrderListItem[];
  pagination: { page: number; limit: number; total: number; totalPages: number };
}

export const ordersService = {
  async list(params?: {
    page?: number;
    limit?: number;
    status?: string;
    type?: string;
    search?: string;
  }): Promise<OrdersListResponse> {
    return api.get<OrdersListResponse>(
      API_ENDPOINTS.ORDERS.ADMIN_LIST,
      params as Record<string, unknown>,
    );
  },

  async getById(id: string): Promise<OrderListItem & Record<string, unknown>> {
    return api.get(API_ENDPOINTS.ORDERS.ADMIN_BY_ID(id));
  },
};
