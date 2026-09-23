// Tampilkan butir yang checkPoint masih kosong beserta field aslinya.
import { getChecklistConfigForSession } from './src/data/auditMasterData.js';

const cfg = getChecklistConfigForSession({ organizationId: 'bki' });
const items = cfg.items || [];

const empty = items.filter((i) => !i.checkPoint && !(i.checkPoints || []).length && !i.remark);
console.log('Butir tanpa Kriteria :', empty.length);
console.log('Total butir          :', items.length);
console.log('');
empty.forEach((i) => {
  console.log(`[${i.no || i.code}] struck=${Boolean(i.isStrikethrough)}`);
  console.log(`  item      : ${i.item}`);
  console.log(`  reply     : ${i.reply ?? '(tidak ada)'}`);
  console.log(`  remark    : ${i.remark ?? '(tidak ada)'}`);
  console.log(`  reference : ${i.reference ?? '(tidak ada)'}`);
  console.log(`  keys      : ${Object.keys(i).join(', ')}`);
  console.log('');
});
