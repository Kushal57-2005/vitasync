import { z } from 'zod';

export const HealthStatusSchema = z.enum(['healthy', 'degraded', 'unhealthy']);

export const ApiHealthResponseSchema = z.object({
  status: HealthStatusSchema,
  service: z.string().min(1),
  version: z.string().min(1),
  uptimeSeconds: z.number().nonnegative(),
  timestamp: z.string().datetime(),
  environment: z.string().min(1),
});

export const PaginationQuerySchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(20),
});

export const PaginationMetaSchema = z.object({
  page: z.number().int().positive(),
  limit: z.number().int().positive(),
  totalCount: z.number().int().nonnegative(),
  totalPages: z.number().int().nonnegative(),
  hasNextPage: z.boolean(),
  hasPrevPage: z.boolean(),
});

export const ApiErrorDetailSchema = z.object({
  field: z.string().optional(),
  message: z.string(),
  code: z.string().optional(),
});

export const ApiErrorPayloadSchema = z.object({
  code: z.string(),
  message: z.string(),
  details: z.array(ApiErrorDetailSchema).optional(),
});
