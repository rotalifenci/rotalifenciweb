const fs = require('fs');
const content = fs.readFileSync('js/app.js', 'utf8');
const lines = content.split('\n');

const startIdx = lines.findIndex(l => l.includes('5. SINIF ÖNE ÇIKAN BAŞYAPIT SİMÜLASYONLARI'));
console.log('Found 5. SINIF ÖNE ÇIKAN at line:', startIdx + 1);

const endIdx = lines.findIndex(l => l.includes('2. DİKEY ÜNİTE AKORDEONLARI'));
console.log('Found 2. DİKEY ÜNİTE AKORDEONLARI at line:', endIdx + 1);

console.log(lines.slice(startIdx - 5, endIdx + 5).join('\n'));
