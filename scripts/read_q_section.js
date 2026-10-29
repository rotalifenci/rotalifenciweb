const fs = require('fs');
const html = fs.readFileSync('oyunlar/kozmik-kosu-3d.html', 'utf8');
const lines = html.split('\n');
console.log(lines.slice(1620, 1950).map((l, i) => (1621 + i) + ': ' + l).join('\n'));
