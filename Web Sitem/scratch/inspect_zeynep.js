const fs = require('fs');
const seed = JSON.parse(fs.readFileSync('data/tubitak-seed-data.json', 'utf8'));
const store = JSON.parse(fs.readFileSync('data/tubitak-runtime-store.json', 'utf8'));

const proj1 = seed.projects['proje-tarih'];
const criteriaList = proj1.criteriaList;
const zeynepItems = proj1.items.slice(27, 40);

console.log('=== ZEYNEP ECRİN ELİŞ (Items 28-40) DETAILED ANALYSIS ===');
let totalFilled = 0;

zeynepItems.forEach((it, idx) => {
  const itemNum = 28 + idx;
  const itemRecords = Object.entries(store.records).filter(([k, v]) => k.startsWith(it.id + '__'));
  const filledCritKeys = itemRecords.filter(([k, v]) => v.content && v.content.trim().length > 0).map(([k, v]) => v.criterionKey);
  totalFilled += filledCritKeys.length;
  console.log(`\n#${itemNum} [${it.id}] ${it.title}: ${filledCritKeys.length}/18 criteria filled.`);
  
  // Check which criteria are in criteriaList
  const missing = [];
  criteriaList.forEach(crit => {
    const recKey = `${it.id}__${crit.key}`;
    const rec = store.records[recKey];
    if (!rec || !rec.content || !rec.content.trim()) {
      missing.push(crit.key);
    }
  });
  console.log(`  Filled keys: ${filledCritKeys.join(', ') || '(none)'}`);
  if (missing.length > 0) {
    console.log(`  Empty keys in criteriaList: ${missing.length} empty (${missing.slice(0, 5).join(', ')}...)`);
  }
});

console.log('\nTotal filled across all 13 items:', totalFilled);
