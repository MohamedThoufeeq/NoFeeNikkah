import test from 'node:test';
import assert from 'node:assert/strict';
import { ProfileRepository } from '../src/repositories/ProfileRepository.js';

test('profile search delegates to the SQL function with safe pagination and filters', async () => {
  const calls = [];
  const client = {
    from() {
      throw new Error('Search should use the SQL function, not a table query.');
    },
    async rpc(name, args) {
      calls.push({ name, args });
      return {
        data: [
          {
            profile: { id: 'profile-1', full_name: 'Aisha', gender: 'female' },
            total_count: 7,
          },
        ],
        error: null,
      };
    },
  };

  const repository = new ProfileRepository({ client });
  const result = await repository.search({
    filters: {
      gender: 'female',
      country: 'India',
      language: 'tamil',
      occupation: 'engineer',
      minAge: 24,
      age: 30,
      income: 0,
      maritalStatus: 'single',
      sect: 'pureSunni',
      education: 'pg',
      eatingHabits: 'halal',
      practicingLevel: 'veryHigh',
      smokeAndDrink: 'haram',
      financialStatus: 'middle',
    },
    page: 2,
    limit: 500,
    excludeUserId: 'viewer-1',
  });

  assert.equal(calls.length, 1);
  assert.equal(calls[0].name, 'search_profiles');
  assert.deepEqual(calls[0].args, {
    p_gender: 'female',
    p_country: 'India',
    p_state: null,
    p_city: null,
    p_language: 'tamil',
    p_occupation: 'engineer',
    p_min_age: 24,
    p_max_age: 30,
    p_max_income: 0,
    p_marital_status: 'single',
    p_sect: 'pureSunni',
    p_education: 'pg',
    p_eating_habits: 'halal',
    p_practicing_level: 'veryHigh',
    p_smoke_and_drink: 'haram',
    p_financial_status: 'middle',
    p_exclude_user: 'viewer-1',
    p_limit: 100,
    p_offset: 100,
  });
  assert.equal(result.total, 7);
  assert.equal(result.page, 2);
  assert.equal(result.limit, 100);
  assert.equal(result.totalPages, 1);
  assert.equal(result.rows[0].full_name, 'Aisha');
});

test('profile search falls back to the original SQL function until migration 002 is applied', async () => {
  const calls = [];
  const client = {
    async rpc(name, args) {
      calls.push({ name, args });

      if (calls.length === 1) {
        return {
          data: null,
          error: {
            code: 'PGRST202',
            message: 'Could not find the function public.search_profiles in the schema cache',
          },
        };
      }

      return {
        data: [
          {
            profile: {
              id: 'profile-1',
              full_name: 'Aisha',
              marital_status: 'single',
              sect: 'pureSunni',
              education: 'pg',
              eating_habits: 'halal',
              practicing_level: 'veryHigh',
              smoke_and_drink: 'haram',
              financial_status: 'middle',
              date_of_birth: '1996-01-01',
            },
            total_count: 1,
          },
          {
            profile: {
              id: 'profile-2',
              full_name: 'Fatima',
              marital_status: 'single',
              sect: 'pureSunni',
              education: 'pg',
              eating_habits: 'halal',
              practicing_level: 'veryHigh',
              smoke_and_drink: 'haram',
              financial_status: 'middle',
              date_of_birth: '2004-01-01',
            },
            total_count: 1,
          },
        ],
        error: null,
      };
    },
  };

  const repository = new ProfileRepository({ client });
  const result = await repository.search({
    filters: {
      minAge: 24,
      maritalStatus: 'single',
      sect: 'pureSunni',
      education: 'pg',
      eatingHabits: 'halal',
      practicingLevel: 'veryHigh',
      smokeAndDrink: 'haram',
      financialStatus: 'middle',
    },
    page: 1,
    limit: 20,
  });

  assert.equal(calls.length, 2);
  assert.equal(calls[1].args.p_limit, 100);
  assert.equal(calls[1].args.p_offset, 0);
  assert.equal(result.total, 1);
  assert.equal(result.rows.length, 1);
  assert.equal(result.rows[0].full_name, 'Aisha');
});
