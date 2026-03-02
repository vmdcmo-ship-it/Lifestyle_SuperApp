import { api } from './api/api';
import { API_ENDPOINTS } from './config/api';

export interface CampaignStats {
  total: number;
  draft: number;
  active: number;
  paused: number;
  ended: number;
}

export interface CampaignItem {
  id: string;
  name: string;
  description: string | null;
  status: string;
  startDate: string;
  endDate: string;
  budget: number | null;
  createdAt: string;
  updatedAt: string;
}

export interface CreateCampaignPayload {
  name: string;
  description?: string;
  status?: string;
  startDate: string;
  endDate: string;
  budget?: number;
}

export interface UpdateCampaignPayload {
  name?: string;
  description?: string;
  status?: string;
  startDate?: string;
  endDate?: string;
  budget?: number;
}

export const marketingService = {
  async getCampaignStats(): Promise<CampaignStats> {
    return api.get<CampaignStats>(API_ENDPOINTS.MARKETING.STATS);
  },

  async listCampaigns(status?: string): Promise<CampaignItem[]> {
    return api.get<CampaignItem[]>(
      API_ENDPOINTS.MARKETING.CAMPAIGNS,
      status ? { status } : undefined,
    );
  },

  async getCampaignById(id: string): Promise<CampaignItem> {
    return api.get<CampaignItem>(API_ENDPOINTS.MARKETING.CAMPAIGN_BY_ID(id));
  },

  async createCampaign(payload: CreateCampaignPayload) {
    return api.post(API_ENDPOINTS.MARKETING.CAMPAIGNS, payload);
  },

  async updateCampaign(id: string, payload: UpdateCampaignPayload) {
    return api.patch(API_ENDPOINTS.MARKETING.CAMPAIGN_BY_ID(id), payload);
  },
};
