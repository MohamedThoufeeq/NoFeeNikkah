/**
 * Demo data used by `npm run seed:demo`.
 *
 * The seed script creates these auth users through the Supabase Admin API,
 * then upserts the matching profile rows and interests. Keeping the data here
 * (instead of inline in the script) makes it easy to add or remove demo people.
 *
 * All accounts use the same password from `DEMO_PASSWORD`.
 */

export const DEMO_PASSWORD = 'DemoPass123!';

const BASE_PROFILE = Object.freeze({
  registeredFor: 'self',
  bloodGroup: '',
  maritalStatus: 'single',
  children: '',
  childrenCount: 0,
  pwd: 'no',
  pwdType: '',
  ethnicity: ['South Indian'],
  education: 'pg',
  ugCourse: '',
  pgCourse: '',
  income: null,
  company: '',
  workLocation: '',
  workExperience: null,
  fatherOccupations: [],
  motherOccupations: [],
  noOfBrothers: null,
  noOfSisters: null,
  financialStatus: 'middle',
  familyLivingIn: '',
  mobileNumber: '',
  parent: 'dad',
  parentName: '',
  parentNumber: '',
  socialLinks: '',
  aboutMe: '',
  myExpectation: '',
  quranVerse: '',
  isRevert: 'no',
  revertedFrom: '',
  startedPracticing: '',
  sect: 'pureSunni',
  salahPattern: 'veryHigh',
  quranRead: 'daily',
  practicingLevel: 'veryHigh',
  scholars: [],
  inspirations: [],
  youtubeChannels: '',
  socialMediaInfluencers: '',
  political: '',
  hobbies: [],
  eatingHabits: 'halal',
  smokeAndDrink: 'haram',
  partnerEducated: 'yes',
  partnerEducation: 'ug',
  partnerProfessional: 'yes',
  partnerProfessions: [],
  partnerFromAge: 24,
  partnerToAge: 35,
  partnerSect: 'anySect',
  partnerCountry: 'India',
  partnerState: '',
  partnerCity: '',
  image: '',
  isPublic: true,
});

function profile(overrides) {
  return { ...BASE_PROFILE, ...overrides };
}

