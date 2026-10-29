const fs = require('fs');
const content = fs.readFileSync('oyunlar/kozmik-kasif-3d.html', 'utf8');
const lines = content.split('\n');

const wIdx = lines.findIndex(l => l.includes('id="widget-moon"'));
console.log(lines.slice(wIdx - 2, wIdx + 30).join('\n'));
