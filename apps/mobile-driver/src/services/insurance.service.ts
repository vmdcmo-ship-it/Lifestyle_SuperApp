import { api } from './api';

/** Service bảo hiểm - đồng bộ với App User, dùng chung API /insurance/* */
export const insuranceService = {
  listProducts: (params?: { page?: number; limit?: number; type?: string }) =>
    api.get<any>('/insurance/products', params),

  getProduct: (id: string) => api.get<any>(`/insurance/products/${id}`),

  purchasePolicy: (data: {
    productId: string;
    startDate: string;
    paymentPeriod: 'monthly' | 'yearly';
    beneficiaryName?: string;
    beneficiaryPhone?: string;
  }) => api.post<any>('/insurance/policies', data),

  getMyPolicies: (params?: { page?: number; limit?: number; status?: string }) =>
    api.get<any>('/insurance/policies', params),

  getPolicyDetail: (id: string) => api.get<any>(`/insurance/policies/${id}`),

  fileClaim: (data: {
    policyId: string;
    claimAmount: number;
    reason: string;
    description?: string;
    documents?: string[];
  }) => api.post<any>('/insurance/claims', data),

  getMyClaims: () => api.get<any>('/insurance/claims'),
};
