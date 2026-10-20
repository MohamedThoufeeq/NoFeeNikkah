import { cn } from '../../lib/utils/cn';

export function Field({ id, label, hint, error, required, className, labelAs = 'label', children }) {
  const LabelTag = labelAs === 'span' ? 'span' : 'label';
  return (
    <div className={cn('field', className)}>
      {label ? (
        <LabelTag className="field__label" {...(labelAs === 'span' ? {} : { htmlFor: id })}>
          {label}
          {required ? (
            <span className="field__required" aria-hidden="true">
              {' '}
              *
            </span>
          ) : null}
        </LabelTag>
      ) : null}
      {children}
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
    </div>
  );
}

export default Field;
