'use client';

import { useState, useEffect } from 'react';
import { loyaltyService } from '../services/loyalty.service';
import { MembershipTier } from '@lifestyle/types';

interface CoinBalance {
  totalCoins: number;
  membershipTier: MembershipTier;
  lifetimeEarned: number;
  lifetimeSpent: number;
}

export const useCoinBalance = () => {
  const [balance, setBalance] = useState<CoinBalance | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loyaltyService
      .getXuBalance()
      .then((data: any) => {
        setBalance({
          totalCoins: data?.balance ?? data?.xu ?? 0,
          membershipTier: data?.tier ?? MembershipTier.BRONZE,
          lifetimeEarned: data?.lifetimeEarned ?? 0,
          lifetimeSpent: data?.lifetimeSpent ?? 0,
        });
      })
      .catch(() => setBalance(null))
      .finally(() => setIsLoading(false));
  }, []);

  return { balance, isLoading };
};
