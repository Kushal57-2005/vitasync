import { describe, it, expect } from 'vitest';
import request from 'supertest';
import { createApp } from '../src/app.js';
import { ApiHealthResponseSchema } from '@vitasync/shared';

describe('Health and Foundation API Tests', () => {
  const app = createApp();

  it('GET /api/v1/health should respond with 200 and valid health schema', async () => {
    const res = await request(app).get('/api/v1/health');

    expect(res.status).toBe(200);
    expect(res.headers['x-request-id']).toBeDefined();
    expect(res.body.success).toBe(true);
    expect(res.body.data).toBeDefined();

    const parsed = ApiHealthResponseSchema.safeParse(res.body.data);
    expect(parsed.success).toBe(true);
    if (parsed.success) {
      expect(parsed.data.status).toBe('healthy');
      expect(parsed.data.service).toBe('VitaSync API');
      expect(parsed.data.uptimeSeconds).toBeGreaterThanOrEqual(0);
    }
  });

  it('GET /api/v1/docs should return OpenAPI scaffold', async () => {
    const res = await request(app).get('/api/v1/docs');

    expect(res.status).toBe(200);
    expect(res.body.openapi).toBe('3.0.3');
    expect(res.body.paths['/api/v1/health']).toBeDefined();
  });

  it('GET /api/v1/not-found should respond with 404 standard envelope', async () => {
    const res = await request(app).get('/api/v1/random-missing-route');

    expect(res.status).toBe(404);
    expect(res.body.success).toBe(false);
    expect(res.body.error).toBeDefined();
    expect(res.body.error.code).toBe('ROUTE_NOT_FOUND');
    expect(res.body.meta.requestId).toBeDefined();
    expect(res.body.meta.timestamp).toBeDefined();
  });

  it('should propagate client-supplied x-request-id', async () => {
    const customId = 'test-custom-request-id-12345';
    const res = await request(app).get('/api/v1/health').set('x-request-id', customId);

    expect(res.status).toBe(200);
    expect(res.headers['x-request-id']).toBe(customId);
    expect(res.body.meta.requestId).toBe(customId);
  });
});
