const fs = require('fs');
const app = fs.readFileSync('js/app.js', 'utf8');
const lines = app.split('\n');
console.log('--- LINES 13855-13920 ---');
console.log(lines.slice(13855, 13920).join('\n'));
console.log('--- LINES 13965-14030 ---');
console.log(lines.slice(13965, 14030).join('\n'));
