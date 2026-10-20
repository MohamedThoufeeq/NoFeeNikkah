import {
  firstDefined,
  normalizeUsername,
  toList,
  toOptionalBoolean,
  toOptionalInteger,
  toOptionalNumber,
  toOptionalText,
  toText,
  toYesNo,
} from '../utils/coerce.js';
import { getAgeInYears } from '../utils/date.js';
import { maskPhone } from '../utils/mask.js';

export const EMPTY_PROFILE = Object.freeze({
  id: '',
  username: '',
  fullName: '',
  registeredFor: '',
  gender: '',
  dateOfBirth: '',
  bloodGroup: '',
  maritalStatus: '',
  children: '',
  childrenCount: null,
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
  income: null,
  company: '',
  workLocation: '',
  workExperience: null,
  fatherOccupations: [],
  motherOccupations: [],
  noOfBrothers: null,
  noOfSisters: null,
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
  partnerFromAge: null,
  partnerToAge: null,
  partnerSect: '',
  partnerCountry: '',
  partnerState: '',
  partnerCity: '',
  image: '',
  isPublic: true,
  createdAt: null,
  updatedAt: null,
});

/**
 * Canonical profile domain model.
 *
 * It is deliberately independent from HTTP and Supabase. Repositories map rows
 * in, presenters map the model out, and the rest of the code only sees this
 * stable shape.
 */
export class Profile {
  constructor(data = {}) {
    const source = { ...EMPTY_PROFILE, ...data };
    Object.assign(this, source);
    this.languages = toList(source.languages);
    this.ethnicity = toList(source.ethnicity);
    this.occupations = toList(source.occupations);
    this.fatherOccupations = toList(source.fatherOccupations);
    this.motherOccupations = toList(source.motherOccupations);
    this.scholars = toList(source.scholars);
    this.inspirations = toList(source.inspirations);
    this.hobbies = toList(source.hobbies);
    this.partnerProfessions = toList(source.partnerProfessions);
    this.pwd = toYesNo(source.pwd);
    this.isRevert = toYesNo(source.isRevert);
    this.partnerEducated = toYesNo(source.partnerEducated);
    this.partnerProfessional = toYesNo(source.partnerProfessional);
    this.childrenCount = toOptionalInteger(source.childrenCount);
    this.income = toOptionalNumber(source.income);
    this.workExperience = toOptionalInteger(source.workExperience);
    this.noOfBrothers = toOptionalInteger(source.noOfBrothers);
    this.noOfSisters = toOptionalInteger(source.noOfSisters);
    this.partnerFromAge = toOptionalInteger(source.partnerFromAge);
    this.partnerToAge = toOptionalInteger(source.partnerToAge);
    this.isPublic = toOptionalBoolean(source.isPublic, true) ?? true;
  }

  static fromRow(row = {}) {
    return new Profile({
      id: toText(row.id),
      username: toText(row.username),
      fullName: toText(row.full_name),
      registeredFor: toText(row.registered_for),
      gender: toText(row.gender),
      dateOfBirth: toText(row.date_of_birth),
      bloodGroup: toText(row.blood_group),
      maritalStatus: toText(row.marital_status),
      children: toText(row.children),
      childrenCount: row.children_count,
      pwd: row.pwd,
      pwdType: toText(row.pwd_type),
      languages: row.languages,
      country: toText(row.country),
      state: toText(row.state),
      city: toText(row.city),
      permanentCountry: toText(row.permanent_country),
      permanentState: toText(row.permanent_state),
      permanentCity: toText(row.permanent_city),
      ethnicity: row.ethnicity,
      education: toText(row.education),
      ugCourse: toText(row.ug_course),
      pgCourse: toText(row.pg_course),
      occupations: row.occupations,
      income: row.income,
      company: toText(row.company),
      workLocation: toText(row.work_location),
      workExperience: row.work_experience,
      fatherOccupations: row.father_occupations,
      motherOccupations: row.mother_occupations,
      noOfBrothers: row.no_of_brothers,
      noOfSisters: row.no_of_sisters,
      financialStatus: toText(row.financial_status),
      familyLivingIn: toText(row.family_living_in),
      email: toText(row.email),
      mobileNumber: toText(row.mobile_number),
      parent: toText(row.parent),
      parentName: toText(row.parent_name),
      parentNumber: toText(row.parent_number),
      socialLinks: toText(row.social_links),
      aboutMe: toText(row.about_me),
      myExpectation: toText(row.my_expectation),
      quranVerse: toText(row.quran_verse),
      isRevert: row.is_revert,
      revertedFrom: toText(row.reverted_from),
      startedPracticing: toText(row.started_practicing),
      sect: toText(row.sect),
      salahPattern: toText(row.salah_pattern),
      quranRead: toText(row.quran_read),
      practicingLevel: toText(row.practicing_level),
      scholars: row.scholars,
      inspirations: row.inspirations,
      youtubeChannels: toText(row.youtube_channels),
      socialMediaInfluencers: toText(row.social_media_influencers),
      political: toText(row.political),
      hobbies: row.hobbies,
      eatingHabits: toText(row.eating_habits),
      smokeAndDrink: toText(row.smoke_and_drink),
      partnerEducated: row.partner_educated,
      partnerEducation: toText(row.partner_education),
      partnerProfessional: row.partner_professional,
      partnerProfessions: row.partner_professions,
      partnerFromAge: row.partner_from_age,
      partnerToAge: row.partner_to_age,
      partnerSect: toText(row.partner_sect),
      partnerCountry: toText(row.partner_country),
      partnerState: toText(row.partner_state),
      partnerCity: toText(row.partner_city),
      image: toText(row.image_url),
      isPublic: row.is_public,
      createdAt: row.created_at || null,
      updatedAt: row.updated_at || null,
    });
  }

