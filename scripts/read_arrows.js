const fs = require('fs');
const html = fs.readFileSync('oyunlar/kuvvet-laboratuvari.html', 'utf8');
const lines = html.split('\n');
console.log(lines.slice(1050, 1105).map((l, i) => (1051 + i) + ': ' + l).join('\n'));
