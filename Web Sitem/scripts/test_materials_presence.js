const fs = require('fs');

const materials = JSON.parse(fs.readFileSync('data/materials.json', 'utf8'));

const testList = [
  'mat-6-oyun-uzay-ekspresi',
  'mat-6-2-sim-kuvvet-laboratuvari',
  'mat-6-1-oyun-gunes-sistemi-3d',
  'mat-6-1-oyun-gunes-sistemi-yolculuk-3d',
  'mat-5-1-sunum-gunes-dunya-ay',
  'mat-5-1-oyun-kozmik-kosu-3d'
];

testList.forEach(id => {
  const m = materials.find(item => item.id === id);
  if (!m) {
    console.error('NOT FOUND:', id);
  } else {
    console.log(`[PASS] ${id}: "${m.title}" -> ${m.fileUrl}`);
  }
});
