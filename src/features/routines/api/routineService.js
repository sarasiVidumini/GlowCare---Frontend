import api from '../../../api/api.js';

export const routineService = {
    getAllSteps: async () => {
        try {
            const response = await api.get('/routines');
            return response.data;
        } catch (error) {
            console.error("API Error:", error);
            throw error;
        }
    },
    createStep: async (stepData) => {
        const response = await api.post('/routines', stepData);
        return response.data;
    },
    updateStep: async (id, stepData) => {
        const response = await api.put(`/routines/${id}`, stepData);
        return response.data;
    },
    deleteStep: async (id) => {
        await api.delete(`/routines/${id}`);
    }
};