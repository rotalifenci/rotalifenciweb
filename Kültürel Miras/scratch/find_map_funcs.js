const fs = require('fs');
const content = fs.readFileSync('js/sivas-map-data.js', 'utf8');

const funcs = content.match(/[a-zA-Z0-9_]+\s*\([^)]*\)\s*\{/g);
console.log('Functions in SIVAS_MAP_DATA:', funcs);
