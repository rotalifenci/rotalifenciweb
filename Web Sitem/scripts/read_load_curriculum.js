const fs = require('fs');

const code = fs.readFileSync('js/yaprak-test.js', 'utf8');
const lines = code.split('\n');
lines.slice(175, 260).forEach((l, i) => console.log((176+i) + ': ' + l));
