import path from 'node:path';
import { fileURLToPath } from 'node:url';
import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import compression from 'compression';
import cookieParser from 'cookie-parser';
import config from './config/env.js';
import { AppError } from './core/errors.js';
import { asyncHandler } from './core/asyncHandler.js';
import { requestId } from './middleware/requestId.js';
import { requestLogger } from './middleware/requestLogger.js';
import { csrfGuard } from './middleware/csrf.js';
import { notFound } from './middleware/notFound.js';
import { errorHandler } from './middleware/errorHandler.js';
import { createApiRouter } from './routes/index.js';

const currentDir = path.dirname(fileURLToPath(import.meta.url));
const defaultClientDist = path.resolve(currentDir, '../../dist');

export function createApp(container) {
  const app = express();

  app.disable('x-powered-by');
  app.set('trust proxy', config.trustProxy);

  app.use(requestId);
  app.use(requestLogger());
  app.use(
    helmet({
      crossOriginResourcePolicy: { policy: 'cross-origin' },
      contentSecurityPolicy: false,
    })
  );
  app.use(
    cors({
      origin(origin, callback) {
        if (!origin || config.corsOrigins.includes(origin)) {
          callback(null, true);
          return;
        }
        callback(
          new AppError('This origin is not allowed to access the API.', {
            statusCode: 403,
            code: 'CORS_NOT_ALLOWED',
          })
        );
      },
      credentials: true,
      methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Authorization', 'X-Request-Id'],
      exposedHeaders: ['X-Request-Id'],
      maxAge: 86_400,
    })
  );
  app.use(compression());
  app.use(cookieParser());
  app.use(csrfGuard({ corsOrigins: config.corsOrigins }));
  app.use(express.json({ limit: config.bodyLimit }));
  app.use(express.urlencoded({ extended: false, limit: config.bodyLimit }));

  // Liveness probe intentionally sits outside the API rate limiter.
  app.get('/health', asyncHandler(container.controllers.health.live));

  app.use('/api', (_req, res, next) => {
    res.set('Cache-Control', 'no-store');
    next();
  });

  app.use(
    '/api',
    container.rateLimiters.global,
    createApiRouter({
      controllers: container.controllers,
      authenticate: container.authenticate,
      optionalAuthenticate: container.optionalAuthenticate,
      rateLimiters: container.rateLimiters,
    })
  );

  if (config.serveClient) {
    const clientDist = config.clientDistPath
      ? path.resolve(config.clientDistPath)
      : defaultClientDist;
    app.use(express.static(clientDist));
    app.use((req, res, next) => {
      if (req.method !== 'GET' || req.path.startsWith('/api') || req.path === '/health') {
        next();
        return;
      }
      res.sendFile(path.join(clientDist, 'index.html'));
    });
  }

  app.use(notFound);
  app.use(errorHandler);

  return app;
}

export default createApp;
