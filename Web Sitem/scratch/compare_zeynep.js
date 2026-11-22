const fs = require('fs');
const snap = JSON.parse(fs.readFileSync('backups/gist-snapshot-1795370489523/tubitak-runtime-store.json', 'utf8'));
const current = JSON.parse(fs.readFileSync('data/tubitak-runtime-store.json', 'utf8'));

const snapZ = Object.entries(snap.records).filter(([k, v]) => v.content && v.content.trim().length > 0 && (v.studentId === 'stu-zeynep' || (v.studentName && v.studentName.includes('Zeynep'))));
const currZ = Object.entries(current.records).filter(([k, v]) => v.content && v.content.trim().length > 0 && (v.studentId === 'stu-zeynep' || (v.studentName && v.studentName.includes('Zeynep'))));

console.log('Snap Zeynep filled count:', snapZ.length);
console.log('Curr Zeynep filled count:', currZ.length);

const currKeys = new Set(currZ.map(([k, v]) => k));
snapZ.forEach(([k, v]) => {
  if (!currKeys.has(k)) {
    console.log('MISSING KEY IN CURRENT:', k, v);
  }
});

const snapKeys = new Set(snapZ.map(([k, v]) => k));
currZ.forEach(([k, v]) => {
  if (!snapKeys.has(k)) {
    console.log('NEW KEY IN CURRENT:', k, v);
  }
});
