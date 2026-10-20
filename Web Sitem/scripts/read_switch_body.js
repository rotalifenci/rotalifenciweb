const fs = require('fs');
const html = fs.readFileSync('oyunlar/kuvvet-laboratuvari.html', 'utf8');
const lines = html.split('\n');
console.log(lines.slice(1384, 1460).map((l, i) => (1385 + i) + ': ' + l).join('\n'));
