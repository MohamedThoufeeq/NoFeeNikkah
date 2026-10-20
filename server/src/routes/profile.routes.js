import { Router } from 'express';
import { asyncHandler } from '../core/asyncHandler.js';
import { validate } from '../middleware/validate.js';
import {
  idParamsSchema,
  searchSchema,
  updateProfileSchema,
} from '../validators/profile.schemas.js';
import { legacyInterestParamsSchema } from '../validators/interest.schemas.js';

export function createProfileRouter({
  profileController,
  interestController,
  authenticate,
  optionalAuthenticate,
}) {
  const router = Router();

  router.get('/profiles/me', authenticate, asyncHandler(profileController.me));
  router.patch(
    '/profiles/me',
    authenticate,
    validate({ body: updateProfileSchema }),
    asyncHandler(profileController.updateMe)
  );
  router.put(
    '/profiles/me',
    authenticate,
    validate({ body: updateProfileSchema }),
    asyncHandler(profileController.updateMe)
  );
  router.delete('/profiles/me', authenticate, asyncHandler(profileController.deleteMe));

  router.get(
    '/filter',
    optionalAuthenticate,
    validate({ query: searchSchema }),
    asyncHandler(profileController.search)
  );
  router.get(
    '/search',
    optionalAuthenticate,
    validate({ query: searchSchema }),
    asyncHandler(profileController.search)
  );

  // Legacy endpoint retained for the existing client.
  router.post(
    '/:id/senInterest/:targetId',
    authenticate,
    validate({ params: legacyInterestParamsSchema }),
    asyncHandler(interestController.sendLegacy)
  );

  router.get(
    '/profiles/:id',
    optionalAuthenticate,
    validate({ params: idParamsSchema }),
    asyncHandler(profileController.getById)
  );

  // Legacy update endpoint: POST /api/:id
  router.post(
    '/:id',
    authenticate,
    validate({ params: idParamsSchema, body: updateProfileSchema }),
    asyncHandler(profileController.updateById)
  );

  return router;
}

export default createProfileRouter;
