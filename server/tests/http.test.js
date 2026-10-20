import test from 'node:test';
import assert from 'node:assert/strict';

process.env.NODE_ENV = 'test';
process.env.LOG_LEVEL = 'silent';
process.env.SUPABASE_URL = 'https://example.supabase.co';
process.env.SUPABASE_ANON_KEY = 'test-anon-key';
process.env.SUPABASE_SERVICE_ROLE_KEY = 'test-service-key';
process.env.RATE_LIMIT_MAX = '1000';
process.env.AUTH_RATE_LIMIT_MAX = '1000';

const { createContainer } = await import('../src/container.js');
const { createApp } = await import('../src/app.js');

const container = createContainer();
const app = createApp(container);
const server = app.listen(0);
await new Promise((resolve) => server.once('listening', resolve));
const baseUrl = `http://127.0.0.1:${server.address().port}`;

test.after(() => {
  server.close();
});

test('liveness and provider discovery are public', async () => {
  const health = await fetch(`${baseUrl}/health`);
  assert.equal(health.status, 200);
  const healthBody = await health.json();
  assert.equal(healthBody.success, true);
  assert.equal(healthBody.data.status, 'ok');

  const providers = await fetch(`${baseUrl}/api/auth/providers`);
  assert.equal(providers.status, 200);
  const providerBody = await providers.json();
  assert.deepEqual(providerBody.data.providers, ['google', 'github']);
});

test('authentication is required for profile routes', async () => {
  const response = await fetch(`${baseUrl}/api/profiles/me`);
  assert.equal(response.status, 401);
  const body = await response.json();
  assert.equal(body.error.code, 'UNAUTHORIZED');
  assert.ok(body.requestId);
});

test('login validation returns a useful 422 payload', async () => {
  const response = await fetch(`${baseUrl}/api/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: 'not-an-email', password: '' }),
  });
  assert.equal(response.status, 422);
  const body = await response.json();
  assert.equal(body.error.code, 'VALIDATION_ERROR');
  assert.equal(body.error.message, 'Enter a valid email address.');
  assert.ok(Array.isArray(body.error.details));
});

test('unknown API routes return 404 and CORS preflight is allowed for the client', async () => {
  const missing = await fetch(`${baseUrl}/api/does-not-exist`);
  assert.equal(missing.status, 404);

  const preflight = await fetch(`${baseUrl}/api/auth/login`, {
    method: 'OPTIONS',
    headers: {
      Origin: 'http://localhost:5173',
      'Access-Control-Request-Method': 'POST',
    },
  });
  assert.equal(preflight.status, 204);
  assert.equal(
    preflight.headers.get('access-control-allow-origin'),
    'http://localhost:5173'
  );
  assert.equal(preflight.headers.get('access-control-allow-credentials'), 'true');
});

test('interest creation reaches its own route and requires auth', async () => {
  const response = await fetch(`${baseUrl}/api/interests`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ targetProfileId: '11111111-1111-4111-8111-111111111111' }),
  });
  assert.equal(response.status, 401);
  const body = await response.json();
  assert.equal(body.error.code, 'UNAUTHORIZED');
});

test('unsafe requests from an unknown browser origin are rejected', async () => {
  const response = await fetch(`${baseUrl}/api/auth/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Origin: 'https://evil.example',
    },
    body: JSON.stringify({ email: 'aisha@example.com', password: 'password123' }),
  });
  assert.equal(response.status, 403);
});
