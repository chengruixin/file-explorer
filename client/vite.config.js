import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path';
export default defineConfig(() => ({
  plugins: [react()],
  root: path.resolve(__dirname, './src'),
  server: {
    port: 3000,
    host: true,
    proxy: {
      '/api': 'http://localhost:8080'
    }
  }
}));