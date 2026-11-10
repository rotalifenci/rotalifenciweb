const fs = require('fs');
const appCode = fs.readFileSync('js/app.js', 'utf8');

const sIdx = appCode.indexOf('renderDistrictInfoPanel(dist) {');
console.log(appCode.substring(sIdx + 2500, sIdx + 3800));
