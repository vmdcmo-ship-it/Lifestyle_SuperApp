import { api } from './api/api';
import { API_ENDPOINTS } from './config/api';

export type PricingServiceType = 'TRANSPORT' | 'DELIVERY';

export interface PricingParam {
  id: string;
  vehicleType: string;
  baseFare: number;
  perKm: number;
  perMin: number;
  minFare: number;
  factors?: {
    surgeEnabled?: boolean;
    surgeMax?: number;
    weatherEnabled?: boolean;
    weatherMultiplier?: number;
    trafficEnabled?: boolean;
    trafficMultiplier?: number;
  };
  isActive: boolean;
}

export type DeliverySizeTier = 'S' | 'M' | 'L' | 'XL' | 'BULKY';

export interface DeliveryPricingParam {
  id: string;
  sizeTier: DeliverySizeTier;
  baseFee: number;
  perKg: number;
  cbmDivisor: number;
  factors?: {
    surgeEnabled?: boolean;
    surgeMax?: number;
    weatherEnabled?: boolean;
    weatherMultiplier?: number;
    trafficEnabled?: boolean;
    trafficMultiplier?: number;
  };
  isActive: boolean;
}

export interface RegionRef {
  id: string;
  code: string;
  name: string;
}

export interface PricingTable {
  id: string;
  code: string;
  name: string;
  serviceType: PricingServiceType;
  effectiveFrom: string;
  effectiveTo: string | null;
  isActive: boolean;
  regions: RegionRef[];
  params: PricingParam[];
  deliveryParams?: DeliveryPricingParam[];
  createdAt: string;
  updatedAt: string;
}

export const pricingTablesService = {
  async list(serviceType?: string): Promise<PricingTable[]> {
    return api.get<PricingTable[]>(API_ENDPOINTS.PRICING.TABLES, {
      serviceType,
    } as Record<string, unknown>);
  },

  async getById(id: string): Promise<PricingTable> {
    return api.get<PricingTable>(API_ENDPOINTS.PRICING.TABLE_BY_ID(id));
  },

  async create(body: {
    code: string;
    name: string;
    serviceType: PricingServiceType;
    regionIds: string[];
    effectiveFrom?: string;
    effectiveTo?: string;
    isActive?: boolean;
  }): Promise<PricingTable> {
    return api.post<PricingTable>(API_ENDPOINTS.PRICING.TABLES, body);
  },

  async update(
    id: string,
    body: Partial<{
      code: string;
      name: string;
      regionIds: string[];
      effectiveFrom: string;
      effectiveTo: string | null;
      isActive: boolean;
    }>,
  ): Promise<PricingTable> {
    return api.patch<PricingTable>(API_ENDPOINTS.PRICING.TABLE_BY_ID(id), body);
  },

  async addParam(
    tableId: string,
    body: {
      vehicleType: string;
      baseFare: number;
      perKm: number;
      perMin: number;
      minFare: number;
      factors?: Record<string, unknown>;
      isActive?: boolean;
    },
  ): Promise<PricingParam> {
    return api.post<PricingParam>(API_ENDPOINTS.PRICING.TABLE_PARAMS(tableId), body);
  },

  async updateParam(
    tableId: string,
    paramId: string,
    body: Partial<{
      baseFare: number;
      perKm: number;
      perMin: number;
      minFare: number;
      factors: Record<string, unknown>;
      isActive: boolean;
    }>,
  ): Promise<PricingParam> {
    return api.patch<PricingParam>(API_ENDPOINTS.PRICING.TABLE_PARAM(tableId, paramId), body);
  },

  async updateParamToggles(
    tableId: string,
    paramId: string,
    body: {
      surgeEnabled?: boolean;
      weatherEnabled?: boolean;
      trafficEnabled?: boolean;
    },
  ): Promise<{ id: string; factors: Record<string, unknown> }> {
    return api.patch(API_ENDPOINTS.PRICING.TABLE_PARAM_TOGGLES(tableId, paramId), body);
  },

  async addDeliveryParam(
    tableId: string,
    body: {
      sizeTier: DeliverySizeTier;
      baseFee: number;
      perKg: number;
      cbmDivisor?: number;
      factors?: Record<string, unknown>;
      isActive?: boolean;
    },
  ): Promise<DeliveryPricingParam> {
    return api.post<DeliveryPricingParam>(
      API_ENDPOINTS.PRICING.TABLE_DELIVERY_PARAMS(tableId),
      body,
    );
  },

  async updateDeliveryParam(
    tableId: string,
    paramId: string,
    body: Partial<{
      baseFee: number;
      perKg: number;
      cbmDivisor: number;
      factors: Record<string, unknown>;
      isActive: boolean;
    }>,
  ): Promise<DeliveryPricingParam> {
    return api.patch<DeliveryPricingParam>(
      API_ENDPOINTS.PRICING.TABLE_DELIVERY_PARAM(tableId, paramId),
      body,
    );
  },

  async updateDeliveryParamToggles(
    tableId: string,
    paramId: string,
    body: {
      surgeEnabled?: boolean;
      weatherEnabled?: boolean;
      trafficEnabled?: boolean;
    },
  ): Promise<{ id: string; factors: Record<string, unknown> }> {
    return api.patch(API_ENDPOINTS.PRICING.TABLE_DELIVERY_PARAM_TOGGLES(tableId, paramId), body);
  },
};
