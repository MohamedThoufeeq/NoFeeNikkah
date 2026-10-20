/**
 * Express does not await async handlers itself. Wrapping every controller
 * keeps rejected promises on the central error-handling path.
 */
export function asyncHandler(handler) {
  return function wrappedHandler(req, res, next) {
    Promise.resolve(handler(req, res, next)).catch(next);
  };
}

export default asyncHandler;
