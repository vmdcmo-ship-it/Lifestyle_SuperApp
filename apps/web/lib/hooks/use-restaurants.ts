'use client';

import { useState, useEffect } from 'react';
import { merchantsService } from '../services/merchants.service';

interface UseRestaurantsReturn {
  restaurants: any[];
  isLoading: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
}

export const useRestaurants = (params?: {
  page?: number;
  limit?: number;
  city?: string;
  search?: string;
}): UseRestaurantsReturn => {
  const [restaurants, setRestaurants] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchRestaurants = async (): Promise<void> => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await merchantsService.list({ ...params, type: 'RESTAURANT' });
      setRestaurants(response?.data || []);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch restaurants'));
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchRestaurants();
  }, [JSON.stringify(params)]);

  return { restaurants, isLoading, error, refetch: fetchRestaurants };
};
