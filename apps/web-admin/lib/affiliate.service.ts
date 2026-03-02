import { api } from './api/api';
import { API_ENDPOINTS } from './config/api';

export interface AffiliateStats {
  totalReferrals: number;
  completedReferrals: number;
  pendingReferrals: number;
  budgetSpentReferrer: number;
  budgetSpentReferee: number;
  budgetSpentTotal: number;
}

export interface AffiliateReferralItem {
  id: string;
  referrerId: string;
  referrerName: string | null;
  referrerPhone: string | null;
  referrerCode: string | null;
  refereeId: string;
  refereeName: string | null;
  refereePhone: string | null;
  status: string;
  referrerReward: number;
  refereeReward: number;
  completedAt: string | null;
  createdAt: string;
}

export const affiliateService = {
  async getStats(): Promise<AffiliateStats> {
    return api.get<AffiliateStats>(API_ENDPOINTS.AFFILIATE.STATS);
  },

  async list(params?: {
    page?: number;
    limit?: number;
    status?: string;
    dateFrom?: string;
    dateTo?: string;
  }): Promise<{
    data: AffiliateReferralItem[];
    pagination: { page: number; limit: number; total: number; totalPages: number };
  }> {
    return api.get(API_ENDPOINTS.AFFILIATE.LIST, params as Record<string, unknown>);
  },
};
