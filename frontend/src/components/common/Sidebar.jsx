import { Home, Target, Bot, BarChart2, Settings, X, LogOut, Sparkles } from 'lucide-react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { motion } from 'framer-motion';

const navItems = [
  { to: '/', icon: Home, label: 'Dashboard', gradient: 'from-blue-500 to-cyan-500' },
  { to: '/goals', icon: Target, label: 'My Goals', gradient: 'from-purple-500 to-pink-500' },
  { to: '/advisor', icon: Bot, label: 'AI Advisor', gradient: 'from-green-500 to-emerald-500' },
  { to: '/reports', icon: BarChart2, label: 'Reports', gradient: 'from-orange-500 to-red-500' },
  { to: '/settings', icon: Settings, label: 'Settings', gradient: 'from-gray-500 to-slate-500' },
];

const Sidebar = ({ isOpen, setIsOpen }) => {
  const { logout, user } = useAuth();

  const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: (i) => ({
      opacity: 1,
      x: 0,
      transition: {
        delay: i * 0.1,
        type: "spring",
        stiffness: 100
      }
    })
  };

  return (
    <div
      className={`fixed top-0 left-0 w-72 h-full z-50 flex flex-col transition-transform duration-300 ${isOpen ? 'translate-x-0' : '-translate-x-full'
        } md:translate-x-0 md:relative`}
    >
      {/* Glassmorphism background */}
      <div className="absolute inset-0 bg-gradient-to-b from-card-light/95 to-card-light/90 dark:from-card-dark/95 dark:to-card-dark/90 backdrop-blur-xl border-r border-border-light/50 dark:border-border-dark/50 shadow-2xl"></div>

      {/* Animated background gradient */}
      <div className="absolute inset-0 opacity-50" style={{
        background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.05) 0%, rgba(139, 92, 246, 0.05) 50%, transparent 100%)'
      }}></div>

      {/* Content */}
      <div className="relative z-10 flex flex-col h-full">
        {/* Header */}
        <div className="p-6 flex justify-between items-center border-b border-border-light/50 dark:border-border-dark/50 min-h-[70px]">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 200 }}
            className="flex items-center space-x-2"
          >
            <div className="relative">
              <div className="absolute inset-0 rounded-lg blur-lg opacity-50" style={{
                background: 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)'
              }}></div>
              <div className="relative p-2 rounded-lg" style={{
                background: 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)'
              }}>
                <Sparkles size={20} className="text-white" />
              </div>
            </div>
            <h2 className="text-2xl font-black text-gradient">
              FINWISE
            </h2>
          </motion.div>
          <button
            onClick={() => setIsOpen(false)}
            className="md:hidden p-2 rounded-xl hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        {/* User Profile Card */}
        {user && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="m-4 p-4 rounded-xl border"
            style={{
              background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.1) 0%, rgba(139, 92, 246, 0.1) 100%)',
              borderColor: 'rgba(59, 130, 246, 0.3)'
            }}
          >
            <div className="flex items-center space-x-3">
              <div className="relative">
                <div className="w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-lg" style={{
                  background: 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)'
                }}>
                  {user.name?.charAt(0).toUpperCase() || 'U'}
                </div>
                <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-card-light dark:border-card-dark"></div>
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-bold text-text-primary-light dark:text-text-primary-dark truncate">
                  {user.name || 'User'}
                </p>
                <p className="text-xs text-text-secondary-light dark:text-text-secondary-dark truncate">
                  {user.email}
                </p>
              </div>
            </div>
          </motion.div>
        )}

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-2 overflow-y-auto scrollbar-thin">
          {navItems.map((item, index) => (
            <motion.div
              key={item.to}
              custom={index}
              initial="hidden"
              animate="visible"
              variants={itemVariants}
            >
              <NavLink
                to={item.to}
                end
                onClick={() => {
                  if (window.innerWidth < 768) setIsOpen(false);
                }}
                className={({ isActive }) =>
                  `group flex items-center px-4 py-3.5 rounded-xl font-semibold text-sm transition-all duration-300 relative overflow-hidden ${isActive
                    ? 'text-white shadow-lg'
                    : 'text-text-secondary-light dark:text-text-secondary-dark hover:text-text-primary-light dark:hover:text-text-primary-dark'
                  }`
                }
                style={({ isActive }) => ({
                  background: isActive ? `linear-gradient(135deg, ${item.gradient.includes('blue') ? '#3b82f6' : item.gradient.includes('purple') ? '#a855f7' : item.gradient.includes('green') ? '#22c55e' : item.gradient.includes('orange') ? '#f97316' : '#64748b'} 0%, ${item.gradient.includes('cyan') ? '#06b6d4' : item.gradient.includes('pink') ? '#ec4899' : item.gradient.includes('emerald') ? '#10b981' : item.gradient.includes('red') ? '#ef4444' : '#475569'} 100%)` : 'transparent'
                })}
              >
                {({ isActive }) => (
                  <>
                    {/* Hover background */}
                    {!isActive && (
                      <div className="absolute inset-0 bg-blue-50 dark:bg-blue-900/20 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    )}

                    {/* Icon and label */}
                    <div className="relative z-10 flex items-center w-full">
                      <motion.div
                        whileHover={{ scale: 1.1, rotate: 5 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <item.icon size={22} className="mr-3" />
                      </motion.div>
                      <span>{item.label}</span>

                      {/* Active indicator */}
                      {isActive && (
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          className="ml-auto w-2 h-2 bg-white rounded-full"
                        />
                      )}
                    </div>
                  </>
                )}
              </NavLink>
            </motion.div>
          ))}
        </nav>

        {/* Logout Button */}
        <div className="p-4 border-t border-border-light/50 dark:border-border-dark/50">
          <motion.button
            onClick={logout}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="flex items-center w-full px-4 py-3.5 rounded-xl font-semibold text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all duration-300 group"
          >
            <motion.div
              whileHover={{ rotate: 180 }}
              transition={{ duration: 0.3 }}
            >
              <LogOut size={22} className="mr-3" />
            </motion.div>
            <span>Logout</span>
          </motion.button>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
