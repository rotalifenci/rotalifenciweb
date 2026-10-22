const fs = require('fs');
const content = fs.readFileSync('oyunlar/kozmik-kasif-3d.html', 'utf8');
const lines = content.split('\n');
console.log(lines.slice(770, 850).map((l, i) => (771 + i) + ': ' + l).join('\n'));
