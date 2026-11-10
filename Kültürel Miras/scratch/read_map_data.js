const fs = require('fs');
const content = fs.readFileSync('js/sivas-map-data.js', 'utf8');
console.log('Current sivas-map-data.js length:', content.length);
console.log('First 500 chars:');
console.log(content.substring(0, 500));
