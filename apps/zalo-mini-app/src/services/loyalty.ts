import { apiFetch, endpoints } from "./api";

export interface XuBalanceResponse {
  xuBalance: number;
  walletXu?: number;
  totalEarned?: number;
  totalSpent?: number;
  referralCode?: string;
  conversionRate?: { xu: number; vnd: number };
}

export async function getXuBalance(): Promise<XuBalanceResponse> {
  return apiFetch<XuBalanceResponse>(endpoints.loyalty.xu);
}
