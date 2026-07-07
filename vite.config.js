import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  build: {
    chunkSizeWarningLimit: 2200,
    rollupOptions: {
      output: {
        manualChunks: {
          globe: ['react-globe.gl'],
          supabase: ['@supabase/supabase-js'],
        },
      },
    },
  },
})
