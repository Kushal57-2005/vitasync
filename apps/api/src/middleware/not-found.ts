import type { Request, Response } from 'express';
import type { ApiErrorResponse } from '@vitasync/shared';

export function notFoundHandler(req: Request, res: Response): void {
  const response: ApiErrorResponse = {
    success: false,
    error: {
      code: 'ROUTE_NOT_FOUND',
      message: `Cannot ${req.method} ${req.originalUrl || req.url}`,
    },
    meta: {
      requestId: req.id,
      timestamp: new Date().toISOString(),
    },
  };

  res.status(404).json(response);
}
