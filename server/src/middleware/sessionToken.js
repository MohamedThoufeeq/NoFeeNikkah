/**
 * Accepts a session token from the Authorization header (legacy/mobile
 * clients) or the HttpOnly cookie (browser clients).
 */
export function extractSessionToken(req, cookieName) {
  const header = req.get('authorization');
  if (header) {
    const match = /^Bearer\s+(.+)$/i.exec(header.trim());
    if (match?.[1]) return match[1];
  }

  return req.cookies?.[cookieName] || null;
}

export default extractSessionToken;
