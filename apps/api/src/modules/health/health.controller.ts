import type { Request, Response } from 'express';
import { env } from '../../config/env.js';
import { APP_CONFIG } from '../../config/index.js';
import type { ApiHealthResponse, ApiSuccessResponse } from '@vitasync/shared';

const startTime = Date.now();

export function getHealth(req: Request, res: Response): void {
  const uptimeSeconds = Math.floor((Date.now() - startTime) / 1000);

  const healthData: ApiHealthResponse = {
    status: 'healthy',
    service: APP_CONFIG.name,
    version: APP_CONFIG.version,
    uptimeSeconds,
    timestamp: new Date().toISOString(),
    environment: env.NODE_ENV,
  };

  const response: ApiSuccessResponse<ApiHealthResponse> = {
    success: true,
    data: healthData,
    meta: {
      requestId: req.id,
      timestamp: new Date().toISOString(),
    },
  };

  res.status(200).json(response);
}
