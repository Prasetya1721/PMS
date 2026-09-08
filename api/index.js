// Vercel Serverless Function entrypoint for /api on Vercel
import { handleRequest } from '../apps/api/server.js';

export default async function handler(req, res) {
  try {
    const parsed = new URL(req.url, 'http://x');
    const pmsRoute = parsed.searchParams.get('__pms_route');

    if (pmsRoute !== null) {
      parsed.searchParams.delete('__pms_route');
      const qs = parsed.searchParams.toString();
      req.url = '/api' + (pmsRoute ? ('/' + pmsRoute.replace(/^\/+/, '')) : '') + (qs ? ('?' + qs) : '');
    } else if (!req.url.startsWith('/api')) {
      req.url = '/api' + (req.url.startsWith('/') ? req.url : '/' + req.url);
    }
    await handleRequest(req, res);
  } catch (err) {
    console.error('Vercel Serverless Function Error:', err);
    if (!res.headersSent) {
      res.writeHead(500, {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      });
      res.end(JSON.stringify({
        error: err.message || 'Internal Server Error'
      }));
    }
  }
}
