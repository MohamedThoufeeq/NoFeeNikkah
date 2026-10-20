import { rateLimit } from 'express-rate-limit';
import { TooManyRequestsError } from '../core/errors.js';

function createLimiter({ windowMs, limit, skip }) {
  return rateLimit({
    windowMs,
    limit,
    standardHeaders: 'draft-8',
    legacyHeaders: false,
    skip,
    handler: (_req, _res, next) => {
      next(new TooManyRequestsError());
    },
  });
}

export function createRateLimiters({ rateLimit: options }) {
  const skipHealth = (req) => req.path === '/health' || req.originalUrl?.startsWith('/api/health');

  return {
    global: createLimiter({
      windowMs: options.windowMs,
      limit: options.max,
      skip: skipHealth,
    }),
    auth: createLimiter({
      windowMs: options.windowMs,
      limit: options.authMax,
    }),
  };
}

export default createRateLimiters;
