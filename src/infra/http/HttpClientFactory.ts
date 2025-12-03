import { config } from '../../app/config';
import { log } from '../../utils/log';
import { HttpClient } from './HttpClient';
import type { HttpError } from './types';

let httpClientInstance: HttpClient | null = null;

export function createHttpClient(): HttpClient {
  if (httpClientInstance) {
    return httpClientInstance;
  }

  const client = new HttpClient(config.apiBaseUrl, 30000);

  // Request interceptor - Add authentication token
  client.addRequestInterceptor(async (url, requestConfig) => {
    // TODO: Get token from secure storage
    // const token = await getAuthToken();
    // if (token) {
    //   requestConfig.headers = {
    //     ...requestConfig.headers,
    //     Authorization: `Bearer ${token}`,
    //   };
    // }
    return { url, config: requestConfig };
  });

  // Request interceptor - Log requests in dev
  client.addRequestInterceptor(async (url, requestConfig) => {
    if (__DEV__) {
      log.debug(`[HTTP Client] Request: ${requestConfig.method} ${url}`);
    }
    return { url, config: requestConfig };
  });

  // Response interceptor - Log responses in dev
  client.addResponseInterceptor(async (response) => {
    if (__DEV__) {
      log.debug(`[HTTP Client] Response: ${response.status}`, response.data);
    }
    return response;
  });

  // Error interceptor - Handle common errors
  client.addErrorInterceptor((error: HttpError) => {
    // Handle 401 Unauthorized - Clear auth and redirect to login
    if (error.status === 401) {
      log.warn('[HTTP Client] Unauthorized - Token may be expired');
      // TODO: Clear auth token and navigate to login
      // clearAuthToken();
      // navigationRef.navigate('Login');
    }

    // Handle 403 Forbidden
    if (error.status === 403) {
      log.warn('[HTTP Client] Forbidden - Access denied');
    }

    // Handle 404 Not Found
    if (error.status === 404) {
      log.warn('[HTTP Client] Not Found', { error });
    }

    // Handle 500 Server Error
    if (error.status && error.status >= 500) {
      log.error('[HTTP Client] Server Error', { error });
    }

    throw error;
  });

  httpClientInstance = client;
  return client;
}

export function getHttpClient(): HttpClient {
  if (!httpClientInstance) {
    return createHttpClient();
  }
  return httpClientInstance;
}

// Reset instance (useful for testing or re-initialization)
export function resetHttpClient(): void {
  httpClientInstance = null;
}
