const fs = require('fs');
const path = require('path');
const html = fs.readFileSync(path.join(process.cwd(), 'index.html'), 'utf8');

const sIdx = html.indexOf('id="tab-fieldwork"');
console.log('Index:', sIdx);
if (sIdx !== -1) {
  console.log(html.substring(sIdx, sIdx + 3000));
}
