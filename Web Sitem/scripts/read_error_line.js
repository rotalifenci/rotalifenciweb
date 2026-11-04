const fs = require('fs');

const code = fs.readFileSync('js/yaprak-test.js', 'utf8');
const lines = code.split('\n');
lines.slice(2935, 2965).forEach((l, i) => console.log((2936+i) + ': ' + l));
