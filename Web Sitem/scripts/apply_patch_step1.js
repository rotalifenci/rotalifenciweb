const fs = require('fs');
const path = require('path');

const appPath = path.join(__dirname, '../js/app.js');
let content = fs.readFileSync(appPath, 'utf8');

// 1. In openInteractiveGameModal:
const oldGameModalIf = `    // 🪐 5. Sınıf Güneş, Dünya ve Ay – 3D Hareket Laboratuvarı\n    if (str.includes("gunes-dunya-ay") || str.includes("gunes_dunya_ay") || (titleStr.includes("güneş") && titleStr.includes("dünya") && titleStr.includes("ay")) || resolvedKey === "mat-5-1-oyun-gunes-dunya-ay-3d" || resolvedKey === "builtin-oyun-5-gunes-dunya-ay" || resolvedKey === "gunes-dunya-ay-3d") {`;

const newGameModalIf = `    // 🪐 5. Sınıf Güneş, Dünya ve Ay – 3D Hareket Laboratuvarı\n    if (str.includes("oyunlar/gunes-dunya-ay") || str.includes("gunes-dunya-ay-3d") || resolvedKey === "mat-5-1-oyun-gunes-dunya-ay-3d" || resolvedKey === "builtin-oyun-5-gunes-dunya-ay" || resolvedKey === "gunes-dunya-ay-3d" || ((titleStr.includes("hareket laboratuvarı") || titleStr.includes("hareket laboratuvari")) && !titleStr.includes("sunum"))) {`;

if (content.includes(oldGameModalIf)) {
  content = content.replace(oldGameModalIf, newGameModalIf);
  console.log('✔ Updated openInteractiveGameModal 5. sinif check');
} else {
  console.log('⚠ Could not find exact oldGameModalIf string');
}

// 2. In openFullScreenPresentationModal:
const oldUrlResolution = `    if (targetUrl && !targetUrl.startsWith("http") && !targetUrl.startsWith("data:") && !targetUrl.startsWith("blob:") && targetUrl !== "#") {
        try {
            targetUrl = new URL(targetUrl, window.location.origin + "/").href;
        } catch (e) {}
    }`;

const newUrlResolution = `    if (targetUrl && !targetUrl.startsWith("http") && !targetUrl.startsWith("data:") && !targetUrl.startsWith("blob:") && targetUrl !== "#") {
        try {
            targetUrl = new URL(targetUrl, window.location.href).href;
        } catch (e) {}
    }`;

if (content.includes(oldUrlResolution)) {
  content = content.replace(oldUrlResolution, newUrlResolution);
  console.log('✔ Updated openFullScreenPresentationModal URL resolution');
} else {
  console.log('⚠ Could not find exact oldUrlResolution');
}

fs.writeFileSync(appPath, content, 'utf8');
console.log('Saved preliminary changes to js/app.js');
