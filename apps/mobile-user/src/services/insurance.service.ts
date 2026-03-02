import { api } from './api';

export const insuranceService = {
  listProducts: (params?: { page?: number; limit?: number; type?: string }) =>
    api.get('/insurance/products', params),
  getProduct: (id: string) => api.get(`/insurance/products/${id}`),
  purchasePolicy: (data: {
    productId: string; startDate: string; paymentPeriod: 'monthly' | 'yearly';
    beneficiaryName?: string; beneficiaryPhone?: string;
  }) => api.post('/insurance/policies', data),
  getMyPolicies: (params?: { page?: number; limit?: number; status?: string }) =>
    api.get('/insurance/policies', params),
  getPolicyDetail: (id: string) => api.get(`/insurance/policies/${id}`),
  fileClaim: (data: {
    policyId: string; claimAmount: number; reason: string;
    description?: string; documents?: string[];
  }) => api.post('/insurance/claims', data),
  getMyClaims: () => api.get('/insurance/claims'),
};
