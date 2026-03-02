/**
 * API Client specific types
 */

export interface RequestConfig {
  headers?: Record<string, string>;
  params?: Record<string, unknown>;
  timeout?: number;
  signal?: AbortSignal;
}

export interface CacheConfig {
  ttl: number; // Time to live in milliseconds
  key: string;
}
