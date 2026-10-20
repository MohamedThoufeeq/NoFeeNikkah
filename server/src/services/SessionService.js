import { UnauthorizedError } from '../core/errors.js';
import { generateSessionToken, hashToken } from '../utils/crypto.js';

/**
 * Owns the lifecycle of opaque, server-side sessions.
 *
 * Tokens are random, stored only as SHA-256 hashes and accepted through either
 * an HttpOnly cookie or an Authorization bearer header. No JWT or provider
 * token is ever persisted in the browser by this layer.
 */
export class SessionService {
  constructor({ sessionRepository, ttlMs, touchIntervalMs = 300_000, logger }) {
    this.sessionRepository = sessionRepository;
    this.ttlMs = ttlMs;
    this.touchIntervalMs = touchIntervalMs;
    this.logger = logger;
  }

  async createSession({ userId, userAgent, ipAddress }) {
    const token = generateSessionToken();
    const tokenHash = hashToken(token);
    const expiresAt = new Date(Date.now() + this.ttlMs).toISOString();

    const row = await this.sessionRepository.create({
      userId,
      tokenHash,
      expiresAt,
      userAgent,
      ipAddress,
    });

    return {
      token,
      tokenHash,
      sessionId: row.id,
      expiresAt,
    };
  }

  async resolveSession(token) {
    if (!token) throw new UnauthorizedError('Authentication is required.');

    const tokenHash = hashToken(token);
    const session = await this.sessionRepository.findActiveByTokenHash(tokenHash);

    if (!session) {
      throw new UnauthorizedError('Your session has expired. Please sign in again.');
    }

    await this.#touchIfNeeded(session);

    return {
      sessionId: session.id,
      userId: session.user_id,
      expiresAt: session.expires_at,
      token,
    };
  }

  async revokeToken(token) {
    if (!token) return false;
    const rows = await this.sessionRepository.revokeByTokenHash(hashToken(token));
    return rows.length > 0;
  }

  async revokeAllForUser(userId) {
    const rows = await this.sessionRepository.revokeAllForUser(userId);
    return rows.length;
  }

  async cleanupExpired() {
    const rows = await this.sessionRepository.deleteExpired();
    return rows.length;
  }

  async #touchIfNeeded(session) {
    if (!this.touchIntervalMs) return;

    const lastUsed = session.last_used_at ? new Date(session.last_used_at).getTime() : 0;
    if (Date.now() - lastUsed < this.touchIntervalMs) return;

    try {
      await this.sessionRepository.touch(session.id);
    } catch (error) {
      // A failed activity update must not reject an otherwise valid session.
      this.logger?.warn({ err: error, sessionId: session.id }, 'Could not update session activity');
    }
  }
}

export default SessionService;
