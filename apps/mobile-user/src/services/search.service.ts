import { api } from './api';

export const searchService = {
  search: (params: { q: string; type?: 'all' | 'merchants' | 'products'; city?: string; page?: number; limit?: number }) =>
    api.get('/search', params),
  nearby: (params: { lat: number; lng: number; radius?: number; type?: string }) =>
    api.get('/search/nearby', params),
};
