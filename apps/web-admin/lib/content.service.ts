import { api } from './api/api';
import { API_ENDPOINTS } from './config/api';

export interface ContentListItem {
  id: string;
  slug: string;
  locale: string;
  title: string;
  version: number;
  effectiveFrom: string;
  effectiveTo: string | null;
  isActive: boolean;
  targetApps: string | null;
  createdAt: string;
}

export interface ContentListResponse {
  data: ContentListItem[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface ContentDetail extends ContentListItem {
  content: string;
  updatedAt: string;
}

export interface CreateContentPayload {
  slug: string;
  locale?: string;
  title: string;
  content: string;
  effectiveFrom: string;
  effectiveTo?: string;
  isActive?: boolean;
  targetApps?: string;
}

export interface UpdateContentPayload {
  title?: string;
  content?: string;
  effectiveFrom?: string;
  effectiveTo?: string;
  isActive?: boolean;
  targetApps?: string;
}

export const contentService = {
  async list(params: {
    page?: number;
    limit?: number;
    slug?: string;
    locale?: string;
  }): Promise<ContentListResponse> {
    return api.get<ContentListResponse>(API_ENDPOINTS.CONTENT.LIST, params);
  },

  async getById(id: string): Promise<ContentDetail> {
    return api.get<ContentDetail>(API_ENDPOINTS.CONTENT.BY_ID(id));
  },

  async create(payload: CreateContentPayload): Promise<ContentDetail> {
    return api.post<ContentDetail>(API_ENDPOINTS.CONTENT.CREATE, payload);
  },

  async update(id: string, payload: UpdateContentPayload): Promise<ContentDetail> {
    return api.patch<ContentDetail>(API_ENDPOINTS.CONTENT.UPDATE(id), payload);
  },
};
