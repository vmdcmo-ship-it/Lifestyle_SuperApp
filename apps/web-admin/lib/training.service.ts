import { api } from './api/api';
import { API_ENDPOINTS } from './config/api';

export interface TrainingCategory {
  id: string;
  slug: string;
  name: string;
  description: string | null;
  sortOrder: number;
  isActive: boolean;
  _count?: { materials: number };
}

export interface TrainingMaterial {
  id: string;
  categoryId: string;
  slug: string;
  title: string;
  materialType: string;
  targetApps: string | null;
  sortOrder: number;
  isPublished: boolean;
  publishedAt: string | null;
  category?: { id: string; slug: string; name: string };
}

export const trainingService = {
  async listCategories(isActive?: boolean): Promise<TrainingCategory[]> {
    const params = isActive !== undefined ? { isActive: String(isActive) } : {};
    const res = await api.get<TrainingCategory[]>(API_ENDPOINTS.TRAINING.CATEGORIES, params);
    return Array.isArray(res) ? res : [];
  },

  async createCategory(data: {
    slug: string;
    name: string;
    description?: string;
    sortOrder?: number;
    isActive?: boolean;
  }): Promise<TrainingCategory> {
    return api.post<TrainingCategory>(API_ENDPOINTS.TRAINING.CATEGORIES, data);
  },

  async getCategoryById(id: string) {
    return api.get(API_ENDPOINTS.TRAINING.CATEGORY_BY_ID(id));
  },

  async updateCategory(id: string, data: Partial<TrainingCategory>) {
    return api.patch(API_ENDPOINTS.TRAINING.CATEGORY_BY_ID(id), data);
  },

  async listMaterials(params?: {
    categoryId?: string;
    materialType?: string;
    page?: number;
    limit?: number;
  }) {
    return api.get<{ data: TrainingMaterial[]; pagination: Record<string, number> }>(
      API_ENDPOINTS.TRAINING.MATERIALS,
      params,
    );
  },

  async createMaterial(data: {
    categoryId: string;
    slug: string;
    title: string;
    content: string;
    materialType: string;
    targetApps?: string;
    sortOrder?: number;
    isPublished?: boolean;
    locale?: string;
  }) {
    return api.post(API_ENDPOINTS.TRAINING.MATERIALS, data);
  },

  async getMaterialById(id: string) {
    return api.get(API_ENDPOINTS.TRAINING.MATERIAL_BY_ID(id));
  },

  async updateMaterial(id: string, data: Partial<TrainingMaterial> & { content?: string }) {
    return api.patch(API_ENDPOINTS.TRAINING.MATERIAL_BY_ID(id), data);
  },
};
