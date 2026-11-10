const fs = require('fs');
const appCode = fs.readFileSync('js/app.js', 'utf8');

const sIdx = appCode.indexOf('setMapViewMode(mode) {');
if (sIdx !== -1) {
  console.log(appCode.substring(sIdx, sIdx + 800));
} else {
  console.log('setMapViewMode def not found');
}
