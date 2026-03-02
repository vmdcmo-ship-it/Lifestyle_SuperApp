'use client';

import { useState, useEffect } from 'react';
import { loyaltyService } from '../services/loyalty.service';

export function useXuBalance(isAuthenticated: boolean): number {
  const [balance, setBalance] = useState(0);

  useEffect(() => {
    if (!isAuthenticated) {
      setBalance(0);
      return;
    }
    loyaltyService
      .getXuBalance()
      .then((r) => setBalance(r.xuBalance))
      .catch(() => setBalance(0));
  }, [isAuthenticated]);

  return balance;
}
