const fs = require('fs');
const content = fs.readFileSync('js/yaprak-test.js', 'utf8');

console.log('--- Lines 2200-3600 ---');
console.log(content.slice(2200, 3600));

console.log('--- Lines 48800-52000 ---');
console.log(content.slice(48800, 52000));
