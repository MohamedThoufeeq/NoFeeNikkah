import { getAgeInYears } from './date';

const base = import.meta.env.BASE_URL || '/';

export const DEFAULT_AVATARS = {
  male: `${base}profile_img_boy.jpg`,
  female: `${base}profile_img_girl.jpg`,
  fallback: `${base}profile_img_boy.jpg`,
};

export function getProfileImage(profile) {
  if (profile?.image) return profile.image;
  if (profile?.gender === 'female') return DEFAULT_AVATARS.female;
  return DEFAULT_AVATARS.fallback;
}

export function getProfileAge(profile) {
  return getAgeInYears(profile?.dateOfBirth) ?? profile?.age ?? null;
}

export function computeBmi(heightCm, weightKg) {
  const height = Number(heightCm);
  const weight = Number(weightKg);
  if (!height || !weight) return '';
  return (weight / ((height * height) / 10000)).toFixed(2);
}
