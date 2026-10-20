import { useCallback, useEffect, useRef, useState } from 'react';

/**
 * Generic data-fetching hook with cancellation-safe state transitions.
 *
 * @param {() => Promise<any>} fetcher
 * @param {Array} deps
 * @param {{ enabled?: boolean, initialData?: any }} options
 */
export function useAsyncData(fetcher, deps = [], options = {}) {
  const { enabled = true, initialData = null } = options;
  const [state, setState] = useState({
    status: enabled ? 'loading' : 'idle',
    data: initialData,
    error: null,
  });
  const [reloadToken, setReloadToken] = useState(0);
  const fetcherRef = useRef(fetcher);
  fetcherRef.current = fetcher;

  useEffect(() => {
    if (!enabled) {
      setState((current) => ({ ...current, status: 'idle' }));
      return undefined;
    }

    let active = true;
    setState((current) => ({ ...current, status: 'loading', error: null }));

    Promise.resolve()
      .then(() => fetcherRef.current())
      .then((data) => {
        if (active) setState({ status: 'success', data, error: null });
      })
      .catch((error) => {
        if (active) setState({ status: 'error', data: initialData, error });
      });

    return () => {
      active = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [...deps, enabled, reloadToken]);

  const reload = useCallback(() => setReloadToken((token) => token + 1), []);

  return {
    ...state,
    isLoading: state.status === 'loading',
    isError: state.status === 'error',
    isSuccess: state.status === 'success',
    reload,
    setData: (data) => setState({ status: 'success', data, error: null }),
  };
}

export default useAsyncData;
