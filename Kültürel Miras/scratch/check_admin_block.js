const fs = require('fs');
const path = require('path');

const appPath = path.join(process.cwd(), 'js/app.js');
let code = fs.readFileSync(appPath, 'utf8');

const sIdx = code.indexOf('initAdminPanel() {');
const sNext = code.indexOf('\n  loadPersistedData() {', sIdx);
console.log('Admin block length:', sNext - sIdx);
