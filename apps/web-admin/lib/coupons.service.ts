import { api } from './api/api';
import { API_ENDPOINTS } from './config/api';

export interface CouponListItem {
  id: string;
  code: string;
  title: string;
  description: string | null;
  discountType: string;
  discountValue: number;
  maxDiscount: number | null;
  minOrderAmount: number | null;
  usageLimit: number | null;
  usedCount: number;
  perUserLimit: number;
  startDate: string;
  endDate: string;
  isActive: boolean;
}

export interface CouponDetail extends CouponListItem {}

export interface CreateCouponPayload {
  code: string;
  title: string;
  description?: string;
  discountType: string;
  discountValue: number;
  maxDiscount?: number;
  minOrderAmount?: number;
  usageLimit?: number;
  perUserLimit?: number;
  startDate: string;
  endDate: string;
}

export interface UpdateCouponPayload {
  title?: string;
  description?: string;
  discountType?: string;
  discountValue?: number;
  maxDiscount?: number;
  minOrderAmount?: number;
  usageLimit?: number;
  perUserLimit?: number;
  startDate?: string;
  endDate?: string;
  isActive?: boolean;
}

export interface CouponsListResponse {
  data: CouponListItem[];
  pagination: { page: number; limit: number; total: number; totalPages: number };
}

export const couponsService = {
  async list(params?: {
    page?: number;
    limit?: number;
    activeOnly?: boolean;
  }): Promise<CouponsListResponse> {
    return api.get<CouponsListResponse>(API_ENDPOINTS.COUPONS.LIST, params);
  },

  async getById(id: string): Promise<CouponDetail> {
    return api.get<CouponDetail>(API_ENDPOINTS.COUPONS.BY_ID(id));
  },

  async create(payload: CreateCouponPayload) {
    return api.post(API_ENDPOINTS.COUPONS.CREATE, payload);
  },

  async update(id: string, payload: UpdateCouponPayload) {
    return api.patch(API_ENDPOINTS.COUPONS.UPDATE(id), payload);
  },

  async getStats(): Promise<CouponStatsResponse> {
    return api.get<CouponStatsResponse>(API_ENDPOINTS.COUPONS.STATS);
  },
};

export interface CouponStatsResponse {
  totalCoupons: number;
  activeCoupons: number;
  totalRedemptions: number;
  topCouponsByUsage: Array<{
    id: string;
    code: string;
    title: string;
    discountType: string;
    discountValue: number;
    usedCount: number;
    usageLimit: number | null;
    isActive: boolean;
    startDate: string;
    endDate: string;
  }>;
}
