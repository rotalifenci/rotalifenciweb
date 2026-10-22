const fs = require('fs');
const content = fs.readFileSync('oyunlar/kozmik-kasif-3d.html', 'utf8');
const lines = content.split('\n');
console.log(lines.slice(680, 770).map((l, i) => (681 + i) + ': ' + l).join('\n'));
