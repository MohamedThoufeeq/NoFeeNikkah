import test from 'node:test';
import assert from 'node:assert/strict';
import { Profile } from '../src/models/Profile.js';
import { ProfilePresenter } from '../src/presenters/ProfilePresenter.js';
import { latestBirthDateForAge } from '../src/utils/date.js';

test('Profile.fromRequest maps the legacy client payload into the canonical model', () => {
  const profile = Profile.fromRequest({
    fullname: 'Aisha Rahman',
    gender: 'female',
    languagesKnownArray: ['English', 'Tamil'],
    occupationArray: ['Engineer'],
    permenantCountry: 'India',
    noOfBrother: '2',
    fatherOccupation: ['Teacher'],
    myInspirationArray: ['Prophet Muhammad (PBUH)'],
    isRevert: 'yes',
    isPartnerProfessional: 'no',
    fromAge: '24',
    toAge: '32',
    partnersPreferredCountry: 'India',
    image: 'https://example.com/aisha.jpg',
  });

  assert.equal(profile.fullName, 'Aisha Rahman');
  assert.deepEqual(profile.languages, ['English', 'Tamil']);
  assert.deepEqual(profile.occupations, ['Engineer']);
  assert.equal(profile.permanentCountry, 'India');
  assert.equal(profile.noOfBrothers, 2);
  assert.deepEqual(profile.fatherOccupations, ['Teacher']);
  assert.deepEqual(profile.inspirations, ['Prophet Muhammad (PBUH)']);
  assert.equal(profile.isRevert, 'yes');
  assert.equal(profile.partnerProfessional, 'no');
  assert.equal(profile.partnerFromAge, 24);
  assert.equal(profile.partnerToAge, 32);
  assert.equal(profile.partnerCountry, 'India');
  assert.equal(profile.image, 'https://example.com/aisha.jpg');
});

test('Profile.toRow uses snake_case columns and keeps identity only when requested', () => {
  const profile = Profile.fromRequest({
    id: '11111111-1111-4111-8111-111111111111',
    username: 'Aisha_R',
    fullname: 'Aisha Rahman',
    email: 'aisha@example.com',
    languages: ['English'],
    income: '75000',
    childrenCount: '2',
    isPublic: false,
  });

  const row = profile.toRow({ includeIdentity: true });

  assert.equal(row.id, '11111111-1111-4111-8111-111111111111');
  assert.equal(row.username, 'aisha_r');
  assert.equal(row.email, 'aisha@example.com');
  assert.equal(row.full_name, 'Aisha Rahman');
  assert.deepEqual(row.languages, ['English']);
  assert.equal(row.income, 75000);
  assert.equal(row.children_count, 2);
  assert.equal(row.is_public, false);
});

test('Profile.fromRow round-trips a Supabase row', () => {
  const row = {
    id: '11111111-1111-4111-8111-111111111111',
    username: 'aisha_r',
    email: 'aisha@example.com',
    full_name: 'Aisha Rahman',
    gender: 'female',
    date_of_birth: '1997-04-12',
    languages: ['English', 'Tamil'],
    occupations: ['Engineer'],
    income: '75000.00',
    no_of_brothers: 2,
    is_revert: 'no',
    image_url: 'https://example.com/aisha.jpg',
    is_public: true,
    created_at: '2026-01-01T00:00:00.000Z',
    updated_at: '2026-01-02T00:00:00.000Z',
  };

  const profile = Profile.fromRow(row);

  assert.equal(profile.fullName, 'Aisha Rahman');
  assert.equal(profile.dateOfBirth, '1997-04-12');
  assert.deepEqual(profile.languages, ['English', 'Tamil']);
  assert.equal(profile.income, 75000);
  assert.equal(profile.noOfBrothers, 2);
  assert.equal(profile.isRevert, 'no');
  assert.equal(profile.image, 'https://example.com/aisha.jpg');
  assert.equal(profile.isPublic, true);
  assert.equal(profile.createdAt, row.created_at);
});

test('public presenter masks contact numbers while the owner sees them', () => {
  const profile = Profile.fromRequest({
    fullname: 'Aisha',
    mobileNumber: '+919087654321',
    parentNumber: '+919000000000',
  });
  const presenter = new ProfilePresenter();

  const publicView = presenter.toApi(profile);
  const ownerView = presenter.toApi(profile, { isOwner: true });

  assert.equal(publicView.mobileNumber, '+919087*****');
  assert.equal(publicView.parentNumber, '+919000*****');
  assert.equal(ownerView.mobileNumber, '+919087654321');
  assert.equal(ownerView.parentNumber, '+919000000000');
});

test('latestBirthDateForAge returns the inclusive upper birth date', () => {
  const boundary = latestBirthDateForAge(30, new Date('2026-10-20T12:00:00.000Z'));
  assert.equal(boundary, '1995-10-21');
});
