const fs = require('fs');
const app = fs.readFileSync('js/app.js', 'utf8');
const lines = app.split('\n');

const startIndex = lines.findIndex(l => l.includes('const isCustom = !String(item.id).startsWith("std-")'));
console.log('startIndex:', startIndex);
const endIndex = lines.findIndex(l => l.includes('const itemCover = resolveMaterialCover(item);'));
console.log('endIndex:', endIndex);

console.log(lines.slice(startIndex, endIndex).join('\n'));
