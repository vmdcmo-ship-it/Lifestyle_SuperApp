/**
 * API Client Interceptors
 * Logging, error handling, retry logic
 */

import type { AxiosRequestConfig, AxiosResponse, AxiosError } from 'axios';

/**
 * Request logging interceptor
 */
export const requestLogger = (config: AxiosRequestConfig): AxiosRequestConfig => {
  if (process.env.NODE_ENV === 'development') {
    console.log(`[API] ${config.method?.toUpperCase()} ${config.url}`, {
      params: config.params,
      data: config.data,
    });
  }
  return config;
};

/**
 * Response logging interceptor
 */
export const responseLogger = (response: AxiosResponse): AxiosResponse => {
  if (process.env.NODE_ENV === 'development') {
    console.log(`[API] Response from ${response.config.url}`, {
      status: response.status,
      data: response.data,
    });
  }
  return response;
};

/**
 * Error logging interceptor
 */
export const errorLogger = (error: AxiosError): Promise<AxiosError> => {
  if (process.env.NODE_ENV === 'development') {
    console.error('[API] Error:', {
      url: error.config?.url,
      status: error.response?.status,
      message: error.message,
      data: error.response?.data,
    });
  }
  return Promise.reject(error);
};

/**
 * Retry logic for failed requests
 */
export const retryInterceptor = async (error: AxiosError): Promise<unknown> => {
  const config = error.config as AxiosRequestConfig & { _retryCount?: number };

  if (!config || !shouldRetry(error)) {
    return Promise.reject(error);
  }

  config._retryCount = config._retryCount || 0;

  if (config._retryCount >= 3) {
    return Promise.reject(error);
  }

  config._retryCount += 1;

  // Exponential backoff
  const delay = Math.pow(2, config._retryCount) * 1000;
  await new Promise((resolve) => setTimeout(resolve, delay));

  // Retry the request
  return axios(config);
};

/**
 * Determine if request should be retried
 */
function shouldRetry(error: AxiosError): boolean {
  // Retry on network errors or 5xx server errors
  if (!error.response) {
    return true; // Network error
  }

  const status = error.response.status;
  return status >= 500 && status < 600;
}

// Import axios for retry
import axios from 'axios';
