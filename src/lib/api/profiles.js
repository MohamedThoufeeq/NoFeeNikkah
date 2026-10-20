import { ApiError, apiClient, buildUrl } from './client';
import config from '../config';
import { mapProfileFromApi, mapProfileToApi } from '../../features/profile/profile.mapper';
import { PROFILE_SAMPLE, SAMPLE_PROFILES } from '../../data/profiles';
import { asArray } from '../utils/array';
import { getAgeInYears } from '../utils/date';

const MOCK_LATENCY_MS = 450;
const mockDelay = (value) => new Promise((resolve) => setTimeout(() => resolve(value), MOCK_LATENCY_MS));

function unwrap(response) {
  return response?.data ?? response;
}

/**
 * Mock mode keeps edits in memory for the current browser session so the full
 * edit → view flow can be demonstrated before the backend exists.
 */
let mockProfiles = SAMPLE_PROFILES;
let mockCurrentProfile = PROFILE_SAMPLE;

function toProfileList(payload) {
  const value = unwrap(payload);
  const list = Array.isArray(value) ? value : value?.profiles || value?.content || [];
  return asArray(list).map(mapProfileFromApi);
}

function sortMockProfiles(profiles, filters = {}) {
  const occupation = String(filters.occupation || '').toLowerCase();
  return profiles.filter((profile) => {
    if (filters.gender && filters.gender !== 'both' && profile.gender !== filters.gender) return false;
    if (filters.country && profile.country !== filters.country) return false;
    if (filters.state && profile.state !== filters.state) return false;
    if (filters.city && profile.city !== filters.city) return false;
    if (filters.language) {
      const languages = profile.languages.join(' ').toLowerCase();
      if (!languages.includes(String(filters.language).toLowerCase())) return false;
    }

    const age = getAgeInYears(profile.dateOfBirth) ?? profile.age;
    if (filters.minAge) {
      if (age === null || age === undefined || Number(age) < Number(filters.minAge)) return false;
    }
    if (filters.age) {
      if (age !== null && age !== undefined && Number(age) > Number(filters.age)) return false;
    }

    if (filters.income) {
      const income = Number(profile.income);
      if (Number.isFinite(income) && income > Number(filters.income)) return false;
    }
    if (occupation) {
      const occupations = profile.occupations.join(' ').toLowerCase();
      if (!occupations.includes(occupation)) return false;
    }
    if (filters.maritalStatus && profile.maritalStatus !== filters.maritalStatus) return false;
    if (filters.sect && profile.sect !== filters.sect) return false;
    if (filters.education && profile.education !== filters.education) return false;
    if (filters.eatingHabits && profile.eatingHabits !== filters.eatingHabits) return false;
    if (filters.practicingLevel && profile.practicingLevel !== filters.practicingLevel) return false;
    if (filters.smokeAndDrink && profile.smokeAndDrink !== filters.smokeAndDrink) return false;
    if (filters.financialStatus && profile.financialStatus !== filters.financialStatus) return false;
    return true;
  });
}

export async function getMyProfile() {
  if (config.useMocks) {
    return mockDelay(mockCurrentProfile);
  }
  const data = await apiClient.get(buildUrl(config.apiBaseUrl, 'profiles/me'));
  return mapProfileFromApi(unwrap(data));
}

export async function getProfileById(id) {
  if (config.useMocks) {
    const match = mockProfiles.find((profile) => String(profile.id) === String(id));
    if (!match) throw new ApiError('Profile not found.', { status: 404 });
    return mockDelay(match);
  }
  const data = await apiClient.get(buildUrl(config.apiBaseUrl, `profiles/${encodeURIComponent(id)}`));
  return mapProfileFromApi(unwrap(data));
}

export async function searchProfiles(filters = {}) {
  if (config.useMocks) {
    return mockDelay(sortMockProfiles(mockProfiles, filters));
  }
  const data = await apiClient.get(buildUrl(config.apiBaseUrl, 'filter', filters));
  return toProfileList(data);
}

export async function updateProfile(id, profile) {
  if (config.useMocks) {
    const nextProfile = mapProfileFromApi({
      ...mapProfileToApi(profile),
      id: profile.id || id,
      username: profile.username,
      image: profile.image,
    });
    mockCurrentProfile = nextProfile;
    mockProfiles = mockProfiles.map((item) =>
      String(item.id) === String(nextProfile.id) ? nextProfile : item
    );
    return mockDelay(nextProfile);
  }
  const payload = mapProfileToApi(profile);
  const data = await apiClient.post(buildUrl(config.apiBaseUrl, String(id)), payload);
  return mapProfileFromApi(unwrap(data));
}

/**
 * Send an interest through the modern endpoint. The backend also keeps the
 * legacy `/:id/senInterest/:targetId` route for older clients.
 */
export async function sendInterest(targetProfileId) {
  if (config.useMocks) {
    return mockDelay({ success: true });
  }
  const data = await apiClient.post(
    buildUrl(config.apiBaseUrl, 'interests'),
    { targetProfileId }
  );
  return unwrap(data);
}
