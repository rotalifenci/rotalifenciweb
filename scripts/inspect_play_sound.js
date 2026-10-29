const fs = require('fs');
const content = fs.readFileSync('oyunlar/kozmik-kasif-3d.html', 'utf8');
const lines = content.split('\n');

const sIdx = lines.findIndex(l => l.includes('function playSound'));
console.log(lines.slice(sIdx, sIdx + 70).join('\n'));