const CURATED_USERS = [
  {
    key: 'aisha',
    email: 'aisha.rahman@example.com',
    username: 'aisha_rahman',
    profile: profile({
      fullName: 'Aisha Rahman',
      gender: 'female',
      dateOfBirth: '1998-04-12',
      bloodGroup: 'O+',
      languages: ['English', 'Tamil', 'Urdu'],
      country: 'India',
      state: 'Tamil Nadu',
      city: 'Chennai',
      permanentCountry: 'India',
      permanentState: 'Tamil Nadu',
      permanentCity: 'Chennai',
      education: 'pg',
      ugCourse: 'B.E. Computer Science',
      pgCourse: 'M.Tech Software Engineering',
      occupations: ['Software Engineer'],
      income: 100000,
      company: 'Northstar Technologies',
      workLocation: 'Chennai (Hybrid)',
      workExperience: 5,
      fatherOccupations: ['Business'],
      motherOccupations: ['Homemaker'],
      noOfBrothers: 1,
      noOfSisters: 1,
      familyLivingIn: 'Chennai',
      mobileNumber: '+919000000001',
      parentName: 'Abdul Rahman',
      parentNumber: '+919000000101',
      aboutMe:
        'Software engineer who values deen, family and quiet weekends. I enjoy reading, cooking and learning Arabic.',
      myExpectation:
        'A practising, kind and emotionally mature partner who values mutual respect and shared responsibility.',
      startedPracticing: '2017-06-01',
      hobbies: ['Reading', 'Cooking'],
      partnerProfessions: ['Software Engineer', 'Teacher'],
      partnerFromAge: 26,
      partnerToAge: 34,
      partnerState: 'Tamil Nadu',
      partnerCity: 'Chennai',
    }),
  },
  {
    key: 'fatima',
    email: 'fatima.siddiqui@example.com',
    username: 'fatima_siddiqui',
    profile: profile({
      fullName: 'Fatima Siddiqui',
      gender: 'female',
      dateOfBirth: '1996-09-03',
      bloodGroup: 'B+',
      languages: ['English', 'Urdu', 'Hindi'],
      country: 'India',
      state: 'Telangana',
      city: 'Hyderabad',
      permanentCountry: 'India',
      permanentState: 'Telangana',
      permanentCity: 'Hyderabad',
      ethnicity: ['Hyderabadi'],
      education: 'pg',
      ugCourse: 'MBBS',
      pgCourse: 'MD General Medicine',
      occupations: ['Doctor'],
      income: 150000,
      company: 'CarePoint Hospital',
      workLocation: 'Hyderabad',
      workExperience: 6,
      fatherOccupations: ['Professor'],
      motherOccupations: ['Teacher'],
      noOfBrothers: 2,
      noOfSisters: 1,
      familyLivingIn: 'Hyderabad',
      mobileNumber: '+919000000002',
      parentName: 'Imran Siddiqui',
      parentNumber: '+919000000102',
      aboutMe:
        'Physician with a love for teaching, biryani and long walks. I am looking for a home where deen and compassion come first.',
      myExpectation:
        'A practising professional who is family-oriented, patient and willing to grow together in faith.',
      startedPracticing: '2015-01-15',
      hobbies: ['Walking', 'Teaching'],
      partnerProfessions: ['Doctor', 'Engineer'],
      partnerFromAge: 28,
      partnerToAge: 36,
      partnerState: 'Telangana',
      partnerCity: 'Hyderabad',
    }),
  },
  {
    key: 'maryam',
    email: 'maryam.khan@example.com',
    username: 'maryam_khan',
    profile: profile({
      fullName: 'Maryam Khan',
      gender: 'female',
      dateOfBirth: '2000-01-25',
      bloodGroup: 'A+',
      languages: ['English', 'Urdu', 'Kannada'],
      country: 'India',
      state: 'Karnataka',
      city: 'Bengaluru',
      permanentCountry: 'India',
      permanentState: 'Karnataka',
      permanentCity: 'Bengaluru',
      education: 'ug',
      ugCourse: 'B.Ed.',
      occupations: ['School Teacher'],
      income: 58000,
      company: 'Al-Noor Public School',
      workLocation: 'Bengaluru',
      workExperience: 3,
      fatherOccupations: ['Bank Manager'],
      motherOccupations: ['Homemaker'],
      noOfBrothers: 0,
      noOfSisters: 2,
      familyLivingIn: 'Bengaluru',
      mobileNumber: '+919000000003',
      parentName: 'Yasmin Khan',
      parentNumber: '+919000000103',
      aboutMe:
        'Primary school teacher who enjoys calligraphy, gardening and volunteering at the local masjid.',
      myExpectation:
        'A sincere and practising partner with a calm temperament and a strong sense of family.',
      startedPracticing: '2018-08-20',
      hobbies: ['Gardening', 'Calligraphy'],
      partnerProfessions: ['Teacher', 'Engineer', 'Doctor'],
      partnerFromAge: 26,
      partnerToAge: 34,
      partnerState: 'Karnataka',
      partnerCity: 'Bengaluru',
    }),
  },
  {
    key: 'zainab',
    email: 'zainab.ali@example.com',
    username: 'zainab_ali',
    profile: profile({
      fullName: 'Zainab Ali',
      gender: 'female',
      dateOfBirth: '1994-06-18',
      bloodGroup: 'AB+',
      languages: ['English', 'Malayalam', 'Tamil'],
      country: 'India',
      state: 'Kerala',
      city: 'Kochi',
      permanentCountry: 'India',
      permanentState: 'Kerala',
      permanentCity: 'Kochi',
      ethnicity: ['Malayali'],
      education: 'pg',
      ugCourse: 'B.Arch.',
      pgCourse: 'M.Arch.',
      occupations: ['Architect'],
      income: 92000,
      company: 'Studio Verde',
      workLocation: 'Kochi (Hybrid)',
      workExperience: 7,
      fatherOccupations: ['Civil Engineer'],
      motherOccupations: ['Homemaker'],
      noOfBrothers: 1,
      noOfSisters: 0,
      familyLivingIn: 'Kochi',
      mobileNumber: '+919000000004',
      parentName: 'Hassan Ali',
      parentNumber: '+919000000104',
      aboutMe:
        'Architect interested in sustainable design, travel and good coffee. I keep my profile private and prefer thoughtful conversations.',
      myExpectation:
        'A practising partner who respects privacy, values design and is ready for a committed family life.',
      startedPracticing: '2016-03-10',
      hobbies: ['Design', 'Travel'],
      partnerProfessions: ['Architect', 'Engineer'],
      partnerFromAge: 30,
      partnerToAge: 38,
      partnerState: 'Kerala',
      partnerCity: 'Kochi',
      isPublic: false,
    }),
  },
  {
    key: 'yusuf',
    email: 'yusuf.ahmed@example.com',
    username: 'yusuf_ahmed',
    profile: profile({
      fullName: 'Yusuf Ahmed',
      gender: 'male',
      dateOfBirth: '1995-03-08',
      bloodGroup: 'O-',
      languages: ['English', 'Tamil', 'Urdu'],
      country: 'India',
      state: 'Tamil Nadu',
      city: 'Chennai',
      permanentCountry: 'India',
      permanentState: 'Tamil Nadu',
      permanentCity: 'Chennai',
      education: 'pg',
      ugCourse: 'B.Tech Information Technology',
      pgCourse: 'MBA',
      occupations: ['Product Manager'],
      income: 133000,
      company: 'BlueOrbit Labs',
      workLocation: 'Chennai (Hybrid)',
      workExperience: 8,
      fatherOccupations: ['Retired Government Officer'],
      motherOccupations: ['Homemaker'],
      noOfBrothers: 1,
      noOfSisters: 2,
      familyLivingIn: 'Chennai',
      mobileNumber: '+919000000005',
      parentName: 'Nadeem Ahmed',
      parentNumber: '+919000000105',
      aboutMe:
        'Product manager who enjoys running, reading seerah and building side projects. I value consistency over intensity.',
      myExpectation:
        'A practising, ambitious and compassionate partner who wants a partnership of equals.',
      startedPracticing: '2014-11-01',
      hobbies: ['Running', 'Reading'],
      partnerProfessions: ['Product Manager', 'Designer', 'Teacher'],
      partnerFromAge: 24,
      partnerToAge: 32,
      partnerState: 'Tamil Nadu',
      partnerCity: 'Chennai',
    }),
  },
  {
    key: 'omar',
    email: 'omar.farooq@example.com',
    username: 'omar_farooq',
    profile: profile({
      fullName: 'Omar Farooq',
      gender: 'male',
      dateOfBirth: '1993-11-30',
      bloodGroup: 'B-',
      languages: ['English', 'Urdu', 'Hindi'],
      country: 'India',
      state: 'Telangana',
      city: 'Hyderabad',
      permanentCountry: 'India',
      permanentState: 'Telangana',
      permanentCity: 'Hyderabad',
      ethnicity: ['Hyderabadi'],
      education: 'pg',
      ugCourse: 'B.Tech Computer Science',
      pgCourse: 'M.S. Data Science',
      occupations: ['Data Scientist'],
      income: 158000,
      company: 'InsightWorks',
      workLocation: 'Hyderabad (Remote)',
      workExperience: 9,
      fatherOccupations: ['Business'],
      motherOccupations: ['Homemaker'],
      noOfBrothers: 0,
      noOfSisters: 1,
      familyLivingIn: 'Hyderabad',
      mobileNumber: '+919000000006',
      parentName: 'Farooq Ahmed',
      parentNumber: '+919000000106',
      aboutMe:
        'Data scientist, amateur photographer and dedicated uncle to three nieces. I enjoy meaningful conversations and serving the community.',
      myExpectation:
        'A practising partner who is curious, kind and open to building a warm, faith-centred home.',
      startedPracticing: '2013-05-12',
      hobbies: ['Photography', 'Cycling'],
      partnerProfessions: ['Data Scientist', 'Doctor', 'Teacher'],
      partnerFromAge: 26,
      partnerToAge: 34,
      partnerState: 'Telangana',
      partnerCity: 'Hyderabad',
    }),
  },
  {
    key: 'ibrahim',
    email: 'ibrahim.hassan@example.com',
    username: 'ibrahim_hassan',
    profile: profile({
      fullName: 'Ibrahim Hassan',
      gender: 'male',
      dateOfBirth: '1997-07-21',
      bloodGroup: 'A-',
      languages: ['English', 'Kannada', 'Urdu'],
      country: 'India',
      state: 'Karnataka',
      city: 'Bengaluru',
      permanentCountry: 'India',
      permanentState: 'Karnataka',
      permanentCity: 'Bengaluru',
      education: 'ug',
      ugCourse: 'B.E. Civil Engineering',
      occupations: ['Civil Engineer'],
      income: 75000,
      company: 'BuildRight Infra',
      workLocation: 'Bengaluru',
      workExperience: 4,
      fatherOccupations: ['Contractor'],
      motherOccupations: ['Homemaker'],
      noOfBrothers: 2,
      noOfSisters: 0,
      familyLivingIn: 'Bengaluru',
      mobileNumber: '+919000000007',
      parentName: 'Salim Hassan',
      parentNumber: '+919000000107',
      aboutMe:
        'Civil engineer who likes sketching, cricket and helping with community construction projects.',
      myExpectation:
        'A practising partner who is grounded, family-oriented and enjoys a simple, purposeful life.',
      startedPracticing: '2016-09-05',
      hobbies: ['Cricket', 'Sketching'],
      partnerProfessions: ['Teacher', 'Engineer'],
      partnerFromAge: 24,
      partnerToAge: 32,
      partnerState: 'Karnataka',
      partnerCity: 'Bengaluru',
    }),
  },
  {
    key: 'bilal',
    email: 'bilal.malik@example.com',
    username: 'bilal_malik',
    profile: profile({
      fullName: 'Bilal Malik',
      gender: 'male',
      dateOfBirth: '1992-02-14',
      bloodGroup: 'AB-',
      languages: ['English', 'Malayalam', 'Hindi'],
      country: 'India',
      state: 'Kerala',
      city: 'Kochi',
      permanentCountry: 'India',
      permanentState: 'Kerala',
      permanentCity: 'Kochi',
      ethnicity: ['Malayali'],
      education: 'pg',
      ugCourse: 'B.Com.',
      pgCourse: 'MBA Finance',
      occupations: ['Entrepreneur'],
      income: 183000,
      company: 'Harbour Foods',
      workLocation: 'Kochi',
      workExperience: 10,
      fatherOccupations: ['Business'],
      motherOccupations: ['Homemaker'],
      noOfBrothers: 1,
      noOfSisters: 1,
      familyLivingIn: 'Kochi',
      mobileNumber: '+919000000008',
      parentName: 'Rashid Malik',
      parentNumber: '+919000000108',
      aboutMe:
        'Founder of a small food business. I enjoy travel, history and hosting family dinners.',
      myExpectation:
        'A practising partner who is independent, warm and excited about building something meaningful together.',
      startedPracticing: '2012-12-01',
      hobbies: ['Travel', 'History'],
      partnerProfessions: ['Entrepreneur', 'Doctor', 'Designer'],
      partnerFromAge: 27,
      partnerToAge: 36,
      partnerState: 'Kerala',
      partnerCity: 'Kochi',
    }),
  },
];

