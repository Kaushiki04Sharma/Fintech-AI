import { Menu, User, ArrowLeft, Search } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';
import ThemeToggle from './ThemeToggle';
import NotificationDropdown from './NotificationDropdown';
import UserProfileDropdown from './UserProfileDropdown';
import { useAuth } from '../../context/AuthContext';
import { motion } from 'framer-motion';
import { useState } from 'react';

const Navbar = ({ setSidebarOpen }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();
  const isDashboard = location.pathname === '/';
  const [searchFocused, setSearchFocused] = useState(false);

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ type: "spring", stiffness: 100 }}
      className="sticky top-0 z-30 navbar-glass"
    >
      <div className="px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center min-h-[70px]">
        <div className="flex items-center space-x-4 flex-1">
          {/* Hamburger Menu for Mobile */}
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => setSidebarOpen(true)}
            className="md:hidden p-2.5 rounded-xl hover:bg-primary-50 dark:hover:bg-primary-900/20 transition-colors relative group"
          >
            <div className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity" style={{
              background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.1) 0%, rgba(139, 92, 246, 0.1) 100%)'
            }}></div>
            <Menu size={24} className="relative z-10" />
          </motion.button>

          {/* Back Button for Mobile (on non-dashboard pages) */}
          {!isDashboard && (
            <motion.button
              whileHover={{ scale: 1.1, x: -2 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => navigate(-1)}
              className="md:hidden p-2.5 rounded-xl hover:bg-primary-50 dark:hover:bg-primary-900/20 transition-colors"
            >
              <ArrowLeft size={24} />
            </motion.button>
          )}

          {/* Welcome message - Hidden on mobile */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="hidden md:block"
          >
            <h1 className="text-2xl font-black text-text-primary-light dark:text-text-primary-dark">
              Welcome back, <span className="text-gradient">{user?.name || 'User'}</span>! 👋
            </h1>
          </motion.div>

          {/* Search Bar - Hidden on small screens */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 }}
            className="hidden lg:flex items-center flex-1 max-w-md ml-8"
          >
            <div className={`relative w-full transition-all duration-300 ${searchFocused ? 'scale-105' : ''}`}>
              <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-text-secondary-light dark:text-text-secondary-dark" />
              <input
                type="text"
                placeholder="Search transactions, goals..."
                onFocus={() => setSearchFocused(true)}
                onBlur={() => setSearchFocused(false)}
                className="w-full pl-12 pr-4 py-2.5 rounded-xl bg-background-light/50 dark:bg-background-dark/50 border-2 border-border-light/50 dark:border-border-dark/50 focus:border-primary dark:focus:border-primary transition-all duration-300 focus:shadow-glow placeholder-text-secondary-light dark:placeholder-text-secondary-dark"
              />
            </div>
          </motion.div>
        </div>

        <div className="flex items-center space-x-2 sm:space-x-3">
          {/* Notification Dropdown */}
          <NotificationDropdown />

          {/* Theme Toggle */}
          <ThemeToggle />

          {/* User Profile Dropdown */}
          <UserProfileDropdown />
        </div>
      </div>
    </motion.nav>
  );
};

export default Navbar;
