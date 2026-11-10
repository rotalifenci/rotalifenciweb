const fs = require('fs');
const stepFile = 'C:\\Users\\my pc\\.gemini\\antigravity\\brain\\43c78db7-a405-4ec9-bf50-bf5d50cec01a\\.system_generated\\steps\\1238\\output.txt';
const content = fs.readFileSync(stepFile, 'utf8');

const sIdx = content.indexOf('g.addEventListener("click", (e) => {');
const eIdx = content.indexOf('selectDistrict(districtId) {', sIdx);
console.log(content.substring(sIdx, eIdx));
