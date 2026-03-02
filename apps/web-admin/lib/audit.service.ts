import { api } from './api/api';
import { API_ENDPOINTS } from './config/api';

export interface AuditLogItem {
  id: string;
  userId: string;
  userEmail: string;
  action: string;
  resource: string;
  resourceId: string | null;
  details: unknown;
  ipAddress: string | null;
  userAgent: string | null;
  createdAt: string;
}

export interface AuditLogsListResponse {
  data: AuditLogItem[];
  pagination: { page: number; limit: number; total: number; totalPages: number };
}

export const auditService = {
  async list(params?: {
    page?: number;
    limit?: number;
    userId?: string;
    action?: string;
    resource?: string;
    fromDate?: string;
    toDate?: string;
  }): Promise<AuditLogsListResponse> {
    return api.get<AuditLogsListResponse>(
      API_ENDPOINTS.AUDIT.LOGS,
      params as Record<string, unknown>,
    );
  },
};
