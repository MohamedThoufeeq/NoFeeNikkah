import config from '../config';

/**
 * A single, typed-ish HTTP client used by every service.
 * Centralising fetch means timeouts, auth headers, JSON parsing and error
 * normalisation only have to be solved once.
 */
export class ApiError extends Error {
  constructor(message, { status = 0, data = null, cause = null } = {}) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.data = data;
    this.cause = cause;
  }
}

export function buildUrl(baseUrl, path = '', query) {
  const base = baseUrl.replace(/\/+$/, '');
  const suffix = path ? `/${String(path).replace(/^\/+/, '')}` : '';
  const target = `${base}${suffix}`;
  const isAbsolute = /^[a-z][a-z0-9+.-]*:\/\//i.test(base);

  // Supports both absolute API hosts and same-origin bases such as `/api`.
  const origin =
    typeof window !== 'undefined' ? window.location.origin : 'http://localhost';
  const url = isAbsolute ? new URL(target) : new URL(target, origin);

  if (query) {
    Object.entries(query).forEach(([key, value]) => {
      if (value === undefined || value === null || value === '') return;
      if (Array.isArray(value)) {
        value.forEach((item) => url.searchParams.append(key, item));
        return;
      }
      url.searchParams.set(key, String(value));
    });
  }

  return isAbsolute ? url.toString() : `${url.pathname}${url.search}`;
}

function createTimeoutSignal(externalSignal, timeoutMs) {
  const controller = new AbortController();
  let timedOut = false;

  const timer = window.setTimeout(() => {
    timedOut = true;
    controller.abort();
  }, timeoutMs);

  const onExternalAbort = () => controller.abort();
  if (externalSignal) {
    if (externalSignal.aborted) controller.abort();
    else externalSignal.addEventListener('abort', onExternalAbort, { once: true });
  }

  return {
    signal: controller.signal,
    didTimeout: () => timedOut,
    cleanup: () => {
      window.clearTimeout(timer);
      if (externalSignal) externalSignal.removeEventListener('abort', onExternalAbort);
    },
  };
}

async function parseBody(response) {
  if (response.status === 204) return null;
  const text = await response.text();
  if (!text) return null;
  const contentType = response.headers.get('content-type') || '';
  if (contentType.includes('application/json')) {
    try {
      return JSON.parse(text);
    } catch {
      return text;
    }
  }
  return text;
}

export async function request(url, options = {}) {
  const {
    method = 'GET',
    body,
    headers = {},
    signal: externalSignal,
    timeoutMs = config.requestTimeoutMs,
    auth = true,
  } = options;

  const { signal, didTimeout, cleanup } = createTimeoutSignal(externalSignal, timeoutMs);
  const isFormData = typeof FormData !== 'undefined' && body instanceof FormData;
  const requestHeaders = { Accept: 'application/json', ...headers };

  if (body !== undefined && !isFormData) {
    requestHeaders['Content-Type'] = 'application/json';
  }

  if (auth) {
    const token = getAuthToken();
    if (token) requestHeaders.Authorization = `Bearer ${token}`;
  }

  try {
    const response = await fetch(url, {
      method,
      headers: requestHeaders,
      body: body === undefined ? undefined : isFormData ? body : JSON.stringify(body),
      signal,
      credentials: 'include',
    });

    const data = await parseBody(response);

    if (!response.ok) {
      const message =
        (data && typeof data === 'object' &&
          (data.error?.message || data.message || data.detail)) ||
        `Request failed with status ${response.status}`;

      if (response.status === 401 && auth && typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('nfn:unauthorized'));
      }

      throw new ApiError(message, { status: response.status, data });
    }

    return data;
  } catch (error) {
    if (error instanceof ApiError) throw error;
    if (error?.name === 'AbortError') {
      throw new ApiError(
        didTimeout() ? 'The request timed out. Please try again.' : 'Request cancelled.',
        { status: 0, cause: error }
      );
    }
    throw new ApiError('Unable to reach the server. Please check your connection.', {
      status: 0,
      cause: error,
    });
  } finally {
    cleanup();
  }
}

function getAuthToken() {
  try {
    const raw = window.localStorage.getItem(config.storageKeys.session);
    if (!raw) return null;
    return JSON.parse(raw)?.token || null;
  } catch {
    return null;
  }
}

export const apiClient = {
  get: (url, options) => request(url, { ...options, method: 'GET' }),
  post: (url, body, options) => request(url, { ...options, method: 'POST', body }),
  put: (url, body, options) => request(url, { ...options, method: 'PUT', body }),
  patch: (url, body, options) => request(url, { ...options, method: 'PATCH', body }),
  delete: (url, options) => request(url, { ...options, method: 'DELETE' }),
};

export default apiClient;
