import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  build: {
    chunkSizeWarningLimit: 3000,
  },
  plugins: [react()],
  base: '/',
  server: {
    proxy: {
      '/api': 'http://52.64.110.28:5000',
    },
  },
});