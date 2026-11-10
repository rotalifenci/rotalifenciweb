const fs = require('fs');
const appCode = fs.readFileSync('js/app.js', 'utf8');

const sIdx = appCode.indexOf('setMapViewMode(');
if (sIdx !== -1) {
  console.log(appCode.substring(sIdx, sIdx + 1000));
} else {
  console.log('setMapViewMode not found');
}
