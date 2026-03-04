import { api } from './api/api';
import { API_ENDPOINTS } from './config/api';

export const LEAD_STATUSES = ['PENDING', 'CONTACTED', 'DONE'] as const;
export type LeadStatus = (typeof LEAD_STATUSES)[number];

export interface AnCuLead {
  id: string;
  fullName: string;
  phone: string;
  email: string;
  note: string | null;
  source: string;
  status: string;
  createdAt: string;
  metadata?: Record<string, unknown>;
}

export const anCuService = {
  async listLeads(params?: {
    page?: number;
    limit?: number;
    status?: string;
    dateFrom?: string;
    dateTo?: string;
  }) {
    return api.get<{
      data: AnCuLead[];
      pagination: { page: number; limit: number; total: number; totalPages: number };
    }>(API_ENDPOINTS.AN_CU.LEADS, params);
  },

  async getById(id: string) {
    return api.get<AnCuLead>(API_ENDPOINTS.AN_CU.LEAD_BY_ID(id));
  },

  async updateStatus(id: string, status: LeadStatus) {
    return api.patch<AnCuLead>(API_ENDPOINTS.AN_CU.UPDATE_LEAD(id), { status });
  },
};
