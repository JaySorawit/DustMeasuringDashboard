import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  build: {
    rollupOptions: {
      output: {
        manualChunks: (id) => {
          if (id.includes('node_modules')) {
            if (id.includes('react')) return 'vendor-react';
            if (id.includes('chart.js')) return 'vendor-chart';
            return 'vendor';
          }
        },
      },
    },
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