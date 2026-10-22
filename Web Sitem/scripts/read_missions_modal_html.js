const fs = require('fs');
const content = fs.readFileSync('oyunlar/kozmik-kasif-3d.html', 'utf8');
const lines = content.split('\n');
console.log(lines.slice(390, 440).map((l, i) => (391 + i) + ': ' + l).join('\n'));
