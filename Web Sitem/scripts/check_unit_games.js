const fs = require('fs');
const app = fs.readFileSync('js/app.js', 'utf8');
const lines = app.split('\n');
console.log(lines.slice(4975, 5025).map((l, i) => (4976 + i) + ': ' + l).join('\n'));
