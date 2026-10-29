const fs = require('fs');
const path = require('path');

const appPath = path.join(__dirname, '../js/app.js');
const content = fs.readFileSync(appPath, 'utf8');

const markerStart = '// 🪐 5. SINIF GÜNEŞ, DÜNYA VE AY: 3D HAREKET LABORATUVARI';
const markerEnd = '// 0.1 📑 DİĞER OFİS BELGELERİ';

const startPos = content.indexOf(markerStart);
const endPos = content.indexOf(markerEnd);

console.log('startPos:', startPos, 'endPos:', endPos);
console.log('Snippet length:', endPos - startPos);
console.log(content.substring(startPos, endPos));
