/**
 * Domain error hierarchy.
 *
 * Every error that is safe to expose to a client extends `AppError` and sets
 * `isOperational` to true. Unexpected errors stay generic in production.
 */
export class AppError extends Error {
  constructor(
    message,
    {
      statusCode = 500,
      code = 'INTERNAL_ERROR',
      details = null,
      isOperational = true,
      cause,
    } = {}
  ) {
    super(message, cause ? { cause } : undefined);
    this.name = this.constructor.name;
    this.statusCode = statusCode;
    this.code = code;
    this.details = details;
    this.isOperational = isOperational;
    Error.captureStackTrace?.(this, this.constructor);
  }

  toJSON() {
    return {
      code: this.code,
      message: this.message,
      ...(this.details ? { details: this.details } : {}),
    };
  }
}

export class BadRequestError extends AppError {
  constructor(message = 'The request is invalid.', details = null) {
    super(message, { statusCode: 400, code: 'BAD_REQUEST', details });
  }
}

export class ValidationError extends AppError {
  constructor(message = 'Validation failed.', details = null) {
    super(message, { statusCode: 422, code: 'VALIDATION_ERROR', details });
  }
}

export class UnauthorizedError extends AppError {
  constructor(message = 'Authentication is required.') {
    super(message, { statusCode: 401, code: 'UNAUTHORIZED' });
  }
}

export class ForbiddenError extends AppError {
  constructor(message = 'You do not have permission to perform this action.') {
    super(message, { statusCode: 403, code: 'FORBIDDEN' });
  }
}

export class NotFoundError extends AppError {
  constructor(message = 'The requested resource was not found.') {
    super(message, { statusCode: 404, code: 'NOT_FOUND' });
  }
}

export class ConflictError extends AppError {
  constructor(message = 'The resource already exists.', details = null) {
    super(message, { statusCode: 409, code: 'CONFLICT', details });
  }
}

export class TooManyRequestsError extends AppError {
  constructor(message = 'Too many requests. Please try again later.') {
    super(message, { statusCode: 429, code: 'RATE_LIMITED' });
  }
}

export class ServiceUnavailableError extends AppError {
  constructor(message = 'The service is temporarily unavailable.') {
    super(message, { statusCode: 503, code: 'SERVICE_UNAVAILABLE' });
  }
}

export class ConfigurationError extends AppError {
  constructor(message = 'Server configuration is invalid.', details = null) {
    super(message, { statusCode: 500, code: 'CONFIGURATION_ERROR', details });
  }
}

export class DatabaseError extends AppError {
  constructor(message = 'A database operation failed.', { details = null, cause } = {}) {
    super(message, {
      statusCode: 500,
      code: 'DATABASE_ERROR',
      details,
      isOperational: false,
      cause,
    });
  }
}

const AUTH_ERROR_MESSAGES = {
  400: 'The authentication request could not be completed.',
  401: 'Invalid email or password.',
  403: 'This account is not allowed to sign in.',
  422: 'Check the email address and password and try again.',
  429: 'Too many authentication attempts. Please try again later.',
};

/**
 * Translate a Supabase auth error into a domain error without leaking
 * provider internals (or whether an email address exists) to the client.
 */
export function mapAuthError(error) {
  if (error instanceof AppError) return error;

  const status = Number(error?.status) || 500;
  const message = String(error?.message || '').toLowerCase();

  if (message.includes('already registered') || message.includes('already exists')) {
    return new ConflictError('This email address is already registered.');
  }
  if (message.includes('invalid login credentials')) {
    return new UnauthorizedError('Invalid email or password.');
  }
  if (message.includes('email not confirmed')) {
    return new ForbiddenError('Please confirm your email address before signing in.');
  }
  if (message.includes('password') && message.includes('short')) {
    return new ValidationError('Password does not meet the minimum requirements.');
  }
  if (status === 429) {
    return new TooManyRequestsError('Too many authentication attempts. Please try again later.');
  }
  if (status >= 400 && status < 500) {
    return new AppError(AUTH_ERROR_MESSAGES[status] || 'Authentication failed.', {
      statusCode: status,
      code: 'AUTH_ERROR',
    });
  }

  return new ServiceUnavailableError('The authentication provider is unavailable.');
}

/**
 * Translate a PostgREST/Postgres error into a domain error. `details` on
 * server logs keep the original database error, while the client receives a
 * safe message.
 */
export function mapDatabaseError(error) {
  if (error instanceof AppError) return error;

  const code = error?.code;
  const details = {
    code,
    message: error?.message,
    hint: error?.hint,
  };

  if (code === '23505') {
    return new ConflictError('A record with these details already exists.');
  }
  if (code === '23503') {
    return new BadRequestError('The referenced record does not exist.');
  }
  if (code === '23502') {
    return new BadRequestError('A required field is missing.');
  }
  if (code === 'PGRST116') {
    return new NotFoundError();
  }
  if (code === '42501') {
    return new ForbiddenError('The database rejected this operation.');
  }

  return new DatabaseError('A database operation failed.', { details, cause: error });
}
