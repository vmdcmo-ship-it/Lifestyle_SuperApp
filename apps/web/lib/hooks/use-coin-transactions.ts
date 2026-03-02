'use client';

import { useState, useEffect } from 'react';
import { loyaltyService } from '../services/loyalty.service';

export const useCoinTransactions = (params?: { limit?: number }) => {
  const [transactions, setTransactions] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loyaltyService
      .getXuHistory(params)
      .then((data: any) => setTransactions(data?.data ?? data ?? []))
      .catch(() => setTransactions([]))
      .finally(() => setIsLoading(false));
  }, []);

  return { transactions, isLoading };
};
