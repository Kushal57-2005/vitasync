export interface PaginationMeta {
  page: number;
  limit: number;
  totalCount: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

export interface ApiResponseMeta {
  requestId?: string;
  timestamp: string;
  pagination?: PaginationMeta;
}

export interface ApiSuccessResponse<T> {
  success: true;
  data: T;
  meta: ApiResponseMeta;
}

export interface ApiErrorDetail {
  field?: string;
  message: string;
  code?: string;
}

export interface ApiErrorPayload {
  code: string;
  message: string;
  details?: ApiErrorDetail[];
}

export interface ApiErrorResponse {
  success: false;
  error: ApiErrorPayload;
  meta: ApiResponseMeta;
}

export type ApiResponse<T> = ApiSuccessResponse<T> | ApiErrorResponse;

export type HealthStatus = 'healthy' | 'degraded' | 'unhealthy';

export interface ApiHealthResponse {
  status: HealthStatus;
  service: string;
  version: string;
  uptimeSeconds: number;
  timestamp: string;
  environment: string;
}
