import React from 'react';
import * as PiIcons from 'react-icons/pi';
import * as MdIcons from 'react-icons/md';
import * as AiIcons from 'react-icons/ai';
import * as IoIcons from 'react-icons/io';

export const SidebarData = [
  {
    title: 'Home',
    path: '/',
    icon: <AiIcons.AiFillHome />,
    cName: 'nav-text'
  },
  {
    title: 'Login',
    path: '/login',
    icon: <IoIcons.IoIosLogIn />,
    cName: 'nav-text'
  },
  {
    title: 'Register',
    path: '/register',
    icon: <PiIcons.PiUserCirclePlusDuotone />,
    cName: 'nav-text'
  },
  {
    title: 'Search',
    path: '/search',
    icon: <MdIcons.MdPersonSearch />,
    cName: 'nav-text'
  },
  {
    title: 'Contact',
    path: '/contact',
    icon: <MdIcons.MdOutlineSupportAgent />,
    cName: 'nav-text'
  },
  {
    title: 'About',
    path: '/about',
    icon: <IoIcons.IoMdHelpCircle />,
    cName: 'nav-text'
  }
];