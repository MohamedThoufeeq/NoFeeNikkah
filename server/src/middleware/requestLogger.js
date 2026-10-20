import pinoHttp from 'pino-http';
import { logger } from '../core/logger.js';

export function requestLogger() {
  return pinoHttp({
    logger,
    genReqId: (req) => req.id,
    autoLogging: {
      ignore: (req) => req.url === '/health' || req.url === '/api/health',
    },
    customLogLevel: (req, res, error) => {
      if (error || res.statusCode >= 500) return 'error';
      if (res.statusCode >= 400) return 'warn';
      return 'info';
    },
    customSuccessMessage: (req, res) => `${req.method} ${req.url} completed with ${res.statusCode}`,
    customErrorMessage: (req, res) => `${req.method} ${req.url} failed with ${res.statusCode}`,
  });
}

export default requestLogger;
