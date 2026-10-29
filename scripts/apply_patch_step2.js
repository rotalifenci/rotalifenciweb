const fs = require('fs');
const path = require('path');

const appPath = path.join(__dirname, '../js/app.js');
let content = fs.readFileSync(appPath, 'utf8');

// 1. In openInteractiveGameModal:
// search for "// 🪐 5. Sınıf Güneş, Dünya ve Ay – 3D Hareket Laboratuvarı"
const marker1 = "// 🪐 5. Sınıf Güneş, Dünya ve Ay – 3D Hareket Laboratuvarı";
const pos1 = content.indexOf(marker1);
if (pos1 !== -1) {
  const lineEnd = content.indexOf('\n', pos1);
  const nextLineEnd = content.indexOf('\n', lineEnd + 1);
  const oldIfLine = content.substring(lineEnd + 1, nextLineEnd);
  console.log('Old if line in openInteractiveGameModal:', oldIfLine.trim());
  const newIfLine = '    if (str.includes("oyunlar/gunes-dunya-ay") || str.includes("gunes-dunya-ay-3d") || resolvedKey === "mat-5-1-oyun-gunes-dunya-ay-3d" || resolvedKey === "builtin-oyun-5-gunes-dunya-ay" || resolvedKey === "gunes-dunya-ay-3d" || ((titleStr.includes("hareket laboratuvarı") || titleStr.includes("hareket laboratuvari")) && !titleStr.includes("sunum"))) {' + (oldIfLine.endsWith('\r') ? '\r' : '');
  content = content.substring(0, lineEnd + 1) + newIfLine + content.substring(nextLineEnd);
  console.log('✔ Replaced if in openInteractiveGameModal');
}

// 2. In openFullScreenPresentationModal:
// window.location.origin + "/" -> window.location.href
const oldUrlStr = 'targetUrl = new URL(targetUrl, window.location.origin + "/").href;';
const newUrlStr = 'targetUrl = new URL(targetUrl, window.location.href).href;';
if (content.includes(oldUrlStr)) {
  content = content.replace(oldUrlStr, newUrlStr);
  console.log('✔ Replaced URL resolution in openFullScreenPresentationModal');
}

fs.writeFileSync(appPath, content, 'utf8');
