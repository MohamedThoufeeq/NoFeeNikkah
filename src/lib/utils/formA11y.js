/** Build the `aria-describedby` value for a field control. */
export function describedBy(id, hint, error) {
  return (
    [hint ? `${id}-hint` : null, error ? `${id}-error` : null].filter(Boolean).join(' ') || undefined
  );
}

export default describedBy;
