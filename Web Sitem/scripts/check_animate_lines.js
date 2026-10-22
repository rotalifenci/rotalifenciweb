const fs = require('fs');
const content = fs.readFileSync('oyunlar/kozmik-kasif-3d.html', 'utf8');
const lines = content.split('\n');

const aIdx = lines.findIndex(l => l.includes('function animate()'));
console.log(lines.slice(aIdx, aIdx + 25).join('\n'));
