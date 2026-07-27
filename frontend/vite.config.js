import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),    VitePWA({
      registerType: 'autoUpdate',
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg}']
      },
      includeAssets: ['favicon.ico', 'apple-touch-icon.png', 'safari-pinned-tab.svg'],
      manifest: {
        name: 'Nanotech Chemical Industry Limited',
        short_name: 'Nanotech Chemical',
        description: 'Family-owned international sourcing and trading company since the 1930s, connecting reliable manufacturers in Mainland China with global customers in chemicals, textiles, and home living products.',
        theme_color: '#0d47a1',
        background_color: '#ffffff',
        display: 'standalone',
        orientation: 'portrait',
        scope: '/',
        start_url: '/',
        icons: [
          {
            src: 'logo-192x192.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: 'logo-512x512.png',
            sizes: '512x512',
            type: 'image/png'
          }
        ]
      }
    })
  ],
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
