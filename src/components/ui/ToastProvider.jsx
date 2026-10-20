import { useCallback, useMemo, useRef, useState } from 'react';
import { ToastContext } from './toastContext';

const AUTO_DISMISS_MS = 4500;

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);
  const counter = useRef(0);

  const dismiss = useCallback((id) => {
    setToasts((current) => current.filter((toast) => toast.id !== id));
  }, []);

  const notify = useCallback(
    ({ title, message, type = 'info', duration = AUTO_DISMISS_MS }) => {
      counter.current += 1;
      const id = counter.current;
      setToasts((current) => [...current, { id, title, message, type }]);
      if (duration > 0) {
        window.setTimeout(() => dismiss(id), duration);
      }
      return id;
    },
    [dismiss]
  );

  const value = useMemo(
    () => ({
      notify,
      dismiss,
      success: (title, message) => notify({ title, message, type: 'success' }),
      error: (title, message) => notify({ title, message, type: 'error' }),
      info: (title, message) => notify({ title, message, type: 'info' }),
    }),
    [notify, dismiss]
  );

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div className="toast-viewport" aria-live="polite" aria-atomic="false">
        {toasts.map((toast) => (
          <div className={`toast toast--${toast.type}`} key={toast.id} role="status">
            <div className="toast__content">
              {toast.title ? <p className="toast__title">{toast.title}</p> : null}
              {toast.message ? <p className="toast__message">{toast.message}</p> : null}
            </div>
            <button
              type="button"
              className="toast__close"
              aria-label="Dismiss notification"
              onClick={() => dismiss(toast.id)}
            >
              ×
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export default ToastProvider;
