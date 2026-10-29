const fs = require('fs');
const app = fs.readFileSync('js/app.js', 'utf8');
const lines = app.split('\n');
console.log(lines.slice(5360, 5430).map((l, i) => (5361 + i) + ': ' + l).join('\n'));
