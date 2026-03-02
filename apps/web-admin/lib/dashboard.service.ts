import { api } from './api/api';
import { API_ENDPOINTS } from './config/api';

export interface DailyStat {
  date: string;
  count: number;
  revenue: number;
}

export interface ChartStatsResponse {
  bookings: { daily: DailyStat[] };
  orders: { daily: DailyStat[] };
}

export interface QuickStatsResponse {
  totalMerchants: number;
  totalOrders: number;
  pendingOrders: number;
}

export interface RegionStat {
  region: string;
  orderCount: number;
  revenue: number;
}

export const dashboardService = {
  async getQuickStats(): Promise<QuickStatsResponse> {
    return api.get<QuickStatsResponse>(API_ENDPOINTS.DASHBOARD.QUICK_STATS);
  },

  async getChartStats(days = 7): Promise<ChartStatsResponse> {
    return api.get<ChartStatsResponse>(API_ENDPOINTS.DASHBOARD.CHART_STATS, {
      days,
    });
  },

  async getRegionStats(days = 30): Promise<RegionStat[]> {
    return api.get<RegionStat[]>(API_ENDPOINTS.DASHBOARD.REGION_STATS, {
      days,
    });
  },
};
