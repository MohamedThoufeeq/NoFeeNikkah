/**
 * Canonical option lists for every profile enum.
 *
 * Values match the existing API/sample data. Legacy spellings are accepted via
 * `aliases` so older records keep rendering correctly after the refactor.
 */
const option = (value, label, aliases = []) => ({ value, label, aliases });

export const GENDER_OPTIONS = [
  option('male', 'Male ♂'),
  option('female', 'Female ♀'),
];

export const REGISTERED_FOR_OPTIONS = [
  option('self', 'Registering For Myself'),
  option('son', 'Registering For My Son'),
  option('daughter', 'Registering For My Daughter'),
  option('brother', 'Registering For My Brother'),
  option('sister', 'Registering For My Sister'),
  option('cousin', 'Registering For My Cousin'),
  option('friend', 'Registering For My Friend'),
  option('other', 'Registering For My Other Relative'),
];

export const MARITAL_STATUS_OPTIONS = [
  option('single', 'Single'),
  option('married', 'Married'),
  option('divorcee', 'Divorcee'),
  option('widow', 'Widow'),
  option('widower', 'Widower'),
];

export const CHILDREN_OPTIONS = [
  option('son', 'Son'),
  option('daughter', 'Daughter'),
  option('both', 'Both'),
];

export const EDUCATION_OPTIONS = [
  option('primary', 'Primary (Grade 1-7)'),
  option('secondary', 'Secondary (Grade 8-10)'),
  option('higher', 'Higher (Grade 11-12)'),
  option('diploma', 'Diploma (Polytechnic)'),
  option('ug', "Bachelor's (UG)"),
  option('pg', "Master's (PG)"),
  option('phd', 'Doctoral degree (Ph.D)'),
];

export const FINANCIAL_STATUS_OPTIONS = [
  option('affluent', 'Affluent'),
  option('rich', 'Rich'),
  option('upper', 'Upper Middle Class'),
  option('middle', 'Middle Class'),
  option('lower', 'Lower Middle Class'),
  option('poor', 'Poor'),
  option('no', 'Prefer Not To Say'),
];

export const SECT_OPTIONS = [
  option('pureSunni', 'Pure Sunni (No Madhhab)', ['pure-sunni', 'pure_sunni']),
  option('pureSunniSalafi', 'Pure Sunni (Salafi)'),
  option('pureSunniAthari', 'Pure Sunni (Athari)'),
  option('pureSunniWahabi', 'Pure Sunni (Wahabi)'),
  option(
    'bidahSunni',
    'Sunni (non-Dargah) (Mawlid, Fatiha, etc.) (Ahlul Sunna val Jamath)',
    ['bidah-sunni', 'bidah_sunni']
  ),
  option('dargahSunni', 'Sunni (Dargah)', ['dargah-sunni', 'dargah_sunni']),
  option('shia', 'Shia'),
  option('zaydiya', 'Zaydiya'),
  option('ismayiliya', 'Ismayiliya'),
  option('ibadiya', 'Ibadiya'),
  option('ahmediya', 'Ahmediya'),
  option('nizari', 'Nizari'),
  option('sufi', 'Sufi'),
  option('deobandi', 'Deobandi'),
  option('barelvi', 'Barelvi'),
  option('others', 'Others'),
  option('preferNotToSay', 'Prefer Not To Say'),
];

export const SECT_OPTIONS_WITH_ANY = [
  ...SECT_OPTIONS,
  option('anySect', 'Any Sect', ['any-sect', 'any']),
];

export const SALAH_PATTERN_OPTIONS = [
  option('veryHigh', 'Never Leave Fardh'),
  option('high', 'Always Pray but leaves occasionally'),
  option('medium', 'Pray Sometimes'),
  option('low', 'Pray Only Jummah and Eid'),
  option('kafir', 'Never Prays'),
];

export const QURAN_READING_OPTIONS = [
  option('daily', 'Daily'),
  option('veryOften', 'More than Once a Week'),
  option('often', 'Often Read'),
  option('ramadhan', 'Only in Ramadhan'),
  option('not', "I don't have time to read consistently"),
  option('never', 'Not Interested to read the Quran'),
];

