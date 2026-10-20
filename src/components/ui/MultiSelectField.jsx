import { useMemo } from 'react';
import CreatableSelect from 'react-select/creatable';
import Select from 'react-select';
import { Field } from './Field';
import { asArray } from '../../lib/utils/array';

const selectStyles = {
  control: (base, state) => ({
    ...base,
    minHeight: 'var(--control-height)',
    borderColor: state.isFocused
      ? 'var(--color-brand-500)'
      : 'var(--color-border-strong)',
    boxShadow: state.isFocused ? 'var(--focus-ring)' : 'none',
    backgroundColor: 'var(--color-surface)',
    ':hover': { borderColor: 'var(--color-text-subtle)' },
  }),
  menu: (base) => ({ ...base, zIndex: 'var(--z-tooltip)' }),
  option: (base, state) => ({
    ...base,
    cursor: 'pointer',
    backgroundColor: state.isSelected
      ? 'var(--color-brand-50)'
      : state.isFocused
        ? 'var(--color-surface-subtle)'
        : 'transparent',
    color: 'var(--color-text)',
    ':active': { backgroundColor: 'var(--color-brand-100)' },
  }),
  multiValue: (base) => ({
    ...base,
    borderRadius: 'var(--radius-xs)',
    backgroundColor: 'var(--color-brand-50)',
  }),
  multiValueLabel: (base) => ({ ...base, color: 'var(--color-brand-700)' }),
  multiValueRemove: (base) => ({
    ...base,
    ':hover': { backgroundColor: 'var(--color-brand-100)', color: 'var(--color-brand-900)' },
  }),
  placeholder: (base) => ({ ...base, color: 'var(--color-text-subtle)' }),
  indicatorSeparator: (base) => ({ ...base, backgroundColor: 'var(--color-border)' }),
};

export function MultiSelectField({
  id,
  label,
  value,
  onChange,
  options = [],
  placeholder = 'Select…',
  hint,
  error,
  creatable = false,
  disabled = false,
  className,
}) {
  const optionMap = useMemo(() => new Map(options.map((option) => [option.value, option])), [options]);

  const selected = useMemo(
    () =>
      asArray(value).map((item) =>
        optionMap.get(item) || { value: item, label: String(item) }
      ),
    [value, optionMap]
  );

  const handleChange = (nextValue) => {
    onChange((nextValue || []).map((option) => option.value));
  };

  const handleCreate = (inputValue) => {
    const trimmed = inputValue.trim();
    if (!trimmed || asArray(value).includes(trimmed)) return;
    onChange([...asArray(value), trimmed]);
  };

  const commonProps = {
    inputId: id,
    className: 'multi-select',
    classNamePrefix: 'select',
    isMulti: true,
    isDisabled: disabled,
    options,
    value: selected,
    onChange: handleChange,
    placeholder,
    styles: selectStyles,
    closeMenuOnSelect: false,
    menuPlacement: 'auto',
    maxMenuHeight: 260,
    'aria-describedby': error ? `${id}-error` : hint ? `${id}-hint` : undefined,
  };

  return (
    <Field id={id} label={label} hint={hint} error={error} className={className}>
      {creatable ? (
        <CreatableSelect {...commonProps} onCreateOption={handleCreate} formatCreateLabel={(input) => `Add “${input}”`} />
      ) : (
        <Select {...commonProps} />
      )}
    </Field>
  );
}

export default MultiSelectField;
