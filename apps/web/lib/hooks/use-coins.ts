'use client';

import { useState, useEffect } from 'react';
import { loyaltyService } from '../services/loyalty.service';

interface UseCoinsReturn {
  balance: number;
  isLoading: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
}

export const useCoins = (): UseCoinsReturn => {
  const [balance, setBalance] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchBalance = async (): Promise<void> => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await loyaltyService.getXuBalance();
      setBalance(data?.balance || data?.xu || 0);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch coin balance'));
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchBalance();
  }, []);

  return { balance, isLoading, error, refetch: fetchBalance };
};
