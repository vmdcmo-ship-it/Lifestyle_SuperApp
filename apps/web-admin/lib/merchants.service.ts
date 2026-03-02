import { api } from './api/api';
import { API_ENDPOINTS } from './config/api';

export interface MerchantListItem {
  id: string;
  merchantNumber: string;
  name: string;
  slug: string;
  type: string;
  address: { city: string; fullAddress: string };
  rating: { overall: number };
  stats: { totalOrders: number; totalRevenue: number };
  status: string;
  createdAt: string;
}

export interface MerchantsListResponse {
  data: MerchantListItem[];
  pagination: { page: number; limit: number; total: number; totalPages: number };
}

export const merchantsService = {
  async list(params?: {
    page?: number;
    limit?: number;
    status?: string;
    type?: string;
    city?: string;
    search?: string;
  }): Promise<MerchantsListResponse> {
    return api.get<MerchantsListResponse>(
      API_ENDPOINTS.MERCHANTS.ADMIN_LIST,
      params as Record<string, unknown>,
    );
  },

  async getById(id: string): Promise<MerchantListItem & Record<string, unknown>> {
    return api.get(API_ENDPOINTS.MERCHANTS.ADMIN_BY_ID(id));
  },

  async verify(
    id: string,
    action: 'APPROVED' | 'REJECTED',
    rejectionReason?: string,
  ): Promise<MerchantListItem & Record<string, unknown>> {
    return api.patch(API_ENDPOINTS.MERCHANTS.ADMIN_VERIFY(id), {
      action,
      rejectionReason: action === 'REJECTED' ? rejectionReason : undefined,
    });
  },
};
