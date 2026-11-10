const fs = require('fs');
const path = require('path');

const appPath = path.join(process.cwd(), 'js/app.js');
let code = fs.readFileSync(appPath, 'utf8');

console.log('Has filterPeriodRibbon:', code.includes('filterPeriodRibbon'));
console.log('Has filterDistrictRibbon:', code.includes('filterDistrictRibbon'));
console.log('Has btnResetMapView:', code.includes('btnResetMapView'));
