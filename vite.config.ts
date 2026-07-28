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
          // ── Vendor: React core & router ──────────────────────────────────
          if (id.includes('node_modules/react') || id.includes('node_modules/react-dom') || id.includes('node_modules/react-router-dom')) {
            return 'vendor-react';
          }
          // ── Vendor: Framer Motion (heavy animation library) ───────────────
          if (id.includes('node_modules/framer-motion')) {
            return 'vendor-framer';
          }
          // ── Vendor: remaining third-party libraries ───────────────────────
          if (id.includes('node_modules')) {
            return 'vendor-misc';
          }
          // ── Admin CMS — only loaded when visiting /nart-admin ─────────────
          if (id.includes('/pages/admin/') || id.includes('/context/AdminAuthContext') || id.includes('/context/CMSContext')) {
            return 'admin';
          }
          // ── Public pages (lazy-loaded per route) ──────────────────────────
          if (id.includes('/pages/')) {
            return 'pages';
          }
        },
      },
    },
  },
});

