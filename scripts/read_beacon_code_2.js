const fs = require('fs');
const content = fs.readFileSync('oyunlar/kozmik-kasif-3d.html', 'utf8');
const lines = content.split('\n');
console.log(lines.slice(1560, 1610).map((l, i) => (1561 + i) + ': ' + l).join('\n'));
