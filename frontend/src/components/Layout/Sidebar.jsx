import React from 'react';
import { NavLink } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';
import {
  FiHome,
  FiUsers,
  FiCamera,
  FiFileText,
  FiSettings,
  FiLogOut,
  FiMenu,
  FiX,
  FiBarChart2
} from 'react-icons/fi';

const Sidebar = ({ sidebarOpen, setSidebarOpen }) => {
  const { user, logout } = useAuth();

  const navItems = [
    { path: '/dashboard', name: 'Dashboard', icon: FiHome },
    { path: '/users', name: 'User Management', icon: FiUsers },
    { path: '/recognition', name: 'Face Recognition', icon: FiCamera },
    { path: '/reports', name: 'Reports', icon: FiFileText },
    { path: '/analytics', name: 'Analytics', icon: FiBarChart2 },
  ];

  // Admin only items
  if (user?.role === 'super_admin' || user?.role === 'admin') {
    navItems.push({ path: '/settings', name: 'Settings', icon: FiSettings });
  }

  const sidebarVariants = {
    open: { width: '280px' },
    closed: { width: '80px' }
  };

  return (
    <>
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-20 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <motion.aside
        variants={sidebarVariants}
        initial="open"
        animate={sidebarOpen ? 'open' : 'closed'}
        className="fixed lg:relative z-30 h-screen bg-secondary-800 border-r border-secondary-700 overflow-hidden flex flex-col"
      >
        {/* Logo */}
        <div className="h-20 flex items-center justify-between px-4 border-b border-secondary-700">
          {sidebarOpen ? (
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
                <FiCamera className="text-white" />
              </div>
              <span className="text-xl font-bold text-white">CCTV<span className="text-primary-500">.AI</span></span>
            </div>
          ) : (
            <div className="w-full flex justify-center">
              <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
                <FiCamera className="text-white" />
              </div>
            </div>
          )}
          
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="lg:hidden text-secondary-400 hover:text-white"
          >
            {sidebarOpen ? <FiX size={20} /> : <FiMenu size={20} />}
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto py-6">
          <ul className="space-y-2 px-3">
            {navItems.map((item) => (
              <li key={item.path}>
                <NavLink
                  to={item.path}
                  className={({ isActive }) =>
                    `flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                      isActive
                        ? 'bg-primary-600 text-white'
                        : 'text-secondary-400 hover:bg-secondary-700 hover:text-white'
                    }`
                  }
                >
                  <item.icon size={20} />
                  {sidebarOpen && <span>{item.name}</span>}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>

        {/* User info */}
        <div className="border-t border-secondary-700 p-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-full bg-primary-600 flex items-center justify-center">
              <span className="text-white font-semibold">
                {user?.full_name?.charAt(0) || 'A'}
              </span>
            </div>
            {sidebarOpen && (
              <div className="flex-1 min-w-0">
                <p className="text-white font-medium truncate">{user?.full_name}</p>
                <p className="text-secondary-400 text-sm truncate">{user?.role}</p>
              </div>
            )}
          </div>
          
          {sidebarOpen && (
            <button
              onClick={logout}
              className="mt-4 w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-secondary-400 hover:bg-secondary-700 hover:text-white transition-all duration-200"
            >
              <FiLogOut size={20} />
              <span>Logout</span>
            </button>
          )}
        </div>
      </motion.aside>
    </>
  );
};

export default Sidebar; // Make sure this is default export