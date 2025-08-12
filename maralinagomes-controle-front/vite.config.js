import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
    plugins: [react()],
    server: {
        proxy: {
            // Qualquer requisição que comece com /api será redirecionada
            '/api': {
                target: 'http://localhost:8080', // O endereço do seu backend
                changeOrigin: true, // Essencial para o proxy funcionar
            }
        }
    }
})