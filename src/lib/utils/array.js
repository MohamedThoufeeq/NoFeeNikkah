/** Normalise any value into an array without mutating it. */
export function asArray(value) {
  if (value === null || value === undefined || value === '') return [];
  return Array.isArray(value) ? value.filter((item) => item !== null && item !== undefined) : [value];
}

/** Remove duplicate primitives while preserving order. */
export function unique(values) {
  return [...new Set(asArray(values))];
}

/** Split a comma separated string into a clean array. */
export function fromCsv(value) {
  return asArray(value)
    .flatMap((item) => (typeof item === 'string' ? item.split(',') : item))
    .map((item) => (typeof item === 'string' ? item.trim() : item))
    .filter(Boolean);
}
