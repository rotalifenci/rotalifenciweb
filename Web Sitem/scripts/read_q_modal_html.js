const fs = require('fs');
const content = fs.readFileSync('oyunlar/kozmik-kasif-3d.html', 'utf8');
const lines = content.split('\n');
console.log(lines.slice(440, 475).map((l, i) => (441 + i) + ': ' + l).join('\n'));
