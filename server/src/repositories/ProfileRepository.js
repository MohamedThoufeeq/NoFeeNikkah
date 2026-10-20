import { BaseRepository } from './BaseRepository.js';
import { getAgeInYears } from '../utils/date.js';

const EXTRA_FILTER_KEYS = [
  'minAge',
  'maritalStatus',
  'sect',
  'education',
  'eatingHabits',
  'practicingLevel',
  'smokeAndDrink',
  'financialStatus',
];

function hasValue(value) {
  return value !== undefined && value !== null && value !== '';
}

function hasExtraFilters(filters) {
  return EXTRA_FILTER_KEYS.some((key) => hasValue(filters[key]));
}

function numberOrNull(value) {
  return hasValue(value) ? Number(value) : null;
}

function textOrNull(value) {
  return hasValue(value) ? String(value) : null;
}

function isMissingSearchFilterFunction(error) {
  const message = String(error?.message || '').toLowerCase();
  return (
    error?.code === 'PGRST202' ||
    message.includes('could not find the function') ||
    (message.includes('search_profiles') && message.includes('schema cache'))
  );
}

function matchesExtraFilters(row, filters) {
  if (hasValue(filters.minAge)) {
    const age = getAgeInYears(row.date_of_birth);
    if (age === null || age < Number(filters.minAge)) return false;
  }

  const exactFilters = [
    ['maritalStatus', 'marital_status'],
    ['sect', 'sect'],
    ['education', 'education'],
    ['eatingHabits', 'eating_habits'],
    ['practicingLevel', 'practicing_level'],
    ['smokeAndDrink', 'smoke_and_drink'],
    ['financialStatus', 'financial_status'],
  ];

  return exactFilters.every(([filterKey, column]) => {
    if (!hasValue(filters[filterKey])) return true;
    return String(row[column] ?? '') === String(filters[filterKey]);
  });
}

export class ProfileRepository extends BaseRepository {
  constructor({ client, logger = null }) {
    super({ client, table: 'profiles' });
    this.logger = logger;
  }

  async findByUsername(username) {
    const result = await this.query()
      .select('*')
      .eq('username', String(username ?? '').trim().toLowerCase())
      .maybeSingle();
    return this.guard(result).data;
  }

  async findByEmail(email) {
    const result = await this.query()
      .select('*')
      .eq('email', String(email ?? '').trim().toLowerCase())
      .maybeSingle();
    return this.guard(result).data;
  }

  async create(row) {
    return this.insert(row);
  }

  async update(id, row) {
    return this.updateById(id, row);
  }

  async search({ filters = {}, page = 1, limit = 20, excludeUserId = null } = {}) {
    const safePage = Math.max(1, Number(page) || 1);
    const safeLimit = Math.min(100, Math.max(1, Number(limit) || 20));
    const offset = (safePage - 1) * safeLimit;
    const extraFilters = hasExtraFilters(filters);

    // The SQL function handles case-insensitive partial matching inside the
    // language/occupation arrays and returns the window count in one round trip.
    // The base arguments also work against the original function signature, so
    // an existing database keeps serving ordinary searches until migration 002
    // is applied.
    const baseArgs = {
      p_gender: filters.gender && filters.gender !== 'both' ? filters.gender : null,
      p_country: filters.country || null,
      p_state: filters.state || null,
      p_city: filters.city || null,
      p_language: filters.language || null,
      p_occupation: filters.occupation || null,
      p_max_age: numberOrNull(filters.age),
      p_max_income: numberOrNull(filters.income),
      p_exclude_user: excludeUserId,
      p_limit: safeLimit,
      p_offset: offset,
    };

    const extendedArgs = {
      ...baseArgs,
      p_min_age: numberOrNull(filters.minAge),
      p_marital_status: textOrNull(filters.maritalStatus),
      p_sect: textOrNull(filters.sect),
      p_education: textOrNull(filters.education),
      p_eating_habits: textOrNull(filters.eatingHabits),
      p_practicing_level: textOrNull(filters.practicingLevel),
      p_smoke_and_drink: textOrNull(filters.smokeAndDrink),
      p_financial_status: textOrNull(filters.financialStatus),
    };

    let result = await this.client.rpc(
      'search_profiles',
      extraFilters ? extendedArgs : baseArgs
    );

    if (result.error && extraFilters && isMissingSearchFilterFunction(result.error)) {
      // Temporary compatibility path for databases that have not run
      // `server/sql/002_search_filters.sql` yet. Fetch one page, apply the new
      // filters in memory, then paginate. The SQL migration removes this path.
      this.logger?.warn(
        { error: result.error },
        'search_profiles is missing the extended filters; apply migration 002'
      );

      result = await this.client.rpc('search_profiles', {
        ...baseArgs,
        p_limit: 100,
        p_offset: 0,
      });
      this.guard(result, 'Could not search profiles.');

      const filtered = (result.data ?? [])
        .map((row) => row.profile)
        .filter(Boolean)
        .filter((row) => matchesExtraFilters(row, filters));
      const total = filtered.length;
      const rows = filtered.slice(offset, offset + safeLimit);

      return {
        rows,
        total,
        page: safePage,
        limit: safeLimit,
        totalPages: Math.max(1, Math.ceil(total / safeLimit)),
      };
    }

    this.guard(result, 'Could not search profiles.');

    const rows = (result.data ?? []).map((row) => row.profile).filter(Boolean);
    const total = Number(result.data?.[0]?.total_count ?? 0);

    return {
      rows,
      total,
      page: safePage,
      limit: safeLimit,
      totalPages: Math.max(1, Math.ceil(total / safeLimit)),
    };
  }
}

export default ProfileRepository;
