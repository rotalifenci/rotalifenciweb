const fs = require('fs');
const app = fs.readFileSync('js/app.js', 'utf8');
const lines = app.split('\n');
console.log(lines.slice(13845, 14045).map((l, i) => (13846 + i) + ': ' + l).join('\n'));
