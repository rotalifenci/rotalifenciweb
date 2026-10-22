const fs = require('fs');
let content = fs.readFileSync('js/app.js', 'utf8');

const targetStart = '${(normSubTab === "egitsel-oyunlar" && gNum === "5") ? `';
const targetEnd = '` : \'\'}';

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

// Safety check: Ensure the slice contains the exact titles mentioned by the user
const slice = content.slice(sIdx, eIdx + targetEnd.length);
if (!slice.includes('Güneş\'i Keşfediyorum: 3D Uzay Laboratuvarı') || !slice.includes('Ay\'ın Evreleri: 3D Uzay Simülatörü')) {
    console.error('Safety check failed: Slice does not contain the target promo banners!');
    process.exit(1);
}

const before = content.slice(0, sIdx).trimEnd();
const after = content.slice(eIdx + targetEnd.length).trimStart();

const newContent = before + '\n\n            ' + after;
fs.writeFileSync('js/app.js', newContent, 'utf8');
console.log('Successfully removed the promo / ad banner section from js/app.js!');
