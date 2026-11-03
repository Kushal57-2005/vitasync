import { createApp } from './app.js';
import { env } from './config/env.js';
import { APP_CONFIG } from './config/index.js';

const app = createApp();

const server = app.listen(env.PORT, env.HOST, () => {
  console.info(
    `🚀 ${APP_CONFIG.name} v${APP_CONFIG.version} running on http://${env.HOST}:${env.PORT}`,
  );
  console.info(`🌱 Environment: ${env.NODE_ENV}`);
  console.info(`🩺 Health check: http://${env.HOST}:${env.PORT}/api/v1/health`);
});

function gracefulShutdown(signal: string): void {
  console.info(`\nReceived ${signal}. Shutting down gracefully...`);
  server.close(() => {
    console.info('HTTP server closed cleanly.');
    process.exit(0);
  });

  // Force shutdown after 10s if dangling connections persist
  setTimeout(() => {
    console.error('Could not close connections in time, forcefully shutting down');
    process.exit(1);
  }, 10000).unref();
}

process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));