/*
 * A deterministic generator supplies the remaining 42 profiles. The eight
 * curated profiles above stay hand-written so the most common demo flows have
 * recognisable people; these generated records add volume and variety for
 * search, pagination, filters, privacy and interest testing.
 */
const GENERATED_PEOPLE = [
  ['Sara', 'Qureshi', 'female'],
  ['Hana', 'Patel', 'female'],
  ['Noor', 'Sheikh', 'female'],
  ['Amina', 'Syed', 'female'],
  ['Khadija', 'Ansari', 'female'],
  ['Sumayya', 'Iqbal', 'female'],
  ['Layla', 'Hussain', 'female'],
  ['Ruqayya', 'Mirza', 'female'],
  ['Safiya', 'Mohammed', 'female'],
  ['Hafsa', 'Choudhury', 'female'],
  ['Asma', 'Rahman', 'female'],
  ['Zoya', 'Siddique', 'female'],
  ['Nabila', 'Karim', 'female'],
  ['Farah', 'Naaz', 'female'],
  ['Iman', 'Bukhari', 'female'],
  ['Sana', 'Firdaus', 'female'],
  ['Rabia', 'Sayeed', 'female'],
  ['Maimuna', 'Bashir', 'female'],
  ['Tahira', 'Jahan', 'female'],
  ['Salma', 'Rizvi', 'female'],
  ['Aaliya', 'Merchant', 'female'],
  ['Adnan', 'Qureshi', 'male'],
  ['Hamza', 'Patel', 'male'],
  ['Zaid', 'Sheikh', 'male'],
  ['Imran', 'Syed', 'male'],
  ['Tariq', 'Ansari', 'male'],
  ['Faisal', 'Iqbal', 'male'],
  ['Rayyan', 'Hussain', 'male'],
  ['Mustafa', 'Mirza', 'male'],
  ['Saad', 'Mohammed', 'male'],
  ['Usman', 'Choudhury', 'male'],
  ['Danish', 'Rahman', 'male'],
  ['Arman', 'Siddique', 'male'],
  ['Kabir', 'Karim', 'male'],
  ['Naveed', 'Naaz', 'male'],
  ['Ayaan', 'Bukhari', 'male'],
  ['Shaan', 'Firdaus', 'male'],
  ['Rehan', 'Sayeed', 'male'],
  ['Junaid', 'Bashir', 'male'],
  ['Firoz', 'Jahan', 'male'],
  ['Sameer', 'Rizvi', 'male'],
  ['Ayaaz', 'Merchant', 'male'],
];

