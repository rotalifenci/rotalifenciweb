const fs = require('fs');
const app = fs.readFileSync('js/app.js', 'utf8');
const lines = app.split('\n');

const lineIdx = lines.findIndex(l => l.includes('builtin-oyun-6-uzay-ekspresi'));
console.log('lineIdx of builtin-oyun-6-uzay-ekspresi:', lineIdx);
console.log(lines.slice(lineIdx - 3, lineIdx + 50).join('\n'));
