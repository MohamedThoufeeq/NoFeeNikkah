import 'dotenv/config';
import { z } from 'zod';
import { ConfigurationError } from '../core/errors.js';

const booleanString = z
  .union([z.boolean(), z.string()])
  .transform((value) => {
    if (typeof value === 'boolean') return value;
    return ['1', 'true', 'yes', 'on'].includes(value.trim().toLowerCase());
  });

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  PORT: z.coerce.number().int().min(1).max(65535).default(8080),
  API_PUBLIC_URL: z.string().url().optional(),
  FRONTEND_URL: z.string().url().default('http://localhost:5173'),
  CORS_ORIGINS: z.string().default('http://localhost:5173'),
  TRUST_PROXY: z.coerce.number().int().min(0).max(10).default(0),

  SUPABASE_URL: z.string().url(),
  SUPABASE_ANON_KEY: z.string().min(1),
  SUPABASE_SERVICE_ROLE_KEY: z.string().min(1),

  SESSION_COOKIE_NAME: z.string().min(1).default('nfn_session'),
  SESSION_TTL_DAYS: z.coerce.number().int().min(1).max(365).default(30),
  SESSION_TOUCH_INTERVAL_SECONDS: z.coerce.number().int().min(0).max(3600).default(300),
  COOKIE_SECURE: booleanString.optional(),
  COOKIE_SAME_SITE: z.enum(['lax', 'strict', 'none']).default('lax'),

  BODY_LIMIT: z.string().default('1mb'),
  LOG_LEVEL: z.enum(['fatal', 'error', 'warn', 'info', 'debug', 'trace', 'silent']).default('info'),
  SERVE_CLIENT: booleanString.default(false),
  CLIENT_DIST_PATH: z.string().optional(),

  RATE_LIMIT_WINDOW_MS: z.coerce.number().int().min(1000).default(15 * 60 * 1000),
  RATE_LIMIT_MAX: z.coerce.number().int().min(1).default(300),
  AUTH_RATE_LIMIT_MAX: z.coerce.number().int().min(1).default(15),

  SOCIAL_PROVIDERS: z.string().default('google,github'),
});

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
  const details = parsed.error.issues.map((issue) => ({
    path: issue.path.join('.'),
    message: issue.message,
  }));
  throw new ConfigurationError(
    'Invalid server configuration. Copy .env.example to .env and provide the required values.',
    details
  );
}

const env = parsed.data;
const port = env.PORT;
const apiPublicUrl = (env.API_PUBLIC_URL || `http://localhost:${port}`).replace(/\/+$/, '');
const frontendUrl = env.FRONTEND_URL.replace(/\/+$/, '');
const corsOrigins = env.CORS_ORIGINS.split(',')
  .map((origin) => origin.trim().replace(/\/+$/, ''))
  .filter(Boolean);
const frontendOrigin = new URL(frontendUrl).origin;
if (!corsOrigins.includes(frontendOrigin)) corsOrigins.push(frontendOrigin);
const socialProviders = env.SOCIAL_PROVIDERS.split(',')
  .map((provider) => provider.trim().toLowerCase())
  .filter(Boolean);
const sameSite = env.COOKIE_SAME_SITE;
const secureCookie = (env.COOKIE_SECURE ?? env.NODE_ENV === 'production') || sameSite === 'none';

export const config = Object.freeze({
  nodeEnv: env.NODE_ENV,
  isProduction: env.NODE_ENV === 'production',
  isTest: env.NODE_ENV === 'test',
  port,
  apiPublicUrl,
  frontendUrl,
  corsOrigins,
  trustProxy: env.TRUST_PROXY,
  bodyLimit: env.BODY_LIMIT,
  logLevel: env.LOG_LEVEL,
  serveClient: env.SERVE_CLIENT,
  clientDistPath: env.CLIENT_DIST_PATH,
  supabase: Object.freeze({
    url: env.SUPABASE_URL,
    anonKey: env.SUPABASE_ANON_KEY,
    serviceRoleKey: env.SUPABASE_SERVICE_ROLE_KEY,
  }),
  session: Object.freeze({
    cookieName: env.SESSION_COOKIE_NAME,
    ttlMs: env.SESSION_TTL_DAYS * 24 * 60 * 60 * 1000,
    touchIntervalMs: env.SESSION_TOUCH_INTERVAL_SECONDS * 1000,
    secureCookie,
    sameSite,
  }),
  rateLimit: Object.freeze({
    windowMs: env.RATE_LIMIT_WINDOW_MS,
    max: env.RATE_LIMIT_MAX,
    authMax: env.AUTH_RATE_LIMIT_MAX,
  }),
  socialProviders,
});

export default config;
