const fs = require('fs');
const app = fs.readFileSync('js/app.js', 'utf8');
const lines = app.split('\n');

const lineIdx = lines.findIndex(l => l.includes('builtinUnitGamesMap ='));
console.log('lineIdx of builtinUnitGamesMap:', lineIdx);
console.log(lines.slice(lineIdx, lineIdx + 130).join('\n'));
