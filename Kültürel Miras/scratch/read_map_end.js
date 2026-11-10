const fs = require('fs');
const content = fs.readFileSync('js/sivas-map-data.js', 'utf8');
console.log(content.substring(content.length - 1200));
