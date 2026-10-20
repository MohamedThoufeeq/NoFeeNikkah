import { BadRequestError, ConflictError, NotFoundError } from '../core/errors.js';

const ALLOWED_STATUSES = new Set(['accepted', 'declined']);

export class InterestService {
  constructor({ interestRepository, profileRepository }) {
    this.interestRepository = interestRepository;
    this.profileRepository = profileRepository;
  }

  async send(senderId, targetId) {
    if (!targetId) throw new BadRequestError('A target profile is required.');
    if (senderId === targetId) {
      throw new BadRequestError('You cannot send an interest to your own profile.');
    }

    const target = await this.profileRepository.findById(targetId);
    if (!target) throw new NotFoundError('Profile not found.');

    const existing = await this.interestRepository.findExisting(senderId, targetId);
    if (existing) throw new ConflictError('You have already sent an interest to this profile.');

    return this.interestRepository.create(senderId, targetId);
  }

  async listSent(userId) {
    return this.interestRepository.listSent(userId);
  }

  async listReceived(userId) {
    return this.interestRepository.listReceived(userId);
  }

  async updateStatus(userId, interestId, status) {
    if (!ALLOWED_STATUSES.has(status)) {
      throw new BadRequestError('Status must be either "accepted" or "declined".');
    }

    const interest = await this.interestRepository.updateStatus(interestId, userId, status);
    if (!interest) throw new NotFoundError('Interest not found.');
    return interest;
  }

  async withdraw(userId, interestId) {
    const deleted = await this.interestRepository.deleteBySender(interestId, userId);
    if (!deleted) throw new NotFoundError('Interest not found.');
    return true;
  }
}

export default InterestService;
