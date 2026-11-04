const fs = require('fs');

const code = fs.readFileSync('js/yaprak-test.js', 'utf8');
const lines = code.split('\n');
lines.slice(425, 520).forEach((l, i) => console.log((426+i) + ': ' + l));
