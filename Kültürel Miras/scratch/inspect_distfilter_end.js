const fs = require('fs');
const path = require('path');

const html = fs.readFileSync(path.join(process.cwd(), 'index.html'), 'utf8');
const sIdx = html.indexOf('id="districtFilter"');
console.log(html.substring(sIdx, sIdx + 1200));
