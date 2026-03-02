import { api } from './api/api';
import { API_ENDPOINTS } from './config/api';

export type CampaignStatus = 'DRAFT' | 'ACTIVE' | 'PAUSED' | 'ENDED';
export type PrizeType = 'VOUCHER' | 'WALLET_CREDIT' | 'PHYSICAL_GOODS' | 'NO_PRIZE';

export interface LuckyWheelCampaign {
  id: string;
  name: string;
  description: string | null;
  status: CampaignStatus;
  startDate: string;
  endDate: string;
  budget: number;
  budgetUsed: number;
  driverRevenuePerSpin: number;
  userTopUpPerSpin: number;
  userOrderPerSpin: number;
  prizeCount?: number;
  spinCount?: number;
  creditGrantsCount?: number;
  createdAt: string;
  updatedAt: string;
}

export interface LuckyWheelPrize {
  id: string;
  name: string;
  type: PrizeType;
  weight: number;
  quantity: number | null;
  quantityGiven: number;
  valueJson: Record<string, unknown>;
}

export interface LuckyWheelSpin {
  id: string;
  campaignId: string;
  campaignName: string;
  userId: string;
  participantType: 'USER' | 'DRIVER';
  prizeId: string | null;
  prizeName: string;
  prizeType: PrizeType;
  createdAt: string;
}

export interface LuckyWheelStats {
  totalCampaigns: number;
  activeCampaigns: number;
  totalSpins: number;
  totalPrizesWon: number;
  noPrizeCount: number;
  recentSpins: LuckyWheelSpin[];
}

export const luckyWheelService = {
  async getStats(): Promise<LuckyWheelStats> {
    return api.get<LuckyWheelStats>(API_ENDPOINTS.LUCKY_WHEEL.STATS);
  },

  async listCampaigns(status?: string): Promise<LuckyWheelCampaign[]> {
    return api.get<LuckyWheelCampaign[]>(API_ENDPOINTS.LUCKY_WHEEL.CAMPAIGNS, {
      status,
    } as Record<string, unknown>);
  },

  async getCampaignById(id: string): Promise<LuckyWheelCampaign & { prizes: LuckyWheelPrize[] }> {
    return api.get(API_ENDPOINTS.LUCKY_WHEEL.CAMPAIGN_BY_ID(id));
  },

  async getCampaignStats(id: string): Promise<{
    campaign: LuckyWheelCampaign;
    spinCount: number;
    creditGrantsCount: number;
    prizeStats: Array<{
      id: string;
      name: string;
      type: string;
      quantity: number | null;
      quantityGiven: number;
      weight: number;
    }>;
  }> {
    return api.get(API_ENDPOINTS.LUCKY_WHEEL.CAMPAIGN_STATS(id));
  },

  async createCampaign(body: {
    name: string;
    description?: string;
    startDate: string;
    endDate: string;
    budget?: number;
    driverRevenuePerSpin?: number;
    userTopUpPerSpin?: number;
    userOrderPerSpin?: number;
  }): Promise<LuckyWheelCampaign> {
    return api.post<LuckyWheelCampaign>(API_ENDPOINTS.LUCKY_WHEEL.CAMPAIGNS, body);
  },

  async updateCampaign(
    id: string,
    body: Partial<{
      name: string;
      description: string;
      startDate: string;
      endDate: string;
      budget: number;
      status: CampaignStatus;
      driverRevenuePerSpin: number;
      userTopUpPerSpin: number;
      userOrderPerSpin: number;
    }>,
  ): Promise<LuckyWheelCampaign> {
    return api.patch<LuckyWheelCampaign>(API_ENDPOINTS.LUCKY_WHEEL.CAMPAIGN_BY_ID(id), body);
  },

  async addPrize(
    campaignId: string,
    body: {
      name: string;
      type: PrizeType;
      weight: number;
      quantity?: number;
      valueJson?: Record<string, unknown>;
    },
  ): Promise<LuckyWheelPrize> {
    return api.post<LuckyWheelPrize>(API_ENDPOINTS.LUCKY_WHEEL.CAMPAIGN_PRIZES(campaignId), body);
  },

  async updatePrize(
    campaignId: string,
    prizeId: string,
    body: Partial<{
      name: string;
      type: PrizeType;
      weight: number;
      quantity: number;
      valueJson: Record<string, unknown>;
    }>,
  ): Promise<LuckyWheelPrize> {
    return api.patch<LuckyWheelPrize>(
      API_ENDPOINTS.LUCKY_WHEEL.CAMPAIGN_PRIZE(campaignId, prizeId),
      body,
    );
  },

  async deletePrize(campaignId: string, prizeId: string): Promise<{ success: boolean }> {
    return api.del(API_ENDPOINTS.LUCKY_WHEEL.CAMPAIGN_PRIZE(campaignId, prizeId));
  },

  async listSpins(params?: {
    page?: number;
    limit?: number;
    campaignId?: string;
    userId?: string;
    participantType?: 'USER' | 'DRIVER';
  }): Promise<{
    data: LuckyWheelSpin[];
    pagination: { page: number; limit: number; total: number; totalPages: number };
  }> {
    return api.get(API_ENDPOINTS.LUCKY_WHEEL.SPINS, params as Record<string, unknown>);
  },
};
