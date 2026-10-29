const fs = require('fs');
const html = fs.readFileSync('oyunlar/kuvvet-laboratuvari.html', 'utf8');
const lines = html.split('\n');
console.log(lines.slice(1299, 1385).map((l, i) => (1300 + i) + ': ' + l).join('\n'));
