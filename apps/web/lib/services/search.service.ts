import { api } from '../api/api';
import { API_ENDPOINTS } from '../config/api';

export const searchService = {
  search: (params: {
    q: string; type?: 'all' | 'merchants' | 'products';
    city?: string; lat?: number; lng?: number; page?: number; limit?: number;
  }) => api.get<any>(API_ENDPOINTS.SEARCH.QUERY, params),

  nearby: (params: { lat: number; lng: number; radius?: number; type?: string }) =>
    api.get<any>(API_ENDPOINTS.SEARCH.NEARBY, params),
};
