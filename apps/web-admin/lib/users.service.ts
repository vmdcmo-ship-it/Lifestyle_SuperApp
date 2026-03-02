import { api } from './api/api';
import { API_ENDPOINTS } from './config/api';

export interface UserStats {
  totalUsers: number;
  activeUsers: number;
  inactiveUsers: number;
  drivers: number;
  merchants: number;
}

export interface UserListItem {
  id: string;
  email: string;
  phoneNumber?: string | null;
  firstName?: string | null;
  lastName?: string | null;
  displayName?: string | null;
  role: string;
  isActive: boolean;
  xuBalance?: number;
  createdAt: string;
  lastLoginAt?: string | null;
}

export interface UsersListResponse {
  data: UserListItem[];
  meta: { total: number; page: number; limit: number; totalPages: number };
}

export const usersService = {
  async stats(): Promise<UserStats> {
    return api.get<UserStats>(API_ENDPOINTS.USERS.STATS);
  },

  async list(params?: {
    page?: number;
    limit?: number;
    search?: string;
    role?: string;
    isActive?: boolean;
  }): Promise<UsersListResponse> {
    return api.get<UsersListResponse>(API_ENDPOINTS.USERS.LIST, params as Record<string, unknown>);
  },

  async getById(id: string): Promise<UserListItem & Record<string, unknown>> {
    return api.get(API_ENDPOINTS.USERS.BY_ID(id));
  },

  async delete(id: string): Promise<{ message: string }> {
    return api.del(API_ENDPOINTS.USERS.DELETE(id));
  },
};
