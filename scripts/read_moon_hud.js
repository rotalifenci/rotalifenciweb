const fs = require('fs');
const content = fs.readFileSync('oyunlar/kozmik-kasif-3d.html', 'utf8');
const lines = content.split('\n');
console.log(lines.slice(220, 290).map((l, i) => (221 + i) + ': ' + l).join('\n'));
