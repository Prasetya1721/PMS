// Verifikasi kolom "Uraian Elemen & Kriteria Audit" terisi setelah normalisasi.
import {
  normalizeChecklistItem,
  getChecklistConfigForSession,
} from './src/data/auditMasterData.js';

const cfg = getChecklistConfigForSession({ organizationId: 'bki' });
console.log('organizationId :', cfg.organizationId);
console.log('checked        :', cfg.checked);
console.log('items          :', cfg.items?.length || 0);
console.log('');

const normalized = (cfg.items || []).map(normalizeChecklistItem);

let emptyName = 0;
let emptyCp = 0;
normalized.forEach((it) => {
  if (!it.name) emptyName++;
  if (!it.checkPoint) emptyCp++;
});

console.log('normalized items      :', normalized.length);
console.log('empty name (Uraian)   :', emptyName);
console.log('empty checkPoint      :', emptyCp);
console.log('');
console.log('=== SAMPLE 6 BUTIR (seperti tampil di tabel) ===');
normalized.slice(0, 6).forEach((it) => {
  console.log(`[${it.code}] struck=${it.isStrikethrough}`);
  console.log(`  Uraian : ${it.name}`);
  console.log(`  Kriteria: ${it.checkPoint || '(kosong)'}`);
  console.log(`  Ref    : ${it.source?.reference || '-'}`);
});
console.log('');
console.log('=== SAMPLE BUTIR DICORET ===');
normalized.filter((i) => i.isStrikethrough).slice(0, 3).forEach((it) => {
  console.log(`[${it.code}] Uraian: ${it.name} | Kriteria: ${it.checkPoint || '(kosong)'}`);
});
console.log('');
console.log('=== LEMBAGA LAIN (harus 0 butir) ===');
['hubla', 'ksop', 'lr', 'bv', 'classnk', 'rina', 'custom'].forEach((id) => {
  const c = getChecklistConfigForSession({ organizationId: id });
  console.log(`${id.padEnd(9)} -> checked=${c.checked} items=${c.items?.length || 0}`);
});
