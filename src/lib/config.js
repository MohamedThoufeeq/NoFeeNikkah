/**
 * Runtime configuration.
 *
 * Values come from Vite environment variables (`.env` / `.env.local`). Never
 * put secrets in `VITE_*` variables: they are embedded in the client bundle.
 */
const env = import.meta.env;

const trimTrailingSlash = (value) => String(value || '').replace(/\/+$/, '');

const asBoolean = (value, fallback) => {
  if (value === undefined || value === null || value === '') return fallback;
  return String(value).toLowerCase() === 'true';
};

const asNumber = (value, fallback) => {
  const parsed = Number(value);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback;
};

const asList = (value, fallback = []) => {
  if (!value) return fallback;
  return String(value)
    .split(',')
    .map((item) => item.trim().toLowerCase())
    .filter(Boolean);
};

const apiBaseUrl = trimTrailingSlash(env.VITE_API_BASE_URL || '/api');

export const config = Object.freeze({
  apiBaseUrl,
  authBaseUrl: trimTrailingSlash(
    env.VITE_AUTH_API_BASE_URL || `${apiBaseUrl}/auth`
  ),
  requestTimeoutMs: asNumber(env.VITE_API_TIMEOUT_MS, 15000),
  /**
   * Mock mode is an offline development escape hatch. The real backend lives
   * in `server/`; production builds must keep this false.
   */
  useMocks: asBoolean(env.VITE_USE_MOCKS, false),
  appName: env.VITE_APP_NAME || 'NoFeeNikkah',
  supabaseUrl: trimTrailingSlash(env.VITE_SUPABASE_URL || ''),
  supabaseAnonKey: env.VITE_SUPABASE_ANON_KEY || '',
  socialProviders: asList(env.VITE_SOCIAL_PROVIDERS, ['google', 'github']),
  storageKeys: {
    session: 'nfn.session',
    oauthProvider: 'nfn.oauth.provider',
  },
});

export default config;
