const fs = require('fs');
const app = fs.readFileSync('js/app.js', 'utf8');
const lines = app.split('\n');
console.log(lines.slice(4865, 4885).map((l, i) => (4866 + i) + ': ' + l).join('\n'));