  /**
   * Accepts both the canonical client model and the legacy API field names.
   * Existing values are used when a field is absent, which makes the same
   * method suitable for PATCH-style updates.
   */
  static fromRequest(payload = {}, base = {}) {
    const current = base instanceof Profile ? base.toApi({ includePrivate: true }) : { ...EMPTY_PROFILE, ...base };
    const source = payload || {};
    const pick = (...keys) => firstDefined(...keys.map((key) => source[key]));
    const withFallback = (value, fallback) =>
      value === undefined || value === null ? fallback : value;

    return new Profile({
      id: toText(withFallback(pick('id', 'profileId'), current.id)),
      username: normalizeUsername(withFallback(pick('username'), current.username)),
      fullName: toText(withFallback(pick('fullName', 'fullname', 'name'), current.fullName)),
      registeredFor: toText(withFallback(pick('registeredFor'), current.registeredFor)),
      gender: toText(withFallback(pick('gender'), current.gender)),
      dateOfBirth: toText(withFallback(pick('dateOfBirth'), current.dateOfBirth)),
      bloodGroup: toText(withFallback(pick('bloodGroup'), current.bloodGroup)),
      maritalStatus: toText(withFallback(pick('maritalStatus'), current.maritalStatus)),
      children: toText(withFallback(pick('children'), current.children)),
      childrenCount: withFallback(pick('childrenCount'), current.childrenCount),
      pwd: withFallback(pick('pwd'), current.pwd),
      pwdType: toText(withFallback(pick('pwdType'), current.pwdType)),
      languages: withFallback(
        pick('languages', 'languagesKnownArray', 'language'),
        current.languages
      ),
      country: toText(withFallback(pick('country'), current.country)),
      state: toText(withFallback(pick('state'), current.state)),
      city: toText(withFallback(pick('city'), current.city)),
      permanentCountry: toText(
        withFallback(pick('permanentCountry', 'permenantCountry'), current.permanentCountry)
      ),
      permanentState: toText(
        withFallback(pick('permanentState', 'permenantState'), current.permanentState)
      ),
      permanentCity: toText(
        withFallback(pick('permanentCity', 'permenantCity'), current.permanentCity)
      ),
      ethnicity: withFallback(pick('ethnicity'), current.ethnicity),
      education: toText(withFallback(pick('education'), current.education)),
      ugCourse: toText(withFallback(pick('ugCourse'), current.ugCourse)),
      pgCourse: toText(withFallback(pick('pgCourse'), current.pgCourse)),
      occupations: withFallback(
        pick('occupations', 'occupationArray', 'occupation'),
        current.occupations
      ),
      income: withFallback(pick('income'), current.income),
      company: toText(withFallback(pick('company'), current.company)),
      workLocation: toText(withFallback(pick('workLocation'), current.workLocation)),
      workExperience: withFallback(pick('workExperience'), current.workExperience),
      fatherOccupations: withFallback(
        pick('fatherOccupations', 'fatherOccupationArray', 'fatherOccupation'),
        current.fatherOccupations
      ),
      motherOccupations: withFallback(
        pick('motherOccupations', 'motherOccupationArray', 'motherOccupation'),
        current.motherOccupations
      ),
      noOfBrothers: withFallback(
        pick('noOfBrothers', 'noOfBrother'),
        current.noOfBrothers
      ),
      noOfSisters: withFallback(
        pick('noOfSisters', 'noOfSister'),
        current.noOfSisters
      ),
      financialStatus: toText(withFallback(pick('financialStatus'), current.financialStatus)),
      familyLivingIn: toText(withFallback(pick('familyLivingIn'), current.familyLivingIn)),
      email: toText(withFallback(pick('email'), current.email)),
      mobileNumber: toText(withFallback(pick('mobileNumber'), current.mobileNumber)),
      parent: toText(withFallback(pick('parent'), current.parent)),
      parentName: toText(withFallback(pick('parentName'), current.parentName)),
      parentNumber: toText(withFallback(pick('parentNumber'), current.parentNumber)),
      socialLinks: toText(withFallback(pick('socialLinks'), current.socialLinks)),
      aboutMe: toText(withFallback(pick('aboutMe'), current.aboutMe)),
      myExpectation: toText(withFallback(pick('myExpectation'), current.myExpectation)),
      quranVerse: toText(withFallback(pick('quranVerse'), current.quranVerse)),
      isRevert: withFallback(pick('isRevert'), current.isRevert),
      revertedFrom: toText(withFallback(pick('revertedFrom'), current.revertedFrom)),
      startedPracticing: toText(
        withFallback(pick('startedPracticing'), current.startedPracticing)
      ),
      sect: toText(withFallback(pick('sect'), current.sect)),
      salahPattern: toText(withFallback(pick('salahPattern'), current.salahPattern)),
      quranRead: toText(withFallback(pick('quranRead'), current.quranRead)),
      practicingLevel: toText(
        withFallback(pick('practicingLevel'), current.practicingLevel)
      ),
      scholars: withFallback(pick('scholars'), current.scholars),
      inspirations: withFallback(
        pick('inspirations', 'myInspirationArray'),
        current.inspirations
      ),
      youtubeChannels: toText(
        withFallback(pick('youtubeChannels'), current.youtubeChannels)
      ),
      socialMediaInfluencers: toText(
        withFallback(pick('socialMediaInfluencers'), current.socialMediaInfluencers)
      ),
      political: toText(withFallback(pick('political'), current.political)),
      hobbies: withFallback(pick('hobbies'), current.hobbies),
      eatingHabits: toText(withFallback(pick('eatingHabits'), current.eatingHabits)),
      smokeAndDrink: toText(withFallback(pick('smokeAndDrink'), current.smokeAndDrink)),
      partnerEducated: withFallback(pick('partnerEducated'), current.partnerEducated),
      partnerEducation: toText(
        withFallback(pick('partnerEducation'), current.partnerEducation)
      ),
      partnerProfessional: withFallback(
        pick('partnerProfessional', 'isPartnerProfessional'),
        current.partnerProfessional
      ),
      partnerProfessions: withFallback(
        pick('partnerProfessions', 'partnersProfessionArray'),
        current.partnerProfessions
      ),
      partnerFromAge: withFallback(
        pick('partnerFromAge', 'fromAge'),
        current.partnerFromAge
      ),
      partnerToAge: withFallback(pick('partnerToAge', 'toAge'), current.partnerToAge),
      partnerSect: toText(withFallback(pick('partnerSect'), current.partnerSect)),
      partnerCountry: toText(
        withFallback(
          pick('partnerCountry', 'partnersPreferredCountry'),
          current.partnerCountry
        )
      ),
      partnerState: toText(
        withFallback(
          pick('partnerState', 'partnersPreferredState'),
          current.partnerState
        )
      ),
      partnerCity: toText(
        withFallback(pick('partnerCity', 'partnersPreferredCity'), current.partnerCity)
      ),
      image: toText(withFallback(pick('image', 'imageUrl', 'image_url', 'profileImage'), current.image)),
      isPublic: withFallback(pick('isPublic', 'is_public'), current.isPublic),
      createdAt: current.createdAt,
      updatedAt: current.updatedAt,
    });
  }

