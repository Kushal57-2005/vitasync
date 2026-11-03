import { Router } from 'express';
import { APP_CONFIG } from '../../config/index.js';

export const docsRouter = Router();

const openApiScaffold = {
  openapi: '3.0.3',
  info: {
    title: APP_CONFIG.name,
    version: APP_CONFIG.version,
    description: APP_CONFIG.description,
  },
  paths: {
    '/api/v1/health': {
      get: {
        summary: 'System Readiness and Health Status',
        description: 'Returns service uptime, environment, and readiness status.',
        responses: {
          '200': {
            description: 'Service is operational',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean', example: true },
                    data: {
                      type: 'object',
                      properties: {
                        status: { type: 'string', example: 'healthy' },
                        service: { type: 'string', example: 'VitaSync API' },
                        version: { type: 'string', example: '0.1.0' },
                        uptimeSeconds: { type: 'number', example: 120 },
                        timestamp: { type: 'string', format: 'date-time' },
                        environment: { type: 'string', example: 'development' },
                      },
                    },
                    meta: {
                      type: 'object',
                      properties: {
                        requestId: { type: 'string' },
                        timestamp: { type: 'string', format: 'date-time' },
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
  },
};

docsRouter.get('/', (_req, res) => {
  res.status(200).json(openApiScaffold);
});
