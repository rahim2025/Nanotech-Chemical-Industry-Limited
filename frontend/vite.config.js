import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    // Generate source maps for production build
    sourcemap: false,
    // Reduce output chunk size
    chunkSizeWarningLimit: 1000,
    // Optimize build
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true,
      },
    },
    // Clean the output directory before building
    emptyOutDir: true,
  },
  server: {
    // Configure proxy for development API calls
    proxy: {
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true,
      },
    },
  },
})
