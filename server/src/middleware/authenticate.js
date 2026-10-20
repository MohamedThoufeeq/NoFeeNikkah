import { asyncHandler } from '../core/asyncHandler.js';
import { UnauthorizedError } from '../core/errors.js';
import { extractSessionToken } from './sessionToken.js';

export function authenticate({ sessionService, cookieName }) {
  return asyncHandler(async (req, _res, next) => {
    const token = extractSessionToken(req, cookieName);
    if (!token) throw new UnauthorizedError('Authentication is required.');

    const session = await sessionService.resolveSession(token);
    req.auth = session;
    next();
  });
}

export default authenticate;
