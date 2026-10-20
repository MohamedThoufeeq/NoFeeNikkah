import { ForbiddenError } from '../core/errors.js';

const SAFE_METHODS = new Set(['GET', 'HEAD', 'OPTIONS']);

/**
 * Cookie-authenticated unsafe requests are only accepted from configured
 * browser origins. Bearer-token requests are exempt because browsers do not
 * attach those credentials automatically.
 *
 * This complements SameSite cookies and CORS, and specifically blocks
 * cross-site HTML form posts that CORS would otherwise not preflight.
 */
export function csrfGuard({ corsOrigins }) {
  return function checkOrigin(req, _res, next) {
    if (SAFE_METHODS.has(req.method)) {
      next();
      return;
    }

    if (req.get('authorization')) {
      next();
      return;
    }

    const origin = req.get('origin');
    if (!origin || corsOrigins.includes(origin)) {
      next();
      return;
    }

    next(new ForbiddenError('This request origin is not allowed.'));
  };
}

export default csrfGuard;
