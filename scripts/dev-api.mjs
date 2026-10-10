#!/usr/bin/env node
/**
 * scripts/dev-api.mjs
 * Menjalankan Serverless Function di api/ sebagai server HTTP lokal, supaya
 * endpoint bisa diuji sungguhan sebelum deploy (termasuk pembacaan body
 * sebagai stream dan perilaku 404 untuk rute /api yang tidak ada).
 *
 * Ini meniru perilaku routing vercel.json:
 *   1. berkas/fungsi yang ada -> dijalankan
 *   2. /api/* tanpa fungsi    -> 404 JSON
 *   3. selain itu             -> 404 (di produksi jatuh ke index.html SPA)
 *
 * Pakai:
 *   node scripts/dev-api.mjs            # http://127.0.0.1:3210
 *   PORT=4000 node scripts/dev-api.mjs
 *
 * Lalu: node scripts/verify-api.mjs http://127.0.0.1:3210
 */
import { createServer } from 'node:http';
import { readdirSync, statSync } from 'node:fs';
import { join, relative } from 'node:path';
import { pathToFileURL } from 'node:url';

const PORT = Number(process.env.PORT || 3210);
const API_DIR = new URL('../api/', import.meta.url).pathname;

/** Memetakan setiap berkas .js di api/ (kecuali _lib) menjadi rute. */
async function loadRoutes(dir = API_DIR, routes = new Map()) {
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    if (statSync(full).isDirectory()) {
      if (entry === '_lib') continue;
      await loadRoutes(full, routes);
      continue;
    }
    if (!entry.endsWith('.js')) continue;
    const rel = relative(API_DIR, full).replace(/\\/g, '/').replace(/\.js$/, '');
    const mod = await import(pathToFileURL(full).href);
    if (typeof mod.default === 'function') routes.set(`/api/${rel}`, mod.default);
  }
  return routes;
}

const routes = await loadRoutes();

/** Response ala Express/Vercel: status(), json(), setHeader(), end(). */
function wrapResponse(res) {
  res.status = (code) => {
    res.statusCode = code;
    return res;
  };
  res.json = (payload) => {
    if (!res.headersSent && !res.getHeader('Content-Type')) {
      res.setHeader('Content-Type', 'application/json; charset=utf-8');
    }
    res.end(JSON.stringify(payload));
    return res;
  };
  return res;
}

const server = createServer(async (req, res) => {
  const url = new URL(req.url, `http://${req.headers.host}`);
  const path = url.pathname.replace(/\/+$/, '') || '/';
  wrapResponse(res);

  const handler = routes.get(path);
  if (!handler) {
    if (path.startsWith('/api')) {
      res.statusCode = 404;
      res.setHeader('Content-Type', 'application/json; charset=utf-8');
      return res.end(JSON.stringify({ success: false, error: 'Endpoint API tidak ditemukan.' }));
    }
    res.statusCode = 404;
    return res.end('Not found (di produksi rute ini dilayani index.html SPA).');
  }

  req.query = Object.fromEntries(url.searchParams);
  try {
    await handler(req, res);
  } catch (err) {
    if (!res.headersSent) {
      res.statusCode = 500;
      res.setHeader('Content-Type', 'application/json; charset=utf-8');
      res.end(JSON.stringify({ success: false, error: `Kesalahan handler: ${err.message}` }));
    }
  }
});

server.listen(PORT, '127.0.0.1', () => {
  console.log(`API lokal di http://127.0.0.1:${PORT} — ${routes.size} rute:`);
  for (const route of routes.keys()) console.log(`  ${route}`);
  console.log('\nUji dengan: node scripts/verify-api.mjs http://127.0.0.1:' + PORT);
});
