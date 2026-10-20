import sampleData from './profiles.sample.json';
import { mapProfileFromApi } from '../features/profile/profile.mapper';

const rawProfiles = Array.isArray(sampleData?.profiles) ? sampleData.profiles : [];

export const SAMPLE_PROFILES = rawProfiles.map(mapProfileFromApi);

/**
 * Deterministic demo profile used by My Profile / Edit Profile in mock mode.
 * It is the record with the most complete field set in the sample data.
 */
export const PROFILE_SAMPLE =
  SAMPLE_PROFILES.find((profile) => profile.id === '6') || SAMPLE_PROFILES.at(-1) || null;

export default SAMPLE_PROFILES;
