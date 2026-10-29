const fs = require('fs');
const content = fs.readFileSync('oyunlar/kozmik-kasif-3d.html', 'utf8');
const lines = content.split('\n');
console.log(lines.slice(1500, 1560).map((l, i) => (1501 + i) + ': ' + l).join('\n'));
