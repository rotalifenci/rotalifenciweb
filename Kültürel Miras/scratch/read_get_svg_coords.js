const fs = require('fs');
const appCode = fs.readFileSync('js/app.js', 'utf8');

const sIdx = appCode.indexOf('getSvgCoordsForMonument(');
if (sIdx !== -1) {
  console.log(appCode.substring(sIdx, sIdx + 1200));
} else {
  console.log('getSvgCoordsForMonument not found');
}
