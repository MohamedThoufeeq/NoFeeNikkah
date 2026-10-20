import { asArray } from '../../lib/utils/array';
import { getAgeInYears } from '../../lib/utils/date';
import { normalizeOptionValue } from './profileOptions';

const toString = (value, fallback = '') => {
  if (value === null || value === undefined) return fallback;
  return String(value);
};

const firstDefined = (...values) => values.find((value) => value !== null && value !== undefined);

const toList = (value) =>
  asArray(value)
    .flatMap((item) => {
      if (typeof item !== 'string') return [item];
      return item.includes(',') ? item.split(',').map((part) => part.trim()) : [item];
    })
    .map((item) => (typeof item === 'string' ? item.trim() : item))
    .filter((item) => item !== '' && item !== null && item !== undefined);

const toYesNo = (value) => {
  if (value === true) return 'yes';
  if (value === false) return 'no';
  const text = String(value ?? '').toLowerCase();
  return text === 'yes' || text === 'no' ? text : '';
};

const toOptionalNumber = (value) => {
  if (value === null || value === undefined || value === '') return '';
  return String(value);
};

export const EMPTY_PROFILE = Object.freeze({
  id: '',
  username: '',
  fullName: '',
  registeredFor: '',
  gender: '',
  dateOfBirth: '',
  age: null,
  bloodGroup: '',
  maritalStatus: '',
  children: '',
  childrenCount: '',
  pwd: '',
  pwdType: '',
  languages: [],
  country: '',
  state: '',
  city: '',
  permanentCountry: '',
  permanentState: '',
  permanentCity: '',
  ethnicity: [],
  education: '',
  ugCourse: '',
  pgCourse: '',
  occupations: [],
  income: '',
  company: '',
  workLocation: '',
  workExperience: '',
  fatherOccupations: [],
  motherOccupations: [],
  noOfBrothers: '',
  noOfSisters: '',
  financialStatus: '',
  familyLivingIn: '',
  email: '',
  mobileNumber: '',
  parent: '',
  parentName: '',
  parentNumber: '',
  socialLinks: '',
  aboutMe: '',
  myExpectation: '',
  quranVerse: '',
  isRevert: '',
  revertedFrom: '',
  startedPracticing: '',
  sect: '',
  salahPattern: '',
  quranRead: '',
  practicingLevel: '',
  scholars: [],
  inspirations: [],
  youtubeChannels: '',
  socialMediaInfluencers: '',
  political: '',
  hobbies: [],
  eatingHabits: '',
  smokeAndDrink: '',
  partnerEducated: '',
  partnerEducation: '',
  partnerProfessional: '',
  partnerProfessions: [],
  partnerFromAge: '',
  partnerToAge: '',
  partnerSect: '',
  partnerCountry: '',
  partnerState: '',
  partnerCity: '',
  image: '',
});

/**
 * Convert any backend/sample shape into the single canonical UI model.
 * Add aliases here when an API field is renamed; the rest of the app is
 * unaffected.
 */
export function mapProfileFromApi(raw = {}) {
  const source = raw || {};
  const dateOfBirth = toString(source.dateOfBirth);
  const ageFromApi = Number(source.age);

  return {
    ...EMPTY_PROFILE,
    id: toString(firstDefined(source.id, source.profileId)),
    username: toString(source.username),
    fullName: toString(firstDefined(source.fullName, source.fullname, source.name)),
    registeredFor: normalizeOptionValue('registeredFor', source.registeredFor),
    gender: normalizeOptionValue('gender', source.gender),
    dateOfBirth,
    age: getAgeInYears(dateOfBirth) ?? (Number.isFinite(ageFromApi) ? ageFromApi : null),
    bloodGroup: toString(source.bloodGroup),
    maritalStatus: normalizeOptionValue('maritalStatus', source.maritalStatus),
    children: normalizeOptionValue('children', source.children),
    childrenCount: toOptionalNumber(source.childrenCount),
    pwd: toYesNo(source.pwd),
    pwdType: toString(source.pwdType),
    languages: toList(
      firstDefined(source.languages, source.languagesKnownArray, source.language)
    ),
    country: toString(source.country),
    state: toString(source.state),
    city: toString(source.city),
    permanentCountry: toString(firstDefined(source.permanentCountry, source.permenantCountry)),
    permanentState: toString(firstDefined(source.permanentState, source.permenantState)),
    permanentCity: toString(firstDefined(source.permanentCity, source.permenantCity)),
    ethnicity: toList(source.ethnicity),
    education: normalizeOptionValue('education', source.education),
    ugCourse: toString(source.ugCourse),
    pgCourse: toString(source.pgCourse),
    occupations: toList(firstDefined(source.occupations, source.occupationArray, source.occupation)),
    income: toOptionalNumber(source.income),
    company: toString(source.company),
    workLocation: toString(source.workLocation),
    workExperience: toOptionalNumber(source.workExperience),
    fatherOccupations: toList(
      firstDefined(source.fatherOccupations, source.fatherOccupationArray, source.fatherOccupation)
    ),
    motherOccupations: toList(
      firstDefined(source.motherOccupations, source.motherOccupationArray, source.motherOccupation)
    ),
    noOfBrothers: toOptionalNumber(firstDefined(source.noOfBrothers, source.noOfBrother)),
    noOfSisters: toOptionalNumber(firstDefined(source.noOfSisters, source.noOfSister)),
    financialStatus: normalizeOptionValue('financialStatus', source.financialStatus),
    familyLivingIn: toString(source.familyLivingIn),
    email: toString(source.email),
    mobileNumber: toString(source.mobileNumber),
    parent: normalizeOptionValue('parent', source.parent),
    parentName: toString(source.parentName),
    parentNumber: toString(source.parentNumber),
    socialLinks: toString(source.socialLinks),
    aboutMe: toString(source.aboutMe),
    myExpectation: toString(source.myExpectation),
    quranVerse: toString(source.quranVerse),
    isRevert: toYesNo(source.isRevert),
    revertedFrom: toString(source.revertedFrom),
    startedPracticing: toString(source.startedPracticing),
    sect: normalizeOptionValue('sect', source.sect),
    salahPattern: normalizeOptionValue('salahPattern', source.salahPattern),
    quranRead: normalizeOptionValue('quranRead', source.quranRead),
    practicingLevel: normalizeOptionValue('practicingLevel', source.practicingLevel),
    scholars: toList(source.scholars),
    inspirations: toList(firstDefined(source.inspirations, source.myInspirationArray)),
    youtubeChannels: toString(source.youtubeChannels),
    socialMediaInfluencers: toString(source.socialMediaInfluencers),
    political: normalizeOptionValue('political', source.political),
    hobbies: toList(source.hobbies),
    eatingHabits: normalizeOptionValue('eatingHabits', source.eatingHabits),
    smokeAndDrink: normalizeOptionValue('smokeAndDrink', source.smokeAndDrink),
    partnerEducated: toYesNo(source.partnerEducated),
    partnerEducation: normalizeOptionValue('education', source.partnerEducation),
    partnerProfessional: toYesNo(
      firstDefined(source.partnerProfessional, source.isPartnerProfessional)
    ),
    partnerProfessions: toList(
      firstDefined(source.partnerProfessions, source.partnersProfessionArray)
    ),
    partnerFromAge: toOptionalNumber(firstDefined(source.partnerFromAge, source.fromAge)),
    partnerToAge: toOptionalNumber(firstDefined(source.partnerToAge, source.toAge)),
    partnerSect: normalizeOptionValue('partnerSect', source.partnerSect),
    partnerCountry: toString(
      firstDefined(source.partnerCountry, source.partnersPreferredCountry)
    ),
    partnerState: toString(firstDefined(source.partnerState, source.partnersPreferredState)),
    partnerCity: toString(firstDefined(source.partnerCity, source.partnersPreferredCity)),
    image: toString(firstDefined(source.image, source.profileImage)),
  };
}

