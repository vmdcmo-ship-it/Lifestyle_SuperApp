import { api } from './api/api';
import { API_ENDPOINTS } from './config/api';

export interface FareConfigItem {
  id: string;
  vehicleType: string;
  baseFare: number;
  perKm: number;
  perMin: number;
  minFare: number;
  isActive: boolean;
  effectiveFrom: string;
  createdAt: string;
}

export interface CreateFarePayload {
  vehicleType: string;
  baseFare: number;
  perKm: number;
  perMin: number;
  minFare: number;
  isActive?: boolean;
}

export interface UpdateFarePayload {
  baseFare?: number;
  perKm?: number;
  perMin?: number;
  minFare?: number;
  isActive?: boolean;
}

export const pricingService = {
  async list(): Promise<FareConfigItem[]> {
    return api.get<FareConfigItem[]>(API_ENDPOINTS.PRICING.FARE_CONFIG);
  },

  async create(payload: CreateFarePayload) {
    return api.post(API_ENDPOINTS.PRICING.FARE_CONFIG, payload);
  },

  async update(vehicleType: string, payload: UpdateFarePayload) {
    return api.patch(API_ENDPOINTS.PRICING.FARE_UPDATE(vehicleType), payload);
  },
};
