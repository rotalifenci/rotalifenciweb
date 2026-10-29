const fs = require('fs');
const app = fs.readFileSync('js/app.js', 'utf8');
const lines = app.split('\n');
console.log(lines.slice(5365, 5425).map((l, i) => (5366 + i) + ': ' + l).join('\n'));
