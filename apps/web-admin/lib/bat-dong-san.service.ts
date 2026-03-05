/**
 * Service quản trị Bất động sản - gọi main-api
 * Backend: /api/v1/bat-dong-san/* (khi main-api triển khai)
 */

import { api } from './api/api';
import { API_ENDPOINTS } from './config/api';

export const BDS_LEAD_STATUSES = ['PENDING', 'CONTACTED', 'DONE'] as const;
export type BdsLeadStatus = (typeof BDS_LEAD_STATUSES)[number];

export interface BdsFindRequest {
  id: string;
  fullName: string;
  phone: string;
  email?: string;
  type: 'mua' | 'thue' | 'ca-hai';
  location?: string;
  note?: string;
  source?: string;
  status?: string;
  createdAt: string;
}

export interface BdsArticle {
  id: string;
  slug: string;
  title: string;
  excerpt?: string;
  content?: string;
  featuredImage?: string;
  publishedAt?: string;
  tags?: string[];
  createdAt?: string;
}

export interface BdsRentalListing {
  id: string;
  title: string;
  propertyType: string;
  location: string;
  district?: string;
  price?: number;
  area?: number;
  description?: string;
  contactPhone?: string;
  status?: string;
  createdAt?: string;
}

function isBackendUnavailable(err: unknown): boolean {
  const msg = String(err instanceof Error ? err.message : '');
  return (
    msg.includes('404') ||
    msg.includes('Not Found') ||
    msg.includes('ECONNREFUSED') ||
    msg.includes('fetch failed')
  );
}

export const batDongSanService = {
  /** Danh sách yêu cầu tìm BDS */
  async listFindRequests(params?: {
    page?: number;
    limit?: number;
    status?: string;
    dateFrom?: string;
    dateTo?: string;
  }) {
    try {
      return await api.get<{
        data: BdsFindRequest[];
        pagination: { page: number; limit: number; total: number; totalPages: number };
      }>(API_ENDPOINTS.BDS.LEADS, params as Record<string, unknown>);
    } catch (e) {
      if (isBackendUnavailable(e)) {
        return { data: [], pagination: { page: 1, limit: 20, total: 0, totalPages: 1 } };
      }
      throw e;
    }
  },

  async getFindRequestById(id: string) {
    return api.get<BdsFindRequest>(API_ENDPOINTS.BDS.LEAD_BY_ID(id));
  },

  async updateFindRequestStatus(id: string, status: BdsLeadStatus) {
    return api.patch<BdsFindRequest>(API_ENDPOINTS.BDS.UPDATE_LEAD(id), { status });
  },

  /** Danh sách tin bài viết */
  async listArticles(params?: { page?: number; limit?: number; tag?: string }) {
    try {
      return await api.get<{
        data: BdsArticle[];
        pagination?: { page: number; limit: number; total: number; totalPages: number };
      }>(API_ENDPOINTS.BDS.ARTICLES, params as Record<string, unknown>);
    } catch (e) {
      if (isBackendUnavailable(e)) {
        return { data: [], pagination: { page: 1, limit: 20, total: 0, totalPages: 1 } };
      }
      throw e;
    }
  },

  async getArticleById(id: string) {
    return api.get<BdsArticle>(API_ENDPOINTS.BDS.ARTICLE_BY_ID(id));
  },

  async createArticle(body: Partial<BdsArticle>) {
    return api.post<BdsArticle>(API_ENDPOINTS.BDS.ARTICLES, body);
  },

  async updateArticle(id: string, body: Partial<BdsArticle>) {
    return api.patch<BdsArticle>(API_ENDPOINTS.BDS.ARTICLE_BY_ID(id), body);
  },

  async deleteArticle(id: string) {
    return api.del(API_ENDPOINTS.BDS.ARTICLE_BY_ID(id));
  },

  /** Danh sách tin cho thuê */
  async listRentalListings(params?: { page?: number; limit?: number; district?: string }) {
    try {
      return await api.get<{
        data: BdsRentalListing[];
        total?: number;
        pagination?: { page: number; limit: number; total: number; totalPages: number };
      }>(API_ENDPOINTS.BDS.RENTAL_LISTINGS, params as Record<string, unknown>);
    } catch (e) {
      if (isBackendUnavailable(e)) {
        return { data: [], total: 0, pagination: { page: 1, limit: 20, total: 0, totalPages: 1 } };
      }
      throw e;
    }
  },

  async getRentalListingById(id: string) {
    return api.get<BdsRentalListing>(API_ENDPOINTS.BDS.RENTAL_BY_ID(id));
  },

  async updateRentalListingStatus(id: string, status: string) {
    return api.patch<BdsRentalListing>(API_ENDPOINTS.BDS.RENTAL_BY_ID(id), { status });
  },

  async deleteRentalListing(id: string) {
    return api.del(API_ENDPOINTS.BDS.RENTAL_BY_ID(id));
  },
};
