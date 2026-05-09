import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:8080/api/v1',
    headers: {
        'Content-Type': 'application/json'
    }
});

api.interceptors.request.use((config) => {

    const token = localStorage.getItem('jwt_token');

    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
});

// Automatically attach the JWT token to every request
api.interceptors.request.use((config) => {
    // Helpful log to see exactly where Axios is sending the request
    console.log(`[AXIOS] Sending ${config.method.toUpperCase()} request to: ${config.baseURL}${config.url}`);

    // 1. Hunt for the token (Specifically targeting 'jwt_token' based on your Application tab)
    const standaloneToken = localStorage.getItem('jwt_token') || localStorage.getItem('token');

    // 2. Fallback: Check inside currentUser just in case
    const userString = localStorage.getItem('currentUser');
    let userToken = null;

    if (userString) {
        try {
            const currentUser = JSON.parse(userString);
            userToken = currentUser.jwt_token || currentUser.token || currentUser.jwt;
        } catch (error) {
            console.error("[AXIOS] Failed to parse currentUser JSON", error);
        }
    }

    // 3. Select the valid token
    const finalToken = standaloneToken || userToken;

    // 4. Attach to Authorization header
    if (finalToken) {
        console.log("[AXIOS] ✅ Token successfully found! Attaching to headers...");
        config.headers.Authorization = `Bearer ${finalToken}`;
    } else {
        console.warn("[AXIOS] ❌ NO TOKEN FOUND in localStorage. Request will be sent naked.");
    }

    return config;
}, (error) => {
    console.error("[AXIOS] Interceptor crashed:", error);
    return Promise.reject(error);
});

export default api;