import { Router } from 'express';
import { asyncHandler } from '../core/asyncHandler.js';
import { notFound } from '../middleware/notFound.js';
import { createAuthRouter } from './auth.routes.js';
import { createProfileRouter } from './profile.routes.js';
import { createInterestRouter } from './interest.routes.js';

export function createApiRouter({ controllers, authenticate, optionalAuthenticate, rateLimiters }) {
  const router = Router();

  router.get('/health', asyncHandler(controllers.health.live));
  router.get('/health/db', asyncHandler(controllers.health.ready));

  router.use(
    '/auth',
    createAuthRouter({
      authController: controllers.auth,
      authenticate,
      rateLimiters,
    })
  );

  router.use(
    createInterestRouter({
      interestController: controllers.interest,
      authenticate,
    })
  );

  router.use(
    createProfileRouter({
      profileController: controllers.profile,
      interestController: controllers.interest,
      authenticate,
      optionalAuthenticate,
    })
  );

  router.use(notFound);

  return router;
}

export default createApiRouter;
