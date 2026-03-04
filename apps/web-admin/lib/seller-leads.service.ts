import { api } from './api/api';
import { API_ENDPOINTS } from './config/api';

export const SELLER_LEAD_STATUSES = ['PENDING', 'CONTACTED', 'DONE', 'REJECTED'] as const;
export type SellerLeadStatus = (typeof SELLER_LEAD_STATUSES)[number];

export interface SellerLead {
  id: string;
  storeName: string;
  contactName: string;
  email: string;
  phone: string;
  businessGroup?: string | null;
  subCategory?: string | null;
  category?: string | null;
  message: string | null;
  source: string;
  status: string;
  createdAt: string;
}

export const sellerLeadsService = {
  async list(params?: { page?: number; limit?: number; status?: string }) {
    return api.get<{
      data: SellerLead[];
      total: number;
      page: number;
      limit: number;
    }>(API_ENDPOINTS.MERCHANTS.SELLER_LEADS, params);
  },

  async updateStatus(id: string, status: SellerLeadStatus, note?: string) {
    return api.patch<{ id: string; status: string }>(
      API_ENDPOINTS.MERCHANTS.SELLER_LEAD_UPDATE(id),
      { status, note }
    );
  },
};
