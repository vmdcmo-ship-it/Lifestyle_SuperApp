import { api } from './api/api';
import { API_ENDPOINTS } from './config/api';

export type RegionLevel = 'PROVINCE' | 'DISTRICT' | 'AREA';
export type RegionServiceType = 'TRANSPORT' | 'FOOD' | 'GROCERY';

export interface RegionItem {
  id: string;
  code: string;
  name: string;
  level: RegionLevel;
  parent_id: string | null;
  province: string | null;
  city: string | null;
  district: string | null;
  is_active: boolean;
  metadata?: Record<string, unknown>;
  created_at: string;
  updated_at: string;
  parent?: RegionItem | null;
  services?: RegionServiceConfig[];
}

export interface RegionServiceConfig {
  id: string;
  region_id: string;
  service_type: RegionServiceType;
  is_active: boolean;
  effective_from: string;
  effective_to: string | null;
  created_at: string;
  updated_at: string;
}

export interface RegionsListResponse {
  items: RegionItem[];
  pagination: { page: number; limit: number; total: number; totalPages: number };
}

export const regionsService = {
  async list(params?: {
    page?: number;
    limit?: number;
    level?: RegionLevel;
    parentId?: string | null;
    isActive?: boolean;
  }): Promise<RegionsListResponse> {
    const q: Record<string, unknown> = {};
    if (params?.page) q.page = params.page;
    if (params?.limit) q.limit = params.limit;
    if (params?.level) q.level = params.level;
    if (params?.parentId !== undefined) q.parentId = params.parentId;
    if (params?.isActive !== undefined) q.isActive = params.isActive;
    return api.get<RegionsListResponse>(API_ENDPOINTS.REGIONS.LIST, q);
  },

  async getById(id: string): Promise<RegionItem> {
    return api.get<RegionItem>(API_ENDPOINTS.REGIONS.BY_ID(id));
  },

  async create(body: {
    code: string;
    name: string;
    level: RegionLevel;
    parentId?: string;
    province?: string;
    city?: string;
    district?: string;
    isActive?: boolean;
  }): Promise<RegionItem> {
    return api.post<RegionItem>(API_ENDPOINTS.REGIONS.LIST, body);
  },

  async update(
    id: string,
    body: Partial<{
      code: string;
      name: string;
      level: RegionLevel;
      parentId?: string | null;
      province?: string;
      city?: string;
      district?: string;
      isActive: boolean;
    }>,
  ): Promise<RegionItem> {
    return api.patch<RegionItem>(API_ENDPOINTS.REGIONS.BY_ID(id), body);
  },

  async getServices(regionId: string): Promise<RegionServiceConfig[]> {
    return api.get<RegionServiceConfig[]>(API_ENDPOINTS.REGIONS.SERVICES(regionId));
  },

  async assignService(
    regionId: string,
    body: {
      serviceType: RegionServiceType;
      isActive?: boolean;
      effectiveFrom?: string;
      effectiveTo?: string | null;
    },
  ): Promise<RegionServiceConfig> {
    return api.post<RegionServiceConfig>(API_ENDPOINTS.REGIONS.ASSIGN_SERVICE(regionId), body);
  },
};
