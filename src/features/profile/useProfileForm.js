import { useCallback, useMemo, useRef, useState, useEffect } from 'react';
import { validateProfileForm } from './profileValidation';

/**
 * Form state, validation and dirty tracking for the schema-driven form.
 *
 * Values are seeded from the loaded profile. When the source profile changes
 * (for example, navigating into Edit with a freshly fetched record), the form
 * is re-seeded from that profile so the saved values display in the inputs.
 * Once seeded, whatever the user types is retained until they explicitly
 * submit or call `reset()`.
 */
export function useProfileForm(initialValues) {
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState({});
  const initialRef = useRef(initialValues);
  const signatureRef = useRef(JSON.stringify(initialValues));

  // Re-seed the form when the loaded profile changes. This runs after render,
  // so it never clobbers a value the user is mid-way through typing for the
  // same profile.
  useEffect(() => {
    const nextSignature = JSON.stringify(initialValues);
    if (signatureRef.current !== nextSignature) {
      signatureRef.current = nextSignature;
      initialRef.current = initialValues;
      setValues(initialValues);
      setErrors({});
    }
  }, [initialValues]);

  const setValue = useCallback((name, value) => {
    setValues((current) => ({ ...current, [name]: value }));
    setErrors((current) => {
      if (!current[name]) return current;
      const next = { ...current };
      delete next[name];
      return next;
    });
  }, []);

  const patch = useCallback((partial) => {
    setValues((current) => ({ ...current, ...partial }));
  }, []);

  const reset = useCallback(() => {
    setValues(initialRef.current);
    setErrors({});
  }, []);

  const validate = useCallback(() => {
    const nextErrors = validateProfileForm(values);
    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  }, [values]);

  const isDirty = useMemo(
    () => JSON.stringify(values) !== JSON.stringify(initialRef.current),
    [values]
  );

  return { values, errors, setValue, patch, reset, validate, isDirty, setErrors };
}

export default useProfileForm;
