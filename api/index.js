// Vercel Serverless Function entrypoint — CommonJS wrapper for ESM app
let _handleRequest = null;

module.exports = async function handler(req, res) {
  try {
    // Lazy-load ESM app module from CJS
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
    console.error('PMS API Error:', err);
    if (!res.headersSent) {
      res.setHeader('Content-Type', 'application/json');
      res.setHeader('Access-Control-Allow-Origin', '*');
      res.statusCode = 500;
      res.end(JSON.stringify({ error: String(err.message || err) }));
    }
  }
};
