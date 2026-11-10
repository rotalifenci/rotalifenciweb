const fs = require('fs');
const path = require('path');

const html = fs.readFileSync(path.join(process.cwd(), 'index.html'), 'utf8');
const sIdx = html.indexOf('map-filter-ribbon');
if (sIdx !== -1) {
  console.log(html.substring(sIdx, sIdx + 1500));
} else {
  console.log('map-filter-ribbon not found');
}
