import { api } from './api/api';
import { API_ENDPOINTS } from './config/api';

export type FranchiseStatus = 'ACTIVE' | 'INACTIVE' | 'PENDING';
export type RegionServiceType = 'TRANSPORT' | 'FOOD' | 'GROCERY';

export interface FranchiseRegion {
  id: string;
  franchise_partner_id: string;
  region_id: string;
  service_type: RegionServiceType;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  region?: { id: string; code: string; name: string };
}

export interface FranchisePartner {
  id: string;
  code: string;
  name: string;
  contact_email: string | null;
  contact_phone: string | null;
  status: FranchiseStatus;
  contract_signed_at: string | null;
  contract_expires_at: string | null;
  metadata?: Record<string, unknown>;
  created_at: string;
  updated_at: string;
  regions?: FranchiseRegion[];
}

export interface FranchiseListResponse {
  items: FranchisePartner[];
  pagination: { page: number; limit: number; total: number; totalPages: number };
}

export const franchiseService = {
  async listPartners(params?: {
    page?: number;
    limit?: number;
    status?: FranchiseStatus;
  }): Promise<FranchiseListResponse> {
    const q: Record<string, unknown> = {};
    if (params?.page) q.page = params.page;
    if (params?.limit) q.limit = params.limit;
    if (params?.status) q.status = params.status;
    return api.get<FranchiseListResponse>(API_ENDPOINTS.FRANCHISE.PARTNERS, q);
  },

  async getPartnerById(id: string): Promise<FranchisePartner> {
    return api.get<FranchisePartner>(API_ENDPOINTS.FRANCHISE.PARTNER_BY_ID(id));
  },

  async createPartner(body: {
    code: string;
    name: string;
    contactEmail?: string;
    contactPhone?: string;
    status?: FranchiseStatus;
    contractSignedAt?: string;
    contractExpiresAt?: string;
  }): Promise<FranchisePartner> {
    const payload: Record<string, unknown> = {
      code: body.code,
      name: body.name,
    };
    if (body.contactEmail) payload.contactEmail = body.contactEmail;
    if (body.contactPhone) payload.contactPhone = body.contactPhone;
    if (body.status) payload.status = body.status;
    if (body.contractSignedAt) payload.contractSignedAt = body.contractSignedAt;
    if (body.contractExpiresAt) payload.contractExpiresAt = body.contractExpiresAt;
    return api.post<FranchisePartner>(API_ENDPOINTS.FRANCHISE.PARTNERS, payload);
  },

  async updatePartner(
    id: string,
    body: Partial<{
      code: string;
      name: string;
      contactEmail: string;
      contactPhone: string;
      status: FranchiseStatus;
      contractSignedAt: string;
      contractExpiresAt: string;
    }>,
  ): Promise<FranchisePartner> {
    return api.patch<FranchisePartner>(API_ENDPOINTS.FRANCHISE.PARTNER_BY_ID(id), body);
  },

  async getPartnerRegions(partnerId: string): Promise<FranchiseRegion[]> {
    return api.get<FranchiseRegion[]>(API_ENDPOINTS.FRANCHISE.PARTNER_REGIONS(partnerId));
  },

  async assignRegion(
    partnerId: string,
    body: {
      regionId: string;
      serviceType: RegionServiceType;
      isActive?: boolean;
    },
  ): Promise<FranchiseRegion> {
    return api.post<FranchiseRegion>(API_ENDPOINTS.FRANCHISE.ASSIGN_REGION(partnerId), body);
  },
};
