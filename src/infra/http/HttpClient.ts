import { log } from '../../utils/log';
import type {
  HttpMethod,
  HttpRequestConfig,
  HttpResponse,
  HttpError,
  RequestInterceptor,
  ResponseInterceptor,
  ErrorInterceptor,
} from './types';

export class HttpClient {
  private baseURL: string;
  private defaultHeaders: Record<string, string>;
  private defaultTimeout: number;
  private requestInterceptors: RequestInterceptor[] = [];
  private responseInterceptors: ResponseInterceptor[] = [];
  private errorInterceptors: ErrorInterceptor[] = [];

  constructor(baseURL: string, defaultTimeout = 30000) {
    this.baseURL = baseURL;
    this.defaultTimeout = defaultTimeout;
    this.defaultHeaders = {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    };
  }

  addRequestInterceptor(interceptor: RequestInterceptor): void {
    this.requestInterceptors.push(interceptor);
  }

  addResponseInterceptor(interceptor: ResponseInterceptor): void {
    this.responseInterceptors.push(interceptor);
  }

  addErrorInterceptor(interceptor: ErrorInterceptor): void {
    this.errorInterceptors.push(interceptor);
  }

  setDefaultHeader(key: string, value: string): void {
    this.defaultHeaders[key] = value;
  }

  removeDefaultHeader(key: string): void {
    delete this.defaultHeaders[key];
  }

  async get<T = unknown>(url: string, config?: HttpRequestConfig): Promise<HttpResponse<T>> {
    return this.request<T>(url, { ...config, method: 'GET' });
  }

  async post<T = unknown>(url: string, body?: unknown, config?: HttpRequestConfig): Promise<HttpResponse<T>> {
    return this.request<T>(url, { ...config, method: 'POST', body });
  }

  async put<T = unknown>(url: string, body?: unknown, config?: HttpRequestConfig): Promise<HttpResponse<T>> {
    return this.request<T>(url, { ...config, method: 'PUT', body });
  }

  async patch<T = unknown>(url: string, body?: unknown, config?: HttpRequestConfig): Promise<HttpResponse<T>> {
    return this.request<T>(url, { ...config, method: 'PATCH', body });
  }

  async delete<T = unknown>(url: string, config?: HttpRequestConfig): Promise<HttpResponse<T>> {
    return this.request<T>(url, { ...config, method: 'DELETE' });
  }

  private async request<T>(url: string, config: HttpRequestConfig = {}): Promise<HttpResponse<T>> {
    try {
      const fullUrl = url.startsWith('http') ? url : `${this.baseURL}${url}`;

      const headers = {
        ...this.defaultHeaders,
        ...config.headers,
      };

      let requestConfig: HttpRequestConfig = {
        method: config.method || 'GET',
        headers,
        body: config.body ? JSON.stringify(config.body) : undefined,
      };

      let interceptedUrl = fullUrl;
      for (const interceptor of this.requestInterceptors) {
        const result = await interceptor(interceptedUrl, requestConfig);
        interceptedUrl = result.url;
        requestConfig = result.config;
      }

      const timeout = config.timeout || this.defaultTimeout;
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), timeout);

      log.info(`[HTTP] ${requestConfig.method} ${interceptedUrl}`, {
        headers: requestConfig.headers,
        body: config.body,
      });

      const fetchResponse = await fetch(interceptedUrl, {
        method: requestConfig.method,
        headers: requestConfig.headers as HeadersInit,
        body: requestConfig.body as BodyInit | undefined,
        signal: config.signal || controller.signal,
      });

      clearTimeout(timeoutId);

      let data: T;
      const contentType = fetchResponse.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        data = await fetchResponse.json();
      } else {
        data = (await fetchResponse.text()) as T;
      }

      let response: HttpResponse<T> = {
        data,
        status: fetchResponse.status,
        statusText: fetchResponse.statusText,
        headers: fetchResponse.headers,
      };

      log.info(`[HTTP] ${response.status} ${interceptedUrl}`, { data: response.data });

      if (!fetchResponse.ok) {
        const error: HttpError = {
          message: `HTTP Error ${fetchResponse.status}: ${fetchResponse.statusText}`,
          status: fetchResponse.status,
          statusText: fetchResponse.statusText,
          data: response.data,
        };
        throw error;
      }

      for (const interceptor of this.responseInterceptors) {
        response = await interceptor(response);
      }

      return response;
    } catch (error: unknown) {
      const err = error as { name?: string; message?: string };

      if (err.name === 'AbortError') {
        const timeoutError: HttpError = {
          message: `Request timeout after ${config.timeout || this.defaultTimeout}ms`,
          status: 408,
          statusText: 'Request Timeout',
        };
        log.error('[HTTP] Request timeout', timeoutError);
        return this.handleError(timeoutError);
      }

      if (error instanceof TypeError && error.message === 'Network request failed') {
        const networkError: HttpError = {
          message: 'Network request failed. Please check your connection.',
          status: 0,
          statusText: 'Network Error',
        };
        log.error('[HTTP] Network error', networkError);
        return this.handleError(networkError);
      }

      log.error('[HTTP] Request failed', error);
      return this.handleError(error as HttpError);
    }
  }

  private async handleError(error: HttpError): Promise<never> {
    for (const interceptor of this.errorInterceptors) {
      await interceptor(error);
    }
    throw error;
  }
}