/**
 * Convert the canonical UI model into the existing backend payload contract.
 * When the API changes, only this function needs updating.
 */
export function mapProfileToApi(profile = {}) {
  return {
    registeredFor: profile.registeredFor,
    fullname: profile.fullName,
    gender: profile.gender,
    dateOfBirth: profile.dateOfBirth,
    bloodGroup: profile.bloodGroup,
    maritalStatus: profile.maritalStatus,
    children: profile.children,
    childrenCount: profile.childrenCount,
    pwd: profile.pwd,
    pwdType: profile.pwdType,
    languagesKnownArray: asArray(profile.languages),
    country: profile.country,
    state: profile.state,
    city: profile.city,
    permenantCountry: profile.permanentCountry,
    permenantState: profile.permanentState,
    permenantCity: profile.permanentCity,
    ethnicity: asArray(profile.ethnicity),
    education: profile.education,
    ugCourse: profile.ugCourse,
    pgCourse: profile.pgCourse,
    occupationArray: asArray(profile.occupations),
    income: profile.income,
    company: profile.company,
    workLocation: profile.workLocation,
    workExperience: profile.workExperience,
    fatherOccupation: asArray(profile.fatherOccupations),
    motherOccupation: asArray(profile.motherOccupations),
    noOfBrother: profile.noOfBrothers,
    noOfSister: profile.noOfSisters,
    financialStatus: profile.financialStatus,
    familyLivingIn: profile.familyLivingIn,
    email: profile.email,
    mobileNumber: profile.mobileNumber,
    parent: profile.parent,
    parentName: profile.parentName,
    parentNumber: profile.parentNumber,
    socialLinks: profile.socialLinks,
    aboutMe: profile.aboutMe,
    myExpectation: profile.myExpectation,
    quranVerse: profile.quranVerse,
    isRevert: profile.isRevert || null,
    revertedFrom: profile.revertedFrom,
    startedPracticing: profile.startedPracticing,
    sect: profile.sect,
    salahPattern: profile.salahPattern,
    quranRead: profile.quranRead,
    practicingLevel: profile.practicingLevel,
    scholars: asArray(profile.scholars),
    myInspirationArray: asArray(profile.inspirations),
    youtubeChannels: profile.youtubeChannels,
    socialMediaInfluencers: profile.socialMediaInfluencers,
    political: profile.political,
    hobbies: asArray(profile.hobbies),
    eatingHabits: profile.eatingHabits,
    smokeAndDrink: profile.smokeAndDrink,
    partnerEducated: profile.partnerEducated,
    partnerEducation: profile.partnerEducation,
    isPartnerProfessional: profile.partnerProfessional,
    partnersProfessionArray: asArray(profile.partnerProfessions),
    fromAge: profile.partnerFromAge,
    toAge: profile.partnerToAge,
    partnerSect: profile.partnerSect,
    partnersPreferredCountry: profile.partnerCountry,
    partnersPreferredState: profile.partnerState,
    partnersPreferredCity: profile.partnerCity,
    image: profile.image,
  };
}

export default mapProfileFromApi;
