# Demo data

`npm run seed:demo` creates **50 realistic profiles** for development and manual
QA. It uses the Supabase Admin API, so it creates **auth users** first and then
upserts the matching `profiles` and `interests` rows.

## What it creates

The eight curated accounts below are good for repeatable testing. Another 42
deterministic accounts are generated from the same fixtures, covering 25 cities
across India, the Gulf, the UK, Canada, the USA, Australia and Singapore; 25
occupations; varied education, sect, practice level, marital status, languages,
income, privacy and partner preferences.

| Account | Profile | Visibility |
| --- | --- | --- |
| `aisha.rahman@example.com` | Aisha Rahman, software engineer, Chennai | public |
| `fatima.siddiqui@example.com` | Fatima Siddiqui, doctor, Hyderabad | public |
| `maryam.khan@example.com` | Maryam Khan, teacher, Bengaluru | public |
| `zainab.ali@example.com` | Zainab Ali, architect, Kochi | private |
| `yusuf.ahmed@example.com` | Yusuf Ahmed, product manager, Chennai | public |
| `omar.farooq@example.com` | Omar Farooq, data scientist, Hyderabad | public |
| `ibrahim.hassan@example.com` | Ibrahim Hassan, civil engineer, Bengaluru | public |
| `bilal.malik@example.com` | Bilal Malik, entrepreneur, Kochi | public |

The generated accounts use emails like `sara.qureshi1@example.com` and
`ayaaz.merchant42@example.com`. Run the dry-run command to print every address.

All 50 accounts use the password `DemoPass123!`.

The script also adds **105 interests** in `pending`, `accepted` and `declined`
states so the interests UI has data immediately. Six profiles are private, which
is useful for checking that search hides them while each owner can still read
their own profile.

## Prerequisites

1. Run [`../sql/001_init.sql`](../sql/001_init.sql) in the target project.
2. Put the project URL and **service-role** key in the repository `.env`:

   ```dotenv
   SUPABASE_URL=https://YOUR_PROJECT.supabase.co
   SUPABASE_SERVICE_ROLE_KEY=...
   ```

   Use the **secret** key (`sb_secret_...`) or the legacy `service_role` JWT,
   not the anon/publishable key. The service-role key is required to create auth
   users. Never expose it to the browser and never put it in a `VITE_*`
   variable.

3. Run the command from the repository root so `dotenv` finds `.env`.

## Commands

```bash
# Preview the accounts and interests without touching Supabase.
npm run seed:demo -- --dry-run

# Create users and upsert profiles/interests.
npm run seed:demo
```

The script is idempotent:

- auth users are matched by email, then their password/metadata are updated;
- profiles are upserted by `id` (the Supabase auth user id);
- interests are upserted by `(sender_id, target_id)`.

It does **not** delete existing data. If you need a clean slate, delete the demo
users in Supabase Auth; the `on delete cascade` rules remove their profiles and
interests.

## Local Supabase

The same command works against a local Supabase stack. Use the local API URL and
keys printed by `supabase status`, for example:

```dotenv
SUPABASE_URL=http://127.0.0.1:54321
SUPABASE_ANON_KEY=...
SUPABASE_SERVICE_ROLE_KEY=...
```

Then run the migration and the seed command. Keep the browser-side
`VITE_SUPABASE_URL`/`VITE_SUPABASE_ANON_KEY` empty unless you are testing the
Supabase OAuth redirect flow.

## Production warning

This command writes to whichever Supabase project is configured in `.env`. Do
not run it against production unless you intentionally want demo accounts in
that project.
