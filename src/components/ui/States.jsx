import { cn } from '../../lib/utils/cn';

export function Spinner({ size = 'md', className }) {
  return <span className={cn('spinner', size === 'sm' && 'spinner--sm', className)} role="status" aria-label="Loading" />;
}

export function LoadingState({ label = 'Loading…' }) {
  return (
    <div className="loading-state">
      <Spinner />
      <p className="text-muted text-sm">{label}</p>
    </div>
  );
}

export function EmptyState({ icon, title, body, action }) {
  return (
    <div className="empty-state">
      {icon ? <span className="empty-state__icon">{icon}</span> : null}
      {title ? <h3 className="empty-state__title">{title}</h3> : null}
      {body ? <p className="empty-state__body">{body}</p> : null}
      {action}
    </div>
  );
}

export function Alert({ variant = 'info', title, children }) {
  return (
    <div className={cn('alert', `alert--${variant}`)} role={variant === 'error' ? 'alert' : 'status'}>
      {title ? <span className="alert__title">{title}</span> : null}
      {children}
    </div>
  );
}
