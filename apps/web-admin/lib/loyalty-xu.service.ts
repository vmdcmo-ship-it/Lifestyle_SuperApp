import { api } from './api/api';
import { API_ENDPOINTS } from './config/api';

export interface LoyaltyXuStats {
  totalXuEarned: number;
  totalXuSpent: number;
  currentXuBalance: number;
  walletCountWithXu: number;
  totalWallets: number;
  estimatedBudgetImpactVnd: number;
}

export const loyaltyXuService = {
  async getStats(): Promise<LoyaltyXuStats> {
    return api.get<LoyaltyXuStats>(API_ENDPOINTS.LOYALTY_XU.STATS);
  },
};
