import { motion, AnimatePresence } from 'framer-motion';
import { User, Settings, LogOut, CreditCard, Bell, Shield, ChevronRight } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const UserProfileDropdown = () => {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const menuItems = [
        {
            icon: User,
            label: 'My Profile',
            action: () => {
                navigate('/settings');
                setIsOpen(false);
            }
        },
        {
            icon: Settings,
            label: 'Settings',
            action: () => {
                navigate('/settings');
                setIsOpen(false);
            }
        },
        {
            icon: CreditCard,
            label: 'Transactions',
            action: () => {
                navigate('/');
                setIsOpen(false);
            }
        },
        {
            icon: Bell,
            label: 'Notifications',
            action: () => {
                navigate('/settings');
                setIsOpen(false);
            }
        },
        {
            icon: Shield,
            label: 'Privacy & Security',
            action: () => {
                navigate('/settings');
                setIsOpen(false);
            }
        }
    ];

    const handleLogout = () => {
        logout();
        setIsOpen(false);
    };

    return (
        <div className="relative" ref={dropdownRef}>
            {/* User Profile Button */}
            <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsOpen(!isOpen)}
                className="relative group"
            >
                <div className="absolute -inset-1 rounded-xl opacity-0 group-hover:opacity-20 blur transition duration-300" style={{
                    background: 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)'
                }}></div>
                <div className="relative flex items-center space-x-2 px-3 py-2 rounded-xl border transition-all duration-300" style={{
                    background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.1) 0%, rgba(139, 92, 246, 0.1) 100%)',
                    borderColor: 'rgba(59, 130, 246, 0.3)'
                }}>
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center text-white font-bold text-sm" style={{
                        background: 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)'
                    }}>
                        {user?.name?.charAt(0).toUpperCase() || 'U'}
                    </div>
                    <span className="hidden sm:block font-semibold text-sm text-text-primary-light dark:text-text-primary-dark">
                        {user?.name?.split(' ')[0] || 'User'}
                    </span>
                    <motion.div
                        animate={{ rotate: isOpen ? 180 : 0 }}
                        transition={{ duration: 0.3 }}
                    >
                        <ChevronRight size={16} className="text-text-secondary-light dark:text-text-secondary-dark" />
                    </motion.div>
                </div>
            </motion.button>

            {/* Dropdown Menu */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: -10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -10, scale: 0.95 }}
                        transition={{ duration: 0.2 }}
                        className="absolute right-0 mt-2 w-64 rounded-2xl shadow-2xl border border-border-light/50 dark:border-border-dark/50 overflow-hidden z-50"
                        style={{
                            background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(255, 255, 255, 0.9) 100%)',
                            backdropFilter: 'blur(20px)'
                        }}
                    >
                        <div className="absolute inset-0 dark:bg-card-dark/95 dark:backdrop-blur-xl"></div>

                        <div className="relative z-10">
                            {/* User Info Header */}
                            <div className="p-4 border-b border-border-light/50 dark:border-border-dark/50">
                                <div className="flex items-center space-x-3">
                                    <div className="w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-lg" style={{
                                        background: 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)'
                                    }}>
                                        {user?.name?.charAt(0).toUpperCase() || 'U'}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="font-bold text-text-primary-light dark:text-text-primary-dark truncate">
                                            {user?.name || 'User'}
                                        </p>
                                        <p className="text-xs text-text-secondary-light dark:text-text-secondary-dark truncate">
                                            {user?.email || 'user@example.com'}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Menu Items */}
                            <div className="py-2">
                                {menuItems.map((item, index) => (
                                    <motion.button
                                        key={index}
                                        whileHover={{ x: 4 }}
                                        onClick={item.action}
                                        className="w-full flex items-center justify-between px-4 py-3 hover:bg-primary-50 dark:hover:bg-primary-900/20 transition-colors group"
                                    >
                                        <div className="flex items-center space-x-3">
                                            <item.icon size={18} className="text-text-secondary-light dark:text-text-secondary-dark group-hover:text-primary transition-colors" />
                                            <span className="text-sm font-medium text-text-primary-light dark:text-text-primary-dark">
                                                {item.label}
                                            </span>
                                        </div>
                                        <ChevronRight size={16} className="text-text-secondary-light dark:text-text-secondary-dark opacity-0 group-hover:opacity-100 transition-opacity" />
                                    </motion.button>
                                ))}
                            </div>

                            {/* Logout Button */}
                            <div className="p-2 border-t border-border-light/50 dark:border-border-dark/50">
                                <motion.button
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    onClick={handleLogout}
                                    className="w-full flex items-center space-x-3 px-4 py-3 rounded-xl hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors group"
                                >
                                    <LogOut size={18} className="text-red-600 dark:text-red-400" />
                                    <span className="text-sm font-semibold text-red-600 dark:text-red-400">
                                        Logout
                                    </span>
                                </motion.button>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default UserProfileDropdown;
