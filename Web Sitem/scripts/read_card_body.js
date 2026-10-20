const fs = require('fs');
const app = fs.readFileSync('js/app.js', 'utf8');
const lines = app.split('\n');
console.log(lines.slice(5425, 5465).map((l, i) => (5426 + i) + ': ' + l).join('\n'));
