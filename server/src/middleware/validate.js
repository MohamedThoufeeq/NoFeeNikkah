import { ValidationError } from '../core/errors.js';

function formatIssues(error) {
  return error.issues.map((issue) => ({
    path: issue.path.join('.'),
    message: issue.message,
    code: issue.code,
  }));
}

/**
 * Validates and stores parsed values on `req.validated`. Request query objects
 * are never mutated, so Express 5's read-only query getter remains intact.
 */
export function validate(schemas = {}) {
  return function validateRequest(req, _res, next) {
    const validated = {};

    for (const key of ['params', 'query', 'body']) {
      const schema = schemas[key];
      if (!schema) {
        validated[key] = req[key];
        continue;
      }

      const result = schema.safeParse(req[key] ?? {});
      if (!result.success) {
        const firstIssue = result.error.issues[0];
        return next(
          new ValidationError(
            firstIssue?.message || `Invalid ${key}.`,
            formatIssues(result.error)
          )
        );
      }
      validated[key] = result.data;
    }

    req.validated = validated;
    return next();
  };
}

export default validate;
