import test from 'node:test';
import assert from 'node:assert/strict';
import { ProfileService } from '../src/services/ProfileService.js';
import { NotFoundError } from '../src/core/errors.js';

function createProfileRepository(initialRows = []) {
  const rows = [...initialRows];
  return {
    rows,
    async findById(id) {
      return rows.find((row) => row.id === id) || null;
    },
    async findByUsername(username) {
      return rows.find((row) => row.username.toLowerCase() === username.toLowerCase()) || null;
    },
    async findByEmail(email) {
      return rows.find((row) => row.email && row.email.toLowerCase() === String(email).toLowerCase()) || null;
    },
    async create(row) {
      if (rows.some((item) => item.username.toLowerCase() === row.username.toLowerCase())) {
        const error = new Error('duplicate');
        error.code = 'CONFLICT';
        throw error;
      }
      const now = new Date().toISOString();
      const stored = { ...row, created_at: now, updated_at: now };
      rows.push(stored);
      return stored;
    },
    async update(id, values) {
      const index = rows.findIndex((row) => row.id === id);
      if (index < 0) return null;
      rows[index] = { ...rows[index], ...values, updated_at: new Date().toISOString() };
      return rows[index];
    },
    async deleteById(id) {
      const index = rows.findIndex((row) => row.id === id);
      if (index < 0) return null;
      const [deleted] = rows.splice(index, 1);
      return { id: deleted.id };
    },
    async search({ filters }) {
      const filtered = rows.filter((row) => row.is_public && (!filters.gender || row.gender === filters.gender));
      return { rows: filtered, total: filtered.length, page: 1, limit: 20, totalPages: 1 };
    },
  };
}

test('ensureProfile creates a profile once and reuses it afterwards', async () => {
  const repository = createProfileRepository();
  const service = new ProfileService({ profileRepository: repository });
  const user = {
    id: '11111111-1111-4111-8111-111111111111',
    email: 'aisha@example.com',
    user_metadata: { full_name: 'Aisha Rahman', username: 'Aisha_R' },
  };

  const created = await service.ensureProfile(user);
  const reused = await service.ensureProfile(user);

  assert.equal(created.id, user.id);
  assert.equal(created.username, 'aisha_r');
  assert.equal(created.fullName, 'Aisha Rahman');
  assert.equal(repository.rows.length, 1);
  assert.equal(reused.id, created.id);
});

test('updateCurrent preserves username and email while applying profile fields', async () => {
  const userId = '11111111-1111-4111-8111-111111111111';
  const repository = createProfileRepository([
    {
      id: userId,
      username: 'aisha_r',
      email: 'aisha@example.com',
      full_name: 'Aisha',
      is_public: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
  ]);
  const service = new ProfileService({ profileRepository: repository });

  const updated = await service.updateCurrent(userId, {
    fullname: 'Aisha Rahman',
    username: 'hijacker',
    email: 'other@example.com',
    languagesKnownArray: ['English', 'Tamil'],
  });

  assert.equal(updated.id, userId);
  assert.equal(updated.username, 'aisha_r');
  assert.equal(updated.email, 'aisha@example.com');
  assert.equal(updated.fullName, 'Aisha Rahman');
  assert.deepEqual(updated.languages, ['English', 'Tamil']);
});

test('private profiles are hidden from other members', async () => {
  const repository = createProfileRepository([
    {
      id: '11111111-1111-4111-8111-111111111111',
      username: 'private_user',
      is_public: false,
    },
  ]);
  const service = new ProfileService({ profileRepository: repository });

  await assert.rejects(
    () => service.getById('11111111-1111-4111-8111-111111111111', { viewerId: 'other' }),
    NotFoundError
  );

  const own = await service.getById('11111111-1111-4111-8111-111111111111', {
    viewerId: '11111111-1111-4111-8111-111111111111',
  });
  assert.equal(own.username, 'private_user');
});
