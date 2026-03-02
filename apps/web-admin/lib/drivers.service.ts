import { api } from './api/api';
import { API_ENDPOINTS } from './config/api';

export interface DriverUser {
  firstName?: string;
  lastName?: string;
  email?: string;
  avatar_url?: string | null;
}

export interface DriverListItem {
  id: string;
  driverNumber: string;
  userId: string;
  status: string;
  onlineStatus: string;
  rating: number;
  totalRatings?: number;
  totalTrips?: number;
  totalEarnings?: number;
  acceptanceRate?: number;
  onboardingCompleted?: boolean;
  createdAt: string;
  user?: DriverUser;
}

export interface DriversListResponse {
  data: DriverListItem[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface DriverStats {
  total: number;
  active: number;
  pending: number;
  online: number;
  averageAcceptanceRate?: number | null;
  averageRating?: number | null;
  totalDriverEarnings?: number;
  todayEarnings?: number;
  weekEarnings?: number;
}

export interface DriverDetail extends DriverListItem {
  rejectionReason?: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  avatar_url?: string | null;
  phoneNumber?: string | null;
  vehicleType?: string | null;
  vehiclePlate?: string | null;
  identity?: {
    verificationStatus?: string;
    citizenId?: string;
    driverLicenseClass?: string;
    driverLicenseExpiry?: string;
    citizenIdFrontImage?: string;
    citizenIdBackImage?: string;
    faceImage?: string;
    driverLicenseImage?: string;
    criminalRecordImage?: string;
  } | null;
  vehicles?: Array<{
    id: string;
    vehicleType?: string;
    licensePlate?: string;
    brand?: string;
    model?: string;
  }>;
}

export const driversService = {
  async list(params: {
    page?: number;
    limit?: number;
    status?: string;
  }): Promise<DriversListResponse> {
    return api.get<DriversListResponse>(API_ENDPOINTS.DRIVERS.LIST, params);
  },

  async getById(id: string): Promise<DriverDetail> {
    return api.get<DriverDetail>(API_ENDPOINTS.DRIVERS.BY_ID(id));
  },

  async stats(): Promise<DriverStats> {
    return api.get<DriverStats>(API_ENDPOINTS.DRIVERS.STATS);
  },

  async verify(
    id: string,
    action: 'APPROVED' | 'REJECTED',
    rejectionReason?: string,
  ): Promise<DriverDetail> {
    return api.patch<DriverDetail>(API_ENDPOINTS.DRIVERS.VERIFY(id), {
      action,
      rejectionReason: action === 'REJECTED' ? rejectionReason : undefined,
    });
  },
};
