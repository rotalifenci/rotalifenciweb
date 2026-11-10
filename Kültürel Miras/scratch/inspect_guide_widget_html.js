const fs = require('fs');
const path = require('path');

const html = fs.readFileSync(path.join(process.cwd(), 'index.html'), 'utf8');
const sIdx = html.indexOf('guideFloatingWidget');
console.log(html.substring(sIdx - 50, sIdx + 1000));
