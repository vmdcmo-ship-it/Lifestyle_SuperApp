import { api } from './api/api';
import { API_ENDPOINTS } from './config/api';

export interface NewsArticle {
  id: string;
  slug: string;
  title: string;
  excerpt: string | null;
  content: string;
  featuredImage: string | null;
  seoTitle: string | null;
  seoDescription: string | null;
  targetApps: string | null;
  isPublished: boolean;
  publishedAt: string | null;
  locale: string;
  author: string | null;
  createdAt: string;
  updatedAt: string;
}

export const newsService = {
  async list(params?: { page?: number; limit?: number; isPublished?: boolean }) {
    return api.get<{ data: NewsArticle[]; pagination: Record<string, number> }>(
      API_ENDPOINTS.NEWS.LIST,
      params,
    );
  },

  async create(data: {
    slug: string;
    title: string;
    excerpt?: string;
    content: string;
    featuredImage?: string;
    seoTitle?: string;
    seoDescription?: string;
    targetApps?: string;
    isPublished?: boolean;
    locale?: string;
    author?: string;
  }) {
    return api.post<NewsArticle>(API_ENDPOINTS.NEWS.CREATE, data);
  },

  async getById(id: string) {
    return api.get<NewsArticle>(API_ENDPOINTS.NEWS.BY_ID(id));
  },

  async update(id: string, data: Partial<NewsArticle>) {
    return api.patch<NewsArticle>(API_ENDPOINTS.NEWS.UPDATE(id), data);
  },
};
