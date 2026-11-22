const fs = require('fs');
const seed = JSON.parse(fs.readFileSync('data/tubitak-seed-data.json', 'utf8'));
const store = JSON.parse(fs.readFileSync('data/tubitak-runtime-store.json', 'utf8'));

const proj1 = seed.projects['proje-tarih'];
const criteriaList = proj1.criteriaList;
console.log('Criteria keys in criteriaList:');
console.log(criteriaList.map((c, i) => `${i+1}. ${c.key}`).join('\n'));

console.log('\n=== CHECKING ALL 40 MONUMENTS IN PROJE-TARIH ===');

proj1.items.forEach((it, idx) => {
  const itemRecords = Object.entries(store.records).filter(([k, v]) => k.startsWith(it.id + '__'));
  const filled = itemRecords.filter(([k, v]) => v.content && v.content.trim().length > 0);
  
  // Group keys into recognized in criteriaList vs UNRECOGNIZED
  const recognized = [];
  const unrecognized = [];
  
  filled.forEach(([k, v]) => {
    if (criteriaList.some(c => c.key === v.criterionKey)) {
      recognized.push(v.criterionKey);
    } else {
      unrecognized.push({ critKey: v.criterionKey, len: v.content.length, snippet: v.content.slice(0, 30) });
    }
  });

  if (unrecognized.length > 0 || filled.length > 0) {
    console.log(`\n#${idx+1} [${it.id}] ${it.title}: ${recognized.length} recognized, ${unrecognized.length} UNRECOGNIZED!`);
    if (unrecognized.length > 0) {
      console.log('  UNRECOGNIZED KEYS WITH CONTENT:', unrecognized);
    }
  }
});
