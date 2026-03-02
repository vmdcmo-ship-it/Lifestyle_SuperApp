/**
 * API-related types and interfaces
 */

/**
 * HTTP Methods
 */
export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

/**
 * API Request Config
 */
export interface ApiRequestConfig {
  method: HttpMethod;
  url: string;
  params?: Record<string, unknown>;
  data?: unknown;
  headers?: Record<string, string>;
  timeout?: number;
  withCredentials?: boolean;
}

/**
 * API Query Params
 */
export interface ApiQueryParams {
  page?: number;
  limit?: number;
  sort?: string;
  order?: 'asc' | 'desc';
  search?: string;
  filter?: Record<string, unknown>;
}

/**
 * API endpoints configuration
 */
export interface ApiEndpoints {
  baseUrl: string;
  timeout: number;
  headers: Record<string, string>;
}
