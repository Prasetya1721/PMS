/**
 * idUtils.js
 * Generator ID unik untuk entitas PMS.
 *
 * Kenapa perlu: pola `id: `prefix-${Date.now()}`` bertabrakan ketika dua entitas
 * dibuat dalam milidetik yang sama (mis. 2 temuan NC dari satu handler sample).
 * ID duplikat membuat React key tidak unik dan lookup `find(x => x.id === ...)`
 * bisa mengembalikan entitas yang salah.
 *
 * Format: `<prefix>-<base36 timestamp>-<counter>`
 * - timestamp base36: lebih pendek dari Date.now(), tetap urut secara waktu
 * - counter: dijamin unik dalam proses yang sama walau dipanggil di ms yang sama
 */

let counter = 0;

/**
 * Buat ID unik.
 * @param {string} prefix - awalan ID, mis. 'nc' atau 'aud-smc'
 * @returns {string} ID unik
 */
export function makeId(prefix = 'id') {
  counter = (counter + 1) % Number.MAX_SAFE_INTEGER;
  return `${prefix}-${Date.now().toString(36)}-${counter}`;
}
