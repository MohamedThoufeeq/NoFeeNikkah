import test from 'node:test';
import assert from 'node:assert/strict';
import { AuthService } from '../src/services/AuthService.js';
import { Profile } from '../src/models/Profile.js';

function createProfileService() {
  return {
    profile: null,
    async isUsernameTaken() {
      return false;
    },
    async createInitialProfile(user, values) {
      this.profile = Profile.fromRequest({
        id: user.id,
        username: values.username,
        fullName: values.fullName,
        email: user.email,
      });
      return this.profile;
    },
    async ensureProfile() {
      return this.profile;
    },
    async getCurrent() {
      return this.profile;
    },
  };
}

function createDependencies(overrides = {}) {
  const profileService = createProfileService();
  const createdSessions = [];
  const deletedUsers = [];

  const authRepository = {
    async signInWithPassword() {
      return {
        user: {
          id: '11111111-1111-4111-8111-111111111111',
          email: 'aisha@example.com',
          user_metadata: {},
        },
      };
    },
    async signUp() {
      return {
        user: {
          id: '11111111-1111-4111-8111-111111111111',
          email: 'aisha@example.com',
          identities: [{ id: 'identity' }],
        },
        session: { access_token: 'provider-token' },
      };
    },
    async deleteUser(userId) {
      deletedUsers.push(userId);
    },
    async getUserByAccessToken() {
      return {
        id: '11111111-1111-4111-8111-111111111111',
        email: 'aisha@example.com',
        user_metadata: {},
      };
    },
    ...overrides.authRepository,
  };

  const sessionService = {
    async createSession({ userId }) {
      const session = { token: `session-${userId}`, expiresAt: '2030-01-01T00:00:00.000Z' };
      createdSessions.push(session);
      return session;
    },
    async revokeToken() {
      return true;
    },
    async revokeAllForUser() {
      return 1;
    },
    ...overrides.sessionService,
  };

  const service = new AuthService({
    authRepository,
    profileService: overrides.profileService || profileService,
    sessionService,
    frontendUrl: 'http://localhost:5173',
  });

  return { service, profileService, createdSessions, deletedUsers, authRepository };
}

test('login creates a server session and ensures a profile', async () => {
  const { service, profileService, createdSessions } = createDependencies();
  profileService.profile = Profile.fromRequest({
    id: '11111111-1111-4111-8111-111111111111',
    username: 'aisha',
    fullName: 'Aisha',
  });

  const result = await service.login({
    email: 'aisha@example.com',
    password: 'password123',
  });

  assert.equal(result.profile.username, 'aisha');
  assert.equal(result.session.token, 'session-11111111-1111-4111-8111-111111111111');
  assert.equal(createdSessions.length, 1);
});

test('registration deletes the auth user when profile creation fails', async () => {
  const failingProfileService = {
    async isUsernameTaken() {
      return false;
    },
    async createInitialProfile() {
      throw new Error('profile insert failed');
    },
  };
  const { service, deletedUsers } = createDependencies({
    profileService: failingProfileService,
  });

  await assert.rejects(() =>
    service.register({
      username: 'aisha',
      email: 'aisha@example.com',
      password: 'password123',
    })
  );

  assert.deepEqual(deletedUsers, ['11111111-1111-4111-8111-111111111111']);
});

test('social login verifies the provider token and creates a server session', async () => {
  const { service, profileService, createdSessions } = createDependencies();
  profileService.profile = Profile.fromRequest({ id: '11111111-1111-4111-8111-111111111111' });

  const result = await service.socialLogin({ accessToken: 'provider-access-token' });

  assert.equal(result.session.token, 'session-11111111-1111-4111-8111-111111111111');
  assert.equal(createdSessions.length, 1);
});
