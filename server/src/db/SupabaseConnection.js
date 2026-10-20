import { createClient } from '@supabase/supabase-js';
import { ServiceUnavailableError } from '../core/errors.js';

/**
 * Owns the two Supabase clients used by the backend:
 *
 * - `authClient` (anon key): verifies credentials and access tokens.
 * - `client` (service role key): privileged persistence. It must never be
 *   exposed to the browser.
 */
export class SupabaseConnection {
  #client;
  #authClient;

  constructor({ url, anonKey, serviceRoleKey }) {
    if (!url || !anonKey || !serviceRoleKey) {
      throw new ServiceUnavailableError('Supabase credentials are not configured.');
    }

    const commonOptions = {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
        detectSessionInUrl: false,
      },
      global: {
        headers: { 'X-Client-Info': 'nofeenikkah-api/1.0' },
      },
    };

    this.#client = createClient(url, serviceRoleKey, commonOptions);
    this.#authClient = createClient(url, anonKey, commonOptions);
  }

  get client() {
    return this.#client;
  }

  get authClient() {
    return this.#authClient;
  }

  async ping() {
    const { error } = await this.#client
      .from('profiles')
      .select('id', { head: true, count: 'exact' })
      .limit(1);

    if (error) {
      throw new ServiceUnavailableError('The database is not reachable.');
    }

    return true;
  }
}

export default SupabaseConnection;
