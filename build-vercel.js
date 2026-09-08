import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const srcDir = path.join(__dirname, 'apps', 'web');
const destDir = path.join(__dirname, 'public');

if (!fs.existsSync(destDir)) {
  fs.mkdirSync(destDir, { recursive: true });
}

// Copy only static frontend files (exclude server.js which is not needed for SPA)
const exclude = new Set(['server.js']);
for (const entry of fs.readdirSync(srcDir, { withFileTypes: true })) {
  if (exclude.has(entry.name)) continue;
  const src = path.join(srcDir, entry.name);
  const dest = path.join(destDir, entry.name);
  if (entry.isDirectory()) {
    fs.cpSync(src, dest, { recursive: true });
  } else {
    fs.copyFileSync(src, dest);
  }
  console.log('Copied:', entry.name);
}
console.log('Build completed successfully for Vercel deployment!');
