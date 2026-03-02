/**
 * Initialized API Client instance
 * Singleton pattern for consistent client across the app
 */

'use client';

import { createApiClient } from '@lifestyle/api-client';
import { API_CONFIG } from '../config/api';

/**
 * Global API client instance
 */
export const apiClient = createApiClient(API_CONFIG);

/**
 * Initialize auth token from storage
 */
if (typeof window !== 'undefined') {
  const accessToken = localStorage.getItem('accessToken');
  if (accessToken) {
    apiClient.setAccessToken(accessToken);
  }
}

/**
 * Helper to save tokens
 */
export const saveAuthTokens = (accessToken: string, refreshToken: string): void => {
  if (typeof window !== 'undefined') {
    localStorage.setItem('accessToken', accessToken);
    localStorage.setItem('refreshToken', refreshToken);
    apiClient.setAccessToken(accessToken);
  }
};

/**
 * Helper to clear tokens
 */
export const clearAuthTokens = (): void => {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    apiClient.clearAccessToken();
  }
};
