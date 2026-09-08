// Minimal diagnostic endpoint — no app dependencies
import fs from 'node:fs';
import path from 'node:path';

export default function handler(req, res) {
  const info = {
    ok: true,
    node: process.version,
    vercel: process.env.VERCEL || 'not-set',
    cwd: process.cwd(),
    dirname: import.meta.url,
    url: req.url,
    time: new Date().toISOString()
  };

  // Check if key files exist relative to cwd
  const checks = [
    'apps/api/server.js',
    'apps/api/store.js',
    'apps/api/lib.js',
    'apps/api/data.json',
    'api/index.js',
    'package.json'
  ];
  info.fileChecks = {};
  for (const c of checks) {
    try {
      const resolved = path.resolve(process.cwd(), c);
      info.fileChecks[c] = fs.existsSync(resolved);
    } catch (e) {
      info.fileChecks[c] = 'error: ' + e.message;
    }
  }

  // List cwd contents
  try {
    info.cwdFiles = fs.readdirSync(process.cwd()).slice(0, 30);
  } catch (e) {
    info.cwdFiles = 'error: ' + e.message;
  }

  // Try to list api/ dir
  try {
    const apiDir = path.resolve(process.cwd(), 'api');
    if (fs.existsSync(apiDir)) {
      info.apiDirFiles = fs.readdirSync(apiDir);
    }
  } catch (e) {
    info.apiDirFiles = 'error: ' + e.message;
  }

  // Try to list apps/ dir
  try {
    const appsDir = path.resolve(process.cwd(), 'apps');
    if (fs.existsSync(appsDir)) {
      info.appsDirFiles = fs.readdirSync(appsDir);
    } else {
      info.appsDirFiles = 'NOT FOUND';
    }
  } catch (e) {
    info.appsDirFiles = 'error: ' + e.message;
  }

  res.setHeader('Content-Type', 'application/json');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.end(JSON.stringify(info, null, 2));
}
