const fs = require('fs');
const path = require('path');

const mat = JSON.parse(fs.readFileSync('data/materials.json', 'utf8'));
const denemeler = mat.filter(m => m.category === 'denemeler');

console.log('--- ALL DENEMELER MATERIALS ---');
denemeler.forEach(d => {
  const fileExists = fs.existsSync(path.join('testler', d.fileName));
  console.log(`[Grade ${d.grade}] Title: "${d.title}" | File: ${d.fileName} | Exists: ${fileExists} | Format: ${d.format}`);
});
