export const API_ROUTES = {
  HEALTH: '/api/v1/health',
  DOCS: '/api/v1/docs',
} as const;

export const HTTP_HEADERS = {
  REQUEST_ID: 'x-request-id',
  TENANT_ID: 'x-user-id',
} as const;
