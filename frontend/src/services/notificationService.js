import axiosClient from '../utils/axiosClient';

export const getUserNotifications = async (page = 0, limit = 20) => {
    const response = await axiosClient.get('/notifications', {
        params: { page, limit },
        headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
    });
    return response.data;
};

export const markAsRead = async (id) => {
    const response = await axiosClient.put(`/notifications/${id}/read`, {}, {
        headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
    });
    return response.data;
};

export const markAllAsRead = async () => {
    const response = await axiosClient.put('/notifications/read-all', {}, {
        headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
    });
    return response.data;
};

export const deleteNotification = async (id) => {
    const response = await axiosClient.delete(`/notifications/${id}`, {
        headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
    });
    return response.data;
};

export const getUnreadCount = async () => {
    const response = await axiosClient.get('/notifications/unread-count', {
        headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
    });
    return response.data;
};
