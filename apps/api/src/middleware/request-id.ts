import { randomUUID } from 'node:crypto';
import type { Request, Response, NextFunction } from 'express';
import { HTTP_HEADERS } from '@vitasync/shared';

declare global {
  namespace Express {
    interface Request {
      id: string;
      startTime: number;
    }
  }
}

export function requestIdMiddleware(req: Request, res: Response, next: NextFunction): void {
  const incomingId = req.header(HTTP_HEADERS.REQUEST_ID);
  const requestId = incomingId && incomingId.trim().length > 0 ? incomingId.trim() : randomUUID();

  req.id = requestId;
  req.startTime = Date.now();
  res.setHeader(HTTP_HEADERS.REQUEST_ID, requestId);

  next();
}
