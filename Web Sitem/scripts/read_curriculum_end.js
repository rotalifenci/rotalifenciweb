const fs = require('fs');

const code = fs.readFileSync('js/curriculum-data.js', 'utf8');
const lines = code.split('\n');
lines.slice(3080, 3100).forEach((l, i) => console.log((3081+i) + ': ' + l));
