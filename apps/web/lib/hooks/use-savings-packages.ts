'use client';

import { useState, useEffect } from 'react';
import { insuranceService } from '../services/insurance.service';

interface UseSavingsPackagesReturn {
  packages: any[];
  isLoading: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
}

export const useSavingsPackages = (params?: {
  page?: number;
  limit?: number;
  type?: string;
}): UseSavingsPackagesReturn => {
  const [packages, setPackages] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchPackages = async (): Promise<void> => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await insuranceService.listProducts(params);
      setPackages(response?.data || []);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch packages'));
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPackages();
  }, [JSON.stringify(params)]);

  return { packages, isLoading, error, refetch: fetchPackages };
};
