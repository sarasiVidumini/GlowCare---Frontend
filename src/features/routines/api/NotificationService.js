import api from '../../../api/api.js';

export const notificationService = {
    // 1. PUBLIC: Fetch only active alerts for standard users
    getActiveNotifications: async () => {
        const response = await api.get('/routine-notifications/active');
        return response.data;
    },

    // 2. ADMIN: Fetch absolutely everything (Active & Inactive)
    getAllNotifications: async () => {
        const response = await api.get('/routine-notifications');
        return response.data;
    },

    // 3. ADMIN: Create a new alert
    createNotification: async (data) => {
        const response = await api.post('/routine-notifications', data);
        return response.data;
    },

    // 4. ADMIN: Update an existing alert
    updateNotification: async (id, data) => {
        const response = await api.put(`/routine-notifications/${id}`, data);
        return response.data;
    },

    // 5. ADMIN: Delete an alert
    deleteNotification: async (id) => {
        await api.delete(`/routine-notifications/${id}`);
    }
};