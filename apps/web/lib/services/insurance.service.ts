import { api } from '../api/api';
import { API_ENDPOINTS } from '../config/api';

export const insuranceService = {
  listProducts: (params?: { page?: number; limit?: number; type?: string }) =>
    api.get<any>(API_ENDPOINTS.INSURANCE.PRODUCTS, params),

  getProduct: (id: string) => api.get<any>(API_ENDPOINTS.INSURANCE.PRODUCT(id)),

  purchasePolicy: (data: {
    productId: string; startDate: string; paymentPeriod: 'monthly' | 'yearly';
    beneficiaryName?: string; beneficiaryPhone?: string;
  }) => api.post<any>(API_ENDPOINTS.INSURANCE.POLICIES, data),

  getMyPolicies: (params?: { page?: number; limit?: number; status?: string }) =>
    api.get<any>(API_ENDPOINTS.INSURANCE.POLICIES, params),

  getPolicyDetail: (id: string) => api.get<any>(API_ENDPOINTS.INSURANCE.POLICY(id)),

  fileClaim: (data: {
    policyId: string; claimAmount: number; reason: string;
    description?: string; documents?: string[];
  }) => api.post<any>(API_ENDPOINTS.INSURANCE.CLAIMS, data),

  getMyClaims: () => api.get<any>(API_ENDPOINTS.INSURANCE.CLAIMS),
};