const LOCATIONS = [
  { country: 'India', state: 'Tamil Nadu', city: 'Chennai', languages: ['Tamil', 'English', 'Urdu'], ethnicity: ['Tamil'] },
  { country: 'India', state: 'Telangana', city: 'Hyderabad', languages: ['Urdu', 'Hindi', 'English', 'Telugu'], ethnicity: ['Hyderabadi'] },
  { country: 'India', state: 'Karnataka', city: 'Bengaluru', languages: ['Kannada', 'English', 'Urdu', 'Hindi'], ethnicity: ['Kannada'] },
  { country: 'India', state: 'Kerala', city: 'Kochi', languages: ['Malayalam', 'English', 'Tamil'], ethnicity: ['Malayali'] },
  { country: 'India', state: 'Maharashtra', city: 'Mumbai', languages: ['Marathi', 'Hindi', 'Urdu', 'English'], ethnicity: ['Marathi'] },
  { country: 'India', state: 'Delhi', city: 'Delhi', languages: ['Hindi', 'Urdu', 'English'], ethnicity: ['North Indian'] },
  { country: 'India', state: 'Uttar Pradesh', city: 'Lucknow', languages: ['Urdu', 'Hindi', 'English'], ethnicity: ['Awadhi'] },
  { country: 'India', state: 'West Bengal', city: 'Kolkata', languages: ['Bengali', 'Hindi', 'English', 'Urdu'], ethnicity: ['Bengali'] },
  { country: 'India', state: 'Gujarat', city: 'Ahmedabad', languages: ['Gujarati', 'Hindi', 'English'], ethnicity: ['Gujarati'] },
  { country: 'India', state: 'Maharashtra', city: 'Pune', languages: ['Marathi', 'Hindi', 'English'], ethnicity: ['Marathi'] },
  { country: 'India', state: 'Rajasthan', city: 'Jaipur', languages: ['Hindi', 'English', 'Urdu'], ethnicity: ['Rajasthani'] },
  { country: 'India', state: 'Madhya Pradesh', city: 'Bhopal', languages: ['Hindi', 'Urdu', 'English'], ethnicity: ['Central Indian'] },
  { country: 'India', state: 'Jammu and Kashmir', city: 'Srinagar', languages: ['Kashmiri', 'Urdu', 'English'], ethnicity: ['Kashmiri'] },
  { country: 'India', state: 'Assam', city: 'Guwahati', languages: ['Assamese', 'Bengali', 'English'], ethnicity: ['Assamese'] },
  { country: 'India', state: 'Kerala', city: 'Kozhikode', languages: ['Malayalam', 'English', 'Arabic'], ethnicity: ['Malayali'] },
  { country: 'UAE', state: 'Dubai', city: 'Dubai', languages: ['Arabic', 'English', 'Urdu', 'Malayalam'], ethnicity: ['Emirati'] },
  { country: 'UAE', state: 'Abu Dhabi', city: 'Abu Dhabi', languages: ['Arabic', 'English', 'Hindi', 'Urdu'], ethnicity: ['Emirati'] },
  { country: 'Qatar', state: 'Doha', city: 'Doha', languages: ['Arabic', 'English', 'Urdu'], ethnicity: ['Qatari'] },
  { country: 'Saudi Arabia', state: 'Riyadh', city: 'Riyadh', languages: ['Arabic', 'English'], ethnicity: ['Saudi'] },
  { country: 'United Kingdom', state: 'England', city: 'London', languages: ['English', 'Urdu', 'Bengali'], ethnicity: ['British Pakistani'] },
  { country: 'United Kingdom', state: 'England', city: 'Manchester', languages: ['English', 'Urdu'], ethnicity: ['British Indian'] },
  { country: 'Canada', state: 'Ontario', city: 'Toronto', languages: ['English', 'Urdu', 'Arabic'], ethnicity: ['Canadian'] },
  { country: 'United States', state: 'New York', city: 'New York', languages: ['English', 'Urdu', 'Bengali', 'Arabic'], ethnicity: ['American'] },
  { country: 'Australia', state: 'Victoria', city: 'Melbourne', languages: ['English', 'Urdu', 'Arabic'], ethnicity: ['Australian'] },
  { country: 'Singapore', state: 'Singapore', city: 'Singapore', languages: ['English', 'Malay', 'Tamil', 'Urdu'], ethnicity: ['Singaporean'] },
];

