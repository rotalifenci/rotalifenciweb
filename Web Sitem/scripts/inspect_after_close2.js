const fs = require('fs');
const path = require('path');

const targetFile = path.join(__dirname, '../oyunlar/kozmik-kosu-3d.html');
const html = fs.readFileSync(targetFile, 'utf8');

const closeIdx = html.indexOf('function closeQuestionModalAndResume()');
console.log(html.substring(closeIdx + 800, closeIdx + 1800));
