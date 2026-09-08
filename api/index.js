// Vercel Serverless Function entrypoint for /api on Vercel
// Uses dynamic import() so module-level init errors are caught by try/catch

let _handleRequest = null;

export default async function handler(req, res) {
  try {
    // Lazy-load on first invocation — catches any module-init errors
    if (!_handleRequest) {
      const mod = await import('../apps/api/server.js');
      _handleRequest = mod.handleRequest;
    }

    // Reconstruct original API path from Vercel rewrite params
    const parsed = new URL(req.url, 'http://x');
    const pmsRoute = parsed.searchParams.get('__pms_route');

    if (pmsRoute !== null) {
      parsed.searchParams.delete('__pms_route');
      const qs = parsed.searchParams.toString();
      req.url = '/api' + (pmsRoute ? ('/' + pmsRoute.replace(/^\/+/, '')) : '') + (qs ? ('?' + qs) : '');
    } else if (!req.url.startsWith('/api')) {
      req.url = '/api' + (req.url.startsWith('/') ? req.url : '/' + req.url);
    }

    await _handleRequest(req, res);
  } catch (err) {
    console.error('Vercel Serverless Function Error:', err);
    if (!res.headersSent) {
      res.writeHead(500, {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      });
      res.end(JSON.stringify({
        error: err.message || 'Internal Server Error',
        stack: process.env.NODE_ENV !== 'production' ? String(err.stack || '') : undefined
      }));
    }
  }
}