const OCCUPATIONS = [
  { title: 'Software Engineer', min: 75000, max: 200000 },
  { title: 'Doctor', min: 125000, max: 265000 },
  { title: 'Teacher', min: 40000, max: 85000 },
  { title: 'Architect', min: 65000, max: 150000 },
  { title: 'Pharmacist', min: 50000, max: 110000 },
  { title: 'Data Analyst', min: 60000, max: 140000 },
  { title: 'HR Specialist', min: 50000, max: 100000 },
  { title: 'Dentist', min: 100000, max: 230000 },
  { title: 'Lecturer', min: 60000, max: 125000 },
  { title: 'UX Designer', min: 65000, max: 150000 },
  { title: 'Chartered Accountant', min: 85000, max: 185000 },
  { title: 'Research Scientist', min: 75000, max: 165000 },
  { title: 'Entrepreneur', min: 85000, max: 250000 },
  { title: 'Nurse', min: 35000, max: 75000 },
  { title: 'Content Writer', min: 35000, max: 85000 },
  { title: 'Civil Engineer', min: 50000, max: 115000 },
  { title: 'Lawyer', min: 85000, max: 210000 },
  { title: 'Social Worker', min: 35000, max: 75000 },
  { title: 'Journalist', min: 40000, max: 100000 },
  { title: 'Physiotherapist', min: 50000, max: 110000 },
  { title: 'Chef', min: 35000, max: 85000 },
  { title: 'Business Analyst', min: 65000, max: 150000 },
  { title: 'Product Manager', min: 100000, max: 230000 },
  { title: 'Professor', min: 75000, max: 165000 },
  { title: 'Homemaker', min: 0, max: 0 },
];

