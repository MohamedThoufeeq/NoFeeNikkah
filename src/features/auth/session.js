import { useSyncExternalStore } from 'react';
import config from '../../lib/config';

/**
 * Minimal observable session store.
 *
 * Components subscribe with `useSession()`; auth code calls `setSession` /
 * `clearSession`. Synchronising across browser tabs is handled through the
 * `storage` event.
 */
let cache = readSession();
const listeners = new Set();

function readSession() {
  if (typeof window === 'undefined') return null;
  try {
    const raw = window.localStorage.getItem(config.storageKeys.session);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function emit() {
  listeners.forEach((listener) => listener());
}

export function subscribe(listener) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function getSession() {
  return cache;
}

export function getServerSession() {
  return null;
}

export function setSession(session) {
  cache = session;
  try {
    if (session) window.localStorage.setItem(config.storageKeys.session, JSON.stringify(session));
    else window.localStorage.removeItem(config.storageKeys.session);
  } catch {
    /* Storage can be unavailable (private mode); keep the in-memory session. */
  }
  emit();
}

export function clearSession() {
  setSession(null);
}

if (typeof window !== 'undefined') {
  window.addEventListener('storage', (event) => {
    if (event.key !== config.storageKeys.session) return;
    cache = readSession();
    emit();
  });

  // The HTTP client dispatches this whenever the backend rejects a token.
  window.addEventListener('nfn:unauthorized', () => {
    clearSession();
  });
}

export function useSession() {
  return useSyncExternalStore(subscribe, getSession, getServerSession);
}

export default useSession;
