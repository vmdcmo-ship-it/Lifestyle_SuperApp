'use client';

import { useRestaurants } from './use-restaurants';

interface UsePopularRestaurantsReturn {
  restaurants: any[];
  isLoading: boolean;
  error: Error | null;
}

/**
 * Hook to fetch popular restaurants for homepage display
 */
export const usePopularRestaurants = (limit: number = 8): UsePopularRestaurantsReturn => {
  const { restaurants, isLoading, error } = useRestaurants({ limit, type: 'RESTAURANT' });
  return {
    restaurants: restaurants.slice(0, limit),
    isLoading,
    error,
  };
};
