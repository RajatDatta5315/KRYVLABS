// Build: force-clean-2026-03-v3 — supabase fully removed
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from "path"

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: { "@": path.resolve(__dirname, "./src") },
  },
  build: {
    // Ensures a completely fresh bundle on every deploy
    emptyOutDir: true,
    rollupOptions: {
      output: {
        // Different chunk naming forces new cache keys
        entryFileNames: 'assets/[name]-[hash].js',
        chunkFileNames: 'assets/[name]-[hash].js',
      }
    }
  }
})
