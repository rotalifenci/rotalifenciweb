const fs = require('fs');
const path = require('path');

const matPath = path.join(__dirname, '../data/materials.json');
const mats = JSON.parse(fs.readFileSync(matPath, 'utf8'));

let updated = false;
mats.forEach(m => {
  if (m.id === 'mat-6-2-sim-kuvvet-laboratuvari') {
    m.targetSection = '2';
    m.unit = '2. Ünite: Kuvvet ve Hareket';
    m.downloadCount = '🌟 2. Ünite Başyapıtı';
    m.tags = [
      "6. sınıf",
      "2. ünite",
      "kuvvet",
      "hareket",
      "bileşke kuvvet",
      "dengelenmiş kuvvetler",
      "halat çekme",
      "dengeleyici kuvvet",
      "3d laboratuvar",
      "maarif modeli"
    ];
    updated = true;
    console.log('Updated Kuvvet Laboratuvarı material to 2. Ünite:', m);
  }
});

if (updated) {
  fs.writeFileSync(matPath, JSON.stringify(mats, null, 2), 'utf8');
  console.log('Saved data/materials.json successfully.');
} else {
  console.error('Material mat-6-2-sim-kuvvet-laboratuvari not found!');
}
