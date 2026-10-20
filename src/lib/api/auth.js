import { apiClient, buildUrl } from './client';
import config from '../config';
import { getSession, setSession, clearSession } from '../../features/auth/session';

const MOCK_LATENCY_MS = 450;
const mockDelay = (value) => new Promise((resolve) => setTimeout(() => resolve(value), MOCK_LATENCY_MS));

function createMockSession(email, token = null) {
  return {
    token,
    user: { email, fullName: email.split('@')[0], username: email.split('@')[0] },
  };
}

function unwrap(response) {
  return response?.data ?? response;
}

function storeServerSession(data, fallbackEmail = '') {
  if (!data?.token) {
    throw new Error('The server did not return a session. Please try again.');
  }

  const session = {
    token: data.token,
    expiresAt: data.expiresAt || null,
    user:
      data.user || {
        email: fallbackEmail,
        fullName: fallbackEmail.split('@')[0],
        username: fallbackEmail.split('@')[0],
      },
  };

  setSession(session);
  return session;
}

export async function login({ email, password }) {
  if (config.useMocks) {
    if (!email || password.length < 6) {
      throw new Error('Enter a valid email and a password of at least 6 characters.');
    }
    const session = createMockSession(email, 'mock-session-token');
    await mockDelay(null);
    setSession(session);
    return session;
  }

  const response = await apiClient.post(
    buildUrl(config.authBaseUrl, 'login'),
    { email, password },
    { auth: false }
  );

  return storeServerSession(unwrap(response), email);
}

export async function register({ username, email, password }) {
  if (config.useMocks) {
    if (!username || !email || password.length < 6) {
      throw new Error('Enter a username, valid email and a password of at least 6 characters.');
    }
    await mockDelay(null);
    return { success: true };
  }

  const response = await apiClient.post(
    buildUrl(config.authBaseUrl, 'register'),
    { username, email, password },
    { auth: false }
  );

  const data = unwrap(response);

  if (data?.session?.token) {
    setSession({
      token: data.session.token,
      expiresAt: data.session.expiresAt || null,
      user: data.session.user || data.user || null,
    });
  }

  return data;
}

/**
 * Exchanges a Supabase OAuth access token for this application's opaque
 * server-side session.
 */
export async function socialLogin(accessToken) {
  if (!accessToken) throw new Error('The social provider did not return a valid token.');

  const response = await apiClient.post(
    buildUrl(config.authBaseUrl, 'social'),
    { accessToken },
    { auth: false }
  );

  return storeServerSession(unwrap(response));
}

/**
 * Rehydrates the current user from the backend. This keeps the navbar in sync
 * when a session was created through the OAuth cookie flow.
 */
export async function refreshSession() {
  const current = getSession();
  if (config.useMocks) return current;

  try {
    const response = await apiClient.get(buildUrl(config.authBaseUrl, 'me'));
    const data = unwrap(response);
    const next = {
      token: current?.token || null,
      user: data.user || current?.user || null,
      expiresAt: data.expiresAt || current?.expiresAt || null,
    };
    setSession(next);
    return next;
  } catch (error) {
    if (error.status === 401) clearSession();
    return getSession();
  }
}

export async function logout() {
  try {
    if (!config.useMocks) {
      await apiClient.post(buildUrl(config.authBaseUrl, 'logout'));
    }
  } catch {
    // Local sign-out must still succeed if the server is unreachable.
  } finally {
    clearSession();
  }
}

export function getCurrentSession() {
  return getSession();
}
