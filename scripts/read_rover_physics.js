const fs = require('fs');
const content = fs.readFileSync('oyunlar/kozmik-kasif-3d.html', 'utf8');
const lines = content.split('\n');
console.log(lines.slice(1900, 1990).map((l, i) => (1901 + i) + ': ' + l).join('\n'));
