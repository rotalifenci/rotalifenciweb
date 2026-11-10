const fs = require('fs');
const path = require('path');
const code = fs.readFileSync(path.join(process.cwd(), 'js/app.js'), 'utf8');

const sIdx = code.indexOf('gradeAssessment() {');
const sNext = code.indexOf('\n  initMapPicker() {', sIdx);
console.log(code.substring(sIdx, sNext));
