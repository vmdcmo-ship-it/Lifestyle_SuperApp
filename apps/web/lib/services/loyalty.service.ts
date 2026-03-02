import { api } from '../api/api';
import { API_ENDPOINTS } from '../config/api';

export interface ReferralInfoResponse {
  referralCode: string;
  totalReferrals: number;
  completedReferrals: number;
  totalReward: number;
  rewardPerReferral: number;
  refereeReward: number;
}

export interface ReferralHistoryItemApi {
  id: string;
  refereeId: string;
  status: string;
  referrerReward: number;
  refereeReward: number;
  completedAt: string | null;
  createdAt: string;
}

export interface ReferralsListResponse {
  data: ReferralHistoryItemApi[];
  pagination: { page: number; limit: number; total: number; totalPages: number };
}

export interface XuBalanceResponse {
  xuBalance: number;
  walletXu: number;
  totalEarned: number;
  totalSpent: number;
  referralCode: string | null;
  conversionRate: { xu: number; vnd: number };
}

export const loyaltyService = {
  async getReferralInfo(): Promise<ReferralInfoResponse> {
    return api.get<ReferralInfoResponse>(API_ENDPOINTS.LOYALTY.REFERRAL);
  },

  async getMyReferrals(page = 1, limit = 10): Promise<ReferralsListResponse> {
    return api.get<ReferralsListResponse>(API_ENDPOINTS.LOYALTY.REFERRALS, {
      page,
      limit,
    });
  },

  async getXuBalance(): Promise<XuBalanceResponse> {
    return api.get<XuBalanceResponse>(API_ENDPOINTS.LOYALTY.XU);
  },

  async redeemXu(amount: number, purpose?: string): Promise<{
    redeemed: number;
    vndValue: number;
    remainingXu: number;
    purpose?: string;
  }> {
    return api.post(API_ENDPOINTS.LOYALTY.XU_REDEEM, { amount, purpose });
  },
};
