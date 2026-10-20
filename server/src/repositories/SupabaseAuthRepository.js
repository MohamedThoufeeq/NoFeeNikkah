import { mapAuthError, ServiceUnavailableError, UnauthorizedError } from '../core/errors.js';

/**
 * Adapter around Supabase Auth. Keeping provider calls behind this repository
 * means switching identity providers later does not change the services or
 * controllers.
 */
export class SupabaseAuthRepository {
  constructor({ connection }) {
    this.auth = connection.authClient.auth;
    this.admin = connection.client.auth.admin;
  }

  async signUp({ email, password, metadata = {}, emailRedirectTo }) {
    const { data, error } = await this.auth.signUp({
      email,
      password,
      options: {
        data: metadata,
        ...(emailRedirectTo ? { emailRedirectTo } : {}),
      },
    });

    if (error) throw mapAuthError(error);
    return data;
  }

  async signInWithPassword({ email, password }) {
    const { data, error } = await this.auth.signInWithPassword({ email, password });
    if (error) throw mapAuthError(error);
    return data;
  }

  async getUserByAccessToken(accessToken) {
    const { data, error } = await this.auth.getUser(accessToken);
    if (error || !data?.user) {
      throw new UnauthorizedError('The social sign in token is invalid or expired.');
    }
    return data.user;
  }

  async deleteUser(userId) {
    const { error } = await this.admin.deleteUser(userId);
    if (error) throw mapAuthError(error);
    return true;
  }

  async getHealth() {
    const { error } = await this.admin.listUsers({ page: 1, perPage: 1 });
    if (error) throw new ServiceUnavailableError('Supabase auth is unavailable.');
    return true;
  }
}

export default SupabaseAuthRepository;
