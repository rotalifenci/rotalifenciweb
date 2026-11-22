const fs = require('fs');
const seed = JSON.parse(fs.readFileSync('data/tubitak-seed-data.json', 'utf8'));
const store = JSON.parse(fs.readFileSync('data/tubitak-runtime-store.json', 'utf8'));

console.log('=== FULL AUDIT OF ALL 3 PROJECTS AND ALL STUDENTS ===');

Object.entries(seed.projects).forEach(([pId, proj]) => {
  console.log(`\n=================== ${pId.toUpperCase()} ===================`);
  const criteriaList = proj.criteriaList || [];
  const criteriaKeys = new Set(criteriaList.map(c => c.key));

  proj.items.forEach((it, idx) => {
    const itemNum = idx + 1;
    // Find all records belonging to this item
    const itemRecords = Object.entries(store.records).filter(([k, v]) => {
      return k.startsWith(it.id + '__') || v.itemId === it.id;
    });

    const recognized = [];
    const unrecognized = [];

    itemRecords.forEach(([k, v]) => {
      const critKey = v.criterionKey || k.slice(k.indexOf('__') + 2);
      if (v.content && v.content.trim().length > 0) {
        if (criteriaKeys.has(critKey)) {
          recognized.push({ critKey, len: v.content.length });
        } else {
          unrecognized.push({ rawKey: k, critKey, len: v.content.length, snippet: v.content.slice(0, 30) });
        }
      }
    });

    if (unrecognized.length > 0) {
      console.log(`[ALERT] Item #${itemNum} [${it.id}] ${it.title}: ${recognized.length} recognized, ${unrecognized.length} UNRECOGNIZED CRITERIA KEYS!`);
      unrecognized.forEach(u => console.log(`   --> ${u.rawKey} (critKey: ${u.critKey}, len: ${u.len}): "${u.snippet}"`));
    }
  });
});
