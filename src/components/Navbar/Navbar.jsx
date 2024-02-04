import React, { useState } from 'react';
import * as FaIcons from 'react-icons/fa';
import * as AiIcons from 'react-icons/ai';
import * as PiIcons from 'react-icons/pi';
import { Link } from 'react-router-dom';
import { SidebarData } from './SidebarData';
import '../css/Navbar.css';

function Navbar() {
  const [sidebar, setSidebar] = useState(false);

  const showSidebar = () => setSidebar(!sidebar);

  return (
    <div id='navbar-container'>
      <div className='navbar'>
        <div id="logo-container">
          <a href='/'><p>NoFeeNikkah</p></a>
        </div>
        <div id="profile-container">
          <Link to='/myprofile'>
            <PiIcons.PiUserCircleFill />
          </Link>
        </div>
        <div id="toggle-container">
          <Link to='#' className='menu-bars'>
            <FaIcons.FaBars onClick={showSidebar} />
          </Link>
        </div>
      </div>
      <nav className={sidebar ? 'nav-menu active' : 'nav-menu'}>
        <ul className='nav-menu-items' onClick={showSidebar}>
          <li className='navbar-toggle'>
            <Link to='#' className='menu-bars'>
              <AiIcons.AiOutlineClose />
            </Link>
          </li>
          {SidebarData.map((item, index) => {
            return (
              <li key={index} className={item.cName}>
                <Link to={item.path}>
                  {item.icon}
                  <span>{item.title}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
      {/* </IconContext.Provider> */}
    </div>
  );
}

export default Navbar;