import express, { type Express } from 'express';
import { requestIdMiddleware } from './middleware/request-id.js';
import { requestLogger } from './middleware/logger.js';
import { helmetMiddleware, corsMiddleware, rateLimiterMiddleware } from './middleware/security.js';
import { errorHandler } from './middleware/error-handler.js';
import { notFoundHandler } from './middleware/not-found.js';
import { v1Router } from './routes/v1.js';

export function createApp(): Express {
  const app = express();

  // Basic security and parsing
  app.use(helmetMiddleware);
  app.use(corsMiddleware);
  app.use(rateLimiterMiddleware);
  app.use(express.json({ limit: '1mb' }));
  app.use(express.urlencoded({ extended: true, limit: '1mb' }));

  // Correlation IDs and structured logging
  app.use(requestIdMiddleware);
  app.use(requestLogger);

  // Mount API modules
  app.use('/api/v1', v1Router);

  // Fallback 404 for unmapped endpoints
  app.use(notFoundHandler);

  // Centralized error handling
  app.use(errorHandler);

  return app;
}
