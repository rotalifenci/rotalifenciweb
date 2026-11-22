const fs = require('fs');
const store = JSON.parse(fs.readFileSync('data/tubitak-runtime-store.json', 'utf8'));

const revisions = store.revisions || [];
console.log('Total revisions in store:', revisions.length);

const zeynepItems = ['alacahan-camii', 'kangal-merkez-camii', 'cevre-kultur-sanat-evi', 'abdulvahabi-gazi-turbesi', 'muhurdarzade-konagi', 'semsi-sivasi-turbesi', 'yesil-konak', 'altinyayla-merkez-camii', 'seyh-coban-turbesi', 'abdi-aga-konagi', 'yildiz-koprusu', 'behram-pasa-hani', 'halil-rifat-pasa-koprusu'];

zeynepItems.forEach(itemId => {
  const revs = revisions.filter(r => r.itemId === itemId);
  console.log(`Item [${itemId}] revisions count: ${revs.length}`);
  if (revs.length > 0) {
    const revCrits = Array.from(new Set(revs.map(r => r.criterionKey)));
    console.log(`  Revision criteria: ${revCrits.join(', ')}`);
  }
});
