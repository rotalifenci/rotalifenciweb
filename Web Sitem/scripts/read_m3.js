const fs = require('fs');
const html = fs.readFileSync('oyunlar/kuvvet-laboratuvari.html', 'utf8');
const lines = html.split('\n');
console.log(lines.slice(1570, 1610).map((l, i) => (1571 + i) + ': ' + l).join('\n'));
