const fs = require('fs');

const code = fs.readFileSync('js/yaprak-test.js', 'utf8');
const lines = code.split('\n');
lines.slice(0, 100).forEach((l, i) => console.log((i+1) + ': ' + l));
