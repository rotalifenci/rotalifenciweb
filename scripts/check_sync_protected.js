const fs = require('fs');
const sync = fs.readFileSync('api/sync.js', 'utf8');
const lines = sync.split('\n');
console.log(lines.slice(20, 50).join('\n'));
