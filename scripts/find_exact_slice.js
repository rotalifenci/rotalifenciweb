const fs = require('fs');
const app = fs.readFileSync('js/app.js', 'utf8');
const lines = app.split('\n');

const lineIdx = lines.findIndex(l => l.includes('const isGunesSistemiItem = !isAyaInisItem && ((item.fileUrl'));
console.log('lineIdx of isGunesSistemiItem:', lineIdx);

// We replace from lineIdx - 3 (where const isCustom is) to lineIdx + 50 (after itemActionUI)
const start = lineIdx - 3;
const end = lineIdx + 52;

console.log('Replacing lines', start, 'to', end);
console.log(lines.slice(start, end).join('\n'));
