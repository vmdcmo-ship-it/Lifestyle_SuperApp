'use client';

import { useState, useEffect } from 'react';
import { bookingService } from '../services/booking.service';

interface UseRideServicesReturn {
  services: any[];
  isLoading: boolean;
  error: Error | null;
}

export const useRideServices = (): UseRideServicesReturn => {
  const [services] = useState([
    { id: 'MOTORBIKE', label: 'Xe Máy', icon: '🏍️', pricePerKm: 4000 },
    { id: 'CAR_4', label: 'Ô tô 4 chỗ', icon: '🚗', pricePerKm: 8000 },
    { id: 'CAR_7', label: 'Ô tô 7 chỗ', icon: '🚐', pricePerKm: 10000 },
    { id: 'LUXURY', label: 'Premium', icon: '✨', pricePerKm: 15000 },
  ]);

  return { services, isLoading: false, error: null };
};

export const useBookingEstimate = () => {
  const [estimate, setEstimate] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);

  const getEstimate = async (data: Parameters<typeof bookingService.estimate>[0]) => {
    setIsLoading(true);
    try {
      const result = await bookingService.estimate(data);
      setEstimate(result);
      return result;
    } finally {
      setIsLoading(false);
    }
  };

  return { estimate, isLoading, getEstimate };
};
