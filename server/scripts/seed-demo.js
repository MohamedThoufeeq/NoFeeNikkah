/**
 * Seed the NoFeeNikkah database with demo auth users, profiles and interests.
 *
 * Usage:
 *   npm run seed:demo
 *   npm run seed:demo -- --dry-run
 *
 * The script uses the Supabase service-role key, so run it from the repository
 * root with a valid `.env`. It is safe to run repeatedly: users are matched by
 * email, profiles are upserted by id, and interests are upserted by
 * (sender_id, target_id).
 */
import 'dotenv/config';
import { createClient } from '@supabase/supabase-js';
import { Profile } from '../src/models/Profile.js';
import { DEMO_INTERESTS, DEMO_PASSWORD, DEMO_USERS } from './demo-data.js';

const dryRun = process.argv.includes('--dry-run');

function fail(message) {
  console.error(`\n[seed:demo] ${message}\n`);
  process.exit(1);
}

function assertServiceRoleKey(key, anonKey) {
  const value = String(key || '').trim();

  if (value === String(anonKey || '').trim()) {
    fail(
      'SUPABASE_SERVICE_ROLE_KEY is the same as SUPABASE_ANON_KEY. Use the secret/service_role key, not the anon/publishable key.'
    );
  }

  if (value.startsWith('sb_publishable_')) {
    fail(
      'SUPABASE_SERVICE_ROLE_KEY is a publishable key. Use the secret key (sb_secret_...) or the legacy service_role JWT.'
    );
  }

  if (value.startsWith('sb_secret_')) return;

  if (value.startsWith('eyJ')) {
    try {
      const payload = JSON.parse(
        Buffer.from(value.split('.')[1], 'base64url').toString('utf8')
      );
      if (payload.role !== 'service_role') {
        fail(
          `SUPABASE_SERVICE_ROLE_KEY is a JWT with role "${payload.role || 'unknown'}". Copy the legacy service_role key, not the anon key.`
        );
      }
      return;
    } catch {
      fail('SUPABASE_SERVICE_ROLE_KEY is not a valid JWT or Supabase secret key.');
    }
  }

  fail(
    'SUPABASE_SERVICE_ROLE_KEY must be a Supabase secret key (sb_secret_...) or a legacy service_role JWT.'
  );
}

function printSummary() {
  console.log('\nNoFeeNikkah demo data');
  console.log('=====================');
  console.log(`Accounts:  ${DEMO_USERS.length}`);
  console.log(`Interests: ${DEMO_INTERESTS.length}`);
  console.log(`Password:  ${DEMO_PASSWORD}`);
  console.log('\nDemo accounts:');
  for (const user of DEMO_USERS) {
    const visibility = user.profile.isPublic === false ? 'private' : 'public';
    console.log(`  ${user.email.padEnd(34)} @${user.username.padEnd(20)} ${visibility}`);
  }
  console.log('\nInterests:');
  for (const interest of DEMO_INTERESTS.slice(0, 8)) {
    console.log(`  ${interest.from.padEnd(10)} -> ${interest.to.padEnd(10)} ${interest.status}`);
  }
  if (DEMO_INTERESTS.length > 8) {
    console.log(`  ...and ${DEMO_INTERESTS.length - 8} more.`);
  }
  console.log('');
}

async function findUserByEmail(admin, email) {
  const target = email.trim().toLowerCase();

  for (let page = 1; page <= 20; page += 1) {
    const { data, error } = await admin.listUsers({ page, perPage: 1000 });
    if (error) throw new Error(`Could not list auth users: ${error.message}`);

    const match = (data?.users || []).find(
      (user) => String(user.email || '').toLowerCase() === target
    );
    if (match) return match;
    if (!data?.users || data.users.length < 1000) return null;
  }

  return null;
}

async function ensureUser(admin, demoUser) {
  const metadata = {
    username: demoUser.username,
    full_name: demoUser.profile.fullName,
  };
  const existing = await findUserByEmail(admin, demoUser.email);

  if (existing) {
    const { data, error } = await admin.updateUserById(existing.id, {
      password: DEMO_PASSWORD,
      email_confirm: true,
      user_metadata: metadata,
    });
    if (error) {
      throw new Error(`Could not update ${demoUser.email}: ${error.message}`);
    }
    return { user: data.user, created: false };
  }

  const { data, error } = await admin.createUser({
    email: demoUser.email,
    password: DEMO_PASSWORD,
    email_confirm: true,
    user_metadata: metadata,
  });
  if (error) {
    throw new Error(`Could not create ${demoUser.email}: ${error.message}`);
  }

  return { user: data.user, created: true };
}

function profileRow(demoUser, user) {
  const profile = Profile.fromRequest(
    {
      ...demoUser.profile,
      email: user.email || demoUser.email,
      username: demoUser.username,
    },
    {
      id: user.id,
      username: demoUser.username,
      email: user.email || demoUser.email,
    }
  );

  return profile.toRow({ includeIdentity: true });
}

async function main() {
  if (dryRun) {
    printSummary();
    console.log('[seed:demo] Dry run: no Supabase calls were made.\n');
    return;
  }

  const url = process.env.SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !serviceRoleKey) {
    fail(
      'SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY must be set in the repository .env file.'
    );
  }

  assertServiceRoleKey(serviceRoleKey, process.env.SUPABASE_ANON_KEY);

  if (process.env.NODE_ENV === 'production') {
    console.warn(
      '\n[seed:demo] NODE_ENV is production. This will create/update real auth users.'
    );
  }

  const supabase = createClient(url, serviceRoleKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
      detectSessionInUrl: false,
    },
  });

  const idByKey = new Map();
  let createdUsers = 0;
  let updatedUsers = 0;

  console.log(`\n[seed:demo] Seeding ${DEMO_USERS.length} demo users...`);

  for (const demoUser of DEMO_USERS) {
    const { user, created } = await ensureUser(supabase.auth.admin, demoUser);
    if (!user?.id) throw new Error(`No auth user returned for ${demoUser.email}.`);

    const row = profileRow(demoUser, user);
    const { error: profileError } = await supabase
      .from('profiles')
      .upsert(row, { onConflict: 'id' });

    if (profileError) {
      throw new Error(`Could not seed profile for ${demoUser.email}: ${profileError.message}`);
    }

    idByKey.set(demoUser.key, user.id);
    if (created) createdUsers += 1;
    else updatedUsers += 1;
    console.log(`  ${created ? 'created' : 'updated'}  ${demoUser.email}`);
  }

  const interestRows = DEMO_INTERESTS.map((interest) => ({
    sender_id: idByKey.get(interest.from),
    target_id: idByKey.get(interest.to),
    status: interest.status,
  }));

  const { error: interestError } = await supabase
    .from('interests')
    .upsert(interestRows, { onConflict: 'sender_id,target_id' });

  if (interestError) {
    throw new Error(`Could not seed interests: ${interestError.message}`);
  }

  console.log(`\n[seed:demo] Done: ${createdUsers} created, ${updatedUsers} updated.`);
  console.log(`[seed:demo] ${interestRows.length} interests upserted.`);
  printSummary();
}

main().catch((error) => {
  fail(error?.message || String(error));
});
