import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [
        react(),
        tailwindcss(),
    ],
    // 🚀 FIX FOR SOCKJS 'global is not defined' WHITE SCREEN ERROR:
    define: {
        global: 'window',
    },
    server: {
        port: 5173,
        strictPort: true, // Forces Vite to stay on 5173
        hmr: {
            protocol: 'ws',
            host: 'localhost',
        },
        // Polling is helpful if you are using Docker or WSL2
        watch: {
            usePolling: true,
            interval: 100,
        },
        // API Proxy: This solves CORS by making the backend look like it's on the same port
        proxy: {
            '/api': {
                target: 'http://localhost:8080',
                changeOrigin: true,
                secure: false,
                // If your backend URL is /api/v1/experts, this keeps the path intact
                rewrite: (path) => path
            }
        }
    },
})