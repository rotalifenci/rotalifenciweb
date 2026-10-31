const fs = require('fs');

const mat = JSON.parse(fs.readFileSync('data/materials.json', 'utf8'));
const denemeler = mat.filter(m => m.category === 'denemeler');

console.log('Total denemeler in materials.json:', denemeler.length);
denemeler.forEach(d => {
  console.log(`- [${d.grade}. Sınıf] ${d.title} -> fileUrl: ${d.fileUrl}, id: ${d.id}`);
});
