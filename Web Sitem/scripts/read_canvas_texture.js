const fs = require('fs');
const html = fs.readFileSync('oyunlar/kuvvet-laboratuvari.html', 'utf8');
const lines = html.split('\n');
console.log(lines.slice(1105, 1150).map((l, i) => (1106 + i) + ': ' + l).join('\n'));
