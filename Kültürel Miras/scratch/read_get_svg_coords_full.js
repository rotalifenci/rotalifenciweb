const fs = require('fs');
const appCode = fs.readFileSync('js/app.js', 'utf8');

const sIdx = appCode.indexOf('getSvgCoordsForMonument(');
const eIdx = appCode.indexOf('\n  renderMapMarkers()', sIdx);
console.log(appCode.substring(sIdx, eIdx));
