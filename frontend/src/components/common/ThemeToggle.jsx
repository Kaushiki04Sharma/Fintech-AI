import { Moon, Sun } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { motion } from 'framer-motion';

const ThemeToggle = () => {
  const { darkMode, toggleTheme } = useTheme();

  return (
    <motion.button
      whileHover={{ scale: 1.1, rotate: 15 }}
      whileTap={{ scale: 0.9 }}
      onClick={toggleTheme}
      className="relative p-2.5 rounded-xl hover:bg-primary-50 dark:hover:bg-primary-900/20 transition-all duration-300 group"
    >
      {/* Glow effect */}
      <div className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity" style={{
        background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.1) 0%, rgba(139, 92, 246, 0.1) 100%)'
      }}></div>

      {/* Icon with animation */}
      <motion.div
        initial={false}
        animate={{ rotate: darkMode ? 180 : 0 }}
        transition={{ duration: 0.5, type: "spring" }}
        className="relative z-10"
      >
        {darkMode ? (
          <Sun size={20} className="text-yellow-400" />
        ) : (
          <Moon size={20} className="text-blue-600" />
        )}
      </motion.div>
    </motion.button>
  );
};

export default ThemeToggle;
