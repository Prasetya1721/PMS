import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: { port: 3000, open: false, host: true },
  // Konfigurasi test ditaruh di sini (bukan vitest.config terpisah) supaya plugin
  // react dan resolusi alias yang sama dipakai ulang — test memakai transform yang
  // identik dengan build, jadi tidak ada perbedaan perilaku JSX antara keduanya.
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./tests/setup.js'],
    include: ['tests/**/*.test.{js,jsx}'],
    restoreMocks: true,
  },
  build: {
    outDir: 'dist',
    sourcemap: false,
    chunkSizeWarningLimit: 600,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            if (/[\/]node_modules[\/](react|react-dom|scheduler)[\/]/.test(id)) return 'vendor';
            return 'vendor-libs';
          }
        }
      }
    }
  }
});
