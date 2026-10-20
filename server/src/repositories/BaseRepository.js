import { mapDatabaseError } from '../core/errors.js';

/**
 * Small generic repository for simple, table-scoped operations.
 * Complex queries live in focused repositories so the base class stays
 * replaceable and easy to reason about.
 */
export class BaseRepository {
  constructor({ client, table }) {
    if (!client) throw new Error('BaseRepository requires a Supabase client.');
    if (!table) throw new Error('BaseRepository requires a table name.');
    this.client = client;
    this.table = table;
  }

  query() {
    return this.client.from(this.table);
  }

  guard(result, fallbackMessage = 'A database operation failed.') {
    if (result?.error) {
      const mapped = mapDatabaseError(result.error);
      if (mapped.code === 'DATABASE_ERROR') {
        mapped.message = fallbackMessage;
      }
      throw mapped;
    }
    return result;
  }

  async findById(id, select = '*') {
    const result = await this.query().select(select).eq('id', id).maybeSingle();
    return this.guard(result).data;
  }

  async findOneBy(column, value, select = '*') {
    const result = await this.query().select(select).eq(column, value).maybeSingle();
    return this.guard(result).data;
  }

  async insert(values, select = '*') {
    const result = await this.query().insert(values).select(select).single();
    return this.guard(result).data;
  }

  async updateById(id, values, select = '*') {
    const result = await this.query().update(values).eq('id', id).select(select).maybeSingle();
    return this.guard(result).data;
  }

  async deleteById(id) {
    const result = await this.query().delete().eq('id', id).select('id').maybeSingle();
    return this.guard(result).data;
  }
}

export default BaseRepository;
