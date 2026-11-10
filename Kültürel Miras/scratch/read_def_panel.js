const fs = require('fs');
const appCode = fs.readFileSync('js/app.js', 'utf8');

const sIdx = appCode.indexOf('renderDistrictInfoPanel(distObj) {');
console.log(appCode.substring(sIdx, sIdx + 1500));
