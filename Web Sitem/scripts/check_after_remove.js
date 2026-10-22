const fs = require('fs');
const content = fs.readFileSync('js/app.js', 'utf8');
const lines = content.split('\n');

const idx = lines.findIndex(l => l.includes('2. DİKEY ÜNİTE AKORDEONLARI'));
console.log(lines.slice(idx - 15, idx + 10).join('\n'));
