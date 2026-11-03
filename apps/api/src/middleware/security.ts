import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import { allowedCorsOrigins, env } from '../config/env.js';
import type { Request, Response } from 'express';
import type { ApiErrorResponse } from '@vitasync/shared';

export const helmetMiddleware = helmet({
  contentSecurityPolicy: env.NODE_ENV === 'production',
  crossOriginEmbedderPolicy: false,
});

export const corsMiddleware = cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (e.g. mobile apps, curl, server-to-server)
    if (!origin) {
      return callback(null, true);
    }

    if (allowedCorsOrigins.includes('*') || allowedCorsOrigins.includes(origin)) {
      return callback(null, true);
    }

    return callback(new Error(`CORS policy violation: origin ${origin} is not allowed`));
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'x-request-id', 'x-user-id'],
  exposedHeaders: ['x-request-id'],
});

export const rateLimiterMiddleware = rateLimit({
  windowMs: env.RATE_LIMIT_WINDOW_MS,
  max: env.RATE_LIMIT_MAX,
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req: Request, res: Response) => {
    const response: ApiErrorResponse = {
      success: false,
      error: {
        code: 'RATE_LIMIT_EXCEEDED',
        message: 'Too many requests. Please try again later.',
      },
      meta: {
        requestId: req.id,
        timestamp: new Date().toISOString(),
      },
    };
    res.status(429).json(response);
  },
});
