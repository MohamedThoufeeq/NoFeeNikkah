import { AiFillHome } from 'react-icons/ai';
import { IoIosLogIn } from 'react-icons/io';
import { PiUserCirclePlusDuotone, PiUserCircleFill } from 'react-icons/pi';
import { MdPersonSearch, MdOutlineSupportAgent, MdOutlineEdit } from 'react-icons/md';
import { IoMdHelpCircle } from 'react-icons/io';

export const primaryNavigation = [
  { id: 'home', label: 'Home', path: '/', icon: AiFillHome },
  { id: 'search', label: 'Search', path: '/search', icon: MdPersonSearch },
  { id: 'my-profile', label: 'My Profile', path: '/myprofile', icon: PiUserCircleFill },
  { id: 'edit-profile', label: 'Edit Profile', path: '/edit-myprofile', icon: MdOutlineEdit },
  { id: 'contact', label: 'Contact', path: '/contact', icon: MdOutlineSupportAgent },
  { id: 'about', label: 'About', path: '/about', icon: IoMdHelpCircle },
];

export const guestNavigation = [
  { id: 'login', label: 'Login', path: '/login', icon: IoIosLogIn },
  { id: 'register', label: 'Register', path: '/register', icon: PiUserCirclePlusDuotone },
];
