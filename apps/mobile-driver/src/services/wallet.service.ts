import { api } from './api';

export const walletService = {
  getInfo: () => api.get<any>('/wallet'),

  getTransactions: (params?: { page?: number; limit?: number; type?: string }) =>
    api.get<any>('/wallet/transactions', params),

  topUp: (amount: number, method: 'VNPAY' | 'MOMO' | 'ZALOPAY' | 'BANK_TRANSFER') =>
    api.post<any>('/wallet/top-up', { amount, method }),

  withdraw: (amount: number, bankAccount: string) =>
    api.post<any>('/wallet/withdraw', { amount, bankAccount }),
};
