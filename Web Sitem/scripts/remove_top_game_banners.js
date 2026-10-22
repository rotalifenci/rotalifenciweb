// scripts/remove_top_game_banners.js
const fs = require('fs');
let content = fs.readFileSync('js/app.js', 'utf8');

const targetStart = '${grade.number === 7 ? `';
const targetEnd = ': \'\'}';

const sIdx = content.indexOf(targetStart);
if (sIdx === -1) {
    console.error('targetStart not found!');
    process.exit(1);
}

const eIdx = content.indexOf(targetEnd, sIdx);
if (eIdx === -1) {
    console.error('targetEnd not found!');
    process.exit(1);
}

console.log('Found block from index', sIdx, 'to', eIdx + targetEnd.length);

// Also verify what is being removed contains the 5th grade banner
const sliceToRemove = content.slice(sIdx, eIdx + targetEnd.length);
if (!sliceToRemove.includes('5. SINIF 3D EĞİTSEL UZAY OYUNLARI')) {
    console.error('Safety check failed: slice does not contain 5. SINIF 3D banner!');
    process.exit(1);
}

const before = content.slice(0, sIdx).trimEnd();
const after = content.slice(eIdx + targetEnd.length).trimStart();

const newContent = before + '\n\n                    ' + after;
fs.writeFileSync('js/app.js', newContent, 'utf8');
console.log('Successfully removed top game banners from all grade levels in js/app.js');
