import { useEffect, useState } from 'react';

/**
 * Location data is stored pre-indexed and is loaded on demand (when a location
 * picker is first focused), then shared between every picker on the page.
 */
let datasetPromise = null;

function buildIndex(dataset) {
  if (!dataset) {
    return { countries: [], getStates: () => [], getCities: () => [] };
  }

  return {
    countries: dataset.countries || [],
    getStates: (country) => dataset.states?.[country] || [],
    getCities: (country, state) => dataset.cities?.[`${country}::${state}`] || [],
  };
}

export function loadLocationData() {
  if (!datasetPromise) {
    datasetPromise = import('../../data/reference/locations.json')
      .then((module) => buildIndex(module.default || module))
      .catch((error) => {
        datasetPromise = null;
        throw error;
      });
  }
  return datasetPromise;
}

/**
 * @param {boolean} enabled - defer the network/chunk request until needed.
 */
export function useLocationData(enabled = true) {
  const [state, setState] = useState(() => ({
    status: datasetPromise ? 'ready' : 'idle',
    data: null,
    error: null,
  }));

  useEffect(() => {
    let active = true;

    if (!enabled && !datasetPromise) return undefined;

    setState((current) => (current.status === 'ready' ? current : { ...current, status: 'loading' }));

    loadLocationData()
      .then((data) => {
        if (active) setState({ status: 'ready', data, error: null });
      })
      .catch((error) => {
        if (active) setState({ status: 'error', data: null, error });
      });

    return () => {
      active = false;
    };
  }, [enabled]);

  return state;
}
