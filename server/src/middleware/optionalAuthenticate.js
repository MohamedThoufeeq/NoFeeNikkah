import { asyncHandler } from '../core/asyncHandler.js';
import { extractSessionToken } from './sessionToken.js';

/**
 * Allows guests through while still resolving a session when one is present.
 * Used for public profile reads and search.
 */
export function optionalAuthenticate({ sessionService, cookieName }) {
  return asyncHandler(async (req, _res, next) => {
    const token = extractSessionToken(req, cookieName);
    if (!token) {
      next();
      return;
    }

    req.auth = await sessionService.resolveSession(token);
    next();
  });
}

export default optionalAuthenticate;
