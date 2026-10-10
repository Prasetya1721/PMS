import { cleanup } from '@testing-library/react';
import { afterEach, beforeEach } from 'vitest';

// Node.js >= 22 memiliki objek global `localStorage` eksperimental yang belum aktif.
// Kita sediakan mock memori in-memory sederhana untuk lingkungan jsdom test.
const storageMock = (() => {
  let store = {};
  return {
    getItem: (key) => store[key] || null,
    setItem: (key, value) => {
      store[key] = String(value);
    },
    removeItem: (key) => {
      delete store[key];
    },
    clear: () => {
      store = {};
    },
  };
})();

// Sebagian tes berjalan di lingkungan `node` (mis. endpoint serverless di api/),
// di sana `window` tidak ada — jangan pasang mock DOM.
if (typeof window !== 'undefined') {
  Object.defineProperty(window, 'localStorage', {
    value: storageMock,
    writable: true,
  });
}

if (typeof globalThis !== 'undefined') {
  Object.defineProperty(globalThis, 'localStorage', {
    value: storageMock,
    writable: true,
  });
}

beforeEach(() => {
  if (typeof window !== 'undefined' && window.localStorage) window.localStorage.clear();
});

afterEach(() => {
  cleanup();
});
