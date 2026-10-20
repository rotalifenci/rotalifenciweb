const fs = require('fs');
const path = require('path');

const p = path.join(__dirname, '../data/materials.json');
const mats = JSON.parse(fs.readFileSync(p, 'utf8'));

console.log('--- UZAY ITEMS ---');
mats.filter(m => JSON.stringify(m).toLowerCase().includes('uzay')).forEach(m => {
  console.log({ id: m.id, title: m.title, unit: m.unit, grade: m.grade, fileName: m.fileName, fileUrl: m.fileUrl });
});

console.log('--- KUVVET ITEMS ---');
mats.filter(m => JSON.stringify(m).toLowerCase().includes('kuvvet')).forEach(m => {
  console.log({ id: m.id, title: m.title, unit: m.unit, grade: m.grade, fileName: m.fileName, fileUrl: m.fileUrl });
});