  get age() {
    return getAgeInYears(this.dateOfBirth);
  }

  toRow({ includeIdentity = false } = {}) {
    const row = {
      full_name: this.fullName,
      registered_for: this.registeredFor,
      gender: this.gender,
      date_of_birth: toOptionalText(this.dateOfBirth),
      blood_group: this.bloodGroup,
      marital_status: this.maritalStatus,
      children: this.children,
      children_count: this.childrenCount,
      pwd: this.pwd,
      pwd_type: this.pwdType,
      languages: this.languages,
      country: this.country,
      state: this.state,
      city: this.city,
      permanent_country: this.permanentCountry,
      permanent_state: this.permanentState,
      permanent_city: this.permanentCity,
      ethnicity: this.ethnicity,
      education: this.education,
      ug_course: this.ugCourse,
      pg_course: this.pgCourse,
      occupations: this.occupations,
      income: this.income,
      company: this.company,
      work_location: this.workLocation,
      work_experience: this.workExperience,
      father_occupations: this.fatherOccupations,
      mother_occupations: this.motherOccupations,
      no_of_brothers: this.noOfBrothers,
      no_of_sisters: this.noOfSisters,
      financial_status: this.financialStatus,
      family_living_in: this.familyLivingIn,
      mobile_number: this.mobileNumber,
      parent: this.parent,
      parent_name: this.parentName,
      parent_number: this.parentNumber,
      social_links: this.socialLinks,
      about_me: this.aboutMe,
      my_expectation: this.myExpectation,
      quran_verse: this.quranVerse,
      is_revert: this.isRevert,
      reverted_from: this.revertedFrom,
      started_practicing: toOptionalText(this.startedPracticing),
      sect: this.sect,
      salah_pattern: this.salahPattern,
      quran_read: this.quranRead,
      practicing_level: this.practicingLevel,
      scholars: this.scholars,
      inspirations: this.inspirations,
      youtube_channels: this.youtubeChannels,
      social_media_influencers: this.socialMediaInfluencers,
      political: this.political,
      hobbies: this.hobbies,
      eating_habits: this.eatingHabits,
      smoke_and_drink: this.smokeAndDrink,
      partner_educated: this.partnerEducated,
      partner_education: this.partnerEducation,
      partner_professional: this.partnerProfessional,
      partner_professions: this.partnerProfessions,
      partner_from_age: this.partnerFromAge,
      partner_to_age: this.partnerToAge,
      partner_sect: this.partnerSect,
      partner_country: this.partnerCountry,
      partner_state: this.partnerState,
      partner_city: this.partnerCity,
      image_url: this.image,
      is_public: this.isPublic,
    };

    if (includeIdentity) {
      row.id = this.id;
      row.username = this.username;
      row.email = this.email || null;
    }

    return row;
  }

