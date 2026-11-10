const fs = require('fs');
const path = require('path');

const appPath = path.join(process.cwd(), 'js/app.js');
let code = fs.readFileSync(appPath, 'utf8');

const sIdx = code.indexOf('currentPeriodFilter');
console.log(code.substring(sIdx, sIdx + 1500));
