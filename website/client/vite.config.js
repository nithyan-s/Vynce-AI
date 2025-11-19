import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react({
      babel: {
        plugins: [['babel-plugin-react-compiler']],
      },
    }),
  ],
  build: {
    // Generate source maps for production debugging
    sourcemap: false,
    // Optimize chunks
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
        },
      },
    },
    // Minify output
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true, // Remove console logs in production
      },
    },
  },
  // Performance optimizations
  optimizeDeps: {
    include: ['react', 'react-dom'],
  },
})
