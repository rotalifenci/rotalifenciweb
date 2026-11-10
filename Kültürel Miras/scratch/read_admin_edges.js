const fs = require('fs');
const path = require('path');

const appPath = path.join(process.cwd(), 'js/app.js');
let code = fs.readFileSync(appPath, 'utf8');

const sIdx = code.indexOf('initAdminPanel() {');
const sNext = code.indexOf('\n  loadPersistedData() {', sIdx);
const adminCode = code.substring(sIdx, sNext);
console.log('--- START (first 800) ---');
console.log(adminCode.substring(0, 800));
console.log('--- END (last 800) ---');
console.log(adminCode.substring(adminCode.length - 800));