const EDUCATION_BY_OCCUPATION = {
  'Software Engineer': { level: 'pg', ugCourse: 'B.Tech Computer Science', pgCourse: 'M.Tech Data Science' },
  Doctor: { level: 'pg', ugCourse: 'MBBS', pgCourse: 'MD General Medicine' },
  Teacher: { level: 'ug', ugCourse: 'B.Ed.' },
  Architect: { level: 'pg', ugCourse: 'B.Arch.', pgCourse: 'M.Arch.' },
  Pharmacist: { level: 'ug', ugCourse: 'B.Pharm.' },
  'Data Analyst': { level: 'pg', ugCourse: 'B.Sc. Statistics', pgCourse: 'M.Sc. Data Science' },
  'HR Specialist': { level: 'pg', ugCourse: 'BBA', pgCourse: 'MBA HR' },
  Dentist: { level: 'pg', ugCourse: 'BDS', pgCourse: 'MDS Orthodontics' },
  Lecturer: { level: 'pg', ugCourse: 'B.A. English', pgCourse: 'M.A. English' },
  'UX Designer': { level: 'ug', ugCourse: 'B.Des. Interaction Design' },
  'Chartered Accountant': { level: 'pg', ugCourse: 'B.Com.', pgCourse: 'Chartered Accountancy' },
  'Research Scientist': { level: 'pg', ugCourse: 'B.Sc. Biotechnology', pgCourse: 'M.Sc. Biotechnology' },
  Entrepreneur: { level: 'pg', ugCourse: 'B.Com.', pgCourse: 'MBA Finance' },
  Nurse: { level: 'ug', ugCourse: 'B.Sc. Nursing' },
  'Content Writer': { level: 'ug', ugCourse: 'B.A. Journalism' },
  'Civil Engineer': { level: 'pg', ugCourse: 'B.E. Civil Engineering', pgCourse: 'M.E. Structural Engineering' },
  Lawyer: { level: 'pg', ugCourse: 'B.A. Law', pgCourse: 'LL.M.' },
  'Social Worker': { level: 'ug', ugCourse: 'Bachelor of Social Work' },
  Journalist: { level: 'pg', ugCourse: 'B.A. Political Science', pgCourse: 'M.A. Journalism' },
  Physiotherapist: { level: 'ug', ugCourse: 'BPT' },
  Chef: { level: 'diploma', ugCourse: 'Diploma in Culinary Arts' },
  'Business Analyst': { level: 'pg', ugCourse: 'B.Com.', pgCourse: 'MBA Finance' },
  'Product Manager': { level: 'pg', ugCourse: 'B.E. Mechanical Engineering', pgCourse: 'MBA Product Management' },
  Professor: { level: 'phd', ugCourse: 'B.A. Islamic Studies', pgCourse: 'Ph.D. Islamic Studies' },
  Homemaker: { level: 'ug', ugCourse: 'B.A. Home Science' },
};

const COMPANIES = [
  'Al Noor Group',
  'Crescent Services',
  'Meridian Solutions',
  'Barakah Works',
  'Sakina Care',
  'Noor Analytics',
  'Greenline Co.',
  'Horizon Labs',
  'Al Amanah',
  'Citywide Services',
  'Blue Dome',
  'Pearl River',
  'Sana Enterprises',
  'Mizan Consulting',
  'Rahma Foundation',
  'East West Co.',
  'ClearPath',
  'New Leaf',
  'Bridgepoint',
  'Skyline Group',
  'Harmony Works',
  'Anchor Services',
  'Brightside',
  'Unity Center',
];

const BLOOD_GROUPS = ['O+', 'O-', 'A+', 'A-', 'B+', 'B-', 'AB+', 'AB-'];
const HOBBIES = [
  'Reading',
  'Cooking',
  'Travel',
  'Hiking',
  'Photography',
  'Gardening',
  'Calligraphy',
  'Cycling',
  'Running',
  'Cricket',
  'Football',
  'Painting',
  'Chess',
  'Volunteering',
  'Baking',
  'Writing',
  'Swimming',
  'Yoga',
  'Design',
  'History',
];
const SCHOLARS = [
  'Mufti Menk',
  'Omar Suleiman',
  'Yasmin Mogahed',
  'Imam Al-Ghazali',
  'Sheikh Hamza Yusuf',
  'Dr. Jonathan Brown',
];
const INSPIRATIONS = [
  'Parents',
  'Prophet Muhammad ﷺ',
  'Imam Al-Ghazali',
  'Abdul Sattar Edhi',
  'My grandmother',
  'Malala Yousafzai',
];
const FATHER_OCCUPATIONS = [
  ['Business'],
  ['Teacher'],
  ['Retired Government Officer'],
  ['Doctor'],
  ['Engineer'],
  ['Farmer'],
  ['Shop Owner'],
  ['Accountant'],
];
const MOTHER_OCCUPATIONS = [
  ['Homemaker'],
  ['Teacher'],
  ['Nurse'],
  ['Tailor'],
  ['Retired Teacher'],
  ['Homemaker'],
  ['Doctor'],
];
const FATHER_NAMES = ['Abdul', 'Mohammed', 'Rashid', 'Yusuf', 'Imran', 'Salim', 'Nadeem', 'Farooq'];
const MOTHER_NAMES = ['Ayesha', 'Fatima', 'Zainab', 'Maryam', 'Yasmin', 'Rahima', 'Safiya', 'Nadia'];
const SECTS = ['pureSunni', 'salafi', 'deobandi', 'barelvi', 'shia', 'sufi', 'preferNotToSay'];
const PARTNER_SECTS = ['anySect', 'pureSunni', 'salafi', 'deobandi', 'shia', 'sufi'];
const SALAH_PATTERNS = ['veryHigh', 'high', 'medium', 'low'];
const QURAN_READING = ['daily', 'veryOften', 'often', 'ramadhan', 'not'];
const PRACTICING_LEVELS = ['excellent', 'veryHigh', 'high', 'medium', 'low'];
const POLITICAL_AWARENESS = ['high', 'medium', 'no', 'never'];
const EATING_HABITS = ['halal', 'veg', 'any', 'vegan'];
const SMOKING_DRINKING = ['haram', 'nonAlchohol', 'smoke'];
const REGISTERED_FOR = ['self', 'self', 'self', 'self', 'self', 'self', 'son', 'daughter', 'brother', 'sister', 'friend'];
const EXPECTATIONS = [
  'A practising, kind and communicative partner who values family and is open to growing together.',
  'Someone who is serious about deen, emotionally mature and enjoys a peaceful home.',
  'A partner who is ambitious but grounded, respects family and can laugh at the little things.',
  'I am looking for a practising Muslim who values honesty, loyalty and shared responsibility.',
  'A warm, practising partner who wants a marriage built on mercy, respect and common goals.',
  'A patient and sincere person who values faith, family and continuous self-improvement.',
];

