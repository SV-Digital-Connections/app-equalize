export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

export type HttpHeaders = Record<string, string>;

export type HttpRequestConfig = {
  method?: HttpMethod;
  headers?: HttpHeaders;
  body?: unknown;
  timeout?: number;
  signal?: AbortSignal;
};

export type HttpResponse<T = unknown> = {
  data: T;
  status: number;
  statusText: string;
  headers: Headers;
};

export type HttpError = {
  message: string;
  status?: number;
  statusText?: string;
  data?: unknown;
};

export type RequestInterceptor = (
  url: string,
  config: HttpRequestConfig
) => Promise<{ url: string; config: HttpRequestConfig }> | { url: string; config: HttpRequestConfig };

export type ResponseInterceptor = <T>(
  response: HttpResponse<T>
) => Promise<HttpResponse<T>> | HttpResponse<T>;

export type ErrorInterceptor = (error: HttpError) => Promise<never> | never;
