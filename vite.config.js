import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'dist', // Ensure Vite outputs to "dist"
  },
  server: {
    port: 5173,
  },
  resolve: {
    alias: {
      '@': '/src', // Optional alias for clean imports
    },
  },
});
