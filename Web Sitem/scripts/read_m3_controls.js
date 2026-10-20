const fs = require('fs');
const html = fs.readFileSync('oyunlar/kuvvet-laboratuvari.html', 'utf8');
const lines = html.split('\n');
console.log(lines.slice(380, 440).map((l, i) => (381 + i) + ': ' + l).join('\n'));
