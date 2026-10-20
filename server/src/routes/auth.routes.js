import { Router } from 'express';
import { asyncHandler } from '../core/asyncHandler.js';
import { validate } from '../middleware/validate.js';
import {
  loginSchema,
  registerSchema,
  socialLoginSchema,
} from '../validators/auth.schemas.js';

export function createAuthRouter({ authController, authenticate, rateLimiters }) {
  const router = Router();

  router.get('/providers', asyncHandler(authController.providers));

  router.post(
    '/register',
    rateLimiters.auth,
    validate({ body: registerSchema }),
    asyncHandler(authController.register)
  );

  router.post(
    '/login',
    rateLimiters.auth,
    validate({ body: loginSchema }),
    asyncHandler(authController.login)
  );

  router.post(
    '/social',
    rateLimiters.auth,
    validate({ body: socialLoginSchema }),
    asyncHandler(authController.social)
  );

  // Logout must work even when the session has already expired.
  router.post('/logout', asyncHandler(authController.logout));

  router.get('/me', authenticate, asyncHandler(authController.me));
  router.get('/session', authenticate, asyncHandler(authController.me));
  router.post('/logout-all', authenticate, asyncHandler(authController.logoutAll));
  router.delete('/account', authenticate, asyncHandler(authController.deleteAccount));

  return router;
}

export default createAuthRouter;
