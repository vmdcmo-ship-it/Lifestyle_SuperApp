'use client';

import { useState, useEffect } from 'react';
import { insuranceService } from '../services/insurance.service';

export const usePopularPackages = (limit: number = 8) => {
  const [packages, setPackages] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    insuranceService
      .listProducts({ limit, type: 'popular' })
      .then((data: any) => setPackages(data?.data ?? data ?? []))
      .catch(() => setPackages([]))
      .finally(() => setIsLoading(false));
  }, [limit]);

  return { packages, isLoading };
};
