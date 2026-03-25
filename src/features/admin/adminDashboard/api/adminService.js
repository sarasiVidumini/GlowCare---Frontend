import axios from 'axios';

const adminApi = axios.create({
    baseURL: 'http://localhost:8080/api/v1/admin',
});

adminApi.interceptors.request.use((config) => {
    let token = localStorage.getItem('jwt_token') || localStorage.getItem('token');
    if (token) {
        const cleanToken = token.replace(/['"]+/g, '').replace(/^bearer\s+/i, '').trim();
        config.headers.Authorization = `Bearer ${cleanToken}`;
    }
    return config;
}, (error) => Promise.reject(error));

// Original Stats & Maintenance
export const fetchNexusStats = () => adminApi.get('/nexus-stats');
export const performSystemMaintenance = () => adminApi.post('/reboot-cache');

// --- NEW ADMIN MANAGEMENT PATHS ---
export const fetchAllAdmins = () => adminApi.get('/all');
export const updateAdminRecord = (adminDto) => adminApi.put('/update', adminDto);
export const deleteAdminRecord = (id) => adminApi.delete(`/delete/${id}`);