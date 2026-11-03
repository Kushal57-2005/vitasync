import type { Request, Response, NextFunction } from 'express';
import { env } from '../config/env.js';

const SENSITIVE_KEYS = new Set([
  'password',
  'token',
  'refreshtoken',
  'secret',
  'authorization',
  'cookie',
  'apikey',
  'api_key',
  'access_token',
]);

export function redactSensitiveData(obj: unknown, depth = 0): unknown {
  if (depth > 4 || obj === null || obj === undefined) {
    return obj;
  }

  if (Array.isArray(obj)) {
    return obj.map((item) => redactSensitiveData(item, depth + 1));
  }

  if (typeof obj === 'object') {
    const sanitized: Record<string, unknown> = {};
    for (const [key, value] of Object.entries(obj as Record<string, unknown>)) {
      if (SENSITIVE_KEYS.has(key.toLowerCase())) {
        sanitized[key] = '[REDACTED]';
      } else if (typeof value === 'object' && value !== null) {
        sanitized[key] = redactSensitiveData(value, depth + 1);
      } else {
        sanitized[key] = value;
      }
    }
    return sanitized;
  }

  return obj;
}

export function requestLogger(req: Request, res: Response, next: NextFunction): void {
  if (env.NODE_ENV === 'test') {
    return next();
  }

  res.on('finish', () => {
    const duration = req.startTime ? Date.now() - req.startTime : 0;
    const logEntry = {
      level: res.statusCode >= 500 ? 'error' : res.statusCode >= 400 ? 'warn' : 'info',
      requestId: req.id,
      method: req.method,
      path: req.originalUrl || req.url,
      statusCode: res.statusCode,
      durationMs: duration,
      ip: req.ip,
      userAgent: req.get('user-agent'),
      query: redactSensitiveData(req.query),
      timestamp: new Date().toISOString(),
    };

    const serialized = JSON.stringify(logEntry);
    if (res.statusCode >= 500) {
      console.error(serialized);
    } else if (res.statusCode >= 400) {
      console.warn(serialized);
    } else {
      console.info(serialized);
    }
  });

  next();
}
