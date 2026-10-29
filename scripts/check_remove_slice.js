const fs = require('fs');
let content = fs.readFileSync('js/app.js', 'utf8');

const targetStart = '${(normSubTab === "egitsel-oyunlar" && gNum === "5") ? `';
const targetEnd = '` : \'\'}';

const sIdx = content.indexOf(targetStart);
console.log('sIdx:', sIdx);

const eIdx = content.indexOf(targetEnd, sIdx);
console.log('eIdx:', eIdx);

const slice = content.slice(sIdx, eIdx + targetEnd.length);
console.log('Slice length:', slice.length);
console.log('Slice starts with:', slice.slice(0, 100));
console.log('Slice ends with:', slice.slice(-100));
console.log('Contains Gunesi Kesfediyorum:', slice.includes('Güneş\'i Keşfediyorum'));
console.log('Contains Ayin Evreleri:', slice.includes('Ay\'ın Evreleri'));
