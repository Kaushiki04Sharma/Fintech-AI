import { motion, AnimatePresence } from 'framer-motion';
import { Bell, X, Check, Info, CheckCheck } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import { useNotifications } from '../../context/NotificationContext';

const NotificationDropdown = () => {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);
    const { notifications, unreadCount, markAsRead, markAllAsRead, clearNotification } = useNotifications();

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

    const getTimeAgo = (timestamp) => {
        const seconds = Math.floor((new Date() - new Date(timestamp)) / 1000);
        if (seconds < 60) return 'Just now';
        const minutes = Math.floor(seconds / 60);
        if (minutes < 60) return `${minutes}m ago`;
        const hours = Math.floor(minutes / 60);
        if (hours < 24) return `${hours}h ago`;
        const days = Math.floor(hours / 24);
        return `${days}d ago`;
    };

    const getNotificationIcon = (type) => {
        switch (type) {
            case 'success':
                return <Check size={18} className="text-green-500" />;
            case 'info':
                return <Info size={18} className="text-blue-500" />;
            default:
                return <Bell size={18} className="text-gray-500" />;
        }
    };

    return (
        <div className="relative" ref={dropdownRef}>
            {/* Notification Bell Button */}
            <motion.button
                whileHover={{ scale: 1.1, rotate: 15 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setIsOpen(!isOpen)}
                className="relative p-2.5 rounded-xl hover:bg-primary-50 dark:hover:bg-primary-900/20 transition-colors group"
            >
                <div className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity" style={{
                    background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.1) 0%, rgba(139, 92, 246, 0.1) 100%)'
                }}></div>
                <Bell size={20} className="relative z-10 text-text-secondary-light dark:text-text-secondary-dark" />

                {/* Unread Badge */}
                {unreadCount > 0 && (
                    <motion.span
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="absolute top-1 right-1 w-2.5 h-2.5 rounded-full border-2 border-card-light dark:border-card-dark" style={{
                            background: 'linear-gradient(135deg, #ef4444 0%, #ec4899 100%)'
                        }}
                    >
                        <span className="absolute inset-0 rounded-full animate-ping opacity-75" style={{
                            background: 'linear-gradient(135deg, #ef4444 0%, #ec4899 100%)'
                        }}></span>
                    </motion.span>
                )}
            </motion.button>

            {/* Dropdown */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: -10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -10, scale: 0.95 }}
                        transition={{ duration: 0.2 }}
                        className="absolute right-0 mt-2 w-80 sm:w-96 rounded-2xl shadow-2xl border border-border-light/50 dark:border-border-dark/50 overflow-hidden z-50"
                        style={{
                            background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(255, 255, 255, 0.9) 100%)',
                            backdropFilter: 'blur(20px)'
                        }}
                    >
                        <div className="absolute inset-0 dark:bg-card-dark/95 dark:backdrop-blur-xl"></div>

                        <div className="relative z-10">
                            {/* Header */}
                            <div className="p-4 border-b border-border-light/50 dark:border-border-dark/50 flex items-center justify-between">
                                <div>
                                    <h3 className="font-bold text-lg text-text-primary-light dark:text-text-primary-dark">
                                        Notifications
                                    </h3>
                                    {unreadCount > 0 && (
                                        <p className="text-xs text-text-secondary-light dark:text-text-secondary-dark">
                                            {unreadCount} unread
                                        </p>
                                    )}
                                </div>
                                {notifications.length > 0 && (
                                    <motion.button
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        onClick={markAllAsRead}
                                        className="text-xs font-semibold text-primary hover:text-primary-600 flex items-center gap-1"
                                    >
                                        <CheckCheck size={14} />
                                        Mark all read
                                    </motion.button>
                                )}
                            </div>

                            {/* Notifications List */}
                            <div className="max-h-96 overflow-y-auto scrollbar-thin">
                                {notifications.length === 0 ? (
                                    <div className="p-8 text-center">
                                        <Bell size={48} className="mx-auto mb-3 text-text-secondary-light dark:text-text-secondary-dark opacity-50" />
                                        <p className="text-text-secondary-light dark:text-text-secondary-dark">
                                            No notifications yet
                                        </p>
                                    </div>
                                ) : (
                                    notifications.map((notification) => (
                                        <motion.div
                                            key={notification.id}
                                            initial={{ opacity: 0, x: -20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            exit={{ opacity: 0, x: 20 }}
                                            onClick={() => !notification.read && markAsRead(notification.id)}
                                            className={`p-4 border-b border-border-light/50 dark:border-border-dark/50 hover:bg-primary-50/50 dark:hover:bg-primary-900/10 transition-colors cursor-pointer group ${!notification.read ? 'bg-primary-50/30 dark:bg-primary-900/20' : ''
                                                }`}
                                        >
                                            <div className="flex items-start gap-3">
                                                <div className="mt-1">
                                                    {getNotificationIcon(notification.type)}
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <div className="flex items-start justify-between gap-2">
                                                        <h4 className="font-semibold text-sm text-text-primary-light dark:text-text-primary-dark">
                                                            {notification.title}
                                                        </h4>
                                                        <motion.button
                                                            whileHover={{ scale: 1.2 }}
                                                            whileTap={{ scale: 0.8 }}
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                clearNotification(notification.id);
                                                            }}
                                                            className="opacity-0 group-hover:opacity-100 transition-opacity"
                                                        >
                                                            <X size={14} className="text-text-secondary-light dark:text-text-secondary-dark" />
                                                        </motion.button>
                                                    </div>
                                                    <p className="text-xs text-text-secondary-light dark:text-text-secondary-dark mt-1">
                                                        {notification.message}
                                                    </p>
                                                    <p className="text-xs text-text-secondary-light dark:text-text-secondary-dark mt-2">
                                                        {getTimeAgo(notification.timestamp)}
                                                    </p>
                                                </div>
                                                {!notification.read && (
                                                    <div className="w-2 h-2 rounded-full mt-2" style={{
                                                        background: 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)'
                                                    }}></div>
                                                )}
                                            </div>
                                        </motion.div>
                                    ))
                                )}
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default NotificationDropdown;
