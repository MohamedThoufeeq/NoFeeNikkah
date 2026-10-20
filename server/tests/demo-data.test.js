import test from 'node:test';
import assert from 'node:assert/strict';
import { Profile } from '../src/models/Profile.js';
import { DEMO_INTERESTS, DEMO_PASSWORD, DEMO_USERS } from '../scripts/demo-data.js';

test('demo users have 50 unique profiles with gender and privacy variety', () => {
  const emails = new Set(DEMO_USERS.map((user) => user.email));
  const usernames = new Set(DEMO_USERS.map((user) => user.username));
  const keys = new Set(DEMO_USERS.map((user) => user.key));

  assert.equal(DEMO_USERS.length, 50);
  assert.equal(emails.size, DEMO_USERS.length);
  assert.equal(usernames.size, DEMO_USERS.length);
  assert.equal(keys.size, DEMO_USERS.length);
  assert.equal(DEMO_USERS.filter((user) => user.profile.gender === 'male').length, 25);
  assert.equal(DEMO_USERS.filter((user) => user.profile.gender === 'female').length, 25);
  assert.ok(DEMO_USERS.some((user) => user.profile.isPublic === false));
  assert.ok(DEMO_USERS.some((user) => user.profile.isPublic !== false));
  assert.ok(DEMO_PASSWORD.length >= 8);
});

test('demo profiles map to complete database rows', () => {
  for (const demoUser of DEMO_USERS) {
    const profile = Profile.fromRequest(
      {
        ...demoUser.profile,
        email: demoUser.email,
        username: demoUser.username,
      },
      {
        id: '11111111-1111-4111-8111-111111111111',
        username: demoUser.username,
        email: demoUser.email,
      }
    );
    const row = profile.toRow({ includeIdentity: true });

    assert.equal(row.username, demoUser.username);
    assert.equal(row.email, demoUser.email);
    assert.equal(row.full_name, demoUser.profile.fullName);
    assert.equal(typeof row.is_public, 'boolean');
    assert.ok(Array.isArray(row.languages));
    assert.ok(Array.isArray(row.occupations));
    assert.ok(row.about_me.length > 0);
  }
});

test('demo interests reference known users without self or duplicate pairs', () => {
  const keys = new Set(DEMO_USERS.map((user) => user.key));
  const pairs = new Set();

  for (const interest of DEMO_INTERESTS) {
    const pair = `${interest.from}->${interest.to}`;

    assert.ok(keys.has(interest.from), `unknown sender ${interest.from}`);
    assert.ok(keys.has(interest.to), `unknown target ${interest.to}`);
    assert.notEqual(interest.from, interest.to);
    assert.ok(['pending', 'accepted', 'declined'].includes(interest.status));
    assert.ok(!pairs.has(pair), `duplicate interest ${pair}`);
    pairs.add(pair);
  }
});
