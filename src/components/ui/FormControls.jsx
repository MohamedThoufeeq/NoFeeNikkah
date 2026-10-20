import { cn } from '../../lib/utils/cn';
import { describedBy } from '../../lib/utils/formA11y';
import { Field } from './Field';

export function TextField({
  id,
  label,
  value,
  onChange,
  type = 'text',
  placeholder,
  hint,
  error,
  required,
  disabled,
  suffix,
  className,
  inputClassName,
  autoComplete,
  min,
  max,
  step,
  inputMode,
}) {
  const input = (
    <input
      id={id}
      className={cn('control', error && 'control--invalid', inputClassName)}
      type={type}
      value={value ?? ''}
      onChange={(event) => onChange(event.target.value)}
      placeholder={placeholder}
      required={required}
      disabled={disabled}
      autoComplete={autoComplete}
      min={min}
      max={max}
      step={step}
      inputMode={inputMode}
      aria-invalid={error ? 'true' : undefined}
      aria-describedby={describedBy(id, hint, error)}
    />
  );

  if (suffix) {
    return (
      <Field id={id} label={label} hint={hint} error={error} required={required} className={className}>
        <div className="measure__item">
          {input}
          <span className="measure__suffix">{suffix}</span>
        </div>
      </Field>
    );
  }

  return (
    <Field id={id} label={label} hint={hint} error={error} required={required} className={className}>
      {input}
    </Field>
  );
}

export function SelectField({
  id,
  label,
  value,
  onChange,
  options = [],
  placeholder = 'Select',
  hint,
  error,
  required,
  disabled,
  className,
}) {
  return (
    <Field id={id} label={label} hint={hint} error={error} required={required} className={className}>
      <select
        id={id}
        className={cn('control', error && 'control--invalid')}
        value={value ?? ''}
        onChange={(event) => onChange(event.target.value)}
        required={required}
        disabled={disabled}
        aria-invalid={error ? 'true' : undefined}
        aria-describedby={describedBy(id, hint, error)}
      >
        <option value="">{placeholder}</option>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </Field>
  );
}

export function TextareaField({
  id,
  label,
  value,
  onChange,
  placeholder,
  hint,
  error,
  required,
  rows = 6,
  className,
}) {
  return (
    <Field id={id} label={label} hint={hint} error={error} required={required} className={className}>
      <textarea
        id={id}
        className={cn('control', error && 'control--invalid')}
        value={value ?? ''}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        required={required}
        rows={rows}
        aria-invalid={error ? 'true' : undefined}
        aria-describedby={describedBy(id, hint, error)}
      />
    </Field>
  );
}

export function RadioGroup({
  id,
  label,
  name,
  value,
  onChange,
  options = [],
  hint,
  error,
  required,
  className,
}) {
  return (
    <fieldset className={cn('field', className)}>
      <legend className="field__label">
        {label}
        {required ? (
          <span className="field__required" aria-hidden="true">
            {' '}
            *
          </span>
        ) : null}
      </legend>
      <div className="radio-row" id={id}>
        {options.map((option) => (
          <label className="radio-row__option" key={option.value} htmlFor={`${id}-${option.value}`}>
            <input
              id={`${id}-${option.value}`}
              type="radio"
              name={name || id}
              value={option.value}
              checked={value === option.value}
              onChange={() => onChange(option.value)}
              required={required}
              aria-invalid={error ? 'true' : undefined}
              aria-describedby={describedBy(id, hint, error)}
            />
            {option.label}
          </label>
        ))}
      </div>
      {hint ? (
        <p className="field__hint" id={`${id}-hint`}>
          {hint}
        </p>
      ) : null}
      {error ? (
        <p className="field__error" id={`${id}-error`} role="alert">
          {error}
        </p>
      ) : null}
    </fieldset>
  );
}

export function SegmentedControl({
  id,
  label,
  name,
  value,
  onChange,
  options = [],
  hint,
  className,
}) {
  return (
    <fieldset className={cn('field', className)}>
      <legend className="field__label">{label}</legend>
      <div className="segmented">
        {options.map((option) => (
          <span key={option.value} className="segmented__item">
            <input
              className="segmented__input"
              id={`${id}-${option.value}`}
              type="radio"
              name={name || id}
              value={option.value}
              checked={value === option.value}
              onChange={() => onChange(option.value)}
              aria-describedby={hint ? `${id}-hint` : undefined}
            />
            <label className="segmented__label" htmlFor={`${id}-${option.value}`}>
              {option.label}
            </label>
          </span>
        ))}
      </div>
      {hint ? (
        <p className="field__hint" id={`${id}-hint`}>
          {hint}
        </p>
      ) : null}
    </fieldset>
  );
}

export default TextField;
