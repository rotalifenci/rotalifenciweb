const fs = require('fs');
const content = fs.readFileSync('oyunlar/kozmik-kasif-3d.html', 'utf8');
const lines = content.split('\n');
console.log(lines.slice(2340, 2420).map((l, i) => (2341 + i) + ': ' + l).join('\n'));
