import { api } from '../api/api';
import { API_ENDPOINTS } from '../config/api';

export interface ContentBySlugResponse {
  id: string;
  slug: string;
  locale: string;
  title: string;
  content: string;
  version: number;
  effectiveFrom: string;
  effectiveTo: string | null;
}

export const contentService = {
  /**
   * Lấy văn bản theo slug (public, không cần auth).
   * Dùng cho Điều khoản, Chính sách bảo mật, FAQ...
   */
  async getBySlug(
    slug: string,
    locale = 'vi'
  ): Promise<ContentBySlugResponse> {
    return api.get<ContentBySlugResponse>(API_ENDPOINTS.CONTENT.BY_SLUG(slug), {
      locale,
    });
  },
};
