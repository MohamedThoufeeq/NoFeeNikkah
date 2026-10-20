import { createHash, randomBytes } from 'node:crypto';

export function generateSessionToken() {
  return randomBytes(48).toString('base64url');
}

export function hashToken(token) {
  return createHash('sha256').update(String(token)).digest('hex');
}
