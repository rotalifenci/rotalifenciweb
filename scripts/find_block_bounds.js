const fs = require('fs');
const path = require('path');

const targetFile = path.join(__dirname, '../oyunlar/kozmik-kosu-3d.html');
const html = fs.readFileSync(targetFile, 'utf8');

const startMarker = 'function checkQuestionGateTriggers()';
const endMarker = 'function showFeedbackToast(';

const startIdx = html.indexOf(startMarker);
const endIdx = html.indexOf(endMarker);

console.log('startIdx:', startIdx, 'endIdx:', endIdx);
console.log('Snippet length:', endIdx - startIdx);
