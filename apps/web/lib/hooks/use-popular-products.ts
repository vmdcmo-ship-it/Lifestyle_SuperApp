'use client';

import { useState, useEffect } from 'react';
import { generateMockProducts } from '../mock/data-generator';

interface UsePopularProductsReturn {
  products: any[];
  isLoading: boolean;
  error: Error | null;
}

/**
 * Hook to fetch popular products for homepage display.
 * TODO: Integrate with real API when /products/popular endpoint is available
 */
export const usePopularProducts = (limit: number = 8): UsePopularProductsReturn => {
  const [products, setProducts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    try {
      const mock = generateMockProducts(limit);
      setProducts(
        mock.map((p) => ({
          ...p,
          slug: p.slug || `product-${p.id}`,
          images: p.images || [{ url: '', alt: p.name }],
        })),
      );
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to load products'));
    } finally {
      setIsLoading(false);
    }
  }, [limit]);

  return { products, isLoading, error };
};
