const fs = require('fs');
const path = require('path');

// 1. In data/materials.json: remove mat-game-gezegen-kosusu
const matPath = path.join(__dirname, '../data/materials.json');
let materials = JSON.parse(fs.readFileSync(matPath, 'utf8'));

const beforeLen = materials.length;
materials = materials.filter(m => m.id !== 'mat-game-gezegen-kosusu');
const afterLen = materials.length;
console.log(`materials.json: removed ${beforeLen - afterLen} item (mat-game-gezegen-kosusu)`);
fs.writeFileSync(matPath, JSON.stringify(materials, null, 2), 'utf8');

// 2. In js/app.js:
const appPath = path.join(__dirname, '../js/app.js');
let app = fs.readFileSync(appPath, 'utf8');

// In openOrDownloadMaterial: add Uzay Ekspresi before gunes-sistemi
const uzayEkspresiRoute = `    // 🚂 6. SINIF UZAY EKSPRESİ: GÜNEŞ SİSTEMİ KEŞFİ
    if (
        id === "mat-6-oyun-uzay-ekspresi" ||
        id === "builtin-oyun-6-uzay-ekspresi" ||
        id === "oyun-uzay-ekspresi" ||
        id === "oyun-6-uzay-ekspresi" ||
        targetUrl.includes("uzay-ekspresi") ||
        checkTitle.includes("uzay ekspresi") ||
        checkTitle.includes("uzay-ekspresi")
    ) {
        openInteractiveGameModal("oyun-uzay-ekspresi", "Rotalı Fenci - Uzay Ekspresi: Güneş Sistemi Keşfi");
        return;
    }

`;

const markerSearch = '// 🪐 6. SINIF GÜNEŞ SİSTEMİ – 3D KEŞİF LABORATUVARI (3D DIGITAL PLANETARIUM)';
if (app.includes(markerSearch) && !app.includes('// 🚂 6. SINIF UZAY EKSPRESİ: GÜNEŞ SİSTEMİ KEŞFİ')) {
  app = app.replace(markerSearch, uzayEkspresiRoute + '    ' + markerSearch);
  console.log('✔ Added Uzay Ekspresi route to openOrDownloadMaterial');
}

// In openInteractiveGameModal:
// Make sure gunes-sistemi DOES NOT trigger if titleStr or str contains uzay-ekspresi or uzay ekspresi
const oldGunesSistemiIf = `    // 🪐 6. Sınıf Güneş Sistemi – 3D Keşif Laboratuvarı (Dijital Planetaryum)
    if (str.includes("gunes-sistemi") || str.includes("gunes_sistemi") || str.includes("güneş sistemi") || str.includes("gunes sistemi") || titleStr.includes("güneş sistemi") || titleStr.includes("gunes sistemi") || resolvedKey === "gunes-sistemi-3d" || resolvedKey === "oyun-gunes-sistemi-3d") {`;

const newGunesSistemiIf = `    // 🪐 6. Sınıf Güneş Sistemi – 3D Keşif Laboratuvarı (Dijital Planetaryum)
    if (!str.includes("uzay") && !titleStr.includes("uzay") && (str.includes("gunes-sistemi") || str.includes("gunes_sistemi") || str.includes("güneş sistemi") || str.includes("gunes sistemi") || titleStr.includes("güneş sistemi") || titleStr.includes("gunes sistemi") || resolvedKey === "gunes-sistemi-3d" || resolvedKey === "oyun-gunes-sistemi-3d")) {`;

if (app.includes(oldGunesSistemiIf)) {
  app = app.replace(oldGunesSistemiIf, newGunesSistemiIf);
  console.log('✔ Fixed gunes-sistemi guard in openInteractiveGameModal');
} else {
  // Try CRLF / LF agnostic regex
  const regex = /\/\/\s*🪐\s*6\.\s*Sınıf Güneş Sistemi – 3D Keşif Laboratuvarı[\s\S]*?if\s*\((str\.includes\("gunes-sistemi"[\s\S]*?resolvedKey === "oyun-gunes-sistemi-3d"\))\s*\{/;
  if (regex.test(app)) {
    app = app.replace(regex, `// 🪐 6. Sınıf Güneş Sistemi – 3D Keşif Laboratuvarı (Dijital Planetaryum)\n    if (!str.includes("uzay") && !titleStr.includes("uzay") && ($1)) {`);
    console.log('✔ Fixed gunes-sistemi guard using regex');
  } else {
    console.log('⚠ Could not match oldGunesSistemiIf');
  }
}

// In openInteractiveGameModal: move Uzay Ekspresi to the top (before Apollo / Gunes Sistemi)
const uzayEkspresiBlockRegex = /\/\/\s*🚂\s*Rotalı Fenci - Uzay Ekspresi[\s\S]*?return;\s*\}/;
const uzayMatch = app.match(uzayEkspresiBlockRegex);
if (uzayMatch) {
  const uzayBlock = uzayMatch[0];
  // Remove it from current position
  app = app.replace(uzayBlock, '');
  // Insert at top of openInteractiveGameModal
  const titleStrMarker = 'const titleStr = String(gameTitle || "").toLowerCase();';
  app = app.replace(titleStrMarker, titleStrMarker + '\n\n    ' + uzayBlock);
  console.log('✔ Moved Uzay Ekspresi block to top of openInteractiveGameModal');
} else {
  console.log('⚠ Could not find uzayEkspresiBlockRegex in openInteractiveGameModal');
}

fs.writeFileSync(appPath, app, 'utf8');
console.log('✔ Saved changes to js/app.js');
