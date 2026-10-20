import { z } from 'zod';

const optionalNumber = (schema) =>
  z.preprocess((value) => {
    if (value === '' || value === null || value === undefined) return undefined;
    return value;
  }, schema.optional());

const text = z.string().max(5000).optional();
const list = z.union([z.array(z.union([z.string(), z.number()])), z.string()]).optional();
const number = z.union([z.number(), z.string(), z.null()]).optional();
const yesNo = z.union([z.boolean(), z.enum(['yes', 'no', 'true', 'false']), z.null()]).optional();

/**
 * Profile payloads are intentionally permissive: the client can send either
 * canonical camelCase fields or the legacy names, and the domain model
 * performs the final coercion. Core identity/safety fields are still checked.
 */
export const updateProfileSchema = z
  .object({
    fullName: z.string().trim().max(120).optional(),
    fullname: z.string().trim().max(120).optional(),
    name: z.string().trim().max(120).optional(),
    gender: z.enum(['male', 'female', '']).optional(),
    dateOfBirth: z
      .string()
      .regex(/^\d{4}-\d{2}-\d{2}$/, 'Date of birth must use YYYY-MM-DD.')
      .or(z.literal(''))
      .optional(),
    email: z.string().email().optional(),
    isPublic: z.boolean().optional(),
    is_public: z.boolean().optional(),
    mobileNumber: z.string().max(30).optional(),
    parentNumber: z.string().max(30).optional(),
    socialLinks: z.string().max(500).optional(),
    aboutMe: z.string().max(5000).optional(),
    myExpectation: z.string().max(5000).optional(),
    income: number,
    childrenCount: number,
    workExperience: number,
    noOfBrothers: number,
    noOfBrother: number,
    noOfSisters: number,
    noOfSister: number,
    partnerFromAge: number,
    fromAge: number,
    partnerToAge: number,
    toAge: number,
    pwd: yesNo,
    isRevert: yesNo,
    partnerEducated: yesNo,
    partnerProfessional: yesNo,
    isPartnerProfessional: yesNo,
    languages: list,
    languagesKnownArray: list,
    occupations: list,
    occupationArray: list,
    fatherOccupations: list,
    fatherOccupation: list,
    motherOccupations: list,
    motherOccupation: list,
    ethnicity: list,
    scholars: list,
    inspirations: list,
    myInspirationArray: list,
    hobbies: list,
    partnerProfessions: list,
    partnersProfessionArray: list,
    image: z.string().max(2048).optional(),
    imageUrl: z.string().max(2048).optional(),
    image_url: z.string().max(2048).optional(),
    registeredFor: text,
    bloodGroup: text,
    maritalStatus: text,
    children: text,
    pwdType: text,
    country: text,
    state: text,
    city: text,
    permanentCountry: text,
    permanentState: text,
    permanentCity: text,
    permenantCountry: text,
    permenantState: text,
    permenantCity: text,
    education: text,
    ugCourse: text,
    pgCourse: text,
    company: text,
    workLocation: text,
    financialStatus: text,
    familyLivingIn: text,
    parent: text,
    parentName: text,
    revertedFrom: text,
    startedPracticing: text,
    sect: text,
    salahPattern: text,
    quranRead: text,
    practicingLevel: text,
    youtubeChannels: text,
    socialMediaInfluencers: text,
    political: text,
    eatingHabits: text,
    smokeAndDrink: text,
    partnerEducation: text,
    partnerSect: text,
    partnerCountry: text,
    partnerState: text,
    partnerCity: text,
    partnersPreferredCountry: text,
    partnersPreferredState: text,
    partnersPreferredCity: text,
    quranVerse: text,
  })
  .partial()
  .passthrough();

export const idParamsSchema = z.object({
  id: z.string().uuid('A valid profile id is required.'),
});

export const searchSchema = z
  .object({
    gender: z.enum(['male', 'female', 'both']).optional(),
    country: z.string().trim().max(100).optional(),
    state: z.string().trim().max(100).optional(),
    city: z.string().trim().max(100).optional(),
    language: z.string().trim().max(100).optional(),
    occupation: z.string().trim().max(100).optional(),
    minAge: optionalNumber(z.coerce.number().int().min(18).max(100)),
    age: optionalNumber(z.coerce.number().int().min(18).max(100)),
    income: optionalNumber(z.coerce.number().min(0)),
    maritalStatus: z.string().trim().max(60).optional(),
    sect: z.string().trim().max(100).optional(),
    education: z.string().trim().max(60).optional(),
    eatingHabits: z.string().trim().max(60).optional(),
    practicingLevel: z.string().trim().max(100).optional(),
    smokeAndDrink: z.string().trim().max(100).optional(),
    financialStatus: z.string().trim().max(60).optional(),
    page: optionalNumber(z.coerce.number().int().min(1)),
    limit: optionalNumber(z.coerce.number().int().min(1).max(100)),
  })
  .partial();
