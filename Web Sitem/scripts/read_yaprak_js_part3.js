const fs = require('fs');
const content = fs.readFileSync('js/yaprak-test.js', 'utf8');

console.log(content.slice(52000, 56000));
