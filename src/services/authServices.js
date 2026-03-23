import api from '../api/axios.js';

export const authService = {

    register: async (userData) => {
        try {
            const response = await api.post('/auth/register', userData);
            return response.data; // Returns AuthResponse (token, name, email, role, message)
        } catch (error) {
            // Extract the error message from Spring Boot, or provide a fallback
            throw new Error(error.response?.data?.message || 'Registration failed');
        }
    },

    login: async (credentials) => {
        try {
            const response = await api.post('/auth/login', credentials);
            return response.data;
        } catch (error) {
            throw new Error(error.response?.data?.message || 'Invalid email or password');
        }
    },

    // Trigger Spring Boot's OAuth2 Redirect Flow
    googleLogin: (role = 'CLIENT') => {
        window.location.href = `http://localhost:8080/oauth2/authorization/google?role=${role}`;
    },

    completeProfile: async (details) => {
        try {
            // This hits the @PostMapping("/complete-profile") we just added to the Controller
            const response = await api.post('/auth/complete-profile', details);
            return response.data;
        } catch (error) {
            throw new Error(error.response?.data?.message || 'Profile completion failed');
        }
    },
};