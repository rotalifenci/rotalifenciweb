const fs = require('fs');
const path = require('path');

const targetFile = path.join(__dirname, '../oyunlar/kozmik-kosu-3d.html');
const html = fs.readFileSync(targetFile, 'utf8');

const closeIdx = html.indexOf('function closeQuestionModalAndResume()');
console.log('closeIdx:', closeIdx);
console.log(html.substring(closeIdx, closeIdx + 1200));
