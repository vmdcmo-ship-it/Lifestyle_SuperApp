'use client';

import { useState, useEffect } from 'react';
import { merchantsService } from '../services/merchants.service';

interface UseFoodItemsReturn {
  items: any[];
  isLoading: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
}

export const useFoodItems = (merchantId: string): UseFoodItemsReturn => {
  const [items, setItems] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchItems = async (): Promise<void> => {
    if (!merchantId) return;
    try {
      setIsLoading(true);
      setError(null);
      const response = await merchantsService.getProducts(merchantId);
      setItems(response?.data || []);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch food items'));
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchItems();
  }, [merchantId]);

  return { items, isLoading, error, refetch: fetchItems };
};
