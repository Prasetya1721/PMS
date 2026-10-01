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

Object.defineProperty(window, 'localStorage', {
  value: storageMock,
  writable: true,
});

if (typeof globalThis !== 'undefined') {
  Object.defineProperty(globalThis, 'localStorage', {
    value: storageMock,
    writable: true,
  });
}

beforeEach(() => {
  window.localStorage.clear();
});

afterEach(() => {
  cleanup();
});
