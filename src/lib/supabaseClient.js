import { createClient } from '@supabase/supabase-js';
import config from './config';

let browserClient = null;

/**
 * The browser Supabase client is used only to perform the provider redirect
 * and receive the OAuth access token. Application sessions are always issued
 * by the Node API, never by this client.
 */
export function getSupabaseClient() {
  if (typeof window === 'undefined') return null;
  if (!config.supabaseUrl || !config.supabaseAnonKey) return null;

  if (!browserClient) {
    browserClient = createClient(config.supabaseUrl, config.supabaseAnonKey, {
      auth: {
        flowType: 'pkce',
        detectSessionInUrl: true,
        persistSession: true,
        autoRefreshToken: true,
      },
    });
  }

  return browserClient;
}

export function getSocialRedirectUrl() {
  if (typeof window === 'undefined') return '';
  const base = import.meta.env.BASE_URL.replace(/\/$/, '');
  return `${window.location.origin}${base}/auth/callback`;
}

export function isSocialLoginEnabled() {
  return Boolean(
    config.supabaseUrl && config.supabaseAnonKey && config.socialProviders.length
  );
}

export default getSupabaseClient;
