import { api } from './api';

export interface WalletTransaction {
  id: string;
  type: string;
  amount: number;
  balanceAfter?: number;
  description?: string;
  createdAt: string;
  status?: string;
}

export const walletService = {
  async getWallet(): Promise<{ balance?: number; xu?: number }> {
    try {
      const info = await api.get<any>('/wallet');
      return {
        balance: info?.balance ?? info?.walletBalance,
        xu: info?.xu ?? info?.xuBalance ?? 0,
      };
    } catch {
      return {};
    }
  },
  async getInfo() {
    return api.get<any>('/wallet');
  },
  async getTransactions(params?: { page?: number; limit?: number; type?: string }) {
    const { page = 1, limit = 20, type } = params ?? {};
    return api.get<{ data: WalletTransaction[]; pagination?: any }>('/wallet/transactions', {
      page,
      limit,
      ...(type && { type }),
    });
  },
};
