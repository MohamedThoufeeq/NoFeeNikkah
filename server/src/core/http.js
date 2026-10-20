/**
 * One response envelope for every JSON endpoint.
 *
 * `success` is always present so clients can distinguish business responses
 * from infrastructure/proxy errors.
 */
export function sendSuccess(res, data, { status = 200, meta } = {}) {
  const payload = { success: true, data };
  if (meta !== undefined) payload.meta = meta;
  return res.status(status).json(payload);
}

export function sendCreated(res, data, options = {}) {
  return sendSuccess(res, data, { ...options, status: 201 });
}

export function sendNoContent(res) {
  return res.status(204).end();
}