  toApi({ includePrivate = false } = {}) {
    return {
      id: this.id,
      username: this.username,
      fullName: this.fullName,
      registeredFor: this.registeredFor,
      gender: this.gender,
      dateOfBirth: this.dateOfBirth,
      age: this.age,
      bloodGroup: this.bloodGroup,
      maritalStatus: this.maritalStatus,
      children: this.children,
      childrenCount: this.childrenCount,
      pwd: this.pwd,
      pwdType: this.pwdType,
      languages: [...this.languages],
      country: this.country,
      state: this.state,
      city: this.city,
      permanentCountry: this.permanentCountry,
      permanentState: this.permanentState,
      permanentCity: this.permanentCity,
      ethnicity: [...this.ethnicity],
      education: this.education,
      ugCourse: this.ugCourse,
      pgCourse: this.pgCourse,
      occupations: [...this.occupations],
      income: this.income,
      company: this.company,
      workLocation: this.workLocation,
      workExperience: this.workExperience,
      fatherOccupations: [...this.fatherOccupations],
      motherOccupations: [...this.motherOccupations],
      noOfBrothers: this.noOfBrothers,
      noOfSisters: this.noOfSisters,
      financialStatus: this.financialStatus,
      familyLivingIn: this.familyLivingIn,
      email: this.email,
      mobileNumber: includePrivate ? this.mobileNumber : maskPhone(this.mobileNumber),
      parent: this.parent,
      parentName: this.parentName,
      parentNumber: includePrivate ? this.parentNumber : maskPhone(this.parentNumber),
      socialLinks: this.socialLinks,
      aboutMe: this.aboutMe,
      myExpectation: this.myExpectation,
      quranVerse: this.quranVerse,
      isRevert: this.isRevert,
      revertedFrom: this.revertedFrom,
      startedPracticing: this.startedPracticing,
      sect: this.sect,
      salahPattern: this.salahPattern,
      quranRead: this.quranRead,
      practicingLevel: this.practicingLevel,
      scholars: [...this.scholars],
      inspirations: [...this.inspirations],
      youtubeChannels: this.youtubeChannels,
      socialMediaInfluencers: this.socialMediaInfluencers,
      political: this.political,
      hobbies: [...this.hobbies],
      eatingHabits: this.eatingHabits,
      smokeAndDrink: this.smokeAndDrink,
      partnerEducated: this.partnerEducated,
      partnerEducation: this.partnerEducation,
      partnerProfessional: this.partnerProfessional,
      partnerProfessions: [...this.partnerProfessions],
      partnerFromAge: this.partnerFromAge,
      partnerToAge: this.partnerToAge,
      partnerSect: this.partnerSect,
      partnerCountry: this.partnerCountry,
      partnerState: this.partnerState,
      partnerCity: this.partnerCity,
      image: this.image,
      isPublic: this.isPublic,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    };
  }
}

export default Profile;
