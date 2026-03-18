import React from 'react';
import { FiMenu, FiBell, FiUser } from 'react-icons/fi';
import { useAuth } from '../../context/AuthContext';

const Header = ({ sidebarOpen, setSidebarOpen }) => {
  const { user } = useAuth();

  return (
    <header className="h-16 bg-secondary-800 border-b border-secondary-700 flex items-center justify-between px-6">
      <div className="flex items-center space-x-4">
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="text-secondary-400 hover:text-white lg:hidden"
        >
          <FiMenu size={24} />
        </button>
        
        <div className="flex items-center space-x-2">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
          <span className="text-secondary-400 text-sm">System Online</span>
        </div>
      </div>

      <div className="flex items-center space-x-4">
        {/* Notifications */}
        <button className="relative text-secondary-400 hover:text-white">
          <FiBell size={20} />
          <span className="absolute -top-1 -right-1 w-4 h-4 bg-accent-red rounded-full text-xs flex items-center justify-center text-white">
            3
          </span>
        </button>

        {/* User menu */}
        <div className="flex items-center space-x-3">
          <div className="text-right hidden sm:block">
            <p className="text-white text-sm font-medium">{user?.full_name}</p>
            <p className="text-secondary-400 text-xs">{user?.role}</p>
          </div>
          <div className="w-8 h-8 rounded-full bg-primary-600 flex items-center justify-center">
            <FiUser className="text-white" />
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header; // Make sure this is default export