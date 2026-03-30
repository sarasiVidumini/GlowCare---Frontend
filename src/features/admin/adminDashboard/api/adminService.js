import axios from 'axios';

const adminApi = axios.create({ baseURL: 'http://localhost:8080/api/v1/admin' });

adminApi.interceptors.request.use((config) => {
    const token = localStorage.getItem('jwt_token') || localStorage.getItem('token');
    if (token) {
        const cleanToken = token.replace(/"/g, '').trim();
        config.headers.Authorization = `Bearer ${cleanToken}`;
    }
    return config;
});

export const fetchNexusStats = () => adminApi.get('/nexus-stats');
export const fetchAllAdmins = () => adminApi.get('/all');
export const updateAdminRecord = (dto) => adminApi.put('/update', dto);
export const deleteAdminRecord = (id) => adminApi.delete(`/delete/${id}`);
export const performSystemMaintenance = () => adminApi.post('/reboot-cache');