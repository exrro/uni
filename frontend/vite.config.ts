import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  build: {
    minify: 'esbuild',
    target: 'es2019',
  },
  server: {
    host: true, // expose on the LAN so a phone on the same WiFi can connect
    port: 5173,
    // Single-origin: the dev server forwards backend API calls to the FastAPI
    // server on localhost. The browser (and phone) only ever talks to :5173,
    // so there are no CORS issues and no separate backend URL to configure.
    proxy: {
      '/students': { target: 'http://localhost:8000', changeOrigin: true },
      '/professors': { target: 'http://localhost:8000', changeOrigin: true },
      '/courses': { target: 'http://localhost:8000', changeOrigin: true },
      '/selection': { target: 'http://localhost:8000', changeOrigin: true },
      '/auth': { target: 'http://localhost:8000', changeOrigin: true },
      '/access': { target: 'http://localhost:8000', changeOrigin: true },
      '/summary': { target: 'http://localhost:8000', changeOrigin: true },
      '/all-data': { target: 'http://localhost:8000', changeOrigin: true },
      '/docs': { target: 'http://localhost:8000', changeOrigin: true },
      '/admin-login': { target: 'http://localhost:8000', changeOrigin: true },
      '/openapi.json': { target: 'http://localhost:8000', changeOrigin: true },
    },
  },
})
