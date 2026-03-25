import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [
        react(),
        tailwindcss(),
    ],
    server: {
        port: 5173,
        strictPort: true, // Forces Vite to stay on 5173
        hmr: {
            protocol: 'ws',
            host: 'localhost',
        },
        // Optional: add this if you are still seeing connection issues
        watch: {
            usePolling: true,
        },
    },
})