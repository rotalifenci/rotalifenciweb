const fs = require('fs');
const html = fs.readFileSync('oyunlar/kuvvet-laboratuvari.html', 'utf8');

// Check all script functions
const fnNames = [];
const matches = html.matchAll(/function\s+([a-zA-Z0-9_]+)\s*\(/g);
for (const m of matches) {
  fnNames.push(m[1]);
}
console.log('Total functions:', fnNames.length);
console.log(fnNames.join(', '));
