import { useCallback, useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FaBars } from 'react-icons/fa';
import { PiUserCircleFill } from 'react-icons/pi';
import config from '../../lib/config';
import Sidebar from './Sidebar';

export function Navbar() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();

  const closeSidebar = useCallback(() => setSidebarOpen(false), []);

  useEffect(() => {
    setSidebarOpen(false);
  }, [location.pathname]);

  return (
    <>
      <header className="site-header">
        <div className="site-header__inner">
          <Link to="/" className="site-header__brand">
            {config.appName}
          </Link>
          <div className="site-header__actions">
            <Link to="/myprofile" className="site-header__icon" aria-label="My profile">
              <PiUserCircleFill aria-hidden="true" />
            </Link>
            <button
              type="button"
              className="site-header__toggle"
              aria-label={sidebarOpen ? 'Close navigation' : 'Open navigation'}
              aria-expanded={sidebarOpen}
              aria-controls="site-sidebar"
              onClick={() => setSidebarOpen((open) => !open)}
            >
              <FaBars aria-hidden="true" />
            </button>
          </div>
        </div>
      </header>
      <div id="site-sidebar">
        <Sidebar open={sidebarOpen} onClose={closeSidebar} />
      </div>
    </>
  );
}

export default Navbar;
