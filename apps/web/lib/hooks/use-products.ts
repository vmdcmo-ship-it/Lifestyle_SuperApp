'use client';

import { useState, useEffect } from 'react';
import { merchantsService } from '../services/merchants.service';

interface UseProductsReturn {
  products: any[];
  isLoading: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
}

export const useProducts = (
  merchantId: string,
  params?: { page?: number; limit?: number; categoryId?: string; search?: string },
): UseProductsReturn => {
  const [products, setProducts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchProducts = async (): Promise<void> => {
    if (!merchantId) return;
    try {
      setIsLoading(true);
      setError(null);
      const response = await merchantsService.getProducts(merchantId, params);
      setProducts(response?.data || []);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch products'));
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [merchantId, JSON.stringify(params)]);

  return { products, isLoading, error, refetch: fetchProducts };
};
