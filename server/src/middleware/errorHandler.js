import { ZodError } from 'zod';
import { AppError, ValidationError } from '../core/errors.js';
import { logger } from '../core/logger.js';

export function errorHandler(error, req, res, next) {
  if (res.headersSent) {
    next(error);
    return;
  }

  let normalized = error;

  if (error instanceof ZodError) {
    normalized = new ValidationError(
      'Validation failed.',
      error.issues.map((issue) => ({
        path: issue.path.join('.'),
        message: issue.message,
      }))
    );
  } else if (error?.type === 'entity.parse.failed') {
    normalized = new AppError('The request body contains invalid JSON.', {
      statusCode: 400,
      code: 'INVALID_JSON',
    });
  } else if (error?.type === 'entity.too.large') {
    normalized = new AppError('The request body is too large.', {
      statusCode: 413,
      code: 'PAYLOAD_TOO_LARGE',
    });
  }

  const isOperational = normalized instanceof AppError && normalized.isOperational;
  const statusCode = isOperational ? normalized.statusCode : 500;
  const code = isOperational ? normalized.code : 'INTERNAL_ERROR';
  const message = isOperational ? normalized.message : 'An unexpected error occurred.';

  const logPayload = {
    err: normalized,
    requestId: req.id,
    method: req.method,
    path: req.originalUrl,
    statusCode,
  };

  if (statusCode >= 500) logger.error(logPayload, 'Request failed');
  else logger.warn(logPayload, 'Request rejected');

  return res.status(statusCode).json({
    success: false,
    error: {
      code,
      message,
      ...(isOperational && normalized.details ? { details: normalized.details } : {}),
    },
    requestId: req.id,
  });
}

export default errorHandler;
