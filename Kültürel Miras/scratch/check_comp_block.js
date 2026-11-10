const fs = require('fs');
const path = require('path');
const code = fs.readFileSync(path.join(process.cwd(), 'js/app.js'), 'utf8');

const sIdx = code.indexOf('initComparisonModule() {');
const sNext = code.indexOf('\n  initTimeline() {', sIdx);
console.log('Comparison block length:', sNext - sIdx);
