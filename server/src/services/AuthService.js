import { ConflictError } from '../core/errors.js';

export class AuthService {
  constructor({
    authRepository,
    profileService,
    sessionService,
    frontendUrl,
    logger,
  }) {
    this.authRepository = authRepository;
    this.profileService = profileService;
    this.sessionService = sessionService;
    this.frontendUrl = frontendUrl;
    this.logger = logger;
  }

  async register({ username, email, password, fullName }, requestMeta) {
    if (await this.profileService.isUsernameTaken(username)) {
      throw new ConflictError('This username is already taken.');
    }

    const data = await this.authRepository.signUp({
      email,
      password,
      metadata: { username, full_name: fullName || username },
      emailRedirectTo: `${this.frontendUrl}/login?confirmed=1`,
    });

    const user = data?.user;
    if (!user) {
      throw new Error('The authentication provider did not return a user.');
    }

    // Supabase intentionally obfuscates existing emails by returning a user
    // with no identities. Treat that as a conflict.
    if (Array.isArray(user.identities) && user.identities.length === 0) {
      throw new ConflictError('This email address is already registered.');
    }

    // Only roll back an auth user when Supabase clearly created a new identity
    // for this request. Deleting an obfuscated "existing user" response would
    // remove an account that did not belong to this signup attempt.
    const canRollBack = Array.isArray(user.identities) && user.identities.length > 0;

    let profile;
    try {
      profile = await this.profileService.createInitialProfile(user, {
        username,
        fullName: fullName || username,
      });
    } catch (error) {
      if (canRollBack) {
        await this.authRepository.deleteUser(user.id).catch((cleanupError) => {
          this.logger?.error(
            { err: cleanupError, userId: user.id },
            'Could not roll back auth user after profile creation failure'
          );
        });
      } else {
        this.logger?.warn(
          { userId: user.id },
          'Profile creation failed for an auth response without identities; skipping rollback'
        );
      }
      throw error;
    }

    const requiresEmailConfirmation = !data.session;
    const session = requiresEmailConfirmation
      ? null
      : await this.#createSession(user.id, requestMeta);

    return { profile, session, requiresEmailConfirmation };
  }

  async login({ email, password }, requestMeta) {
    const data = await this.authRepository.signInWithPassword({ email, password });
    const user = data?.user;
    if (!user) throw new Error('The authentication provider did not return a user.');

    const profile = await this.profileService.ensureProfile(user);
    const session = await this.#createSession(user.id, requestMeta);

    return { profile, session };
  }

  async socialLogin({ accessToken }, requestMeta) {
    const user = await this.authRepository.getUserByAccessToken(accessToken);
    const profile = await this.profileService.ensureProfile(user);
    const session = await this.#createSession(user.id, requestMeta);
    return { profile, session };
  }

  async getSession(auth) {
    const profile = await this.profileService.getCurrent(auth.userId);
    return {
      profile,
      session: {
        expiresAt: auth.expiresAt,
      },
    };
  }

  async logout(token) {
    await this.sessionService.revokeToken(token);
    return true;
  }

  async logoutAll(userId) {
    return this.sessionService.revokeAllForUser(userId);
  }

  async deleteAccount(userId) {
    await this.sessionService.revokeAllForUser(userId);
    await this.authRepository.deleteUser(userId);
    return true;
  }

  async #createSession(userId, requestMeta = {}) {
    return this.sessionService.createSession({
      userId,
      userAgent: requestMeta.userAgent,
      ipAddress: requestMeta.ipAddress,
    });
  }
}

export default AuthService;
