import { BaseRepository } from './BaseRepository.js';

export class InterestRepository extends BaseRepository {
  constructor({ client }) {
    super({ client, table: 'interests' });
  }

  async create(senderId, targetId) {
    return this.insert({
      sender_id: senderId,
      target_id: targetId,
      status: 'pending',
    });
  }

  async findExisting(senderId, targetId) {
    const result = await this.query()
      .select('*')
      .eq('sender_id', senderId)
      .eq('target_id', targetId)
      .maybeSingle();
    return this.guard(result).data;
  }

  async listSent(senderId) {
    const result = await this.query()
      .select('*')
      .eq('sender_id', senderId)
      .order('created_at', { ascending: false });
    return this.guard(result).data ?? [];
  }

  async listReceived(targetId) {
    const result = await this.query()
      .select('*')
      .eq('target_id', targetId)
      .order('created_at', { ascending: false });
    return this.guard(result).data ?? [];
  }

  async updateStatus(id, targetId, status) {
    const result = await this.query()
      .update({ status })
      .eq('id', id)
      .eq('target_id', targetId)
      .select('*')
      .maybeSingle();
    return this.guard(result).data;
  }

  async deleteBySender(id, senderId) {
    const result = await this.query()
      .delete()
      .eq('id', id)
      .eq('sender_id', senderId)
      .select('id')
      .maybeSingle();
    return this.guard(result).data;
  }
}

export default InterestRepository;
