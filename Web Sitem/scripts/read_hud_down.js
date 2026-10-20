const fs = require('fs');
const html = fs.readFileSync('oyunlar/kuvvet-laboratuvari.html', 'utf8');
const lines = html.split('\n');
console.log(lines.slice(260, 360).map((l, i) => (261 + i) + ': ' + l).join('\n'));
