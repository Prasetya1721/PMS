import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

function whatsappProxyPlugin() {
  return {
    name: 'whatsapp-proxy-plugin',
    configureServer(server) {
      server.middlewares.use('/api/proxy/whatsapp', async (req, res) => {
        if (req.method !== 'POST') {
          res.statusCode = 405;
          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify({ ok: false, message: 'Method not allowed' }));
          return;
        }

        let bodyData = '';
        req.on('data', chunk => { bodyData += chunk; });
        req.on('end', async () => {
          try {
            const payload = JSON.parse(bodyData || '{}');
            const { targetUrl, authHeader, phone, message } = payload;

            if (!targetUrl || !phone || !message) {
              res.statusCode = 400;
              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify({ ok: false, message: 'Missing targetUrl, phone, or message' }));
              return;
            }

            const forwardRes = await fetch(targetUrl, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'Authorization': authHeader || ''
              },
              body: JSON.stringify({ phone, message })
            });

            const responseText = await forwardRes.text();
            let parsed;
            try {
              parsed = JSON.parse(responseText);
            } catch {
              parsed = { raw: responseText };
            }

            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({
              ok: forwardRes.ok,
              status: forwardRes.status,
              body: parsed
            }));
          } catch (err) {
            res.statusCode = 500;
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({
              ok: false,
              status: 500,
              message: err.message
            }));
          }
        });
      });
    }
  };
}

export default defineConfig({
  plugins: [react(), whatsappProxyPlugin()],
  server: { port: 3000, open: false, host: true },
  preview: {
    port: 4173,
    host: true,
    headers: {
      'X-Content-Type-Options': 'nosniff',
      'X-Frame-Options': 'DENY',
      'Referrer-Policy': 'strict-origin-when-cross-origin',
      'Permissions-Policy': 'camera=(), microphone=(), geolocation=(), browsing-topics=()',
      'Content-Security-Policy': "default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com data:; img-src 'self' data: blob: https://images.unsplash.com https:; connect-src 'self' https:; frame-src 'self' blob: data:; object-src 'none'; base-uri 'self'; form-action 'self';"
    }
  },
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
