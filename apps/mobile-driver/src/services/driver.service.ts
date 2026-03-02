import { api } from './api';

export const driverService = {
  getProfile: () => api.get<any>('/drivers/profile'),
  getDashboard: () => api.get<any>('/drivers/dashboard'),
  getStats: () => api.get<any>('/drivers/stats'),

  register: (data: {
    vehicleType: string;
    vehiclePlate: string;
    licenseNumber: string;
  }) => api.post<any>('/drivers/register', data),

  updateProfile: (data: any) => api.patch<any>('/drivers/profile', data),

  updateIdentity: (data: {
    citizenIdFrontImage?: string;
    citizenIdBackImage?: string;
    faceImage?: string;
    driverLicenseImage?: string;
    criminalRecordImage?: string;
  }) => api.patch<any>('/drivers/identity', data),

  updateVehicleDocuments: (
    vehicleId: string,
    data: {
      frontImage?: string;
      backImage?: string;
      leftImage?: string;
      rightImage?: string;
      plateCloseupImage?: string;
      registrationImage?: string;
      insuranceImage?: string;
      insuranceNumber?: string;
      insuranceExpiry?: string;
    },
  ) => api.patch<any>(`/drivers/vehicles/${vehicleId}`, data),

  updateLocation: (lat: number, lng: number) =>
    api.post<any>('/booking/driver/location', { latitude: lat, longitude: lng }),

  updateStatus: (status: 'ONLINE' | 'OFFLINE' | 'BUSY') =>
    api.patch<any>('/booking/driver/status', { status }, { skipClearTokenOn401: true }),

  getVehicles: () => api.get<any>('/drivers/vehicles'),
  addVehicle: (data: any) => api.post<any>('/drivers/vehicles', data),

  getOrderReceivingSettings: () => api.get<any>('/drivers/settings/order-receiving'),
  updateOrderReceivingSettings: (data: {
    cashOnHand?: number;
    enabledServices?: Record<string, boolean>;
    autoAcceptEnabled?: boolean;
    autoAcceptMaxDistanceKm?: number;
    autoAcceptMinAmount?: number;
    maxBatchOrders?: number;
  }) => api.patch<any>('/drivers/settings/order-receiving', data),
  declareCash: (amount: number) => api.post<any>('/drivers/cash/declare', { amount }),
};
