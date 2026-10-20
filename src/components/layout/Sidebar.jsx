import { useEffect, useRef } from 'react';
import { NavLink } from 'react-router-dom';
import { AiOutlineClose } from 'react-icons/ai';
import { FaSignOutAlt } from 'react-icons/fa';
import { primaryNavigation, guestNavigation } from '../../data/navigation';
import { useSession } from '../../features/auth/session';
import config from '../../lib/config';
import { logout } from '../../lib/api/auth';
import { cn } from '../../lib/utils/cn';

export function Sidebar({ open, onClose }) {
  const closeButtonRef = useRef(null);
  const panelRef = useRef(null);
  const session = useSession();

  useEffect(() => {
    if (!open) return undefined;

    const previouslyFocused = document.activeElement;
    const getFocusable = () =>
      Array.from(
        panelRef.current?.querySelectorAll(
          'a[href], button:not([disabled]), input:not([disabled]), [tabindex]:not([tabindex="-1"])'
        ) || []
      ).filter((element) => element.offsetParent !== null);

    const onKeyDown = (event) => {
      if (event.key === 'Escape') {
        onClose();
        return;
      }
      if (event.key !== 'Tab') return;

      const focusable = getFocusable();
      if (!focusable.length) return;

      const first = focusable[0];
      const last = focusable[focusable.length - 1];

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener('keydown', onKeyDown);
    document.body.style.overflow = 'hidden';
    closeButtonRef.current?.focus();

    return () => {
      document.removeEventListener('keydown', onKeyDown);
      document.body.style.overflow = '';
      if (previouslyFocused instanceof HTMLElement) previouslyFocused.focus();
    };
  }, [open, onClose]);

  if (!open) return null;

  const handleSignOut = async () => {
    await logout();
    onClose();
  };

  const renderItem = (item) => {
    const Icon = item.icon;
    return (
      <li key={item.id}>
        <NavLink
          to={item.path}
          end={item.path === '/'}
          className={({ isActive }) => cn('sidebar__link', isActive && 'sidebar__link--active')}
          onClick={onClose}
        >
          <span className="sidebar__link-icon" aria-hidden="true">
            <Icon />
          </span>
          {item.label}
        </NavLink>
      </li>
    );
  };

  return (
    <div className="sidebar sidebar--open" role="presentation">
      <div className="sidebar__backdrop" onClick={onClose} />
      <aside
        className="sidebar__panel"
        role="dialog"
        aria-modal="true"
        aria-label="Site navigation"
        ref={panelRef}
      >
        <div className="sidebar__header">
          <span className="sidebar__brand">{config.appName}</span>
          <button
            type="button"
            className="sidebar__close"
            aria-label="Close navigation"
            onClick={onClose}
            ref={closeButtonRef}
          >
            <AiOutlineClose />
          </button>
        </div>

        <nav className="sidebar__nav" aria-label="Main">
          <ul>{primaryNavigation.map(renderItem)}</ul>
        </nav>

        <div className="sidebar__footer">
          {session ? (
            <button type="button" className="btn btn--ghost sidebar__signout" onClick={handleSignOut}>
              <FaSignOutAlt aria-hidden="true" /> Sign out
            </button>
          ) : (
            <nav className="sidebar__nav" aria-label="Account">
              <ul>{guestNavigation.map(renderItem)}</ul>
            </nav>
          )}
          <p className="mt-2">
            © {new Date().getFullYear()} {config.appName}
          </p>
        </div>
      </aside>
    </div>
  );
}

export default Sidebar;
