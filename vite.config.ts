import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    // Proxies API calls to the local ERP backend during development so the
    // browser request stays same-origin, avoiding CORS entirely in dev.
    // In production, VITE_API_BASE_URL should point directly at the API host
    // and that backend must allow CORS for the deployed frontend origin.
    proxy: {
      '/api/v1': {
        target: 'http://localhost:8080',
        changeOrigin: true,
      },
    },
  },
})
