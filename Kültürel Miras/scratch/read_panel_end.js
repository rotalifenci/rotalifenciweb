const fs = require('fs');
const appCode = fs.readFileSync('js/app.js', 'utf8');

const sIdx = appCode.indexOf('renderDistrictInfoPanel(dist) {');
console.log(appCode.substring(sIdx + 1500, sIdx + 3000));
