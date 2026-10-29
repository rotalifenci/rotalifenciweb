// scripts/check_rendered_header.js
const fs = require('fs');
const content = fs.readFileSync('js/app.js', 'utf8');
const lines = content.split('\n');

const idx = lines.findIndex(l => l.includes('ALT BÖLÜM KUTULARI (KOMPAKT DİZİLİM)'));
console.log('Found ALT BÖLÜM KUTULARI at line:', idx + 1);
console.log(lines.slice(idx - 15, idx + 15).join('\n'));
