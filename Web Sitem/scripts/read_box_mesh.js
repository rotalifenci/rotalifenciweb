const fs = require('fs');
const html = fs.readFileSync('oyunlar/kuvvet-laboratuvari.html', 'utf8');
const lines = html.split('\n');
console.log(lines.slice(930, 1000).map((l, i) => (931 + i) + ': ' + l).join('\n'));