function buildGeneratedProfile(person, index) {
  const [firstName, lastName, gender] = person;
  const location = LOCATIONS[index % LOCATIONS.length];
  const occupation = OCCUPATIONS[index % OCCUPATIONS.length];
  const educationPath = EDUCATION_BY_OCCUPATION[occupation.title] || {
    level: 'ug',
    ugCourse: 'B.A.',
  };
  const age = 23 + (index % 15);
  const birthYear = 2026 - age;
  const month = ((index * 5) % 12) + 1;
  const day = ((index * 7) % 27) + 1;
  const dateOfBirth = `${birthYear}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
  const maritalStatus =
    index % 13 === 0
      ? 'divorcee'
      : index % 17 === 0
        ? gender === 'female'
          ? 'widow'
          : 'widower'
        : 'single';
  const hasChildren = maritalStatus !== 'single' && index % 2 === 0;
  const children = hasChildren ? ['son', 'daughter', 'both'][index % 3] : '';
  const childrenCount = hasChildren ? (index % 3) + 1 : 0;
  const hobbyStart = index % HOBBIES.length;
  const hobbies = [
    ...new Set([
      HOBBIES[hobbyStart],
      HOBBIES[(hobbyStart + 4) % HOBBIES.length],
      HOBBIES[(hobbyStart + 9) % HOBBIES.length],
    ]),
  ];
  const article = /^[aeiou]/i.test(occupation.title) ? 'an' : 'a';
  const income =
    occupation.max > 0
      ? Math.round(
          (occupation.min + ((index * 137) % (occupation.max - occupation.min + 1))) / 10000
        ) * 10000
      : null;
  const workExperience = occupation.title === 'Homemaker' ? null : 1 + (index % 12);
  const company =
    occupation.title === 'Homemaker'
      ? ''
      : occupation.title === 'Entrepreneur'
        ? 'Self-employed'
        : COMPANIES[index % COMPANIES.length];
  const parent = index % 2 === 0 ? 'dad' : 'mom';
  const parentNames = parent === 'dad' ? FATHER_NAMES : MOTHER_NAMES;
  const partnerProfessions = [
    ...new Set([
      OCCUPATIONS[(index + 5) % OCCUPATIONS.length].title,
      OCCUPATIONS[(index + 11) % OCCUPATIONS.length].title,
    ]),
  ].filter((title) => title !== 'Homemaker');

  return profile({
    fullName: `${firstName} ${lastName}`,
    gender,
    dateOfBirth,
    bloodGroup: BLOOD_GROUPS[index % BLOOD_GROUPS.length],
    maritalStatus,
    children,
    childrenCount,
    pwd: index % 23 === 0 ? 'yes' : 'no',
    pwdType: index % 23 === 0 ? ['visual', 'hearing', 'physical'][index % 3] : '',
    languages: location.languages,
    country: location.country,
    state: location.state,
    city: location.city,
    permanentCountry: location.country,
    permanentState: location.state,
    permanentCity: location.city,
    ethnicity: location.ethnicity,
    education: educationPath.level,
    ugCourse: educationPath.ugCourse,
    pgCourse: educationPath.pgCourse || '',
    occupations: [occupation.title],
    income,
    company,
    workLocation:
      occupation.title === 'Homemaker'
        ? 'Home'
        : `${location.city} (${['On-site', 'Hybrid', 'Remote'][index % 3]})`,
    workExperience,
    fatherOccupations: FATHER_OCCUPATIONS[index % FATHER_OCCUPATIONS.length],
    motherOccupations: MOTHER_OCCUPATIONS[index % MOTHER_OCCUPATIONS.length],
    noOfBrothers: index % 4,
    noOfSisters: (index + 1) % 4,
    financialStatus: ['middle', 'upper', 'affluent', 'lower'][index % 4],
    familyLivingIn: location.city,
    mobileNumber: `+91900001${String(1000 + index).padStart(4, '0')}`,
    parent,
    parentName: `${parentNames[index % parentNames.length]} ${lastName}`,
    parentNumber: `+91900002${String(1000 + index).padStart(4, '0')}`,
    aboutMe: `I work as ${article} ${occupation.title} in ${location.city}. I enjoy ${hobbies[0].toLowerCase()} and ${hobbies[1].toLowerCase()}, and I value a calm, faith-centred family life.`,
    myExpectation: EXPECTATIONS[index % EXPECTATIONS.length],
    quranVerse: '',
    isRevert: index % 19 === 0 ? 'yes' : 'no',
    revertedFrom:
      index % 19 === 0 ? ['Christianity', 'Hinduism', 'Buddhism', 'None'][index % 4] : '',
    startedPracticing: `${2010 + (index % 13)}-01-01`,
    sect: SECTS[index % SECTS.length],
    salahPattern: SALAH_PATTERNS[index % SALAH_PATTERNS.length],
    quranRead: QURAN_READING[index % QURAN_READING.length],
    practicingLevel: PRACTICING_LEVELS[index % PRACTICING_LEVELS.length],
    scholars: index % 3 === 0 ? [] : [SCHOLARS[index % SCHOLARS.length]],
    inspirations: index % 4 === 0 ? [] : [INSPIRATIONS[index % INSPIRATIONS.length]],
    youtubeChannels: '',
    socialMediaInfluencers: '',
    political: POLITICAL_AWARENESS[index % POLITICAL_AWARENESS.length],
    hobbies,
    eatingHabits: EATING_HABITS[index % EATING_HABITS.length],
    smokeAndDrink: SMOKING_DRINKING[index % SMOKING_DRINKING.length],
    partnerEducated: 'yes',
    partnerEducation: ['ug', 'pg', 'phd', 'diploma'][index % 4],
    partnerProfessional: index % 5 === 0 ? 'no' : 'yes',
    partnerProfessions,
    partnerFromAge: Math.max(21, age - 3 + (index % 3)),
    partnerToAge: age + 4 + (index % 4),
    partnerSect: PARTNER_SECTS[index % PARTNER_SECTS.length],
    partnerCountry: location.country,
    partnerState: location.state,
    partnerCity: location.city,
    image: '',
    isPublic: index % 9 !== 0,
    registeredFor: REGISTERED_FOR[index % REGISTERED_FOR.length],
  });
}

function buildGeneratedUsers() {
  return GENERATED_PEOPLE.map((person, index) => {
    const [firstName, lastName] = person;
    const number = String(index + 1).padStart(2, '0');

    return {
      key: `demo_${number}`,
      email: `${firstName}.${lastName}${index + 1}@example.com`.toLowerCase(),
      username: `${firstName}_${lastName}_${index + 1}`
        .toLowerCase()
        .replace(/[^a-z0-9_]/g, ''),
      profile: buildGeneratedProfile(person, index),
    };
  });
}

export const DEMO_USERS = [...CURATED_USERS, ...buildGeneratedUsers()];

const CURATED_INTERESTS = [
  { from: 'aisha', to: 'yusuf', status: 'pending' },
  { from: 'aisha', to: 'omar', status: 'pending' },
  { from: 'fatima', to: 'yusuf', status: 'accepted' },
  { from: 'maryam', to: 'ibrahim', status: 'pending' },
  { from: 'zainab', to: 'bilal', status: 'declined' },
  { from: 'yusuf', to: 'aisha', status: 'accepted' },
  { from: 'omar', to: 'fatima', status: 'accepted' },
  { from: 'ibrahim', to: 'maryam', status: 'pending' },
];

function buildGeneratedInterests(users) {
  const women = users.filter((user) => user.profile.gender === 'female');
  const men = users.filter((user) => user.profile.gender === 'male');
  const seen = new Set(CURATED_INTERESTS.map((item) => `${item.from}->${item.to}`));
  const statuses = ['pending', 'accepted', 'declined'];
  const interests = [];

  function add(sender, target, status) {
    if (!target || sender.key === target.key) return;
    const key = `${sender.key}->${target.key}`;
    if (seen.has(key)) return;
    seen.add(key);
    interests.push({ from: sender.key, to: target.key, status });
  }

  users.forEach((sender, index) => {
    const targets = sender.profile.gender === 'female' ? men : women;
    add(sender, targets[index % targets.length], statuses[index % statuses.length]);
    add(sender, targets[(index + 7) % targets.length], statuses[(index + 1) % statuses.length]);
  });

  return interests;
}

export const DEMO_INTERESTS = [...CURATED_INTERESTS, ...buildGeneratedInterests(DEMO_USERS)];

export default { DEMO_PASSWORD, DEMO_USERS, DEMO_INTERESTS };
