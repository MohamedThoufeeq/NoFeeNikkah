import test from 'node:test';
import assert from 'node:assert/strict';
import { SessionService } from '../src/services/SessionService.js';
import { hashToken } from '../src/utils/crypto.js';
import { UnauthorizedError } from '../src/core/errors.js';

function createRepository() {
  const rows = [];
  return {
    rows,
    async create(values) {
      const row = {
        id: `session-${rows.length + 1}`,
        user_id: values.userId,
        token_hash: values.tokenHash,
        expires_at: values.expiresAt,
        user_agent: values.userAgent,
        ip_address: values.ipAddress,
        last_used_at: new Date().toISOString(),
        revoked_at: null,
      };
      rows.push(row);
      return row;
    },
    async findActiveByTokenHash(tokenHash) {
      return (
        rows.find(
          (row) => row.token_hash === tokenHash && !row.revoked_at && row.expires_at > new Date().toISOString()
        ) || null
      );
    },
    async touch(id) {
      const row = rows.find((item) => item.id === id);
      if (row) row.last_used_at = new Date().toISOString();
      return row || null;
    },
    async revokeByTokenHash(tokenHash) {
      const matches = rows.filter((row) => row.token_hash === tokenHash && !row.revoked_at);
      matches.forEach((row) => {
        row.revoked_at = new Date().toISOString();
      });
      return matches;
    },
    async revokeAllForUser(userId) {
      const matches = rows.filter((row) => row.user_id === userId && !row.revoked_at);
      matches.forEach((row) => {
        row.revoked_at = new Date().toISOString();
      });
      return matches;
    },
    async deleteExpired() {
      return [];
    },
  };
}

test('session tokens are random, hashed at rest and resolvable', async () => {
  const repository = createRepository();
  const service = new SessionService({
    sessionRepository: repository,
    ttlMs: 60_000,
    touchIntervalMs: 0,
  });

  const created = await service.createSession({
    userId: 'user-1',
    userAgent: 'test',
    ipAddress: '127.0.0.1',
  });

  assert.ok(created.token.length >= 40);
  assert.notEqual(created.token, created.tokenHash);
  assert.equal(repository.rows[0].token_hash, hashToken(created.token));

  const resolved = await service.resolveSession(created.token);
  assert.equal(resolved.userId, 'user-1');
  assert.equal(resolved.sessionId, repository.rows[0].id);
});

test('revoked sessions cannot be resolved', async () => {
  const repository = createRepository();
  const service = new SessionService({
    sessionRepository: repository,
    ttlMs: 60_000,
    touchIntervalMs: 0,
  });

  const created = await service.createSession({ userId: 'user-1' });
  await service.revokeToken(created.token);

  await assert.rejects(() => service.resolveSession(created.token), UnauthorizedError);
});

test('missing tokens fail with an unauthorized error', async () => {
  const service = new SessionService({
    sessionRepository: createRepository(),
    ttlMs: 60_000,
  });

  await assert.rejects(() => service.resolveSession(''), UnauthorizedError);
});
