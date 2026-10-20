import pino from 'pino';
import config from '../config/env.js';

const redactPaths = [
  'req.headers.authorization',
  'req.headers.cookie',
  'res.headers["set-cookie"]',
  'password',
  '*.password',
  'token',
  '*.token',
  'accessToken',
  '*.accessToken',
  'refreshToken',
  '*.refreshToken',
  'SUPABASE_SERVICE_ROLE_KEY',
];

export const logger = pino({
  level: config.logLevel,
  base: {
    service: 'nofeenikkah-api',
    environment: config.nodeEnv,
  },
  timestamp: pino.stdTimeFunctions.isoTime,
  redact: {
    paths: redactPaths,
    censor: '[redacted]',
  },
});

export default logger;
