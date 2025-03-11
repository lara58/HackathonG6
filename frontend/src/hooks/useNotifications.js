import { useState } from 'react';
import {
    getUserNotifications,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    getUnreadCount,
} from '../services/notificationService';

const useNotifications = () => {
    const [notifications, setNotifications] = useState([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const fetchNotifications = async (page = 0, limit = 20) => {
        setLoading(true);
        setError(null);
        try {
            const data = await getUserNotifications(page, limit);
            setNotifications(data.notifications);
        } catch (err) {
            setError(err.response?.data?.message || 'Erreur inconnue');
        } finally {
            setLoading(false);
        }
    };

    const fetchUnreadCount = async () => {
        try {
            const { count } = await getUnreadCount();
            setUnreadCount(count);
        } catch (err) {
            setError(err.response?.data?.message || 'Erreur inconnue');
        }
    };

    const markNotificationAsRead = async (id) => {
        try {
            const updatedNotification = await markAsRead(id);
            setNotifications((prev) =>
                prev.map((notif) =>
                    notif._id === id ? { ...notif, read: true } : notif
                )
            );
            fetchUnreadCount();
        } catch (err) {
            setError(err.response?.data?.message || 'Erreur inconnue');
        }
    };

    const markAllNotificationsAsRead = async () => {
        try {
            await markAllAsRead();
            setNotifications((prev) =>
                prev.map((notif) => ({ ...notif, read: true }))
            );
            setUnreadCount(0);
        } catch (err) {
            setError(err.response?.data?.message || 'Erreur inconnue');
        }
    };

    const deleteNotificationById = async (id) => {
        try {
            await deleteNotification(id);
            setNotifications((prev) => prev.filter((notif) => notif._id !== id));
        } catch (err) {
            setError(err.response?.data?.message || 'Erreur inconnue');
        }
    };

    return {
        notifications,
        unreadCount,
        loading,
        error,
        fetchNotifications,
        fetchUnreadCount,
        markNotificationAsRead,
        markAllNotificationsAsRead,
        deleteNotificationById,
    };
};

export default useNotifications;
