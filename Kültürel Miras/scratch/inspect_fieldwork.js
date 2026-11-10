const fs = require('fs');
const path = require('path');
const html = fs.readFileSync(path.join(process.cwd(), 'index.html'), 'utf8');

const sIdx = html.indexOf('tab-fieldwork');
const sNext = html.indexOf('tab-sources', sIdx);
console.log(html.substring(sIdx, sNext));
