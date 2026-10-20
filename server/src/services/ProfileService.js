import { ConflictError, NotFoundError } from '../core/errors.js';
import { Profile } from '../models/Profile.js';
import { normalizeUsername } from '../utils/coerce.js';

function randomSuffix(length = 4) {
  return Math.random().toString(36).slice(2, 2 + length);
}

/**
 * Profile use-cases. This layer knows nothing about Express; it can be reused
 * from a queue worker, CLI or a future GraphQL adapter.
 */
export class ProfileService {
  constructor({ profileRepository, logger }) {
    this.profileRepository = profileRepository;
    this.logger = logger;
  }

  async isUsernameTaken(username) {
    if (!username) return false;
    return Boolean(await this.profileRepository.findByUsername(normalizeUsername(username)));
  }

  async getById(id, { viewerId = null } = {}) {
    const row = await this.profileRepository.findById(id);
    if (!row) throw new NotFoundError('Profile not found.');

    // Private profiles are indistinguishable from missing profiles to other
    // members, which avoids leaking their existence.
    if (!row.is_public && row.id !== viewerId) {
      throw new NotFoundError('Profile not found.');
    }

    return Profile.fromRow(row);
  }

  async getCurrent(userId) {
    const row = await this.profileRepository.findById(userId);
    if (!row) throw new NotFoundError('Your profile has not been created yet.');
    return Profile.fromRow(row);
  }

  async ensureProfile(user) {
    const existing = await this.profileRepository.findById(user.id);
    if (existing) return Profile.fromRow(existing);

    const email = user.email || '';
    const metadata = user.user_metadata || {};
    const username =
      metadata.username || metadata.preferred_username || email.split('@')[0] || `member_${user.id.slice(0, 8)}`;
    const fullName =
      metadata.full_name || metadata.fullName || metadata.name || metadata.display_name || username;

    return this.createInitialProfile(user, {
      username,
      fullName,
      image: metadata.avatar_url || metadata.picture || '',
    });
  }

  async createInitialProfile(user, { username, fullName, image = '' } = {}) {
    if (user.email) {
      const existingEmail = await this.profileRepository.findByEmail(user.email);
      if (existingEmail && existingEmail.id !== user.id) {
        throw new ConflictError(
          'An account with this email already exists. Sign in with your original method.'
        );
      }
    }

    const baseUsername = normalizeUsername(username || user.email?.split('@')[0] || `member_${user.id.slice(0, 8)}`);

    for (let attempt = 0; attempt < 6; attempt += 1) {
      const candidate = attempt === 0 ? baseUsername : `${baseUsername.slice(0, 23)}_${randomSuffix()}`;
      if (await this.profileRepository.findByUsername(candidate)) continue;

      const profile = Profile.fromRequest({
        id: user.id,
        username: candidate,
        email: user.email || '',
        fullName: fullName || candidate,
        image,
        isPublic: true,
      });

      try {
        const row = await this.profileRepository.create(profile.toRow({ includeIdentity: true }));
        return Profile.fromRow(row);
      } catch (error) {
        if (error.code !== 'CONFLICT') throw error;

        // A concurrent request may have created the same profile already.
        const existing = await this.profileRepository.findById(user.id);
        if (existing) return Profile.fromRow(existing);

        if (user.email) {
          const existingEmail = await this.profileRepository.findByEmail(user.email);
          if (existingEmail && existingEmail.id !== user.id) {
            throw new ConflictError(
              'An account with this email already exists. Sign in with your original method.'
            );
          }
        }

        this.logger?.warn({ username: candidate }, 'Username collision while creating profile');
      }
    }

    throw new ConflictError('Could not allocate a unique username. Please choose another one.');
  }

  async updateCurrent(userId, payload) {
    const row = await this.profileRepository.findById(userId);
    if (!row) throw new NotFoundError('Your profile has not been created yet.');

    const current = Profile.fromRow(row);
    const next = Profile.fromRequest(payload, current);

    // Identity fields are owned by the auth provider and must not be mutable
    // through a profile update.
    next.id = current.id;
    next.username = current.username;
    next.email = current.email;

    const updated = await this.profileRepository.update(userId, next.toRow());
    if (!updated) throw new NotFoundError('Your profile has not been created yet.');
    return Profile.fromRow(updated);
  }

  async deleteCurrent(userId) {
    const deleted = await this.profileRepository.deleteById(userId);
    if (!deleted) throw new NotFoundError('Your profile has not been created yet.');
    return true;
  }

  async search(filters, { viewerId = null } = {}) {
    const result = await this.profileRepository.search({
      filters,
      page: filters.page,
      limit: filters.limit,
      excludeUserId: viewerId,
    });

    return {
      profiles: result.rows.map((row) => Profile.fromRow(row)),
      pagination: {
        page: result.page,
        limit: result.limit,
        total: result.total,
        totalPages: result.totalPages,
      },
    };
  }
}

export default ProfileService;
