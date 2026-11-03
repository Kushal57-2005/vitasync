import type { Request, Response, NextFunction } from 'express';
import { ZodError } from 'zod';
import { AppError } from '../utils/errors.js';
import { env } from '../config/env.js';
import type { ApiErrorResponse, ApiErrorDetail } from '@vitasync/shared';

export function errorHandler(err: unknown, req: Request, res: Response, _next: NextFunction): void {
  const timestamp = new Date().toISOString();
  const requestId = req.id;

  // 1. Handled AppError
  if (err instanceof AppError) {
    const payload: ApiErrorResponse = {
      success: false,
      error: {
        code: err.code,
        message: err.message,
        details: err.details,
      },
      meta: {
        requestId,
        timestamp,
      },
    };
    res.status(err.statusCode).json(payload);
    return;
  }

  // 2. Zod Validation Error
  if (err instanceof ZodError) {
    const details: ApiErrorDetail[] = err.errors.map((e) => ({
      field: e.path.join('.'),
      message: e.message,
      code: e.code,
    }));

    const payload: ApiErrorResponse = {
      success: false,
      error: {
        code: 'VALIDATION_ERROR',
        message: 'Request validation failed',
        details,
      },
      meta: {
        requestId,
        timestamp,
      },
    };
    res.status(400).json(payload);
    return;
  }

  // 3. JSON Syntax error from body-parser
  if (
    err instanceof SyntaxError &&
    'status' in err &&
    (err as { status?: number }).status === 400
  ) {
    const payload: ApiErrorResponse = {
      success: false,
      error: {
        code: 'INVALID_JSON',
        message: 'Malformed JSON payload in request body',
      },
      meta: {
        requestId,
        timestamp,
      },
    };
    res.status(400).json(payload);
    return;
  }

  // 4. CORS Error
  if (err instanceof Error && err.message.startsWith('CORS policy violation')) {
    const payload: ApiErrorResponse = {
      success: false,
      error: {
        code: 'CORS_VIOLATION',
        message: err.message,
      },
      meta: {
        requestId,
        timestamp,
      },
    };
    res.status(403).json(payload);
    return;
  }

  // 5. Unhandled / Unexpected Errors
  if (env.NODE_ENV !== 'test') {
    console.error('Unhandled internal server error:', err);
  }

  const message =
    env.NODE_ENV === 'production'
      ? 'An unexpected internal server error occurred'
      : (err as Error).message;

  const payload: ApiErrorResponse = {
    success: false,
    error: {
      code: 'INTERNAL_SERVER_ERROR',
      message: message || 'Internal Server Error',
    },
    meta: {
      requestId,
      timestamp,
    },
  };

  res.status(500).json(payload);
}
