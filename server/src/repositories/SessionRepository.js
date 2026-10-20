import { BaseRepository } from './BaseRepository.js';

export class SessionRepository extends BaseRepository {
  constructor({ client }) {
    super({ client, table: 'sessions' });
  }

  async create({ userId, tokenHash, expiresAt, userAgent, ipAddress }) {
    return this.insert({
      user_id: userId,
      token_hash: tokenHash,
      expires_at: expiresAt,
      user_agent: userAgent || null,
      ip_address: ipAddress || null,
    });
  }

  async findActiveByTokenHash(tokenHash) {
    const now = new Date().toISOString();
    const result = await this.query()
      .select('*')
      .eq('token_hash', tokenHash)
      .is('revoked_at', null)
      .gt('expires_at', now)
      .maybeSingle();
    return this.guard(result).data;
  }

  async touch(id, lastUsedAt = new Date().toISOString()) {
    const result = await this.query()
      .update({ last_used_at: lastUsedAt })
      .eq('id', id)
      .select('id')
      .maybeSingle();
    return this.guard(result).data;
  }

  async revoke(id, revokedAt = new Date().toISOString()) {
    const result = await this.query()
      .update({ revoked_at: revokedAt })
      .eq('id', id)
      .is('revoked_at', null)
      .select('id')
      .maybeSingle();
    return this.guard(result).data;
  }

  async revokeByTokenHash(tokenHash, revokedAt = new Date().toISOString()) {
    const result = await this.query()
      .update({ revoked_at: revokedAt })
      .eq('token_hash', tokenHash)
      .is('revoked_at', null)
      .select('id');
    return this.guard(result).data ?? [];
  }

  async revokeAllForUser(userId, revokedAt = new Date().toISOString()) {
    const result = await this.query()
      .update({ revoked_at: revokedAt })
      .eq('user_id', userId)
      .is('revoked_at', null)
      .select('id');
    return this.guard(result).data ?? [];
  }

  async deleteExpired(now = new Date().toISOString()) {
    const expired = await this.query()
      .delete()
      .lt('expires_at', now)
      .select('id');
    this.guard(expired);

    const revoked = await this.query()
      .delete()
      .not('revoked_at', 'is', null)
      .select('id');
    this.guard(revoked);

    return [...(expired.data ?? []), ...(revoked.data ?? [])];
  }
}

export default SessionRepository;
