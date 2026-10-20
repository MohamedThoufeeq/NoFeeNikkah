import { NotFoundError } from '../core/errors.js';

export function notFound(req, _res, next) {
  next(new NotFoundError(`Route ${req.method} ${req.originalUrl} was not found.`));
}

export default notFound;
