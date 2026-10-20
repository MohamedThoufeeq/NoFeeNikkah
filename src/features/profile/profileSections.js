import { labelFor } from './profileOptions';
import { computeBmi, getProfileAge } from '../../lib/utils/profile';
import { formatDate } from '../../lib/utils/date';
import { formatCurrencyINR, joinList, maskPhone } from '../../lib/utils/format';
import { asArray } from '../../lib/utils/array';

const display = (value) => {
  if (value === null || value === undefined || value === '') return '—';
  return value;
};

const childrenSummary = (profile) => {
  if (!profile.children) return '—';
  return `${labelFor('children', profile.children)}: ${display(profile.childrenCount)}`;
};

const educationSummary = (profile) => {
  if (!profile.education) return [];
  const lines = [labelFor('education', profile.education)];
  if (profile.ugCourse) lines.push(`Stream: ${profile.ugCourse}`);
  if (profile.pgCourse) lines.push(`Post graduate stream: ${profile.pgCourse}`);
  return lines;
};

/**
 * Declarative description of the profile screen.
 *
 * Adding or reordering a section is a data change, not a markup change, which
 * keeps the profile view open for extension but closed for modification.
 */
export function buildProfileSections(profile) {
  const age = getProfileAge(profile);
  const bmi = computeBmi(profile.height, profile.weight);

  const physical = [
    `Height: ${profile.height ? `${profile.height} CM` : '—'}`,
    `Weight: ${profile.weight ? `${profile.weight} KG` : '—'}`,
    `BMI index: ${bmi || '—'}`,
  ];

  const siblings = [
    `No. of Brothers: ${display(profile.noOfBrothers)}`,
    `No. of Sisters: ${display(profile.noOfSisters)}`,
  ];

  const revert =
    profile.isRevert === 'yes'
      ? ['Yes', ...(profile.revertedFrom ? [`Reverted from: ${profile.revertedFrom}`] : [])]
      : [profile.isRevert === 'no' ? 'No' : '—'];

  const partnerEducation = [];
  if (profile.partnerEducated === 'yes') {
    partnerEducation.push(
      profile.partnerEducation
        ? `Preferred minimum education: ${labelFor('education', profile.partnerEducation)}`
        : 'Preferred minimum education: —'
    );
  }

  return [
    {
      id: 'basic-identity',
      title: 'Basic Information',
      rows: [
        { label: 'Registerer', value: display(labelFor('registeredFor', profile.registeredFor)) },
        { label: 'Gender', value: display(labelFor('gender', profile.gender)) },
        { label: 'Date Of Birth', value: profile.dateOfBirth ? formatDate(profile.dateOfBirth) : '—' },
        { label: 'Age', value: age !== null && age !== undefined ? `${age}` : '—' },
        {
          label: 'Living in',
          value: joinList([profile.city, profile.state, profile.country], '—'),
        },
      ],
    },
    {
      id: 'basic-personal',
      title: 'Basic Information',
      rows: [
        { label: 'Languages Known', value: joinList(profile.languages) },
        {
          label: 'Permanent Address',
          value: joinList([profile.permanentCity, profile.permanentState, profile.permanentCountry], '—'),
        },
        { label: 'Marital Status', value: display(labelFor('maritalStatus', profile.maritalStatus)) },
        { label: 'Children', value: childrenSummary(profile) },
        { label: 'Physical Information', value: physical },
        { label: 'Blood Group', value: display(profile.bloodGroup) },
        { label: 'Ethnicity', value: joinList(profile.ethnicity) },
      ],
    },
    {
      id: 'professional',
      title: 'Professional Background',
      rows: [
        { label: 'Education', value: educationSummary(profile) },
        { label: 'Occupation', value: joinList(profile.occupations) },
        { label: 'Income (per month)', value: formatCurrencyINR(profile.income) || '—' },
        { label: 'Now Working at', value: display(profile.company) },
        { label: 'Work Location', value: display(profile.workLocation) },
        {
          label: 'Experience',
          value: profile.workExperience ? `${profile.workExperience} years` : '—',
        },
      ],
    },
    {
      id: 'family',
      title: 'Family Details',
      rows: [
        { label: "Father's Status / Occupation", value: joinList(profile.fatherOccupations) },
        { label: "Mother's Status / Occupation", value: joinList(profile.motherOccupations) },
        { label: 'Siblings', value: siblings },
        {
          label: 'Financial Status',
          value: display(labelFor('financialStatus', profile.financialStatus)),
        },
      ],
    },
    {
      id: 'religious',
      title: 'Religious Information',
      rows: [
        { label: 'Revert', value: revert },
        {
          label: 'Started Practicing From',
          value: profile.startedPracticing ? formatDate(profile.startedPracticing) : '—',
        },
        { label: 'Sect', value: display(labelFor('sect', profile.sect)) },
        { label: 'Salah Pattern', value: display(labelFor('salahPattern', profile.salahPattern)) },
      ],
    },
    {
      id: 'religious-practice',
      title: 'Religious Information',
      rows: [
        {
          label: 'Quran Reading Consistency',
          value: display(labelFor('quranRead', profile.quranRead)),
        },
        {
          label: 'Practicing level of Deen',
          value: display(labelFor('practicingLevel', profile.practicingLevel)),
        },
        { label: 'Islamic Scholars / Daees I follow', value: joinList(profile.scholars) },
      ],
    },
    {
      id: 'taste',
      title: 'My Taste',
      rows: [
        { label: 'My Inspiration', value: joinList(profile.inspirations) },
        { label: 'YouTube Channels I like / follow', value: display(profile.youtubeChannels) },
        {
          label: 'Social Media Pages I like / follow',
          value: display(profile.socialMediaInfluencers),
        },
        { label: 'How Political I am', value: display(labelFor('political', profile.political)) },
      ],
    },
    {
      id: 'habits',
      title: 'My Habits',
      rows: [
        { label: 'Hobbies and Interests', value: joinList(profile.hobbies) },
        { label: 'Eating Habits', value: display(labelFor('eatingHabits', profile.eatingHabits)) },
        {
          label: 'Smoking & Drinking',
          value: display(labelFor('smokeAndDrink', profile.smokeAndDrink)),
        },
      ],
    },
    {
      id: 'partner',
      title: 'Partner Preferences',
      rows: [
        {
          label: 'Do you want your partner to be educated?',
          value: [display(labelFor('partnerEducated', profile.partnerEducated)), ...partnerEducation],
        },
        {
          label: "Partner's preferred Age",
          value:
            profile.partnerFromAge || profile.partnerToAge
              ? `Between ${display(profile.partnerFromAge)} and ${display(profile.partnerToAge)}`
              : '—',
        },
        { label: "Partner's preferred Sect", value: display(labelFor('partnerSect', profile.partnerSect)) },
        {
          label: "Partner's preferred Location",
          value: joinList([profile.partnerCity, profile.partnerState, profile.partnerCountry], '—'),
        },
        {
          label: 'Partner to be a working professional',
          value: display(labelFor('partnerProfessional', profile.partnerProfessional)),
        },
        { label: 'Preferred professions', value: joinList(profile.partnerProfessions) },
      ],
    },
    {
      id: 'contact',
      title: 'Contact Information',
      rows: [
        { label: 'Email Id', value: profile.email, type: 'email' },
        { label: 'Social Media Handles', value: profile.socialLinks, type: 'social' },
        { label: 'Mobile Number', value: maskPhone(profile.mobileNumber), hint: 'Protected for privacy' },
        {
          label: "Parent's Name",
          value: profile.parentName
            ? `${labelFor('parent', profile.parent)}: ${profile.parentName}`
            : '—',
        },
        {
          label: "Parent's Contact Number",
          value: maskPhone(profile.parentNumber),
          hint: 'Protected for privacy',
        },
      ],
    },
  ];
}

export function buildProfileDescriptions(profile) {
  return [
    { id: 'about', title: 'About Me', body: profile.aboutMe },
    { id: 'expectation', title: 'My Expectation', body: profile.myExpectation },
    { id: 'quran-verse', title: 'Quran Verse I Suggest', body: profile.quranVerse },
  ].filter((item) => asArray(item.body).length || item.body);
}

export default buildProfileSections;
