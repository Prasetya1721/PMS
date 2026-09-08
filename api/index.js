// Vercel Serverless Function entrypoint for PMS Kapal REST API
import { handleRequest } from '../apps/api/server.js';

export default async function handler(req, res) {
  // Normalisasi pathname jika Vercel rewrite menghilangkan prefix /api
  if (!req.url.startsWith('/api')) {
    req.url = '/api' + (req.url.startsWith('/') ? req.url : '/' + req.url);
  }
  return handleRequest(req, res);
}
