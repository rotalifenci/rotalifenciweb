const fs = require('fs');
const content = fs.readFileSync('oyunlar/kozmik-kasif-3d.html', 'utf8');
const lines = content.split('\n');
console.log(lines.slice(2045, 2105).map((l, i) => (2046 + i) + ': ' + l).join('\n'));
