const fs = require('fs');

const code = fs.readFileSync('api/test-viewer.js', 'utf8');
console.log(code.slice(0, 800));
