import { api } from './api/api';
import { API_ENDPOINTS } from './config/api';

export type RunToEarnStatus = 'DRAFT' | 'ACTIVE' | 'PAUSED' | 'ENDED';
export type RunToEarnPrizeType = 'XU' | 'VOUCHER' | 'PHYSICAL_GOODS';

export interface RunToEarnCampaign {
  id: string;
  name: string;
  description: string | null;
  status: RunToEarnStatus;
  startDate: string;
  endDate: string;
  stepsPerXu: number;
  budget: number;
  budgetUsed: number;
  prizeCount?: number;
  participationCount?: number;
  createdAt: string;
  updatedAt: string;
}

export interface RunToEarnPrize {
  id: string;
  name: string;
  type: RunToEarnPrizeType;
  rankFrom: number;
  rankTo: number;
  xuAmount: number | null;
  couponId: string | null;
  valueJson: Record<string, unknown>;
  quantity: number;
  quantityGiven: number;
}

export interface RunToEarnStats {
  totalCampaigns: number;
  activeCampaigns: number;
  totalParticipations: number;
  budgetUsedTotal: number;
}

export const runToEarnService = {
  async getStats(): Promise<RunToEarnStats> {
    return api.get<RunToEarnStats>(API_ENDPOINTS.RUN_TO_EARN.STATS);
  },

  async listCampaigns(status?: string): Promise<RunToEarnCampaign[]> {
    return api.get<RunToEarnCampaign[]>(API_ENDPOINTS.RUN_TO_EARN.CAMPAIGNS, {
      status,
    } as Record<string, unknown>);
  },

  async getCampaignById(id: string): Promise<RunToEarnCampaign & { prizes: RunToEarnPrize[] }> {
    return api.get(API_ENDPOINTS.RUN_TO_EARN.CAMPAIGN_BY_ID(id));
  },

  async createCampaign(body: {
    name: string;
    description?: string;
    startDate: string;
    endDate: string;
    stepsPerXu?: number;
    budget?: number;
  }): Promise<RunToEarnCampaign> {
    return api.post<RunToEarnCampaign>(API_ENDPOINTS.RUN_TO_EARN.CAMPAIGNS, body);
  },

  async updateCampaign(
    id: string,
    body: Partial<{
      name: string;
      description: string;
      startDate: string;
      endDate: string;
      stepsPerXu: number;
      budget: number;
      status: RunToEarnStatus;
    }>,
  ): Promise<RunToEarnCampaign> {
    return api.patch<RunToEarnCampaign>(API_ENDPOINTS.RUN_TO_EARN.CAMPAIGN_BY_ID(id), body);
  },

  async addPrize(
    campaignId: string,
    body: {
      name: string;
      type: RunToEarnPrizeType;
      rankFrom: number;
      rankTo: number;
      xuAmount?: number;
      couponId?: string;
      valueJson?: Record<string, unknown>;
      quantity?: number;
    },
  ): Promise<RunToEarnPrize> {
    return api.post<RunToEarnPrize>(API_ENDPOINTS.RUN_TO_EARN.CAMPAIGN_PRIZES(campaignId), body);
  },
};
