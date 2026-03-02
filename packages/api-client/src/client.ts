/**
 * API Client base configuration
 * Uses axios for HTTP requests
 */

import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import type { ApiResponse, ApiError } from '@lifestyle/types';

/**
 * API Client Configuration
 */
export interface ApiClientConfig {
  baseURL: string;
  timeout?: number;
  headers?: Record<string, string>;
}

/**
 * API Client class
 * Handles all HTTP requests with interceptors for auth, errors, etc.
 */
export class ApiClient {
  private client: AxiosInstance;
  private accessToken: string | null = null;

  constructor(config: ApiClientConfig) {
    this.client = axios.create({
      baseURL: config.baseURL,
      timeout: config.timeout || 30000,
      headers: {
        'Content-Type': 'application/json',
        ...config.headers,
      },
    });

    this.setupInterceptors();
  }

  /**
   * Setup request and response interceptors
   */
  private setupInterceptors(): void {
    // Request interceptor - add auth token
    this.client.interceptors.request.use(
      (config) => {
        if (this.accessToken) {
          config.headers.Authorization = `Bearer ${this.accessToken}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    // Response interceptor - handle errors
    this.client.interceptors.response.use(
      (response) => response,
      async (error) => {
        const originalRequest = error.config;

        // Handle 401 - Unauthorized (token expired)
        if (error.response?.status === 401 && !originalRequest._retry) {
          originalRequest._retry = true;

          try {
            // Attempt to refresh token
            const newToken = await this.refreshAccessToken();
            this.setAccessToken(newToken);

            // Retry original request with new token
            originalRequest.headers.Authorization = `Bearer ${newToken}`;
            return this.client(originalRequest);
          } catch (refreshError) {
            // Refresh failed, redirect to login
            if (typeof window !== 'undefined') {
              window.location.href = '/login';
            }
            return Promise.reject(refreshError);
          }
        }

        return Promise.reject(this.normalizeError(error));
      }
    );
  }

  /**
   * Set access token for authenticated requests
   */
  public setAccessToken(token: string): void {
    this.accessToken = token;
  }

  /**
   * Clear access token
   */
  public clearAccessToken(): void {
    this.accessToken = null;
  }

  /**
   * Refresh access token
   */
  private async refreshAccessToken(): Promise<string> {
    const refreshToken = this.getRefreshToken();
    if (!refreshToken) {
      throw new Error('No refresh token available');
    }

    const response = await this.client.post<ApiResponse<{ accessToken: string }>>(
      '/auth/refresh',
      { refreshToken }
    );

    if (!response.data.data?.accessToken) {
      throw new Error('Failed to refresh token');
    }

    return response.data.data.accessToken;
  }

  /**
   * Get refresh token from storage
   */
  private getRefreshToken(): string | null {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem('refreshToken');
  }

  /**
   * Normalize error response
   */
  private normalizeError(error: unknown): ApiError {
    if (axios.isAxiosError(error) && error.response) {
      return {
        code: error.response.data?.code || 'UNKNOWN_ERROR',
        message: error.response.data?.message || error.message,
        details: error.response.data?.details,
        statusCode: error.response.status,
      };
    }

    return {
      code: 'NETWORK_ERROR',
      message: 'Network error occurred',
      statusCode: 0,
    };
  }

  /**
   * Generic GET request
   */
  public async get<T>(
    url: string,
    config?: AxiosRequestConfig
  ): Promise<ApiResponse<T>> {
    const response = await this.client.get<ApiResponse<T>>(url, config);
    return response.data;
  }

  /**
   * Generic POST request
   */
  public async post<T>(
    url: string,
    data?: unknown,
    config?: AxiosRequestConfig
  ): Promise<ApiResponse<T>> {
    const response = await this.client.post<ApiResponse<T>>(url, data, config);
    return response.data;
  }

  /**
   * Generic PUT request
   */
  public async put<T>(
    url: string,
    data?: unknown,
    config?: AxiosRequestConfig
  ): Promise<ApiResponse<T>> {
    const response = await this.client.put<ApiResponse<T>>(url, data, config);
    return response.data;
  }

  /**
   * Generic PATCH request
   */
  public async patch<T>(
    url: string,
    data?: unknown,
    config?: AxiosRequestConfig
  ): Promise<ApiResponse<T>> {
    const response = await this.client.patch<ApiResponse<T>>(url, data, config);
    return response.data;
  }

  /**
   * Generic DELETE request
   */
  public async delete<T>(
    url: string,
    config?: AxiosRequestConfig
  ): Promise<ApiResponse<T>> {
    const response = await this.client.delete<ApiResponse<T>>(url, config);
    return response.data;
  }
}

/**
 * Create and export default API client instance
 */
export const createApiClient = (config: ApiClientConfig): ApiClient => {
  return new ApiClient(config);
};
