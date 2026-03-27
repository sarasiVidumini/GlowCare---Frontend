import api from '../api/api.js';

export const authService = {
    /**
     * REGISTER: Handles both CLIENT and EXPERT signups.
     * Expects: { name, email, password, role, licenseNumber, expertiseArea, bio }
     */
    register: async (userData) => {
        try {
            // Spring Boot expects the Role to be Uppercase (EXPERT/CLIENT)
            const response = await api.post('/auth/register', userData);

            // If successful, returns AuthResponse: { token, name, email, role }
            return response.data;
        } catch (error) {
            // Detailed logging for debugging 400 Bad Request errors
            console.error("Registration Trace:", {
                status: error.response?.status,
                data: error.response?.data,
                payloadSent: userData
            });

            // Extract specific error message from Backend (e.g., "Email already exists")
            const errorMessage = error.response?.data?.message || 'Registration failed. Please verify clinical details.';
            throw new Error(errorMessage);
        }
    },

    /**
     * LOGIN: Standard email/password authentication
     */
    login: async (credentials) => {
        try {
            const response = await api.post('/auth/login', credentials);
            return response.data;
        } catch (error) {
            console.error("Login Trace:", error.response?.data);
            const errorMessage = error.response?.data?.message || 'Invalid email or password';
            throw new Error(errorMessage);
        }
    },

    /**
     * GOOGLE OAUTH: Triggers the redirect to Google
     */
    googleLogin: (role = 'CLIENT') => {
        // Ensure the role is passed as a query param so the backend knows the target profile type
        window.location.href = `http://localhost:8080/oauth2/authorization/google?role=${role.toUpperCase()}`;
    },

    /**
     * COMPLETE PROFILE: Legacy method (used if users need to update details later)
     */
    completeProfile: async (details) => {
        try {
            const response = await api.post('/auth/complete-profile', details);
            return response.data;
        } catch (error) {
            console.error("Profile Update Trace:", error.response?.data);
            throw new Error(error.response?.data?.message || 'Profile completion failed');
        }
    },

    /**
     * LOGOUT: Clears local session
     */
    logout: () => {
        localStorage.removeItem('jwt_token');
        localStorage.removeItem('currentUser');
        window.location.href = '/login';
    }
};