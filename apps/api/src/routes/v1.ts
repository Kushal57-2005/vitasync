import { Router } from 'express';
import { healthRouter } from '../modules/health/health.router.js';
import { docsRouter } from '../modules/docs/docs.router.js';

export const v1Router = Router();

v1Router.use('/health', healthRouter);
v1Router.use('/docs', docsRouter);
