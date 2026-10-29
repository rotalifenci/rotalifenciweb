const fs = require('fs');
const path = require('path');

const appPath = path.join(__dirname, '../js/app.js');
let content = fs.readFileSync(appPath, 'utf8');

// Find index of openOrDownloadMaterial
const startMarker = 'async function openOrDownloadMaterial(';
const startIdx = content.indexOf(startMarker);
console.log('startIdx of openOrDownloadMaterial:', startIdx);

// Find index of openInteractiveGameModal
const gameModalMarker = 'function openInteractiveGameModal(';
const gameModalIdx = content.indexOf(gameModalMarker);
console.log('gameModalIdx:', gameModalIdx);
