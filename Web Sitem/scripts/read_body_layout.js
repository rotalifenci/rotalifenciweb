const fs = require('fs');
const html = fs.readFileSync('oyunlar/kuvvet-laboratuvari.html', 'utf8');
const lines = html.split('\n');
console.log(lines.slice(150, 260).map((l, i) => (151 + i) + ': ' + l).join('\n'));
