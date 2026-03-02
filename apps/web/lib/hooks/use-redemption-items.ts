'use client';

import { useState, useEffect } from 'react';
import { loyaltyService } from '../services/loyalty.service';

export const usePopularRedemptionItems = (limit: number = 8) => {
  const [items, setItems] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loyaltyService
      .getRewards({ limit })
      .then((data: any) => setItems(data?.data ?? data ?? []))
      .catch(() => setItems([]))
      .finally(() => setIsLoading(false));
  }, [limit]);

  return { items, isLoading };
};
