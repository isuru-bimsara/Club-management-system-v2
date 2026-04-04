import React from 'react';
import { Menu, X, LogOut, User as UserIcon } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';
import NotificationBell from '../notifications/NotificationBell';
import UpcomingEventsMarquee from '../events/UpcomingEventsMarquee';
import { ROLES } from '../../utils/constants';

const Navbar = ({ onMenuClick, isMobileMenuOpen }) => {
  const { user, logout, role } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="sticky top-0 z-30 flex min-h-[5rem] w-full items-center justify-between bg-dark-50 px-4 sm:px-8 py-4">
      {/* Mobile Menu Button */}
      <div className="flex items-center lg:hidden">
        <button
          type="button"
          className="inline-flex items-center justify-center rounded-xl p-2.5 text-dark-500 hover:bg-white hover:text-dark-900 focus:outline-none transition-colors border border-transparent hover:border-dark-200"
          onClick={onMenuClick}
        >
          <span className="sr-only">Open sidebar</span>
          {isMobileMenuOpen ? (
            <X className="block h-5 w-5" aria-hidden="true" />
          ) : (
            <Menu className="block h-5 w-5" aria-hidden="true" />
          )}
        </button>
      </div>

      <div className="flex flex-1 items-center justify-center lg:justify-start gap-4 lg:gap-8 overflow-hidden pr-4">
        <UpcomingEventsMarquee />
      </div>

      <div className="flex items-center gap-2 sm:gap-4">
        {/* Notifications */}
        {user && role !== ROLES.ADMIN && role !== ROLES.SUPERADMIN && (
          <div className="bg-white rounded-full p-1 border border-dark-100 shadow-[0_2px_10px_rgb(0,0,0,0.02)] hidden sm:block">
            <NotificationBell />
          </div>
        )}

        {/* Profile Card */}
        <div className="flex items-center gap-3 bg-white pl-2 pr-4 py-2 rounded-full border border-dark-100 shadow-[0_2px_10px_rgb(0,0,0,0.02)]">
          <button 
            type="button" 
            className="flex rounded-full bg-dark-50 text-sm focus:outline-none overflow-hidden h-9 w-9 items-center justify-center"
          >
            {user?.profilePhoto ? (
              <img className="h-full w-full object-cover" src={user.profilePhoto} alt="" />
            ) : (
               <UserIcon className="h-4 w-4 text-dark-500" />
            )}
          </button>
          
          <div className="hidden sm:flex flex-col">
            <span className="text-xs font-bold text-dark-900 leading-tight">{user?.name}</span>
            <span className="text-[10px] text-dark-500 truncate max-w-[120px] leading-tight capitalize">{role}</span>
          </div>
          
          <button
            onClick={handleLogout}
            className="ml-1 rounded-full p-1.5 text-dark-400 hover:bg-dark-50 hover:text-dark-900 transition-colors"
            title="Logout"
          >
            <LogOut className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
