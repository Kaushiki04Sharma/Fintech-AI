import { createContext, useContext, useState, useEffect } from 'react';

const NotificationContext = createContext();

export const useNotifications = () => {
    const context = useContext(NotificationContext);
    if (!context) {
        throw new Error('useNotifications must be used within NotificationProvider');
    }
    return context;
};

export const NotificationProvider = ({ children }) => {
    const [notifications, setNotifications] = useState([]);
    const [unreadCount, setUnreadCount] = useState(0);

    // Simulate some initial notifications
    useEffect(() => {
        const initialNotifications = [
            {
                id: 1,
                title: 'Welcome to FinWise!',
                message: 'Start tracking your finances today',
                type: 'info',
                read: false,
                timestamp: new Date().toISOString()
            },
            {
                id: 2,
                title: 'AI Advisor Available',
                message: 'Get personalized financial advice',
                type: 'success',
                read: false,
                timestamp: new Date(Date.now() - 3600000).toISOString()
            }
        ];
        setNotifications(initialNotifications);
        setUnreadCount(initialNotifications.filter(n => !n.read).length);
    }, []);

    const addNotification = (notification) => {
        const newNotification = {
            id: Date.now(),
            ...notification,
            read: false,
            timestamp: new Date().toISOString()
        };
        setNotifications(prev => [newNotification, ...prev]);
        setUnreadCount(prev => prev + 1);
    };

    const markAsRead = (id) => {
        setNotifications(prev =>
            prev.map(notif =>
                notif.id === id ? { ...notif, read: true } : notif
            )
        );
        setUnreadCount(prev => Math.max(0, prev - 1));
    };

    const markAllAsRead = () => {
        setNotifications(prev =>
            prev.map(notif => ({ ...notif, read: true }))
        );
        setUnreadCount(0);
    };

    const clearNotification = (id) => {
        setNotifications(prev => prev.filter(notif => notif.id !== id));
        const notification = notifications.find(n => n.id === id);
        if (notification && !notification.read) {
            setUnreadCount(prev => Math.max(0, prev - 1));
        }
    };

    const clearAll = () => {
        setNotifications([]);
        setUnreadCount(0);
    };

    return (
        <NotificationContext.Provider
            value={{
                notifications,
                unreadCount,
                addNotification,
                markAsRead,
                markAllAsRead,
                clearNotification,
                clearAll
            }}
        >
            {children}
        </NotificationContext.Provider>
    );
};
