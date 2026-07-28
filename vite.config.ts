import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { fileURLToPath, URL } from 'node:url';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: (id) => {
          // ── Admin CMS — strictly isolate admin code ─────────────
          if (
            id.includes('/src/pages/admin/') || 
            id.includes('/src/context/AdminAuthContext') || 
            id.includes('/src/context/CMSContext')
          ) {
            return 'admin';
          }
          // ── Isolate heavy animations ───────────────
          if (id.includes('node_modules/framer-motion')) {
            return 'framer-motion';
          }
        },
      },
    },
  },
});

