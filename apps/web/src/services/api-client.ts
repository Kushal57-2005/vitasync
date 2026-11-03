import type { ApiErrorResponse, ApiSuccessResponse, ApiHealthResponse } from '@vitasync/shared';
import { API_ROUTES, HTTP_HEADERS } from '@vitasync/shared';

export class ApiClientError extends Error {
  public readonly code: string;
  public readonly statusCode: number;
  public readonly details?: unknown;
  public readonly requestId?: string;

  constructor(
    statusCode: number,
    code: string,
    message: string,
    details?: unknown,
    requestId?: string,
  ) {
    super(message);
    this.name = 'ApiClientError';
    this.statusCode = statusCode;
    this.code = code;
    this.details = details;
    this.requestId = requestId;
  }
}

export interface RequestOptions extends RequestInit {
  params?: Record<string, string | number | boolean | undefined>;
}

export class ApiClient {
  private readonly baseUrl: string;

  constructor(baseUrl?: string) {
    this.baseUrl = (
      baseUrl ||
      (import.meta as unknown as { env: Record<string, string> }).env.VITE_API_URL ||
      'http://localhost:4000'
    ).replace(/\/+$/, '');
  }

  public getBaseUrl(): string {
    return this.baseUrl;
  }

  private buildUrl(
    path: string,
    params?: Record<string, string | number | boolean | undefined>,
  ): string {
    const normalizedPath = path.startsWith('/') ? path : `/${path}`;
    const url = new URL(`${this.baseUrl}${normalizedPath}`);

    if (params) {
      for (const [key, value] of Object.entries(params)) {
        if (value !== undefined) {
          url.searchParams.append(key, String(value));
        }
      }
    }

    return url.toString();
  }

  public async request<T>(path: string, options: RequestOptions = {}): Promise<T> {
    const { params, headers, ...restOptions } = options;
    const url = this.buildUrl(path, params);

    const mergedHeaders = new Headers(headers);
    if (!mergedHeaders.has('Content-Type') && !(restOptions.body instanceof FormData)) {
      mergedHeaders.set('Content-Type', 'application/json');
    }

    try {
      const response = await fetch(url, {
        ...restOptions,
        headers: mergedHeaders,
      });

      const responseText = await response.text();
      let data: unknown;
      try {
        data = responseText ? JSON.parse(responseText) : {};
      } catch {
        data = { message: responseText };
      }

      const requestId = response.headers.get(HTTP_HEADERS.REQUEST_ID) || undefined;

      if (!response.ok) {
        const errorBody = data as Partial<ApiErrorResponse>;
        const code = errorBody?.error?.code || 'HTTP_ERROR';
        const message =
          errorBody?.error?.message || `Request failed with status ${response.status}`;
        const details = errorBody?.error?.details;

        throw new ApiClientError(response.status, code, message, details, requestId);
      }

      // Check if wrapped in standard ApiSuccessResponse
      if (
        typeof data === 'object' &&
        data !== null &&
        'success' in data &&
        (data as { success: boolean }).success === true &&
        'data' in data
      ) {
        return (data as ApiSuccessResponse<T>).data;
      }

      return data as T;
    } catch (err) {
      if (err instanceof ApiClientError) {
        throw err;
      }
      throw new ApiClientError(
        0,
        'NETWORK_ERROR',
        err instanceof Error ? err.message : 'Network request failed',
      );
    }
  }

  public get<T>(path: string, options?: RequestOptions): Promise<T> {
    return this.request<T>(path, { ...options, method: 'GET' });
  }

  public post<T>(path: string, body?: unknown, options?: RequestOptions): Promise<T> {
    return this.request<T>(path, {
      ...options,
      method: 'POST',
      body: body ? JSON.stringify(body) : undefined,
    });
  }

  public put<T>(path: string, body?: unknown, options?: RequestOptions): Promise<T> {
    return this.request<T>(path, {
      ...options,
      method: 'PUT',
      body: body ? JSON.stringify(body) : undefined,
    });
  }

  public patch<T>(path: string, body?: unknown, options?: RequestOptions): Promise<T> {
    return this.request<T>(path, {
      ...options,
      method: 'PATCH',
      body: body ? JSON.stringify(body) : undefined,
    });
  }

  public delete<T>(path: string, options?: RequestOptions): Promise<T> {
    return this.request<T>(path, { ...options, method: 'DELETE' });
  }

  /**
   * Health Check helper
   */
  public async getHealth(): Promise<ApiHealthResponse> {
    return this.get<ApiHealthResponse>(API_ROUTES.HEALTH);
  }
}

export const apiClient = new ApiClient();
