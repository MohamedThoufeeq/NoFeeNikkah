import { Router } from 'express';
import { asyncHandler } from '../core/asyncHandler.js';
import { validate } from '../middleware/validate.js';
import {
  interestIdParamsSchema,
  sendInterestSchema,
  updateInterestSchema,
} from '../validators/interest.schemas.js';

export function createInterestRouter({ interestController, authenticate }) {
  const router = Router();

  router.use('/interests', authenticate);

  router.post(
    '/interests',
    validate({ body: sendInterestSchema }),
    asyncHandler(interestController.send)
  );
  router.get('/interests/sent', asyncHandler(interestController.sent));
  router.get('/interests/received', asyncHandler(interestController.received));
  router.patch(
    '/interests/:id',
    validate({ params: interestIdParamsSchema, body: updateInterestSchema }),
    asyncHandler(interestController.updateStatus)
  );
  router.delete(
    '/interests/:id',
    validate({ params: interestIdParamsSchema }),
    asyncHandler(interestController.withdraw)
  );

  return router;
}

export default createInterestRouter;