export const PRACTICING_LEVEL_OPTIONS = [
  option(
    'excellent',
    'Fulfils all the Fardh and almost all the Sunnah acts, and abstains from major and minor sins'
  ),
  option('veryHigh', 'Fulfils Fardh and abstains from major sins'),
  option('high', 'Fulfils Fardh'),
  option('medium', 'Partially fulfils the Fardh'),
  option('low', 'Occasionally practises Islam'),
  option('kafir', "I'm a modern liberal"),
];

export const POLITICAL_OPTIONS = [
  option('high', 'Highly aware (Geopolitics and local politics)'),
  option('medium', 'Aware of local politics'),
  option('no', 'Unaware of politics', ['low']),
  option('never', 'Not interested in knowing politics'),
];

export const EATING_HABITS_OPTIONS = [
  option('halal', 'Eat Only Halal Foods'),
  option('any', 'Eat Any Foods'),
  option('veg', 'Eat Only Vegetarian Foods'),
  option('vegan', 'Eat Only Vegan Foods'),
];

export const SMOKING_DRINKING_OPTIONS = [
  option('haram', 'Strictly Not (Haram)'),
  option('smoke', 'Smoke Only'),
  option('nonAlchohol', 'Non Alcoholic Drinks Only', ['nonAlcohol']),
  option('alchohl', 'Alcoholic Drinks Only', ['alchohol', 'alcohol']),
  option(
    'smokeAndNonAlchohol',
    'Smoking and Non Alcoholic Drinks',
    ['smokeAndNonAlcohol']
  ),
  option(
    'smokeAndAlchohol',
    'Smoking and Alcohol',
    ['smokeAndAlcohol', 'smokeAndAlchohol']
  ),
  option('hooka', 'Hookah (Shisha)'),
  option('weed', 'Weed Only'),
  option('all', 'All the Intoxicants'),
];

export const YES_NO_OPTIONS = [
  option('yes', 'Yes'),
  option('no', 'No'),
];

export const PARENT_OPTIONS = [
  option('mom', 'Mother'),
  option('dad', 'Father'),
  option('guardian', 'Guardian'),
];

const OPTION_GROUPS = {
  gender: GENDER_OPTIONS,
  registeredFor: REGISTERED_FOR_OPTIONS,
  maritalStatus: MARITAL_STATUS_OPTIONS,
  children: CHILDREN_OPTIONS,
  education: EDUCATION_OPTIONS,
  financialStatus: FINANCIAL_STATUS_OPTIONS,
  sect: SECT_OPTIONS,
  partnerSect: SECT_OPTIONS_WITH_ANY,
  salahPattern: SALAH_PATTERN_OPTIONS,
  quranRead: QURAN_READING_OPTIONS,
  practicingLevel: PRACTICING_LEVEL_OPTIONS,
  political: POLITICAL_OPTIONS,
  eatingHabits: EATING_HABITS_OPTIONS,
  smokeAndDrink: SMOKING_DRINKING_OPTIONS,
  isRevert: YES_NO_OPTIONS,
  partnerEducated: YES_NO_OPTIONS,
  partnerProfessional: YES_NO_OPTIONS,
  parent: PARENT_OPTIONS,
};

/** Map a legacy or canonical value onto the canonical option value. */
export function normalizeOptionValue(group, value) {
  if (value === null || value === undefined || value === '') return '';
  const options = OPTION_GROUPS[group] || [];
  const match = options.find(
    (item) => item.value === value || (item.aliases || []).includes(String(value))
  );
  return match ? match.value : String(value);
}

/** Resolve the human-readable label for a stored value. */
export function labelFor(group, value, fallback = '—') {
  if (value === null || value === undefined || value === '') return fallback;
  const options = OPTION_GROUPS[group] || [];
  const normalized = normalizeOptionValue(group, value);
  const match = options.find((item) => item.value === normalized);
  return match ? match.label : String(value);
}

export function optionsFor(group) {
  return OPTION_GROUPS[group] || [];
}
