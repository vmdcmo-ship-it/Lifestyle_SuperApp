import { api } from '../api/api';
import { API_ENDPOINTS } from '../config/api';

export interface WalletTransaction {
  id: string;
  type: string;
  amount: number;
  balanceAfter?: number;
  description?: string;
  createdAt: string;
  status: string;
}

export interface WalletTransactionsResponse {
  data: WalletTransaction[];
  pagination: { page: number; limit: number; total: number; totalPages: number };
}

const XU_TYPES = ['XU_EARN', 'XU_SPEND', 'BONUS'];

export const walletService = {
  async getTransactions(page = 1, limit = 20, type?: string): Promise<WalletTransactionsResponse> {
    return api.get<WalletTransactionsResponse>(API_ENDPOINTS.WALLET.TRANSACTIONS, {
      page,
      limit,
      ...(type && { type }),
    });
  },

  async getXuTransactions(page = 1, limit = 30): Promise<WalletTransactionsResponse> {
    const res = await this.getTransactions(page, limit);
    const xuOnly = (res.data || []).filter((t) => XU_TYPES.includes(t.type));
    return {
      data: xuOnly,
      pagination: res.pagination || { page, limit, total: xuOnly.length, totalPages: 1 },
    };
  },
};
