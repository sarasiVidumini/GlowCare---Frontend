import api from '../../../api/api.js';
import axios from "axios";

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
    },

    checkConflict: async (newProduct, timeOfDay, pathCategory, zone) => {
        const token = localStorage.getItem('jwt_token');
        const response = await axios.post('http://localhost:8080/api/v1/smart-engine/check-conflict', {
            newProduct,
            timeOfDay,
            pathCategory,
            zone
        }, {
            headers: { Authorization: `Bearer ${token}` }
        });
        return response.data;
    }
};