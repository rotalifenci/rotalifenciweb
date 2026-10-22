const fs = require('fs');
const content = fs.readFileSync('oyunlar/kozmik-kasif-3d.html', 'utf8');
const lines = content.split('\n');
console.log(lines.slice(1385, 1475).map((l, i) => (1386 + i) + ': ' + l).join('\n'));
