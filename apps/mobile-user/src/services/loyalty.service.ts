import { api } from './api';

export interface XuBalanceResponse {
  xuBalance: number;
  walletXu?: number;
  totalEarned?: number;
  totalSpent?: number;
  referralCode?: string | null;
}

export interface ReferralInfoResponse {
  referralCode: string;
  totalReferrals: number;
  completedReferrals: number;
  totalReward: number;
  rewardPerReferral: number;
  refereeReward: number;
}

export const loyaltyService = {
  async getXuBalance(): Promise<XuBalanceResponse> {
    return api.get<XuBalanceResponse>('/loyalty/xu');
  },
  async getReferralInfo(): Promise<ReferralInfoResponse> {
    return api.get<ReferralInfoResponse>('/loyalty/referral');
  },
  async getMyReferrals(page = 1, limit = 10) {
    return api.get<any>('/loyalty/referrals', { page, limit });
  },
};
