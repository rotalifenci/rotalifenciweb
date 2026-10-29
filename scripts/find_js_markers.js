const fs = require('fs');
const path = require('path');

const targetFile = path.join(__dirname, '../oyunlar/kozmik-kosu-3d.html');
const html = fs.readFileSync(targetFile, 'utf8');

const markerStart = 'function checkQuestionGateTriggers()';
const markerEnd = 'function setupControls()';

const startIdx = html.indexOf(markerStart);
const endIdx = html.indexOf(markerEnd);

console.log('startIdx:', startIdx, 'endIdx:', endIdx);
console.log('Snippet length:', endIdx - startIdx);
