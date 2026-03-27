import api from '../../../api/api.js';

export const expertService = {
    getAllExperts: async () => {
        // Axios resolves this to: http://localhost:8080/api/v1/experts
        const response = await api.get('/experts');
        return response.data;
    },

    createExpert: async (expertData) => {
        const response = await api.post('/experts', expertData);
        return response.data;
    },

    updateExpert: async (id, expertData) => {
        const response = await api.put(`/experts/${id}`, expertData);
        return response.data;
    },

    deleteExpert: async (id) => {
        try {
            const response = await api.delete(`/experts/${id}`);
            return response.data;
        } catch (error) {
            // Enhanced error logging to catch Spring Security redirects
            if (error.response?.status === 302 || error.code === 'ERR_NETWORK') {
                console.error("Auth Failure: The server tried to redirect. Check your Admin JWT token permissions.");
            } else {
                console.error("Delete Error:", error.response?.data || error.message);
            }
            throw error;
        }
    }
};